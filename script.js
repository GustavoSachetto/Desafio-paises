$(document).ready(function() {
    const content = $("article#content");
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
    
    function setContent() {
        const search = `
            <section class="container-search">
                <div class="text-search">
                    <i class='bx bx-search'></i>
                    <input id="txtSearch" name="txtSearch" class="search" type="text" placeholder="Search for a country...">
                </div>
                <div class="select-search">
                    <select id="slcSearch" name="slcSearch" class="search">
                        <option value="">Filter by Region</option>
                        <option value="Africa">Africa</option>
                        <option value="America">America</option>
                        <option value="Asia">Asia</option>
                        <option value="Europe">Europe</option>
                        <option value="Oceania">Oceania</option>
                    </select>
                </div>
            </section>
        `;

        const countries = `
            <section class="container-countries">
            </section>
        `;

        content.html(search + countries);

        $(".search").change((e) => {
            filterSearch(e.currentTarget.id);
        });
    }

    async function setCountries() {
        const containerCountries = $(".container-countries");

        let auxReturn = "";
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
                auxReturn += country;
            });
        }).catch(() => {
            auxReturn = `<p>Country not found!</p>`;
        });
        
        containerCountries.html(auxReturn);
        
        $(".container-country").click((e) => {
            setCountriesDetails(e.currentTarget.id);
        });   
    }

    function setCountriesDetails(countryName) {
        prepareUrl(`name/${countryName}`);

        let countriesDetails = "";
        getData(urlComplete).then((result) => {
            countriesDetails = `
            
            <section class="container-details">
                <button class="country-back">
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
                                <span>${Object.values(result[0].currencies).map(money => money.name)}</span>
                            </li>
                            <li>
                                <strong>Languages:</strong>
                                <span>${Object.values(result[0].languages).map(lang => lang)}</span>
                            </li>
                        </ul>
                        <div class="country-border">
                            <strong>Border Countries:</strong>
                        </div>
                    </div>
                </div>
            </section>
            `;

            content.html(countriesDetails);
            
            countryBorders(result[0].borders);
            
            $(".country-back").click(() => {
                initContent();
            });
        });
    }

    async function countryBorders(countries) {
        const countryBorder = $(".country-border");

        let count = 0;
        let auxReturn = "";

        while (count < countries.length) {
            prepareUrl(`alpha/${countries[count]}`);

            await getData(urlComplete).then((result)=> {
                let borders = `
                    <button class="country-open" value="${result[0].name['common']}">${result[0].name['common']}</button>
                `;
                auxReturn += borders;
            });   
            
            count++;
        }

        countryBorder.append(auxReturn);
    }

    function prepareUrl(complement) {
        urlComplete = urlDefault + (complement == null ? "all" : complement); 
    }

    function filterSearch(target) {
        const txtSearch = $("#txtSearch");
        const slcSearch = $("#slcSearch");

        if (target == "txtSearch") {
            txtSearch.val() != "" ? prepareUrl(`name/${txtSearch.val()}`) : prepareUrl();
        } else {
            slcSearch.val() != "" ? prepareUrl(`region/${slcSearch.val()}`) : prepareUrl();
        }

        setCountries();
    }

    function initContent() {
        prepareUrl();
        setContent();
        setCountries();
    }
    
    initContent();
});