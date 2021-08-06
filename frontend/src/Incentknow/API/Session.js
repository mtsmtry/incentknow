

exports.storeSession = async authenticate => {
    const { session, userId } = await authenticate;
    localStorage.setItem("session", session);
    localStorage.setItem("userId", userId);
    return {};
};

exports._getMyUserId = () => {
    return localStorage.getItem("userId");
};

exports.logout = () => {
    localStorage.removeItem("session");
    localStorage.removeItem("userId");
}