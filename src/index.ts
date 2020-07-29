import { FunctionalIterable } from "./func-iter"
import { AsyncFunctionalIterable } from "./async/func-iter"

export * from "./func-iter"
export * from "./range"
export * from "./methods"

const is = <T>(
    varToBeChecked: any,
    propertyToCheckFor: keyof T,
): varToBeChecked is T =>
    (varToBeChecked as T)[propertyToCheckFor] !== undefined

export function iter<T>(iter: Iterable<T>): FunctionalIterable<T>

export function iter<T>(iter: AsyncIterable<T>): AsyncFunctionalIterable<T>

export function iter<T>(
    iter: Iterable<T> | AsyncIterable<T>,
): FunctionalIterable<T> | AsyncFunctionalIterable<T> {
    if (is<AsyncIterable<T>>(iter, Symbol.asyncIterator as never)) {
        return new AsyncFunctionalIterable(iter)
    }
    return new FunctionalIterable(iter)
}
