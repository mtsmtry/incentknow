
exports.getIcons = (() => { return async function() {
    const response = await fetch("/assets/fontawesome.json");
    return await response.json();
}})();