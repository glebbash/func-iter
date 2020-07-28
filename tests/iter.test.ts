import { expect } from "chai"
import { iter, range, rangeInc } from "../src"
import { monitor } from "./utils/test-console"
import { m } from "multiline-str"
import { async } from "../src/async/func-iter"

function padStart(x: any, n: number): string {
    return x.padStart(n)
}

describe("iterable", () => {
    const oneToSix = [1, 2, 3, 4, 5, 6]
    const isEven = (x: number) => x % 2 == 0

    it("collect", () => {
        const res = iter(oneToSix).collect()

        expect(res).to.eql(oneToSix)
    })

    it("map", () => {
        const resIter = iter(oneToSix)
            .map((it) => it * 2)
            .collect()
        const res = oneToSix.map((it) => it * 2)

        expect(resIter).to.eql(res)
    })

    it("zip", () => {
        const resIter = iter(oneToSix).zip(oneToSix).collect()

        expect(resIter).to.eql([
            [1, 1],
            [2, 2],
            [3, 3],
            [4, 4],
            [5, 5],
            [6, 6],
        ])
    })

    it("filter", () => {
        const filtered = iter(oneToSix).filter(isEven).collect()

        expect(filtered).to.eql([2, 4, 6])
    })

    it("some", () => {
        const someAreEven = iter(oneToSix).some(isEven)

        expect(someAreEven).to.eql(true)
    })

    it("every", () => {
        const allAreEven = iter(oneToSix).every(isEven)

        expect(allAreEven).to.eql(false)
    })

    it("1..5 to power 2", () => {
        const res = range(1, Infinity)
            .zip(rangeInc(1, 5).map((x) => x ** 2))
            .map(([i, x]) => `${i} ^ 2 = ${x}`)
            .collect()

        expect(res).to.eql([
            "1 ^ 2 = 1",
            "2 ^ 2 = 4",
            "3 ^ 2 = 9",
            "4 ^ 2 = 16",
            "5 ^ 2 = 25",
        ])
    })

    it("take while", () => {
        expect(
            range(1, Infinity)
                .takeWhile((n) => n <= 6)
                .collect(),
        ).to.eql(oneToSix)
    })

    it("multiplication table", () => {
        const oneToTen = rangeInc(1, 10)

        const table = oneToTen.map((row) => oneToTen.map((it) => it * row))

        const con = monitor()

        for (const row of table) {
            con.log(row.map((it) => padStart(it + "", 3)).join(" "))
        }

        expect(con.data().join("\n")).to.eql(m`
              1   2   3   4   5   6   7   8   9  10
              2   4   6   8  10  12  14  16  18  20
              3   6   9  12  15  18  21  24  27  30
              4   8  12  16  20  24  28  32  36  40
              5  10  15  20  25  30  35  40  45  50
              6  12  18  24  30  36  42  48  54  60
              7  14  21  28  35  42  49  56  63  70
              8  16  24  32  40  48  56  64  72  80
              9  18  27  36  45  54  63  72  81  90
             10  20  30  40  50  60  70  80  90 100
            `)
    })

    it("to async", async () => {
        const data = rangeInc(1, 10)
            .to(async)
            .map(async (x) => x + 100)

        for await (const val of data) {
            console.log(val)
        }
    })

    it("pipe", () => {
        const rng = rangeInc(1, 10)
        const duplicator = function* <T>(items: Iterable<T>) {
            for (const val of items) {
                yield val
                yield val
            }
        }
        const res1 = iter(rng).pipe(duplicator).collect()
        const res2 = <number[]>(
            [].concat(...rng.map((val) => [val, val]).collect())
        )

        expect(res1).to.eql(res2)
    })
})
