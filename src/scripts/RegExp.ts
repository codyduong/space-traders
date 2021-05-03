export const getErrorCode = (string: String) => {
  const start: number = string.search(/[0-9]{3}/g)
  if (start===-1) return ''
  return string.slice(start)
}