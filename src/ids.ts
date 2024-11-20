const delimiter = ","


export function toDBIds(ids: number[]): string {
  return ids.join(delimiter)
}


export function toAppIds(dbIds: string): number[] {
  const splitIds = dbIds.split(delimiter)

  return splitIds.map((id: string) => parseInt(id))
}
