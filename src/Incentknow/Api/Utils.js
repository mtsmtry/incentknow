
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