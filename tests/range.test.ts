import { range } from "../src"
import { expect } from "chai"
import { pad } from "./utils/pad"
import { monitor } from "./utils/test-console"

describe("range", () => {
    const zeroToNine = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

    it("collect", () => {
        const res = range(0, 10).collect()

        expect(res).to.eql(zeroToNine)
    })

    it("includes", () => {
        const [min, max] = [0, 10]

        const rng = range(min, max)

        for (let i = min; i < max; i++) {
            expect(rng.includes(i)).to.eq(true)
        }
    })

    it("loop", () => {
        const console = monitor()

        for (const i of range(0, 10)) {
            console.log(i)
        }

        expect(console.data().join("\n")).to.eql(pad`
            0
            1
            2
            3
            4
            5
            6
            7
            8
            9
            `)
    })
})
