export function pickRandom<T>(map: Record<string, T>, num: number): Array<T> {
  const keys = Object.keys(map)

  if (keys.length <= num) {
    return Object.values(map)
  } else {
    const picked = new Set<T>()
    while (picked.size < num) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const id = keys[Math.floor(Math.random() * keys.length)]!
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      picked.add(map[id]!)
    }
    return Array.from(picked.values())
  }
}
