function makeChart(elementId) {
    console.log('hi chart maker')
    if (appData.chart) appData.chart.destroy()
    const countryRadioInputElement = dqs('.stats-option-list.country')

    const { chartResolution, chosenCountry, countriesCovidStats,
        continentCovidStats, currSelectedChartTypeInput, currCheckedStatCategoryInput } = appData

    if (currSelectedChartTypeInput === 'line') {
        removeClass(countryRadioInputElement, 'hide')
        
    }
    else addClass(countryRadioInputElement, 'hide')
    console.log('continent covid stats: ', continentCovidStats)
    console.log('continent keys: ', Object.keys(continentCovidStats))
    let chartStats
    if (chartResolution === 'continent-chart') {
        activateRadioButtons('continent')
        chartStats = getStatsByCategory(countriesCovidStats, appData.currCheckedStatCategoryInput)
    } else {
        activateRadioButtons('country')
        if (currSelectedChartTypeInput === 'line') chartStats = getTimelineChart('stats', chosenCountry.timeline)
        else chartStats = Object.values(chosenCountry.chartData)
    }
    console.log('chart stats: ', chartStats)


    const countriesNames = getStatsByCategory(countriesCovidStats, 'name')
    let chartLabels
    // console.log('country names:',countriesNames)

    if (chartResolution === 'continent-chart') {
        if (currCheckedStatCategoryInput === 'overall') {
            chartLabels = Object.keys(continentCovidStats)
        } else chartLabels = countriesNames
    } else {
        if (currSelectedChartTypeInput === "line") chartLabels = getTimelineChart('labels', chosenCountry.timeline)
        else chartLabels = Object.keys(chosenCountry.chartData)
    }
    console.log('chart labels: ', chartLabels)


    if (chartResolution === 'continent-chart') updateCountriesSelectInput(countriesNames)
    // console.log('countries stats: ',countriesStats)
    // console.log('chart stats by selected category: ', chartStats)
    // console.log('app data: ', appData)
    const myChart = document.getElementById(elementId).getContext('2d')
    // console.log('stats: ',countriesStats)

    let chartCtx = new Chart(myChart, {
        type: currSelectedChartTypeInput, // pie,  line, doughnut, radar, polararea
        data: {
            labels: chartLabels,
            datasets: [{
                label: currCheckedStatCategoryInput,
                data: chartStats
            }]
        }
    })
    appData.chart = chartCtx
}

function getStatsByCategory(countryObjs, category) {
    console.log('@get stats by category - country objects: ',countryObjs)
    console.log('@get stats by category - category: ',category)
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
    appData.chosenCountry.population = population
    appData.chosenCountry.updated = updated_at
    appData.chosenCountry.timeline = timeline
    dqs('.country-header').textContent = name
    dqs('.country-population').textContent = population.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    dqs('.country-updated').textContent = new Date(updated_at).toLocaleString()
    appData.chartResolution = 'country-chart'
    makeChart(appData.chartResolution)
}

function getTimelineChart(chartField, timelineData) {
    if (chartField === 'labels') {
        const timelineDates =  timelineData.map(timelineObj =>  timelineObj.date)
        return timelineDates
        // console.log('timeline dates: ',timelineDates)
    } else {
        return getStatsByCategory(timelineData, appData.currCheckedStatCategoryInput).reverse() 
    }
}
