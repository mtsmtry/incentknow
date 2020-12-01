
function toTimestamp(date: Date) {
    const milliseconds = date.getTime();
    return Math.floor(milliseconds / 1000);
}
