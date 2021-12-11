const appData = {
    chart: null,
    chartResolution:'continent-chart',
    chosenContinent: '',
    chosenCountry: {
        name: null,
        population: null,
        updated: null,
        chartData: null,
        timeline: null
    },
    chosenCountryCovidStats: null,
    countriesCovidStats: null,
    continentCovidStats: null,
    currCheckedStatCategoryInput: null,
    currSelectedChartTypeInput: null,
    currCharType: null,
}

async function getRegionCovidData(e) {
    const spinnerElement = dqs('.spinner-container')
    removeClass(spinnerElement,'hide')
    const regionUserInput = (e.target.getAttribute('data-continent'))
    appData.chosenContinent = regionUserInput
    const url = `https://intense-mesa-62220.herokuapp.com/https://restcountries.herokuapp.com/api/v1/region/${regionUserInput}`
    let countriesCodes
    if (!localStorage.getItem(regionUserInput)) {
        const regionData = await axios.get(url)
        countriesCodes = getCountriesCodes(regionData)
        localStorage.setItem(regionUserInput, JSON.stringify(countriesCodes))
    } else countriesCodes = JSON.parse(localStorage.getItem(regionUserInput))
    
    console.log(countriesCodes)
    countriesCodes = countriesCodes.filter(country => country.code !== 'XK')
    const countriesCovidData = await getCovidData(countriesCodes)
    // localStorage.setItem('temp_covid_data', JSON.stringify(countriesCovidData))
    runStats(countriesCovidData)
    addClass(spinnerElement,'hide')
    scrollToSectionElement('.choose-continent','.continent-chart-section')
}

// getRegionCovidData()

function getCountriesCodes(region) {
    console.log(region)
    return region.data.map(country => {
        const { name, cca2 } = country
        return {
            name: name.common,
            code: cca2
        }
    })
}


async function getCovidData(countryCodesArr) {
    const countriesCovidData = await Promise.all(countryCodesArr.map((countryObj) => {
        const prom = axios.get(`https://corona-api.com/countries/${countryObj.code}`)
        return prom
    })).catch(err => console.log(err))
    return countriesCovidData
}

function runStats(countries) {
    // const countries = JSON.parse(localStorage.getItem('temp_covid_data'))
    const countriesStats = getCountryCovidStats(countries)
    console.log('with timeline: ',countriesStats)
    const continentStats = getContinentStats(countriesStats)
    appData.countriesCovidStats = countriesStats
    appData.continentCovidStats = continentStats

    makeChart('continent-chart')
}


function getCountryCovidStats(countryObjs) {
    return countryObjs.map(country => {
        const { data } = country
        const { data: newData } = data
        const { name, population, latest_data,timeline,updated_at } = newData
        const { confirmed, critical, deaths, recovered } = latest_data
        return {
            name, confirmed, critical, deaths, recovered, population,timeline, updated_at
        }
    })
}

function getContinentStats(casesObjs){
    let sumObj = {}
    casesObjs.forEach(obj => {
        for (let val in obj){
            if (typeof obj[val] === 'number' && val !== 'population'){
                if (!sumObj[val]) sumObj[val] = obj[val]
                else sumObj[val] += obj[val]
            }
        }
    })
    return sumObj
}


// runStats()