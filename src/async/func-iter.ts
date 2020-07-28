import {
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
    collectAsync,
    countAsync,
    toAsync,
} from "./methods"

type Predicate<T> = (val: T) => boolean
type Transformer<T, T2> = (val: T) => T2

export function async<T>(iterable: Iterable<T>): AsyncFunctionalIterable<T> {
    return new AsyncFunctionalIterable(toAsync(iterable))
}

export class AsyncFunctionalIterable<T> implements AsyncIterable<T> {
    constructor(private iterable: AsyncIterable<T>) {}

    [Symbol.asyncIterator](): AsyncIterator<T> {
        return this.iterable[Symbol.asyncIterator]()
    }

    to<T2>(transform: Transformer<AsyncIterable<T>, T2>) {
        return transform(this.iterable)
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
