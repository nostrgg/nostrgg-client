export const dateToUnix = (_date?: Date) => {
  const date = _date || new Date()

  return Math.floor(date.getTime() / 1000)
}
