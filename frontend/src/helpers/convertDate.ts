export function convertIsoToLocal(
  isoString: string,
  locale: string = "pl-PL"
): string {
  const date = new Date(isoString);

  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    // hour: "2-digit",
    // minute: "2-digit",
    // second: "2-digit",
    hour12: false,
  };

  const formattedDate = new Intl.DateTimeFormat(locale, options).format(date);

  return formattedDate;
}
