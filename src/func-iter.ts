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
} from "./methods"

type Predicate<T> = (val: T) => boolean
type Transformer<T, T2> = (val: T) => T2

export class FunctionalIterable<T> implements Iterable<T> {
    constructor(private iterable: Iterable<T>) {}

    [Symbol.iterator](): Iterator<T> {
        return this.iterable[Symbol.iterator]()
    }

    to<T2>(transform: Transformer<Iterable<T>, T2>) {
        return transform(this.iterable)
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
