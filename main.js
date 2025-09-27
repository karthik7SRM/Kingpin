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

        // Get country name from "name" attribute or class
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
                cityOutput.innerText = countryData.capital ? countryData.capital[0] : 'N/A';
                compOutput.innerHTML = 'Hewlett Packard, Intel, Qualcom, MediaTek, Samsung';

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
