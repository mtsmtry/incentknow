exports.setAutosize = function(el) {
    return function() {
        autosize(el);
    };
};