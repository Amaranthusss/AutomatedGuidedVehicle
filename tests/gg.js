//----------------Required variables----------------
let angle
let dir
const MAX_ANGLE = 20
let ini
//----------------Only for juypter----------------
var Plot = require('plotly-notebook-js');
let x
const FULL_ROTATES = 10

angle = -MAX_ANGLE - 1
dir = false
y = []
ini = false
for (let i = 0; i < MAX_ANGLE * 2 * FULL_ROTATES + 1; i++)
{
    if (dir == false && angle != MAX_ANGLE)
        angle++
    else
        angle--
    if (ini == true)
        if (angle >= MAX_ANGLE || angle <= -MAX_ANGLE)
            dir = dir != true
    ini = true
    y.push(angle)
}

x = []
for (let i = 0; i < y.length; i++)
    x.push(i)
var myPlot = Plot.createPlot([{ x: x, y: y }], { 
    title: 'Kontrola rotacji pracy silnika', 
    yaxis: {title: {text: 'Kąt rotacji'}}, 
    xaxis: {title: {text: 'Krok iteracji'}} 
});

$$html$$ = myPlot.render();