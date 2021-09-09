
function toTimestamp(date) {
    const milliseconds = date.getTime();
    return Math.floor(milliseconds / 1000);
}

exports.getDateTimeNow = toTimestamp(new Date());