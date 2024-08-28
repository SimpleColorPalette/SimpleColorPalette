const WCAG = {
    AAA: {
        name: "AAA",
        ratio: 7,
        icon: "new_releases",
        color: ""
    },
    AA: {
        name: "AA",
        ratio: 4.5,
        icon: "task_alt",
        color: ""
    },
    AABig: {
        name: "AA Big Text",
        ratio: 3,
        icon: "check",
        color: ""
    },
    NONE:{
        name: "NONE",
        ratio: 0,
        icon: "priority_high",
        color: ""
    },
}
const WCAGlist = [WCAG.AAA, WCAG.AA, WCAG.AABig, WCAG.NONE];

//Chat---
function luminance(r, g, b) {
    r = r / 255;
    g = g / 255;
    b = b / 255;
    r = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
    g = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
    b = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function contrastRatio(hex1, hex2) {
    const [r1, g1, b1] = hexToRgb(hex1);
    const [r2, g2, b2] = hexToRgb(hex2);
    const lum1 = luminance(r1, g1, b1);
    const lum2 = luminance(r2, g2, b2);
    const ratio = lum1 > lum2
        ? (lum1 + 0.05) / (lum2 + 0.05)
        : (lum2 + 0.05) / (lum1 + 0.05);
    return ratio;
}
//---Chat
const checkContrast = (color1, color2) => {
    const ratio = contrastRatio(color1, color2);
    let compliance = ratio >= WCAG.AAA.ratio ? WCAG.AAA :
                     ratio >= WCAG.AA.ratio ? WCAG.AA :
                     ratio >= WCAG.AABig.ratio ? WCAG.AABig :
                     WCAG.NONE;

    return {ratio: ratio.toFixed(2),
            compliance: compliance};
}
