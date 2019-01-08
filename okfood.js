// ==UserScript==
// @name         OkFood
// @namespace    https://yes.erin.codes
// @version      0.1
// @description  Maybe keep track of sugar free lunch options
// @author       Erin Spiceland <yes@erin.codes>
// @include      https://lunchpad*
// @grant GM_setValue
// @grant GM_getValue
// ==/UserScript==

const foods = [];

class Food {
    constructor (img) {
        if (!img || !img.parentNode) {
            console.log(params)
            throw new Error('Missing img tag or its parent.')
        }

        this.link = img.parentNode
        this.img = img
        this.src = this.link.href
        this.button = createButton(this)

        this.refreshColor()
        this.link.parentNode.insertBefore(this.button, this.link.nextSibling || null)
    }

    getStatus () {
        // Never allow "Coming soon" nutrition info to be set to ok or not ok.
        if (this.src.indexOf('Coming') > 0) return null

        const value = GM_getValue(this.src)
        if (['ok', 'not ok'].indexOf(value) === -1) return null
        return value === 'ok' ? 'ok' : 'not ok'
    }

    refreshColor () {
        this.color = getColor(this.getStatus())
        this.link.style.border = `1px solid ${this.color}`
        this.link.style.backgroundColor = this.color
        this.button.style.border = `1px solid ${this.color}`
        this.button.style.backgroundColor = this.color
        this.img.style.paddingTop = '2px'
        this.img.style.border = `1px solid ${this.color}`
    }
}

function createButton (food) {
    var button = document.createElement('span')
    button.innerHTML = 'Toggle'
    button.addEventListener('click', evt => {
    const status = food.getStatus() === 'ok' ? 'not ok' : 'ok'
        GM_setValue(food.src, status)
        food.refreshColor()
    })
    return button
}

function getColor(status) {
    if (!status) return 'lightgray'
    return status === 'ok' ? 'palegreen' : 'peachpuff'
}

(function() {
    'use strict'

    const imgs = document.getElementsByTagName('img')
    for (let idx in imgs) {
        let img = imgs[idx]

        if (!img.src || img.src.indexOf('nutrition') === -1) return

        foods.push(new Food(img))
    }
})();

