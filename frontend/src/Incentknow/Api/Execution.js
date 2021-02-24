

exports.showError = obj => {
    if(obj.error) {
        return obj.error;
    }
    return "";
};

exports.toCallbackApi = fetch => {
    return callback => { 
        return () => {
            const res = await fetch;
            callback(res)();
        };
    };
};

exports.mapPromise = f => {
    return promise => {
        return promise.then(x => f(x));
    };
};