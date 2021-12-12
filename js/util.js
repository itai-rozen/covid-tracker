const dqs = el => document.querySelector(el)
const dqsa = el => document.querySelectorAll(el)
const addClass = (el, className) => el.classList.add(className)
const removeClass = (el, className) => el.classList.remove(className)

function getRandomColor() {
    const hexStr = '0123456789abcdef'
    let randColor = ''
    for (let i = 0; i < 6; i++) randColor += (hexStr.charAt(getRandomNumber(hexStr.length)))
    return `#${randColor}`
}

function getRandomNumber(max){
    return Math.floor(Math.random() * max)
}