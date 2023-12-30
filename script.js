$(document).ready(function() {
    const txtSearch = $("#txtSearch");
    const slcSearch = $("#slcSearch");
    const content = $("article#content");
    const containerCountries = $(".container-countries");
    const urlDefault = "https://restcountries.com/v3.1/";

    let result;
    let urlComplete;

    $(".container-theme").click(() => {
        $("body").toggleClass("dark");
        
        if ($("body").attr("class") == "dark") {
            $("i.dark").css("display", "none");
            $(".theme-text").text("Light Mode");
        } else {
            $("i.dark").css("display", "block");
            $(".theme-text").text("Dark Mode");
        }
    });

    async function getData(url) {
        await $.getJSON(url, (data) => {
            result = data;
        });
        return result;
    }
    
    async function setCountries() {
        let countries = "";

        await getData(urlComplete).then((result) => {
            result.forEach(element => {
                let country = `
                <div id="${element.name['common']}" class="container-country">
                    <img src="${element.flags['svg']}" alt="${element.name['common']}-img" class="country-img">
                    <div class="country-text">
                        <h2 class="country-name">${element.name['common']}</h2>
                        <ul class="country-information">
                            <li>
                                <strong>Population:</strong>
                                <span>${element['population']}</span>
                            </li>
                            <li>
                                <strong>Region:</strong>
                                <span>${element['region']}</span>
                            </li>
                            <li>
                                <strong>Capital:</strong>
                                <span>${element['capital']}</span>
                            </li>
                        </ul>
                    </div>
                </div>
                `;
                countries += country;
            });
        }).catch(() => {
            countries = `<p>Country not found!</p>`;
        });
        
        containerCountries.html(countries);
        
        $(".container-country").click((e) => {
            setCountryDetails(e.currentTarget.id);
        });   
    }

    function setCountryDetails(countryName) {
        prepareUrl(`name/${countryName}`);

        let countryDetails = "";
        getData(urlComplete).then((result) => {
            countryDetails = `
            
            <section class="container-details">
                <button id="country-back">
                    <i class='bx bx-arrow-back'></i>
                    <span>Back</span>
                </button>
                <div id="${result[0].name['common']}" class="country-datails">
                    <img src="${result[0].flags['svg']}" alt="${result[0].name['common']}-img" class="country-img">
                    <div class="country-text">
                        <h2 class="country-name">${result[0].name['common']}</h2>
                        <ul class="country-information">
                            <li>
                                <strong>Native Name:</strong>
                                <span>${result[0].name['official']}</span>
                            </li>
                            <li>
                                <strong>Population:</strong>
                                <span>${result[0]['population']}</span>
                            </li>
                            <li>
                                <strong>Region:</strong>
                                <span>${result[0]['region']}</span>
                            </li>
                            <li>
                                <strong>Sub Region:</strong>
                                <span>${result[0]['subregion']}</span>
                            </li>
                            <li>
                                <strong>Capital:</strong>
                                <span>${result[0]['capital']}</span>
                            </li>
                            <li>
                                <strong>Top Level Domain:</strong>
                                <span>${result[0]['tld']}</span>
                            </li>
                            <li>
                                <strong>Currencies:</strong>
                                <span>${result[0].currencies.toString()}</span>
                            </li>
                            <li>
                                <strong>Languages:</strong>
                                <span>${result[0].currencies['name']}</span>
                            </li>
                        </ul>
                        <ul class="country-border">
                            <li>
                                <strong>Border Countries:</strong>
                                ${ "A"}
                            </li>
                        </ul>
                    </div>
                </div>
            </section>
            `;
            
            content.html(countryDetails);
        });
    }

    function prepareUrl(complement) {
        urlComplete = urlDefault + (complement == null ? "all" : complement); 
    }

    function filterSearch(target) {
        if (target == "txtSearch") {
            txtSearch.val() != "" ? prepareUrl(`name/${txtSearch.val()}`) : prepareUrl();
        } else {
            slcSearch.val() != "" ? prepareUrl(`region/${slcSearch.val()}`) : prepareUrl();
        }

        setCountries();
    }

    $(".search").change((e) => {
        filterSearch(e.currentTarget.id);
    });

    prepareUrl();
    setCountries();
});