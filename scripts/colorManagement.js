const defaultHex = "#808080";
const defaultHexLight = "#FFFFFF";
const defaultHexDark = "#000000";
const defaultHexs = [defaultHexLight, defaultHex, defaultHexDark];

class ColorPalette {
    /** @type {HTMLElement} */
    #colorListElement;
    /** @type {(index: number, hex: string) => HTMLElement} */
    #createElement;
    /** @type {(event: any) => number} */
    #getColorIndex;

    /**
     * @param {HTMLElement} colorListElement
     * @param {(index: number, hex: string) => HTMLElement} createElement
     * @param {(event: any) => number} getColorIndex
     */
    constructor(colorListElement, createElement, getColorIndex){
        this.#colorListElement = colorListElement;
        this.#createElement = createElement;
        this.#getColorIndex = getColorIndex;
    }

    colorHexs = [...defaultHexs];

    #resetColors = () => {
        this.colorHexs = [...defaultHexs];
    }
    
    /**
     * @param {number} index
     * @param {string} hexColor
     */
    #updateColor = (index, hexColor) => {
        this.colorHexs[index] = hexColor;
    }
    
    #addDefaultColor = () => {
        this.colorHexs.push(defaultHex);
    }
    
    /**
     * @param {number} index
     */
    #removeColor = (index) => {
        if (this.colorHexs.length < 2)
            return;
        
        this.colorHexs.splice(index, 1);
    }
    
    /**
     * @param {number} index
     * @param {number} swapIndex
     */
    #swapColors = (index, swapIndex) => {
        // console.log("moveColor", index, indexMove);
        // console.log("moveColor", colorHexs[index], colorHexs[indexMove]);
        [this.colorHexs[index], this.colorHexs[swapIndex]] = [this.colorHexs[swapIndex], this.colorHexs[index]];
    }

    /**
     * @param {number} index
     */
    #moveColorUp = (index) => {
        if (this.colorHexs.length < 2) return;
        let indexMove = index - 1;
        if (indexMove <= -1)
            indexMove = this.colorHexs.length - 1;
        this.#swapColors(index, indexMove);
    }
    
    /**
     * @param {number} index
     */
    #moveColorDown = (index) => {
        if (this.colorHexs.length < 2) return;
        let indexMove = index++;
        [indexMove, index] = [index, indexMove];
        if (indexMove > this.colorHexs.length - 1)
            indexMove = parseInt(0);
        this.#swapColors(index, indexMove);
    }

    
    // MODIFY HTML
    clearColors = ()=>{
        while (this.#colorListElement.hasChildNodes()) {
            this.#colorListElement.removeChild(
                this.#colorListElement.lastChild
            );
        }
    }

    updateColors = () => {
        this.clearColors();
        this.colorHexs.forEach(
            (hex, index) => {
                const element = this.#createElement(index, hex);
                this.#colorListElement.appendChild(element);
            }
        );
    }

    updateColor = (event) => {
        const index = this.#getColorIndex(event);
        const hexColor = event.currentTarget.value;
        this.#updateColor(index, hexColor);
    }

    addColor = () => {
        const index = this.#colorListElement.childElementCount;
        this.#addDefaultColor();
        const element = this.#createElement(index, defaultHex);
        this.#colorListElement.appendChild(element);
    }

    removeColor = (event) => {
        const index = this.#getColorIndex(event);
        this.#removeColor(index);
        this.updateColors();
    }

    // /**
    // * @param {number} index
    // * @param {number} indexMove
    // */
    // moveColor = (index, indexMove) => {
    //     this.#swapColors(index, indexMove);
    //     this.updateColors();
    // }

    moveColorUp = (event) => {
        const index = this.#getColorIndex(event);
        this.#moveColorUp(index);
        this.updateColors();
    }

    moveColorDown = (event) => {
        const index = this.#getColorIndex(event);
        this.#moveColorDown(index);
        this.updateColors();
    }

    resetColors = () => {
        this.#resetColors();
        this.updateColors();
    }
}

// export default ColorPalette;
