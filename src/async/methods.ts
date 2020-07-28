type Predicate<T> = (val: T) => boolean

export async function* toAsync<T>(
    iterable: Iterable<T>,
): AsyncGenerator<T> {
    for (const val of iterable) {
        yield val
    }
}

export async function* mapAsync<T, T2>(
    iterable: AsyncIterable<T>,
    transform: (val: T) => Promise<T2>,
) {
    for await (const val of iterable) {
        yield transform(val)
    }
}

export async function* zipAsync<T1, T2>(
    iterable1: AsyncIterable<T1>,
    iterable2: AsyncIterable<T2>,
): AsyncGenerator<[T1, T2]> {
    const iterator1 = iterable1[Symbol.asyncIterator]()
    const iterator2 = iterable2[Symbol.asyncIterator]()

    while (true) {
        const res1 = await iterator1.next()
        if (res1.done === true) break

        const res2 = await iterator2.next()
        if (res2.done === true) break

        yield [res1.value, res2.value]
    }
}

export async function* filterAsync<T>(
    iterable: AsyncIterable<T>,
    predicate: Predicate<T>,
) {
    for await (const val of iterable) {
        if (predicate(val)) yield val
    }
}

export async function someAsync<T>(
    iterable: AsyncIterable<T>,
    predicate: Predicate<T>,
) {
    for await (const val of iterable) {
        if (predicate(val)) return true
    }
    return false
}

export async function everyAsync<T>(
    iterable: AsyncIterable<T>,
    predicate: Predicate<T>,
) {
    for await (const val of iterable) {
        if (!predicate(val)) return false
    }
    return true
}

export async function foldAsync<A, T>(
    iterable: AsyncIterable<T>,
    fun: (acc: A, val: T) => A,
    init: A,
) {
    for await (const val of iterable) {
        init = fun(init, val)
    }
    return init
}

export async function reduceAsync<T>(
    iterable: AsyncIterable<T>,
    fun: (acc: T, val: T) => T,
) {
    const iterator = iterable[Symbol.asyncIterator]()
    const first = await iterator.next()

    if (first.done === true) {
        throw new Error("Reducing empty iterator")
    }

    let acc = first.value
    while (true) {
        const res = await iterator.next()
        if (res.done === true) break
        acc = fun(acc, res.value)
    }
    return acc
}

export async function joinAsync<T>(iterable: AsyncIterable<T>, sep: string) {
    return reduceAsync(
        mapAsync(iterable, async (val: T) => String(val)),
        (a, b) => a + sep + b,
    )
}

export async function collectAsync<T>(iterable: AsyncIterable<T>) {
    const array: T[] = []

    for await (const val of iterable) array.push(val)

    return array
}

export async function countAsync(iterable: AsyncIterable<any>) {
    return foldAsync(iterable, (count) => count + 1, 0)
}

export async function* takeAsync<T>(iterable: AsyncIterable<T>, n: number) {
    let i = 0
    for await (const val of iterable) {
        if (i++ < n) {
            yield val
        } else {
            break
        }
    }
}

export async function* takeWhileAsync<T>(
    iterable: AsyncIterable<T>,
    predicate: Predicate<T>,
) {
    for await (const val of iterable) {
        if (predicate(val)) {
            yield val
        } else {
            break
        }
    }
}
