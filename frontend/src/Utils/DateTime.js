
function toTimestamp(date) {
    const milliseconds = date.getTime();
    return Math.floor(milliseconds / 1000);
}

exports.getDateTimeNow = toTimestamp(new Date());

exports.fromTimestampToElapsedTimeString = function (dt) {
    const seconds = toTimestamp(new Date()) - dt;
    if (seconds > 365 * 3600 * 24) {
        return Math.floor(seconds / (365 * 3600 * 24)).toString() + "年前"
    } else if (seconds > 30 * 3600 * 24) {
        return Math.floor(seconds / (30 * 3600 * 24)).toString() + "ヶ月前"
    } else if (seconds > 3600 * 24) {
        return Math.floor(seconds / (3600 * 24)).toString() + "日前"
    } else if (seconds > 3600) {
        return Math.floor(seconds / 3600).toString() + "時間前"
    } else if (seconds > 60) {
        return Math.floor(seconds / 60).toString() + "分前"
    } else {
        return "さっき"
    }
}