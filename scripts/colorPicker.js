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
    if (!window.EyeDropper) {
        return;
    }
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
    /** @type {boolean} */
    #enabledMove

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
     * @param {string} hexColor 
     */
    #drawCircle = (x, y, hexColor) => {
        const stroke = 2;
        const radius = 8;
        // Draw the white circle
        this.#ctx.save();
        this.#ctx.strokeStyle = "rgb(0 0 0 / 50%)";
        this.#ctx.lineWidth = 1;
        this.#ctx.lineCap = "round";
        this.#ctx.beginPath();
        this.#ctx.moveTo(this.#center.x, this.#center.y);
        this.#ctx.lineTo(x,y);
        this.#ctx.stroke();
        this.#ctx.fillStyle = 'white';
        this.#ctx.shadowColor = 'black';
        this.#ctx.shadowBlur = stroke * 2;
        this.#ctx.beginPath();
        this.#ctx.arc(x, y, radius + stroke, 0, 2 * Math.PI);
        this.#ctx.fill();
        this.#ctx.fillStyle = hexColor;
        this.#ctx.shadowBlur = 0;
        this.#ctx.beginPath();
        this.#ctx.arc(x, y, radius, 0, 2 * Math.PI);
        this.#ctx.fill();
        this.#ctx.restore();
    }

    /**
     * @param {string} hexColor 
     * @returns {{x:number, y:number}}
     */
    #getXYbyHexColor = (hexColor) => {
        const [r, g, b] = hexToRgb(hexColor);
        const [h, s, l] = rgbToHsl(r, g, b);

        // Convert HSL to Cartesian coordinates
        // const angle = h * 2 * Math.PI;
        const angle = h * 2 * Math.PI;
        // const x = this.#center.x + s * this.#radius * Math.cos(angle);
        // const y = this.#center.y + s * this.#radius * Math.sin(angle);
        const x = this.#center.x - s * this.#radius * Math.cos(angle);
        const y = this.#center.y - s * this.#radius * Math.sin(angle);
        return {x:x, y:y};
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
            const xy = this.#getXYbyHexColor(hexColor);
            this.#drawCircle(xy.x, xy.y, hexColor);
        });
    }

    /**
     * @param {{x:number, y:number}} n1 
     * @param {{x:number, y:number}} n2 
     * @returns {number}
     */
    #euclideanDist(n1, n2){
        return Math.sqrt( (n2.x - n1.x) * (n2.x - n1.x) +
                          (n2.y - n1.y) * (n2.y - n1.y) );
    }
    
    /**
     * @param {number[]} newRGB
     * @param {number} x 
     * @param {number} y 
     */
    #moveColorToCloser = (newRGB, x, y) => {
        /** @type {string[]} */
        const colorHexs = this.#colorPalette.getColorHexs();
        /** @type {{x:number, y:number}[]} */
        const colorsXYs = colorHexs.map(hexColor => this.#getXYbyHexColor(hexColor));
        
        let closestColor = {i: 0, distance: this.#radius * 4};
        colorsXYs.forEach( (xy, i) => {
            const newDist = this.#euclideanDist({x:x, y:y}, xy);
            if (newDist < closestColor.distance)
                closestColor = {i:i, distance:newDist};
        })
        const oldHexColor = colorHexs[closestColor.i];
        
        const [or, og, ob] = hexToRgb(oldHexColor);
        const [oh, os, ol] = rgbToHsl(or, og, ob);
        const [nh, ns, nl] = rgbToHsl(newRGB[0], newRGB[1], newRGB[2]);
        const [r, g, b] = hslToRgb(nh, ns, ol);
        const hexColor = rgbToHex(r, g, b);
        
        this.#colorPalette.updateColor(closestColor.i, hexColor);
        this.#colorPalette.updateColors();
        this.drawSelectedColors();
    }

    pickColor = (event) => {
        // if (!this.#enabledMove) return;
        
        const rect = this.#canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const dx = x - this.#center.x;
        const dy = y - this.#center.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance <= this.#radius) {
            const imageData = this.#ctx.getImageData(x, y, 1, 1).data;
            this.#moveColorToCloser(imageData, x, y);
        }
    }

    /**
     * @param {boolean} enable 
     */
    enableMove = (event, enable)=>{
        this.#enabledMove = enable;
    }
}


// export {clickColor, textColorChange, pickColor};