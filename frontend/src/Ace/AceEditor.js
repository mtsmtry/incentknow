


exports.setCursorVisibleImpl = function (editor, show) {
    return function () {
        if (show) {
            editor.renderer.$cursorLayer.element.style.display = "block";
        } else {
            editor.renderer.$cursorLayer.element.style.display = "none";
        }
    }
}