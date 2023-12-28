$(document).ready(function() {
    const txtSearch = $("#txtSearch");
    const slcSearch = $("#slcSearch");
    const containerCountries = $(".container-countries");
    const urlDefault = "https://restcountries.com/v3.1/";
    
    let urlComplete;
    let countries;

    function setCountries(url) {
        $.getJSON(url, (result) => {
            result.forEach(element => {
                let country = `
                <div id="${element.name['common']}" class="container-country">
                    <img src="${element.flags['svg']}" alt="${element.name['common']}-img" class="country-img">
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
                `;
                countries += country;
            });
            containerCountries.html(countries);
        });
    }

    function prepareUrl(complement) {
        urlComplete = urlDefault + (complement == null ? "all" : `name/${complement}`);        
    }

    txtSearch.change(() => {
        prepareUrl(txtSearch.val());
    });

    prepareUrl();
    setCountries(urlComplete);
});