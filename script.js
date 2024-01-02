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
                    <i class='bx bx-search text-button'></i>
                    <input class="txtSearch" type="text" placeholder="Search for a country...">
                </div>
                <div class="select-search">
                    <div class="slcSearch">
                        <div class="select-button">
                            <span class="select-text">Filter by Region</span>
                            <i class='bx bxs-chevron-down' ></i>
                        </div>
                        <ul class="options">
                            <li class="option">Africa</li>
                            <li class="option">America</li>
                            <li class="option">Asia</li>
                            <li class="option">Europe</li>
                            <li class="option">Oceania</li>
                        </ul>
                    </div>
                </div>
            </section>
        `;

        const countries = `
            <section class="container-countries">
            </section>
        `;

        content.html(search + countries);

        searchEvents();
    }

    function searchEvents() {
        let optionState = false;

        function optionParse(state) {
            if (state) {
                optionState = true;
                $(".options").fadeIn();
                $(".select-button > i").addClass("rotate");
            } else {
                optionState = false;
                $(".options").fadeOut();
                $(".select-button > i").removeClass("rotate");
            }
        }

        $(".select-button").click(() => {
            optionState = optionState == false ? true : false;
            optionParse(optionState);
        });

        $(".slcSearch .option").click((e) => {
            optionParse(false);
            $(".txtSearch").val("");
            $(".select-text").text(e.currentTarget.outerText);
            filterSearch("region", e.currentTarget.outerText);
        }); 

        $(".txtSearch").change((e) => {
            optionParse(false);
            $(".select-text").text("Filter by Region");
            filterSearch("name", e.currentTarget.value);
        });
        
        $(".text-button").click(() => {
            $(".select-text").text("Filter by Region");
            filterSearch("name", $(".txtSearch").val());
        });
    }

    async function setCountries() {
        const containerCountries = $(".container-countries");

        let auxReturn = "";
        await getData(urlComplete).then((result) => {
            result.forEach(element => {
                let country = `
                    <div id="${element['cca3']}" class="container-country">
                        <img src="${element.flags['svg']}" alt="${element.name['common']}-img" class="country-img">
                        <div class="country-text">
                            <h2 class="country-name">${element.name['common']}</h2>
                            <ul class="country-information">
                                <li>
                                    <strong>Population:</strong>
                                    <span>${element['population'].toLocaleString('en-US')}</span>
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

    function setCountriesDetails(alphaCode) {
        prepareUrl(`alpha/${alphaCode}`);

        let countriesDetails = "";
        getData(urlComplete).then((result) => {
            countriesDetails = `
            
            <section class="container-country-details">
                <button class="country-back">
                    <i class='bx bx-arrow-back'></i>
                    <span>Back</span>
                </button>
                <div id="${result[0]['cca3']}" class="country-datails">
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
                                <span>${result[0]['population'].toLocaleString('en-US')}</span>
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
                                <span>${format(result[0]['tld'])}</span>
                            </li>
                            <li>
                                <strong>Currencies:</strong>
                                <span>${Object.values(result[0].currencies).map(money => money.name)}</span>
                            </li>
                            <li>
                                <strong>Languages:</strong>
                                <span>${format(Object.values(result[0].languages).map(lang => lang))}</span>
                            </li>
                        </ul>
                        <div class="country-border">
                            <strong>Border Countries:</strong>
                            <div class="borders"></div>
                        </div>
                    </div>
                </div>
            </section>
            `;

            function format(array) {
                auxReturn = "";
                for (let i = 0; i < array.length; i++) {
                    auxReturn += array[i] + (i + 1 < array.length ? ", " : "");
                }
                return auxReturn;
            }

            content.html(countriesDetails);
            
            countryBorders(result[0].borders);
            
            $(".country-back").click(() => {
                initContent();
            });
        });
    }

    async function countryBorders(countries) {
        const countryBorder = $(".borders");

        let count = 0;
        let auxReturn = "";

        if (countries != null) {       
            while (count < countries.length) {
                prepareUrl(`alpha/${countries[count]}`);
    
                await getData(urlComplete).then((result)=> {
                    let borders = `
                        <button class="country-open" value="${result[0]['cca3']}">${result[0].name['common']}</button>
                    `;
                    auxReturn += borders;
                });   
                
                count++;
            }
        } else {
            auxReturn = "<span>This country has no borders!</span>";
        }

        countryBorder.append(auxReturn);

        $(".country-open").click((e) => {
            setCountriesDetails(e.currentTarget.value);
        });
    }

    function prepareUrl(complement) {
        urlComplete = urlDefault + (complement == null ? "all" : complement); 
    }

    function filterSearch(target, search) {
        if (target == "name") {
            search != "" ? prepareUrl(`name/${search}`) : prepareUrl();
        } else {
            search != "" ? prepareUrl(`region/${search}`) : prepareUrl();
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