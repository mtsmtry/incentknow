

exports.showError = obj => {
    console.log("showError");
    console.log(obj);
    if(obj.error) {
        return obj.error;
    }
    return "";
};

exports.makeQueryCallback = name => {
    console.log(`makeQueryCallback:${name}`);
    return fetch => {
        return callback => { 
            return () => {
                async function get() { 
                    const result = await fetch;
                    callback({ result, from: "server" })();
                }
                get();
            };
        };
    };
};

// foreign import toCallbackApi :: forall a. (Option -> Promise a) -> (Response a -> Effect Unit) -> Effect Unit
/*
exports.toCallbackApi = fetch => {
    return callback => { 
        return () => {
            async function get(source) {
                try {
                    const res = await fetch({ source });
                    callback({ data: res, error: null, source })();
                } catch(e) {
                    callback({ data: null, error: e, source })();
                }
            };
            Promise.all[get("cache"), get("server")];
        };
    };
};
*/
exports.mapPromise = f => {
    return promise => {
        return promise.then(x => f(x));
    };
};