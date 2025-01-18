export function convertIsoToLocal(
  isoString: string,
  locale: string = "pl-PL",
  includeTime: boolean = false
): string {
  const date = new Date(isoString);

  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour12: false,
  };

  if (includeTime) {
    options.hour = "2-digit";
    options.minute = "2-digit";
    options.second = "2-digit";
  }

  const formattedDate = new Intl.DateTimeFormat(locale, options).format(date);

  return formattedDate;
}
