/**
 * @param {string} hex
 * @returns {number[]}
 */
const hexToRgb = (hex) => {
    let bigint = parseInt(hex.slice(1), 16);
    let r = (bigint >> 16) & 255;
    let g = (bigint >> 8) & 255;
    let b = bigint & 255;
    return [r, g, b];
}
// function hexToRgb(hex) {
//     let r = 0, g = 0, b = 0;
//     if (hex.length === 7) {
//         r = parseInt(hex.slice(1, 3), 16);
//         g = parseInt(hex.slice(3, 5), 16);
//         b = parseInt(hex.slice(5, 7), 16);
//     }
//     return [r, g, b];
// }

/**
 * @param {number} h
 * @param {number} s
 * @param {number} l
 * @returns {number[]}
 */
const hslToRgb = (h, s, l) => {
    let r, g, b;

    if (s === 0) {
        r = g = b = l; // achromatic
    } else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };

        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

/**
 * @param {number} r
 * @param {number} g
 * @param {number} b
 * @returns {number[]}
 */
function rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0; // achromatic
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return [h, s, l];
}

/**
 * 
 * @param {number[]} rgb1 
 * @param {number[]} rgb2 
 * @returns 
 */
const colorDistance = (rgb1, rgb2) => {
    const rDiff = rgb1[0] - rgb2[0];
    const gDiff = rgb1[1] - rgb2[1];
    const bDiff = rgb1[2] - rgb2[2];
    return Math.sqrt(rDiff * rDiff + gDiff * gDiff + bDiff * bDiff);
}

/**
 * 
 * @param {string} referenceColor 
 * @param {string[]} colorArray 
 * @returns {string[]}
 */
function sortColorsByProximity(referenceColor, colorArray) {
    const refRgb = hexToRgb(referenceColor);
    const sortedArray = [...colorArray];

    return sortedArray.sort((color1, color2) => {
        const distance1 = colorDistance(refRgb, hexToRgb(color1));
        const distance2 = colorDistance(refRgb, hexToRgb(color2));

        return distance1 - distance2; // Sort by increasing distance
    });
}