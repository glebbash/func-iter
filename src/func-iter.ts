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

/**
 *
 * @param iter
 */
export function iter<T>(iter: Iterable<T>): FunctionalIterable<T> {
    return new FunctionalIterable(iter)
}

export class FunctionalIterable<T> implements Iterable<T> {
    constructor(private iterable: Iterable<T>) {}

    [Symbol.iterator](): Iterator<T> {
        return this.iterable[Symbol.iterator]()
    }

    map<T2>(transform: (val: T) => T2): FunctionalIterable<T2> {
        return new FunctionalIterable(map(this.iterable, transform))
    }

    zip<T2>(iterable: Iterable<T2>): FunctionalIterable<[T, T2]> {
        return new FunctionalIterable(zip(this.iterable, iterable))
    }

    filter(predicate: Predicate<T>): FunctionalIterable<T> {
        return new FunctionalIterable(filter(this.iterable, predicate))
    }

    take(n: number): FunctionalIterable<T> {
        return new FunctionalIterable(take(this.iterable, n))
    }

    takeWhile(predicate: Predicate<T>): FunctionalIterable<T> {
        return new FunctionalIterable(takeWhile(this.iterable, predicate))
    }

    fold<A>(fun: (acc: A, val: T) => A, init: A): A {
        return fold(this.iterable, fun, init)
    }

    reduce(fun: (acc: T, val: T) => T): T {
        return reduce(this.iterable, fun)
    }

    join(sep: string): string {
        return join(this.iterable, sep)
    }

    some(predicate: Predicate<T>): boolean {
        return some(this.iterable, predicate)
    }

    every(predicate: Predicate<T>): boolean {
        return every(this.iterable, predicate)
    }

    collect(): T[] {
        return collect(this.iterable)
    }

    count(): number {
        return count(this.iterable)
    }
}
