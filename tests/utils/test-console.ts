interface FakeConsole {
    log(...args: any[]): void

    data(): string[]
}

export function monitor(): FakeConsole {
    const data: string[] = []
    return {
        log: (...args: any[]) => data.push(args.join(" ")),
        data: () => data,
    }
}
