export function pickRandom<T>(values: Array<T>, num: number): Array<T> {
  if (values.length <= num) {
    return values
  } else {
    const picked = new Set<T>()
    while (picked.size < num) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const value = values[Math.floor(Math.random() * values.length)]!
      picked.add(value)
    }
    return Array.from(picked.values())
  }
}
