function makeChart(elementId) {
    if (appData.chart) appData.chart.destroy()
    const countryRadioInputElement = dqs('.stats-option-list.country')

    const { chartResolution, chosenCountry, countriesCovidStats,
        continentCovidStats, currSelectedChartTypeInput, currCheckedStatCategoryInput } = appData

    if (currSelectedChartTypeInput === 'line') {
        removeClass(countryRadioInputElement, 'hide')
        
    }
    else addClass(countryRadioInputElement, 'hide')
    let chartStats
    if (chartResolution === 'continent-chart') {
        activateRadioButtons('continent')
        chartStats = getStatsByCategory(countriesCovidStats, appData.currCheckedStatCategoryInput)
    } else {
        activateRadioButtons('country')
        if (currSelectedChartTypeInput === 'line') chartStats = getTimelineChart('stats', chosenCountry.timeline)
        else chartStats = Object.values(chosenCountry.chartData)
    }


    const countriesNames = getStatsByCategory(countriesCovidStats, 'name')
    let chartLabels

    if (chartResolution === 'continent-chart') {
        if (currCheckedStatCategoryInput === 'overall') {
            chartLabels = Object.keys(continentCovidStats)
        } else chartLabels = countriesNames
    } else {
        if (currSelectedChartTypeInput === "line") chartLabels = getTimelineChart('labels', chosenCountry.timeline)
        else chartLabels = Object.keys(chosenCountry.chartData)
    }

    const chartColors = chartLabels.map(_ => getRandomColor())
    if (chartResolution === 'continent-chart') updateCountriesSelectInput(countriesNames)
    const myChart = document.getElementById(elementId).getContext('2d')

    let chartCtx = new Chart(myChart, {
        type: currSelectedChartTypeInput, 
        data: {
            labels: chartLabels,
            datasets: [{
                label: currCheckedStatCategoryInput,
                data: chartStats,
                axis: (appData.isMobile)? 'y' : 'x',
                backgroundColor: chartColors,
                borderWidth: 2,
                borderColor: '#ccc',
                hoverBorderColor: '#fff'
            }]
        },
        options: {
            indexAxis: (appData.isMobile)?  'y' : 'x',
            aspectRatio: (appData.isMobile) ? 1 : 2.5,
            plugins:{
                title: {
                    display: true,
                    text:  (chartResolution === 'country-chart' )?  
                    `Population: ${appData.chosenCountry.population.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}. 
                     Last updated: ${new Date(appData.chosenCountry.updated).toLocaleString()}`: 
                     '',
                    color: '#1ADB98',
                    position: 'bottom',
                    padding: 15,
                    font: {
                        size: 30
                    }
                }
            }
        }

    })
    appData.chart = chartCtx
}



function getStatsByCategory(countryObjs, category) {
    return (category === 'overall') ? Object.values(appData.continentCovidStats) :
        countryObjs.map(country => country[category])
}

function makeCountryChart(e) {
    appData.chart.destroy()
    appData.chosenCountry.name = e.target.value
    scrollToSectionElement('.continent-chart-section', '.country-section')
    appData.currSelectedChartTypeInput = 'bar'
    dqs('.chart-type-select.country').querySelector('option').selected = true
    const countryStats = appData.countriesCovidStats.find(country => country.name === appData.chosenCountry.name)
    const { confirmed, critical, deaths, recovered, name, population, updated_at, timeline } = countryStats
    appData.chosenCountry.chartData = { confirmed, critical, deaths, recovered }
    appData.chosenCountry.name = name
    appData.chosenCountry.population = population
    appData.chosenCountry.updated = updated_at
    appData.chosenCountry.timeline = timeline
    dqs('.country-header').textContent = name
    appData.chartResolution = 'country-chart'
    makeChart(appData.chartResolution)
}

function getTimelineChart(chartField, timelineData) {
    if (chartField === 'labels') {
        const timelineDates =  timelineData.map(timelineObj =>  timelineObj.date)
        return timelineDates
    } else {
        return getStatsByCategory(timelineData, appData.currCheckedStatCategoryInput).reverse() 
    }
}
