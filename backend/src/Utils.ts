export function notNull<T>(item: T | null | undefined): item is T {
    return item != null;
}

export function groupBy<T>(array: T[], getKey: (obj: T) => number | null): { [key: number]: T[] } {
    return array.reduce((map: { [key: number]: T[] }, x) => {
        const key = getKey(x);
        if (key) {
            (map[key] || (map[key] = [])).push(x);
        }
        return map;
    }, {});
}

export function mapBy<T>(array: T[], getKey: (obj: T) => number | null): { [key: number]: T } {
    return array.reduce((map, x) => {
        const key = getKey(x);
        if (key) {
            map[key] = x;
        }
        return map;
    }, {});
}

export function mapByString<T>(array: T[], getKey: (obj: T) => string | null): { [key: string]: T } {
    return array.reduce((map, x) => {
        const key = getKey(x);
        if (key) {
            map[key] = x;
        }
        return map;
    }, {});
}

export const sleep = (time: number) => {
    return new Promise((resolve: any, reject) => {
        setTimeout(() => {
            resolve()
        }, time);
    })
};

export function splitArray<T extends any[]>(arr: T, size: number): T[] {
    return arr.reduce(
        (newarr, _, i) => (i % size ? newarr : [...newarr, arr.slice(i, i + size)]),
        [] as T[][]
    )
}

export function zip<T, U>(array1: T[], array2: U[]): [T, U][] {
    const length = Math.min(array1.length, array2.length);
    const result: [T, U][] = [];
    for (let i = 0; i < length; i++) {
        result.push([array1[i], array2[i]]);
    }
    return result;
}