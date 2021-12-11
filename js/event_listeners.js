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


const statItemsElements = dqsa('.radio')
statItemsElements.forEach(radioButton => {
    if (radioButton.checked) appData.currCheckedStatCategoryInput = radioButton.value
    radioButton.addEventListener('click',setNewValueAndDrawChart)

})


const optionSelectInputs = dqsa('.chart-option')
optionSelectInputs.forEach(option => {
    if (option.selected) appData.currSelectedCharTypeInput = option.value
})

const selectInputs = dqsa('.chart-type-select')
selectInputs.forEach(input => input.addEventListener('change', setNewValueAndDrawChart))



function setNewValueAndDrawChart(e){
    appData.chart.destroy()
    if (e.type === 'click') appData.currCheckedStatCategoryInput = e.target.value
    else appData.currSelectedCharTypeInput = e.target.value
    makeChart(appData.chartResolution)
}

function updateCountriesSelectInput(names){
    const selectInputElement = dqs('.countries-select')
    const strHtmls = names.map(name => `
    <option class="country-option" value="${name}">${name}</option>
    `)
    selectInputElement.innerHTML = strHtmls.join('')
    selectInputElement.addEventListener('change', makeCountryChart)
}



console.log(appData)



