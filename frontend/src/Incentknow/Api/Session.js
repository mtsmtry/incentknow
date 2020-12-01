

exports.storeSession = async authenticate => {
    const session = await authenticate;
    localStorage.setItem("session", session);
    return {};
};