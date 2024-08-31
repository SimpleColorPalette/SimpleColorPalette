const defaultHex = "#FFFF00";
const defaultHexLight = "#00FFFF";
const defaultHexDark = "#FF00FF";
const defaultHexs = [defaultHexLight, defaultHex, defaultHexDark];

class ColorPalette {
    /** @type {HTMLElement} */
    #colorListElement;
    /** @type {(index: number, hex: string) => HTMLElement} */
    #createElement;
    /** @type {(event: any) => number} */
    #getColorIndex;
    /** @type {string[]} */
    #colorHexs = [...defaultHexs];

    //overridable functions
    updateColors = () => {}

    #loadSavedColors = () => {
        /** @type {string?} */
        let colorHexs = localStorage.getItem("SimpleColorPalette");
        if (colorHexs != null)
        {
            console.log(colorHexs);
            colorHexs = colorHexs.split(",");
            if (colorHexs != null && colorHexs.length > 0)
                this.#colorHexs = [...colorHexs];
        }
    }

    #saveColors = () => {
        localStorage.setItem("SimpleColorPalette", this.#colorHexs);
    }

    /**
     * @param {HTMLElement} colorListElement
     * @param {(index: number, hex: string) => HTMLElement} createElement
     * @param {(event: any) => number} getColorIndex
     */
    constructor(colorListElement, createElement, getColorIndex, colorHexs=[]){
        this.#colorListElement = colorListElement;
        this.#createElement = createElement;
        this.#getColorIndex = getColorIndex;
        this.#loadSavedColors();
        this.updateColors();
    }

    #resetColors = () => {
        this.#colorHexs = [...defaultHexs];
        this.#saveColors();
    }
    
    #addDefaultColor = () => {
        this.#colorHexs.push(defaultHex);
        this.#saveColors();
    }
    
    /**
     * @param {number} index
     */
    #removeColor = (index) => {
        if (this.#colorHexs.length < 2)
            return;
        
        this.#colorHexs.splice(index, 1);
        this.#saveColors();
    }
    
    /**
     * @param {number} index
     * @param {number} swapIndex
     */
    #swapColors = (index, swapIndex) => {
        // console.log("moveColor", index, indexMove);
        // console.log("moveColor", #colorHexs[index], #colorHexs[indexMove]);
        [this.#colorHexs[index], this.#colorHexs[swapIndex]] = [this.#colorHexs[swapIndex], this.#colorHexs[index]];
        this.#saveColors();
    }

    /**
     * @param {number} index
     */
    #moveColorUp = (index) => {
        if (this.#colorHexs.length < 2) return;
        let indexMove = index - 1;
        if (indexMove <= -1)
            indexMove = this.#colorHexs.length - 1;
        this.#swapColors(index, indexMove);
    }
    
    /**
     * @param {number} index
     */
    #moveColorDown = (index) => {
        if (this.#colorHexs.length < 2) return;
        let indexMove = index++;
        [indexMove, index] = [index, indexMove];
        if (indexMove > this.#colorHexs.length - 1)
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
        this.#colorHexs.forEach(
            (hex, index) => {
                const element = this.#createElement(index, hex);
                this.#colorListElement.appendChild(element);
            }
        );
    }
    
    /**
     * @param {number} index
     * @param {string} hexColor
     */
    updateColor = (index, hexColor) => {
        this.#colorHexs[index] = hexColor;
        this.#saveColors();
    }

    updateColorByEvent = (event) => {
        const index = this.#getColorIndex(event);
        const hexColor = event.currentTarget.value;
        this.updateColor(index, hexColor);
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

    /**
     * @returns {string[]}
     */
    getColorHexs = () => {
        return this.#colorHexs;
    }
}

// export default ColorPalette;
