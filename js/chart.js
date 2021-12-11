function makeChart(elementId){
    console.log('hi chart maker')
    const { chartResolution, chosenCountryCovidStats, countriesCovidStats,
            continentCovidStats,currSelectedCharTypeInput,currCheckedStatCategoryInput } = appData
    
            console.log('continent covid stats: ', continentCovidStats)
            console.log('continent keys: ', Object.keys(continentCovidStats))   
    // console.log('overall stats: ',Array.from(Object.values(continentCovidStats)) )
    // console.log('countries stats: ',countriesStats)
        console.log('chart resolution: ',chartResolution)
    const chartStats = (chartResolution === 'continent-chart')?
        getStatsByCategory(countriesCovidStats,currCheckedStatCategoryInput) :
        Object.values(chosenCountryCovidStats)
    console.log('chart stats: ',chartStats)


    const countriesNames = getStatsByCategory(countriesCovidStats,'name')
    let chartLabels

    
    if (chartResolution === 'continent-chart'){
        if (currCheckedStatCategoryInput === 'overall'){
             chartLabels = Object.keys(continentCovidStats)
        } else  chartLabels = countriesNames
    } else {
        console.log('chosen country: ',appData.chosenCountry)
        console.log('chosen country stats: ', chosenCountryCovidStats)
         chartLabels = Object.keys(chosenCountryCovidStats)
    }
    console.log('chart labels: ', chartLabels)


    if (chartResolution === 'continent-chart') updateCountriesSelectInput(countriesNames)
    // console.log('countries stats: ',countriesStats)
    console.log('chart stats by selected category: ', chartStats)
    console.log('app data: ',appData)
    const myChart = document.getElementById(elementId).getContext('2d')
    // console.log('stats: ',countriesStats)
    
    let chartCtx = new Chart(myChart,{
        type: currSelectedCharTypeInput, // pie,  line, doughnut, radar, polararea
        data: {
            labels: chartLabels,
            datasets:[{
                label: chartLabels,
                data: chartStats 
            }]
        }
    })
    appData.chart = chartCtx
}

function getStatsByCategory (countryObjs, category){
    return (category === 'overall')?  Array.from(Object.values(appData.continentCovidStats))  : 
     countryObjs.map(country => country[category])
}

function makeCountryChart(e){
    appData.chart.destroy()
    appData.chosenCountry = e.target.value
    dqs('.country-header').textContent = appData.chosenCountry
    scrollToSectionElement('.continent-chart-section','.country-section')
    appData.currSelectedCharTypeInput = 'bar'
    appData.chosenCountryCovidStats = appData.countriesCovidStats.find(country => country.name === appData.chosenCountry)
    delete appData.chosenCountryCovidStats.name
    appData.chartResolution = 'country-chart'
    makeChart( appData.chartResolution)
}
