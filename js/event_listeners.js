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
    console.log('hello activate')
    const statItemsElements = dqsa(`.radio-${type}`)
    statItemsElements.forEach(radioButton => {
        if (radioButton.checked){
            appData.currCheckedStatCategoryInput = radioButton.value
            console.log('found checked radio button! ', radioButton, radioButton.value)
        } 
        radioButton.addEventListener('click',setNewValueAndDrawChart)
    })
    console.log('current cateory input: ',appData.currCheckedStatCategoryInput)
}
    



const optionSelectInputs = dqsa('.chart-option')
optionSelectInputs.forEach(option => {
    if (option.selected) appData.currSelectedChartTypeInput = option.value
})

const selectInputs = dqsa('.chart-type-select')
selectInputs.forEach(input => input.addEventListener('change', setNewValueAndDrawChart))



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
    selectInputElement.innerHTML += strHtmls.join('')
    selectInputElement.addEventListener('change', makeCountryChart)
}


dqs('.back-continent').addEventListener('click', () => {
    appData.chart.destroy()
    dqs('.default-option').checked
    makeChart('continent-chart')
    appData.chartResolution = 'continent-chart'
    scrollToSectionElement('.country-section','.continent-chart-section')
})
dqs('.back-choose').addEventListener('click', () => {
    appData.chart.destroy()
    scrollToSectionElement('.continent-chart-section','.choose-continent')
})

console.log(appData)



