const map = document.querySelector("svg");
const countries = document.querySelectorAll("path");
const sidePanel = document.querySelector(".side-panel");
const container = document.querySelector(".side-panel .container");
const closeBtn = document.querySelector(".close-btn");
const loading = document.querySelector(".loading");
const zoomInBtn = document.querySelector(".zoom-in");
const zoomOutBtn = document.querySelector(".zoom-out");
const zoomValueOutput = document.querySelector(".zoom-value");
const countryNameOutput = document.querySelector(".country-name");
const countryFlagOutput = document.querySelector(".country-flag");
const cityOutput = document.querySelector(".city");
const compOutput = document.querySelector(".comp");

// Major airports dataset
const majorAirports = {
    India: [
        "Indira Gandhi International Airport (DEL)",
        "Chhatrapati Shivaji Maharaj International Airport (BOM)",
        "Kempegowda International Airport (BLR)",
        "Rajiv Gandhi International Airport (HYD)",
        "Chennai International Airport (MAA)"
    ],
    China: [
        "Beijing Capital International Airport (PEK)",
        "Shanghai Pudong International Airport (PVG)",
        "Guangzhou Baiyun International Airport (CAN)",
        "Chengdu Shuangliu International Airport (CTU)",
        "Shenzhen Bao'an International Airport (SZX)"
    ],
    Taiwan: [
        "Taiwan Taoyuan International Airport (TPE)",
        "Kaohsiung International Airport (KHH)",
        "Taichung International Airport (RMQ)"
    ],
    Singapore: [
        "Singapore Changi Airport (SIN)"
    ],
    "United States": [
        "Hartsfield Jackson Atlanta International Airport (ATL)",
        "Los Angeles International Airport (LAX)",
        "Chicago O'Hare International Airport (ORD)",
        "Dallas/Fort Worth International Airport (DFW)",
        "Denver International Airport (DEN)",
        "John F. Kennedy International Airport (JFK)",
        "San Francisco International Airport (SFO)"
    ]
};

// Hover effect & click event
countries.forEach(country => {
    country.addEventListener("mouseenter", () => country.style.fill = '#c99aff');
    country.addEventListener("mouseout", () => country.style.fill = '#443d4b');

    country.addEventListener("click", () => {
        loading.innerText = "Loading...";
        container.classList.add("hide");
        loading.classList.remove("hide");

        // Get country name from 'name' attribute or first class
        const clickedCountryName = country.getAttribute("name") || country.classList[0];
        sidePanel.classList.add("side-panel-open");

        fetch(`https://restcountries.com/v3.1/name/${clickedCountryName}?fullText=true`)
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.json();
            })
            .then(data => {
                const countryData = data[0];

                // Display country name
                countryNameOutput.innerText = countryData.name.common;

                // Normalize name for dataset match
                const normalizedName = countryData.name.common.replace(/\s/g, "");

                // Show major airports if available
                const airports = majorAirports[countryData.name.common] || majorAirports[normalizedName];
                if (airports) {
                    compOutput.innerHTML = `<ul>${airports.map(a => `<li>${a}</li>`).join("")}</ul>`;
                } else {
                    compOutput.innerHTML = "No data available";
                }

                // Display country flag
                countryFlagOutput.src = countryData.flags?.png || countryData.flags?.svg || "";
                countryFlagOutput.alt = `${countryData.name.common} flag`;

                // Show container after flag loads
                countryFlagOutput.onload = () => {
                    container.classList.remove("hide");
                    loading.classList.add("hide");
                };
                countryFlagOutput.onerror = () => {
                    container.classList.remove("hide");
                    loading.classList.add("hide");
                };
            })
            .catch(error => {
                loading.innerText = "No data to show for selected country";
                console.error("Fetch error:", error);
            });
    });
});

// Close side panel
closeBtn.addEventListener("click", () => sidePanel.classList.remove("side-panel-open"));
