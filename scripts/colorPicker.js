const clickColor = (event, colorPalette) => {
    const parent = event.currentTarget.parentNode;
    const resultHex = parent.querySelector('input[type="text"]');
    const resultColor = event.currentTarget;
    resultHex.value = resultColor.value;
    colorPalette.updateColor(event);
}

const textColorChange = (event, colorPalette) => {
    const parent = event.currentTarget.parentNode;
    const resultHex = event.currentTarget;
    const resultColor = parent.querySelector('input[type="color"]');
    let Reg_Exp = /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i;
    if (Reg_Exp.test(resultHex.value))
        resultColor.value = resultHex.value;
    else
        resultHex.value = resultColor.value;
    colorPalette.updateColor(event);
}

// export {clickColor, textColorChange};