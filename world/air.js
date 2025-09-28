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
    UnitedStates: [
        "Hartsfield–Jackson Atlanta International Airport (ATL)",
        "Los Angeles International Airport (LAX)",
        "Chicago O'Hare International Airport (ORD)",
        "Dallas/Fort Worth International Airport (DFW)",
        "Denver International Airport (DEN)",
        "John F. Kennedy International Airport (JFK)",
        "San Francisco International Airport (SFO)"
    ]
};

// Hover effect
countries.forEach(country => {
    country.addEventListener("mouseenter", function () {
        this.style.fill = '#c99aff';
    });

    country.addEventListener("mouseout", function () {
        this.style.fill = '#443d4b';
    });

    // Click event
    country.addEventListener("click", function () {
        loading.innerText = "Loading...";
        container.classList.add("hide");
        loading.classList.remove("hide");

        const clickedCountryName = this.getAttribute("name") || this.classList[0];
        sidePanel.classList.add("side-panel-open");

        fetch(`https://restcountries.com/v3.1/name/${clickedCountryName}?fullText=true`)
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.json();
            })
            .then(data => {
                const countryData = data[0];

                // Fill in country info
                countryNameOutput.innerText = countryData.name.common;

                // Show major airports if available
                const airports = majorAirports[countryData.name.common];
                if (airports) {
                    cityOutput.innerText = "Major Airports:";
                    compOutput.innerHTML = `<ul>${airports.map(a => `<li>${a}</li>`).join("")}</ul>`;
                } else {
                    cityOutput.innerText = "Major Airports:";
                    compOutput.innerHTML = "No data available";
                }

                // Set flag and show container after it loads
                countryFlagOutput.src = countryData.flags.png;
                countryFlagOutput.onload = () => {
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

// Optional: close side panel
closeBtn.addEventListener("click", () => {
    sidePanel.classList.remove("side-panel-open");
});
