import { FunctionalIterable } from "./func-iter"
import { numberGenerator } from "./methods"

export class RangeIterable extends FunctionalIterable<number> {
    constructor(public start: number, public end: number, public step: number) {
        super({ [Symbol.iterator]: () => numberGenerator(start, end, step) })
    }

    includes(x: number): boolean {
        return x >= this.start && x < this.end
    }
}

export function range(start: number, end: number, step = 1): RangeIterable {
    return new RangeIterable(start, end, step)
}

export function rangeInc(start: number, end: number, step = 1): RangeIterable {
    return range(start, end + 1, step)
}
