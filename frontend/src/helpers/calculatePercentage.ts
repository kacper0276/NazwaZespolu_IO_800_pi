export function calculatePercentage(start: string, end: string): number {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const today = new Date();

  if (today < startDate) return 0;
  if (today > endDate) return 100;

  const totalTime = endDate.getTime() - startDate.getTime();
  const elapsed = today.getTime() - startDate.getTime();

  return Math.floor((elapsed / totalTime) * 100);
}
