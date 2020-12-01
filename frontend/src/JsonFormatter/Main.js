exports.setFormatterImpl = function (element, json) {
    const formatter = new JSONFormatter(json);
    element.childNodes = []; 
    element.appendChild(formatter.render());
}