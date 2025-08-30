export function formatTime(seconds: number): string {
  const min = Math.floor(seconds / 60)
  const sec = seconds % 60
  return `${min}:${sec.toString().padStart(2, '0')}`
}