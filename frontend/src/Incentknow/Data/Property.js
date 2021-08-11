
exports.forceConvert = x => {
    return x
};

exports.getMaterialObjectType = x => {
    if (x.draftId) {
        return "draft";
    } else if(x.data) {
        return "focused";
    } else {
        return "related";
    }
};

exports.assignJson = a => b => {
    return Object.assign(a, b);
}

exports.insertJson = id => vl => obj => {
    const r = { };
    Object.keys(obj).forEach(x => {
        r[x] = obj[x];
    });
    r[id] = vl;
    return r;
};