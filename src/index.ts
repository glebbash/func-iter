import { FunctionalIterable } from "./func-iter"
import { AsyncFunctionalIterable } from "./async/func-iter"

export * from "./func-iter"
export * from "./range"
export * from "./methods"

export function iter<T>(iter: Iterable<T>): FunctionalIterable<T>

export function iter<T>(iter: AsyncIterable<T>): AsyncFunctionalIterable<T>

export function iter<T>(
    iter: Iterable<T> | AsyncIterable<T>,
): FunctionalIterable<T> | AsyncFunctionalIterable<T> {
    if (iter[Symbol.asyncIterator] !== undefined) {
        return new AsyncFunctionalIterable(iter as AsyncIterable<T>)
    }
    return new FunctionalIterable(iter as Iterable<T>)
}