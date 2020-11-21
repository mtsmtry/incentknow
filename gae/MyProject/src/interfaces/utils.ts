
function toTimestamp(date: Date) {
    const milliseconds = date.getTime();
    return Math.floor(milliseconds / 1000);
}

function groupBy<T>(array: T[], getKey: (obj: T) => number): { [key: number]: T[] } {
    return array.reduce((map: { [key: number]: T[] }, x) => {
        const key = getKey(x);
        (map[key] || (map[key] = [])).push(x);
        return map;
    }, {});
}

function mapBy<T>(array: T[], getKey: (obj: T) => number): { [key: number]: T } {
    return array.reduce((map, x) => map[getKey(x)] = x, {});
}