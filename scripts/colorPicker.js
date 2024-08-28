const eyeDropperCheck = (event) => {
    if (!window.EyeDropper) {
        // alert("Your browser does not support the EyeDropper API");
        // return;
        event.currentTarget.style.visibility = "hidden";
        event.currentTarget.remove();
    }
}

const eyeDropper = (event) => {
    const parent = event.currentTarget.parentNode;
    const resultHex = parent.querySelector('input[type="text"]');
    const resultColor = parent.querySelector('input[type="color"]');
    const eyeDropper = new EyeDropper();
    eyeDropper.open()
              .then((result) => {
                    resultHex.value = result.sRGBHex;
                    resultColor.value = result.sRGBHex;
                    // resultHex.textContent = result.sRGBHex;
                    // resultColor.style.backgroundColor = result.sRGBHex;
                    })
              .catch((e) => {
                    resultHex.value = e;
                    });
};

const clickColor = (event, colorPalette, pickColorWheel) => {
    const parent = event.currentTarget.parentNode;
    const resultHex = parent.querySelector('input[type="text"]');
    const resultColor = event.currentTarget;
    resultHex.value = resultColor.value;
    colorPalette.updateColorByEvent(event);
    pickColorWheel.drawSelectedColors();
}

const textColorChange = (event, colorPalette, pickColorWheel) => {
    const parent = event.currentTarget.parentNode;
    const resultHex = event.currentTarget;
    const resultColor = parent.querySelector('input[type="color"]');
    const Reg_Exp = /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i;
    if (Reg_Exp.test(resultHex.value))
    {
        resultColor.value = resultHex.value;
        pickColorWheel.drawSelectedColors();
        colorPalette.updateColorByEvent(event);
    } else {
        resultHex.value = resultColor.value;
    }
}

class PickColorWheel {
    /** @type {HTMLCanvasElement} */
    #canvas
    /** @type {CanvasRenderingContext2D} */
    #ctx
    /** @type {number} */
    #radius
    /** @type {{x:number, y:number}} */
    #center
    /** @type {ColorPalette} */
    #colorPalette
    /** @type {ImageData} */
    #colorWheelImageData
    // /** @type {{x:number, y:number, radius:number}[]} */
    // #circles
    

    //overridable functions
    drawColorWheel = ()=>{}
    drawSelectedColors = ()=>{}

    /**
     * @param {HTMLCanvasElement} canvas
     * @param {ColorPalette} colorPalette
     */
    constructor (canvas, colorPalette) {
        this.#canvas = canvas;
        this.#ctx = this.#canvas.getContext('2d', {willReadFrequently:true});
        const margin = 0.125;
        this.#radius = (this.#canvas.width / 2) * (1 - margin);
        this.#center = { x: this.#radius * (1+margin), y: this.#radius * (1+margin) };
        this.#colorPalette = colorPalette;
        this.drawColorWheel();
        this.drawSelectedColors();
    }

    /**
     * @param {number} x 
     * @param {number} y 
     */
    #drawCircle = (x, y) => {
        // Draw the white circle
        this.#ctx.save();
        this.#ctx.strokeStyle = 'black';
        this.#ctx.lineWidth = 2;
        this.#ctx.beginPath();
        this.#ctx.arc(x, y, 10, 0, 2 * Math.PI);
        this.#ctx.stroke();
        this.#ctx.strokeStyle = 'white';
        this.#ctx.lineWidth = 1.5;
        this.#ctx.beginPath();
        this.#ctx.arc(x, y, 10, 0, 2 * Math.PI);
        this.#ctx.stroke();
        this.#ctx.restore();
    }

    #drawSelectionCircle = (hexColor) => {
        const [r, g, b] = hexToRgb(hexColor);
        const [h, s, l] = rgbToHsl(r, g, b);

        // Convert HSL to Cartesian coordinates
        // const angle = h * 2 * Math.PI;
        const angle = h * 2 * Math.PI;
        // const x = this.#center.x + s * this.#radius * Math.cos(angle);
        // const y = this.#center.y + s * this.#radius * Math.sin(angle);
        const x = this.#center.x - s * this.#radius * Math.cos(angle);
        const y = this.#center.y - s * this.#radius * Math.sin(angle);
        this.#drawCircle(x, y);
    }
    
    //Chat--
    drawColorWheel = () => {
        const image = this.#ctx.createImageData(this.#canvas.width, this.#canvas.height);
        const data = image.data;
    
        for (let y = 0; y < this.#canvas.height; y++) {
            for (let x = 0; x < this.#canvas.width; x++) {
                const dx = x - this.#center.x;
                const dy = y - this.#center.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const angle = Math.atan2(dy, dx) + Math.PI;
                const hue = angle / (2 * Math.PI);
                const saturation = Math.min(distance / this.#radius, 1);
                const [r, g, b] = hslToRgb(hue, saturation, 0.5);
    
                if (distance <= this.#radius) {
                    const index = (y * this.#canvas.width + x) * 4;
                    data[index] = r;
                    data[index + 1] = g;
                    data[index + 2] = b;
                    data[index + 3] = 255;
                } else {
                    const index = (y * this.#canvas.width + x) * 4;
                    data[index] = 255;
                    data[index + 1] = 255;
                    data[index + 2] = 255;
                    data[index + 3] = 0;
                }
            }
        }
        
        this.#colorWheelImageData = image;
        this.#ctx.putImageData(this.#colorWheelImageData, 0, 0);
        this.#ctx.save();
    }

    drawSelectedColors = () => {
        this.#ctx.putImageData(this.#colorWheelImageData, 0, 0);
        const colorHexs = this.#colorPalette.getColorHexs();
        colorHexs.forEach(hexColor => {
            this.#drawSelectionCircle(hexColor);
        });
    }

    #moveColorToCloser = (hexColor) => {
        const colorHexs = this.#colorPalette.getColorHexs();
        const sortedColorHexs = sortColorsByProximity(hexColor, colorHexs);
        const index = colorHexs.indexOf(sortedColorHexs[0]);
        this.#colorPalette.updateColor(index, hexColor);
        this.#colorPalette.updateColors();
        this.drawSelectedColors();
    }

    pickColor = (event) => {
        const rect = this.#canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const dx = x - this.#center.x;
        const dy = y - this.#center.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance <= this.#radius) {
            const imageData = this.#ctx.getImageData(x, y, 1, 1).data;
            const hexColor = `#${((1 << 24) + (imageData[0] << 16) + (imageData[1] << 8) + imageData[2]).toString(16).slice(1).toUpperCase()}`;
            this.#moveColorToCloser(hexColor);
        }
    }
}


// export {clickColor, textColorChange, pickColor};