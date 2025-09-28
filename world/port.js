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

// Major ports dataset
const majorPorts = {
    India: [
        "Jawaharlal Nehru Port (Nhava Sheva, Mumbai)",
        "Chennai Port",
        "Kolkata (Haldia) Port",
        "Visakhapatnam Port",
        "Cochin Port"
    ],
    China: [
        "Port of Shanghai",
        "Port of Ningbo-Zhoushan",
        "Port of Shenzhen",
        "Port of Guangzhou",
        "Port of Qingdao"
    ],
    Taiwan: [
        "Port of Kaohsiung",
        "Port of Keelung",
        "Port of Taichung"
    ],
    Singapore: [
        "Port of Singapore (PSA Singapore)"
    ],
    UnitedStates: [
        "Port of Los Angeles",
        "Port of Long Beach",
        "Port of New York and New Jersey",
        "Port of Savannah",
        "Port of Houston",
        "Port of Seattle-Tacoma"
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
                const countryName = countryData.name.common;
                const normalizedName = countryName.replace(/\s/g, "");

                // Fill in country info
                countryNameOutput.innerText = countryName;

                // Get ports data
                const ports = majorPorts[countryName] || majorPorts[normalizedName];

                if (ports) {
                    compOutput.innerHTML = `<h4>Major Ports:</h4><ul>${ports.map(p => `<li>${p}</li>`).join("")}</ul>`;
                } else {
                    compOutput.innerHTML = `<h4>Major Ports:</h4><p>No data available</p>`;
                }

                // Set flag and show container after it loads
                countryFlagOutput.src = countryData.flags?.png || countryData.flags?.svg || "";
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
closeBtn.addEventListener("click", () => {
    sidePanel.classList.remove("side-panel-open");
});
