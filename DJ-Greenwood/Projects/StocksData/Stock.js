const exampleJson = {
    "stock_data": {
        "stocks": [
            {
                "ticker": "AAPL",
                "daily_data": [
                    { "date": "2024-01-18", "open": 185.18, "close": 187.71, "high": 188.22, "low": 184.92, "daily change": 2.53 },
                    { "date": "2024-01-17", "open": 184.30, "close": 185.18, "high": 186.00, "low": 183.50, "daily change": 1.00 }
                ]
            },
            {
                "ticker": "MSFT",
                "daily_data": [
                    { "date": "2024-01-18", "open": 320.15, "close": 322.50, "high": 323.00, "low": 319.00, "daily change": 2.35 },
                    { "date": "2024-01-17", "open": 318.10, "close": 320.15, "high": 321.50, "low": 317.00, "daily change": 2.05 }
                ]
            }
        ]
    }
};

async function loadFinancialDashboard() {
    const dashboardContainer = document.getElementById("financial-dashboard");

    try {
        // Use example JSON for debugging
        const data = exampleJson; // await response.json();
        // Populate dashboard with latest stock data
        dashboardContainer.innerHTML = data.stock_data.stocks
            .map(stock => {
                // Sort daily data by date (descending) and get the latest entry
                const latestData = stock.daily_data.sort(
                    (a, b) => new Date(b.date) - new Date(a.date)
                )[0];

                return `
                    <div class="col-md-4">
                        <div class="card mb-4 shadow-sm">
                            <div class="card-body">
                                <h5 class="card-title text-primary">${stock.ticker}</h5>
                                <p class="card-text">Open Price: $${latestData.open.toFixed(2)}</p>
                                <p class="card-text">Close Price: $${latestData.close.toFixed(2)}</p>
                                <p class="card-text">Daily Change: ${latestData.daily_change.toFixed(2)}%</p>
                                <p class="card-text">High: $${latestData.high.toFixed(2)}</p>
                                <p class="card-text">Low: $${latestData.low.toFixed(2)}</p>
                            </div>
                        </div>
                    </div>
                `;
            })
            .join("");
    } catch (error) {
        dashboardContainer.innerHTML = `<p class="text-danger">Failed to load financial data. Please try again later.</p>`;
        console.error("Error fetching financial data:", error);
    }
}



async function loadStockTrendsChart() {
    const ctx = document.getElementById('financial-chart').getContext('2d');

    try {
        const response = await fetch("DJ-Greenwood/Projects/StocksData/top_stocks_data.json");
        const data = await response.json();

        // Group data by stock
        const stocksData = data.stock_data.stocks.reduce((acc, stock) => {
            acc[stock.ticker] = {
                dates: stock.daily_data.map(day => day.date),
                prices: stock.daily_data.map(day => day.close)
            };
            return acc;
        }, {});

        // Create datasets for each stock
        const datasets = Object.entries(stocksData).map(([ticker, data], index) => ({
            label: ticker,
            data: data.prices,
            borderColor: getColor(index),
            fill: false,
            tension: 0.1
        }));

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: stocksData[Object.keys(stocksData)[0]].dates,
                datasets: datasets
            },
            options: {
                responsive: true,
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                scales: {
                    y: {
                        title: {
                            display: true,
                            text: 'Price ($)'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Date'
                        }
                    }
                }
            }
        });
    } catch (error) {
        console.error('Error loading chart:', error);
    }
}

// Helper function to generate colors
function getColor(index) {
    const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'];
    return colors[index % colors.length];
}