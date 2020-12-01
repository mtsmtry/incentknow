function notNull<T>(item: T | null | undefined): item is T {
    return item != null;
}

function groupBy<T>(array: T[], getKey: (obj: T) => number | null): { [key: number]: T[] } {
    return array.reduce((map: { [key: number]: T[] }, x) => {
        const key = getKey(x);
        if (key) {
            (map[key] || (map[key] = [])).push(x);
        }
        return map;
    }, {});
}

function mapBy<T>(array: T[], getKey: (obj: T) => number | null): { [key: number]: T } {
    return array.reduce((map, x) => {
        const key = getKey(x);
        if (key) {
            map[key] = x;
        }
        return map;
    }, {});
}

function mapByString<T>(array: T[], getKey: (obj: T) => string | null): { [key: string]: T } {
    return array.reduce((map, x) => {
        const key = getKey(x);
        if (key) {
            map[key] = x;
        }
        return map;
    }, {});
}