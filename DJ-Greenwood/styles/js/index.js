// Load both the resume data and news feed on DOM load
document.addEventListener("DOMContentLoaded", () => {
    loadResumeData();
    loadNewsFeed();
    loadStockData();
});

// Function to fetch and populate news articles
async function loadNewsFeed() {
    const newsContainer = document.getElementById("news-container");
    try {
        // Replace this with an actual API endpoint for fetching news
        const response = await fetch("https://newsapi.org/v2/everything?q=Data+Science&apiKey=YOUR_NEWS_API_KEY");
        const data = await response.json();

        // Dynamically create news cards
        const articles = data.articles.slice(0, 5); // Limit to 5 articles
        newsContainer.innerHTML = articles
            .map(article => `
                <div class="col-md-4">
                    <div class="card mb-4">
                        <img src="${article.urlToImage || 'placeholder.jpg'}" class="card-img-top" alt="News Image">
                        <div class="card-body">
                            <h5 class="card-title">${article.title}</h5>
                            <p class="card-text">${article.description || ''}</p>
                            <a href="${article.url}" target="_blank" class="btn btn-primary">Read More</a>
                        </div>
                    </div>
                </div>
            `)
            .join("");
    } catch (error) {
        newsContainer.innerHTML = `<p class="text-danger">Failed to load news. Please try again later.</p>`;
        console.error("Error fetching news:", error);
    }
}

async function loadStockData() {
    const stockContainer = document.getElementById("stock-container");
    if (!stockContainer) return;

    try {
        const response = await fetch("DJ-Greenwood/Projects/StocksData/top_stocks_forecast.json");
        if (!response.ok) throw new Error("Failed to load stock data");

        const data = await response.json();
        const regressionResults = data.regression_results;
        const forecasts = data.forecasts; // No need to convert to an object
        const stockDetails = data.stock_data.stocks; // Get detailed stock prices

        stockContainer.innerHTML = Object.keys(regressionResults)
            .map(stock => {
                const trend = regressionResults[stock].trend;
                const trendColor = trend === "positive" ? "text-success" : "text-danger";
                const forecast = forecasts[stock] || {};

                // Find stock details in the stock_data array
                const stockInfo = stockDetails.find(s => s.ticker === stock);
                const latestData = stockInfo?.daily_data?.[stockInfo.daily_data.length - 1] || {}; // Get last day data
                
                return `
                <div class="col-md-4">
                    <div class="card shadow-sm border-0">
                        <div class="card-body">
                            <h5 class="card-title text-primary"><strong>${stock}</strong></h5>
                            <hr>
                            <p class="card-text">📉 <strong>Slope:</strong> ${regressionResults[stock].slope.toFixed(2)}</p>
                            <p class="card-text">📊 <strong>Intercept:</strong> ${regressionResults[stock].intercept.toFixed(2)}</p>
                            <p class="card-text"><strong>Trend:</strong> <span class="${trendColor}">${trend.toUpperCase()}</span></p>
                            
                            ${
                                forecast.forecasted_close
                                    ? `<p class="card-text">📅 <strong>Forecasted Close:</strong> $${forecast.forecasted_close.toFixed(2)} <br> <small class="text-muted">on ${forecast.date}</small></p>`
                                    : `<p class="card-text text-muted">No forecast available</p>`
                            }

                            ${
                                latestData.close
                                    ? `<p class="card-text">📊 <strong>Last Close:</strong> $${latestData.close.toFixed(2)} on ${latestData.date}</p>`
                                    : `<p class="card-text text-muted">No recent price data</p>`
                            }
                        </div>
                    </div>
                </div>`;
            })
            .join("");
    } catch (error) {
        stockContainer.innerHTML = `<p class="text-danger">⚠️ Failed to load stock data. Please try again later.</p>`;
        console.error("Error fetching stock data:", error);
    }
}



async function loadResumeData() {
    try {
        const response = await fetch("DJ-Greenwood/styles/js/resume/resume.json"); // Make sure the path is correct
        if (!response.ok) throw new Error("Failed to load JSON data");
        const data = await response.json();

        // Populate Professional Summary
        document.getElementById("summary").textContent = data.summary;

        // Populate Skills
        if (data.skills && Array.isArray(data.skills)) {
            document.getElementById("skills").innerHTML = data.skills
                .map(skill => `<li>${skill}</li>`)
                .join("");
        } else {
            console.warn("Skills data is missing or not an array");
        }

        // Populate Programming Languages and Libraries
        if (data.programming_languages && Array.isArray(data.programming_languages)) {
            document.getElementById("programming-languages").innerHTML = data.programming_languages
                .map(language => {
                    if (typeof language === "string") {
                        return `<li>${language}</li>`; // Simple text for standalone languages
                    } else if (typeof language === "object" && language.name) {
                        let libraries = "";
                        if (language.libraries && Array.isArray(language.libraries)) {
                            libraries = `
                                <ul class="library-list">
                                    ${language.libraries.map(lib => `<li>${lib}</li>`).join("")}
                                </ul>`;
                        }
                        return `<li>${language.name}${libraries}</li>`;
                    }
                    return "";
                })
                .join("");
        } else {
            console.warn("Programming Languages data is missing or not an array");
        }

        // Populate Experience
        if (data.experience && Array.isArray(data.experience)) {
            document.getElementById("experience-list").innerHTML = data.experience
                .map(exp => `
                    <li>
                        <strong>${exp.title}</strong> (${exp.years})<br>
                        ${exp.responsibilities.join("<br>")}
                    </li>`)
                .join("");
        } else {
            console.warn("Experience data is missing or not an array");
        }

        // Populate Education
        if (data.education) {
            document.getElementById("education-details").textContent = `${data.education.university}, ${data.education.degree} (Expected: ${data.education.graduation_date})`;
        } else {
            console.warn("Education data is missing");
        }

        // Populate Certifications
        if (data.certifications && Array.isArray(data.certifications)) {
            document.getElementById("certifications-list").innerHTML = data.certifications
                .map(cert => `<li>${cert.name} - ${cert.year}</li>`)
                .join("");
        } else {
            console.warn("Certifications data is missing or not an array");
        }
    } catch (error) {
        console.error("Error loading resume data:", error);
    }
}

// Load resume data on page load
document.addEventListener("DOMContentLoaded", loadResumeData);

// Load resume data on page load
document.addEventListener("DOMContentLoaded", loadResumeData);


// Remove the duplicate scrollToTop function and keep just one:
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

window.onscroll = function() {
    const backToTopButton = document.querySelector('.back-to-top');
    if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
        backToTopButton.style.display = "block";
    } else {
        backToTopButton.style.display = "none";
    }
};

