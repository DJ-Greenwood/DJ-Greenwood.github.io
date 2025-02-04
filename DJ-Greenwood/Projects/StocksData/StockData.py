import yfinance as yf
import json
import os
from datetime import datetime, timedelta
from sklearn.linear_model import LinearRegression
import numpy as np
import matplotlib.pyplot as plt

def format_daily_data(hist_data, ticker):
    daily_data = []
    for date, row in hist_data.iterrows():
        daily_data.append({
            "ticker": ticker,
            "date": date.strftime("%Y-%m-%d"),
            "open": round(float(row['Open']), 2),
            "close": round(float(row['Close']), 2),
            "high": round(float(row['High']), 2),
            "low": round(float(row['Low']), 2),
            "daily_change": round(float(row['Close'] - row['Open']), 2)
        })
    return daily_data

def get_stock_data(tickers, dir_url, file_name):
    if not os.path.exists(dir_url):
        os.makedirs(dir_url)
    dir_url = os.path.join(os.getcwd(), dir_url)
    path_dir = os.path.join(dir_url, file_name)
    stock_data = {"stocks": []}
    
    for ticker in tickers:
        stock = yf.Ticker(ticker)
        hist = stock.history(period="5y") # '1d', '5d', '1mo', '3mo', '6mo', '1y', '2y', '5y', '10y', 'ytd', 'max'
        
        stock_info = {
            "ticker": ticker,
            "daily_data": format_daily_data(hist, ticker)
        }
        stock_data["stocks"].append(stock_info)
    
    # Write to JSON file
    
    with open(path_dir, 'w') as f:
        json.dump({"stock_data": stock_data}, f, indent=4)
    
    return stock_data

def forecast_data(stock_data):
    forecasts = {}
    for stock in stock_data['stocks']:
        last_day_data = stock['daily_data'][-1]
        last_close_price = last_day_data['close']
        next_day = datetime.strptime(last_day_data['date'], '%Y-%m-%d') + timedelta(days=1)
        forecasted_data = {
            'ticker': stock['ticker'],
            'date': next_day.strftime('%Y-%m-%d'),
            'forecasted_close': last_close_price
        }
        forecasts[stock['ticker']] = forecasted_data
    return forecasts

def regression_analysis(stock_data):
    regression_results = {}
    for stock in stock_data['stocks']:
        try:
            daily_changes = [day['daily_change'] for day in stock['daily_data']]
            dates = list(range(len(daily_changes)))
            
            # Reshape data for sklearn
            X = np.array(dates).reshape(-1, 1)
            y = np.array(daily_changes)
            
            # Perform regression
            model = LinearRegression()
            model.fit(X, y)
            
            regression_results[stock['ticker']] = {
                'stock': stock['ticker'],
                'slope': float(model.coef_[0]),
                'intercept': float(model.intercept_),
                'trend': 'positive' if model.coef_[0] > 0 else 'negative'
            }
        except KeyError as e:
            print(f"Error processing {stock['ticker']}: Missing key {e}")
        except Exception as e:
            print(f"Error processing {stock['ticker']}: {e}")
            
    return regression_results

def save_to_json(data, dir_url, filename):
    if not os.path.exists(dir_url):
        os.makedirs(dir_url)

    filename = os.path.join(dir_url, filename)
    with open(filename, 'w') as json_file:
        json.dump(data, json_file, indent=4)

if __name__ == "__main__":
    dir_url = 'DJ-Greenwood/Projects/StocksData'
    file_name = 'top_stocks_data.json'
    file_name_forcast = 'top_stocks_forecast.json'
    top_stocks = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA']
    stock_data = get_stock_data(top_stocks, dir_url, file_name)
    print(stock_data)
    
    forecasts = forecast_data(stock_data)
    regression_results = regression_analysis(stock_data)
    
    final_data = {
        'stock_data': stock_data,
        'forecasts': forecasts,
        'regression_results': regression_results
    }
    
    save_to_json(final_data, dir_url, file_name_forcast)
    print(f"Stock data saved to {dir_url}/top_stocks_data.json")
