import {
    map,
    zip,
    filter,
    take,
    takeWhile,
    fold,
    reduce,
    join,
    some,
    every,
    collect,
    count,
    collectAsync,
    toAsync,
    mapAsync,
    zipAsync,
    filterAsync,
    takeAsync,
    takeWhileAsync,
    foldAsync,
    reduceAsync,
    joinAsync,
    someAsync,
    everyAsync,
    countAsync,
} from "./methods"

type Predicate<T> = (val: T) => boolean
type Transformer<T, T2> = (val: T) => T2

/**
 *
 * @param iter
 */
export function iter<T>(iter: Iterable<T>): FunctionalIterable<T>

export function iter<T>(iter: AsyncIterable<T>): AsyncFunctionalIterable<T>

export function iter<T>(
    iter: Iterable<T> | AsyncIterable<T>,
): FunctionalIterable<T> | AsyncFunctionalIterable<T> {
    if (Object.hasOwnProperty.call(iter, Symbol.asyncIterator)) {
        return new AsyncFunctionalIterable(iter as AsyncIterable<T>)
    }
    return new FunctionalIterable(iter as Iterable<T>)
}

export class AsyncFunctionalIterable<T> implements AsyncIterable<T> {
    constructor(private iterable: AsyncIterable<T>) {}

    [Symbol.asyncIterator](): AsyncIterator<T> {
        return this.iterable[Symbol.asyncIterator]()
    }

    map<T2>(transform: Transformer<T, Promise<T2>>) {
        return new AsyncFunctionalIterable(mapAsync(this.iterable, transform))
    }

    pipe<T2>(transform: Transformer<AsyncIterable<T>, AsyncIterable<T2>>) {
        return new AsyncFunctionalIterable(transform(this.iterable))
    }

    zip<T2>(iterable: AsyncIterable<T2>) {
        return new AsyncFunctionalIterable(zipAsync(this.iterable, iterable))
    }

    filter(predicate: Predicate<T>) {
        return new AsyncFunctionalIterable(
            filterAsync(this.iterable, predicate),
        )
    }

    take(n: number) {
        return new AsyncFunctionalIterable(takeAsync(this.iterable, n))
    }

    takeWhile(predicate: Predicate<T>) {
        return new AsyncFunctionalIterable(
            takeWhileAsync(this.iterable, predicate),
        )
    }

    fold<A>(fun: (acc: A, val: T) => A, init: A) {
        return foldAsync(this.iterable, fun, init)
    }

    reduce(fun: (acc: T, val: T) => T) {
        return reduceAsync(this.iterable, fun)
    }

    join(sep: string) {
        return joinAsync(this.iterable, sep)
    }

    some(predicate: Predicate<T>) {
        return someAsync(this.iterable, predicate)
    }

    every(predicate: Predicate<T>) {
        return everyAsync(this.iterable, predicate)
    }

    collect() {
        return collectAsync(this.iterable)
    }

    count() {
        return countAsync(this.iterable)
    }
}

export class FunctionalIterable<T> implements Iterable<T> {
    constructor(private iterable: Iterable<T>) {}

    [Symbol.iterator](): Iterator<T> {
        return this.iterable[Symbol.iterator]()
    }

    /* type check fails without explicit return type, ts bug ?? */
    async(): AsyncFunctionalIterable<T> {
        return new AsyncFunctionalIterable(toAsync(this.iterable))
    }

    map<T2>(transform: Transformer<T, T2>) {
        return new FunctionalIterable(map(this.iterable, transform))
    }

    pipe<T2>(transform: Transformer<Iterable<T>, Iterable<T2>>) {
        return new FunctionalIterable(transform(this.iterable))
    }

    zip<T2>(iterable: Iterable<T2>) {
        return new FunctionalIterable(zip(this.iterable, iterable))
    }

    filter(predicate: Predicate<T>) {
        return new FunctionalIterable(filter(this.iterable, predicate))
    }

    take(n: number) {
        return new FunctionalIterable(take(this.iterable, n))
    }

    takeWhile(predicate: Predicate<T>) {
        return new FunctionalIterable(takeWhile(this.iterable, predicate))
    }

    fold<A>(fun: (acc: A, val: T) => A, init: A) {
        return fold(this.iterable, fun, init)
    }

    reduce(fun: (acc: T, val: T) => T) {
        return reduce(this.iterable, fun)
    }

    join(sep: string) {
        return join(this.iterable, sep)
    }

    some(predicate: Predicate<T>) {
        return some(this.iterable, predicate)
    }

    every(predicate: Predicate<T>) {
        return every(this.iterable, predicate)
    }

    collect() {
        return collect(this.iterable)
    }

    count() {
        return count(this.iterable)
    }
}
