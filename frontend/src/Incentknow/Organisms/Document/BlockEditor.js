
exports.autosize = x => () => {
    autosize(x);
}

exports.isFocused = element => () => {
    return document.activeElement == element;
};

exports.getInnerText = element => () => {
    return element.innerText;
};

exports.setInnerText = text => element => () => {
    const compareHTML = element.innerHTML.replace(/ /g, "&nbsp;").replace(/ /g, "&nbsp;");
    if (compareHTML != text) {
        element.innerHTML = text;
    }
};