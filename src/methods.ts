type Predicate<T> = (val: T) => boolean

export function* map<T, T2>(
    iterable: Iterable<T>,
    transform: (val: T) => T2,
): Generator<T2> {
    for (const val of iterable) {
        yield transform(val)
    }
}

export function* zip<T1, T2>(
    iterable1: Iterable<T1>,
    iterable2: Iterable<T2>,
): Generator<[T1, T2]> {
    const iterator1 = iterable1[Symbol.iterator]()
    const iterator2 = iterable2[Symbol.iterator]()

    while (true) {
        const res1 = iterator1.next()
        if (res1.done === true) break

        const res2 = iterator2.next()
        if (res2.done === true) break

        yield [res1.value, res2.value]
    }
}

export function* filter<T>(
    iterable: Iterable<T>,
    predicate: Predicate<T>,
): Generator<T> {
    for (const val of iterable) {
        if (predicate(val)) yield val
    }
}

export function some<T>(
    iterable: Iterable<T>,
    predicate: Predicate<T>,
): boolean {
    for (const val of iterable) {
        if (predicate(val)) return true
    }
    return false
}

export function every<T>(
    iterable: Iterable<T>,
    predicate: Predicate<T>,
): boolean {
    for (const val of iterable) {
        if (!predicate(val)) return false
    }
    return true
}

export function fold<A, T>(
    iterable: Iterable<T>,
    fun: (acc: A, val: T) => A,
    init: A,
): A {
    for (const val of iterable) {
        init = fun(init, val)
    }
    return init
}

export function reduce<T>(
    iterable: Iterable<T>,
    fun: (acc: T, val: T) => T,
): T {
    const iterator = iterable[Symbol.iterator]()
    const first = iterator.next()

    if (first.done === true) {
        throw new Error("Reducing empty iterator")
    }

    let acc = first.value
    while (true) {
        const res = iterator.next()
        if (res.done === true) break
        acc = fun(acc, res.value)
    }
    return acc
}

export function join<T>(iterable: Iterable<T>, sep: string): string {
    return reduce(map(iterable, String), (a, b) => a + sep + b)
}

export function collect<T>(iterable: Iterable<T>): T[] {
    const array = []

    for (const val of iterable) array.push(val)

    return array
}

export function count(iterable: Iterable<any>): number {
    return fold(iterable, (count) => count + 1, 0)
}

export function* take<T>(iterable: Iterable<T>, n: number): Iterable<T> {
    let i = 0
    for (const val of iterable) {
        if (i++ < n) {
            yield val
        } else {
            break
        }
    }
}

export function* takeWhile<T>(
    iterable: Iterable<T>,
    predicate: Predicate<T>,
): Iterable<T> {
    for (const val of iterable) {
        if (predicate(val)) {
            yield val
        } else {
            break
        }
    }
}

export function* numberGenerator(
    start: number,
    end: number,
    step: number,
): Generator<number> {
    for (let i = start; i < end; i += step) yield i
}
