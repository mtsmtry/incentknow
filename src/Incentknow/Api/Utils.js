

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