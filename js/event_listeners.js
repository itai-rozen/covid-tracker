const continentElements = dqsa('.continent')
continentElements.forEach(el => {
    const textContentEl = el.querySelector('.continent-text')
    el.addEventListener('mouseover', () => {
        addClass(textContentEl, 'show')
    })
    el.addEventListener('mouseout', () => {
        removeClass(textContentEl, 'show')
    })
    el.addEventListener('click', getRegionCovidData)
})

const mobileSelectElement = dqs('.mobile-select')
mobileSelectElement.addEventListener('change',getRegionCovidData)

function scrollToSectionElement(fromClass, toClass){
    const fromElemet = dqs(fromClass)
    const toElement = dqs(toClass)
    removeClass(toElement,'hide')
    toElement.scrollIntoView({ block: 'end',  behavior: 'smooth' });
    setTimeout(() => {
        addClass(fromElemet,'hide')
    },500)
}

function activateRadioButtons(type){
    const statItemsElements = dqsa(`.radio-${type}`)
    statItemsElements.forEach(radioButton => {
        if (radioButton.checked){
            appData.currCheckedStatCategoryInput = radioButton.value
        } 
        radioButton.addEventListener('click',setNewValueAndDrawChart)
    })
}
    

function addSelectEventListeners(){

const optionSelectInputs = (appData.isMobile)? dqsa('.mobile-chart-option') :  dqsa('.chart-option')
optionSelectInputs.forEach(option => {
    if (option.selected) appData.currSelectedChartTypeInput = option.value
})

const selectInputs = (appData.isMobile)? dqsa('.mobile-chart-type-select') : dqsa('.chart-type-select')
selectInputs.forEach(input => input.addEventListener('change', setNewValueAndDrawChart))

}


function setNewValueAndDrawChart(e){
    appData.chart.destroy()
    if (e.type === 'click') appData.currCheckedStatCategoryInput = e.target.value
    else appData.currSelectedChartTypeInput = e.target.value
    makeChart(appData.chartResolution)
}

function updateCountriesSelectInput(names){
    const selectInputElement = dqs('.countries-select')
    const strHtmls = names.map(name => `
    <option class="country-option" value="${name}">${name}</option>
    `)
    selectInputElement.innerHTML =`<option class="default-option" value="" disabled selected hidden>Choose country</option>`+strHtmls.join('')
    selectInputElement.addEventListener('change', makeCountryChart)
}


dqs('.back-continent').addEventListener('click', () => {
    appData.chart.destroy()
    dqs('.default-option').checked
    appData.chartResolution = 'continent-chart'
    appData.currSelectedChartTypeInput = 'bar'
    appData.currCheckedStatCategoryInput = 'confirmed'
    makeChart('continent-chart')
    scrollToSectionElement('.country-section','.continent-chart-section')
})
dqs('.back-choose').addEventListener('click', () => {
    appData.chart.destroy()
    scrollToSectionElement('.continent-chart-section','.choose-continent')
})




