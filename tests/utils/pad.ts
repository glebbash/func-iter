import { iter } from "../../src"

export function pad(template: TemplateStringsArray): string {
    const str = template[0].split("\n").slice(1)
    const padStart = iter(str[str.length - 1])
        .takeWhile((c) => c === " ")
        .count()
    return str.map((str) => str.slice(padStart)).slice(0, -1).join("\n")
}
