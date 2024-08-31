// import {PasteImageListener, UploadImage} from './imageViewer.js';
// import ColorPalette from './colorManagement.js';
// import {clickColor, textColorChange} from './colorPicker.js' ;

//PASTE IMAGE
const imageInput = document.getElementById('image-input');
const imageFile = document.getElementById('image-file');
const imageDisplay = document.getElementById('image-display');
const imageDrop = document.getElementById('image-drop');
PasteImageListener(imageInput, imageDisplay);
UploadImage(imageFile, imageDisplay);
DragAndDropImage(imageDrop, imageDisplay);


//COLOR MANAGEMENT
const colorListElement = document.getElementById("colors");
const colorWheelCanvas = document.getElementById('colorWheel');
/**
 * @param {number} index
 * @param {string} hexColor
 */
const colorElement = (index, hex) => {
    let element = document.createElement("li");
    element.id = "color-" + index;
    element.className = "row";
    element.innerHTML = 
        // '<li class="row" id="color-">'
        // '<span>Color ' + (index + 1) + '</span>' +
        '<input type="color" id="cp-' + index + '" onchange="clickColor(event,colorPalette,pickColorWheel)" value="' + hex + '"/>' +
        '<input type="text"  id="hex-' + index + '" onchange="textColorChange(event,colorPalette,pickColorWheel)" value="' + hex + '"/>' +
        '<span></span>' +
        // '<button class="icon" onload="eyeDropperCheck(event)" onclick="eyeDropper(event)"><span class="material-symbols-rounded">colorize</span></button>' +
        '<button class="icon" onclick="colorPalette.removeColor(event)"><span class="material-symbols-rounded">close</span></button>' +
        '<button class="icon" onclick="colorPalette.moveColorUp(event)"><span class="material-symbols-rounded">arrow_upward</span></button>' +
        '<button class="icon" onclick="colorPalette.moveColorDown(event)"><span class="material-symbols-rounded">arrow_downward</span></button>'
        //'</li>'
    ;
    return element;
}
/**
* @return {number}
*/
const getColorIndex = (event) => {
    const parent = event.currentTarget.parentNode;
    return parent.id.split("-")[1];
}
const colorPalette = new ColorPalette(colorListElement, colorElement, getColorIndex);
const pickColorWheel = new PickColorWheel(colorWheelCanvas, colorPalette);


// COLOR COMBINATIONS
const combinationListElement = document.getElementById("test-colors");
/**
 * @param {{ratio, compliance}} contrast
*/
const combinationElement = (hexText, hexBg,
                            indexText, indexBg,
                            contrast) => {
    const element = document.createElement("div");
    element.id = "combination-" + indexText + "-" + indexBg;
    element.className = "row";
    element.innerHTML = 
    // '<div class="row">' +
            '<div class="row combination">' +
                '<span>Text: ' + hexText + '</span>' +
                '<span>Background ' + hexBg + '</span>' +
            '</div>' +
            '<div class="row contrast">' +
                '<span>' + contrast.ratio + '</span>' +
                '<span class="material-symbols-rounded">'+ contrast.compliance.icon + '</span>';
            '</div>'
    // '</div>'
    const testElem = element.querySelector('.combination');
    testElem.style.backgroundColor = hexBg;
    testElem.style.color = hexText;
    return element;
}

const testColors = () => {
    //clean combinationListElement
    while (combinationListElement.hasChildNodes()) {
        combinationListElement.removeChild(combinationListElement.lastChild);
    }
    
    const sameTogether = true;
    const colorHexs = colorPalette.getColorHexs();
    if (sameTogether)
    {
        const numColors = colorHexs.length;
        for (let indexBg = 0; indexBg < numColors; indexBg++)
        {
            for (let indexText = indexBg + 1; indexText < numColors; indexText++)
            {
                const hexText = colorHexs[indexText];
                const hexBg = colorHexs[indexBg];
                combinationListElement.appendChild(
                    combinationElement(hexText, hexBg,
                                       indexText, indexBg,
                                       checkContrast(hexText, hexBg))
                );
                combinationListElement.appendChild(
                    combinationElement(hexBg, hexText,
                                       indexBg, indexText,
                                       checkContrast(hexBg, hexText))
                );
            }
        }
    } else {
        colorHexs.forEach((hexBg, indexBg) => {
            colorHexs.forEach((hexText, indexText) => {
                if (indexBg != indexText) {
                    const contrast = checkContrast(hexText, hexBg);
                    combinationListElement.appendChild(
                        combinationElement(hexText, hexBg,
                                        indexText, indexBg,
                                        contrast)
                    );
                }
            });
        });
    }
}