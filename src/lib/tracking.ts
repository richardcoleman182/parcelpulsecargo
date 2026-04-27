export function generateTrackingNumber() {
  let digits = "";

  for (let index = 0; index < 7; index += 1) {
    digits += Math.floor(Math.random() * 10).toString();
  }

  return `PPC${digits}`;
}

export function normalizeTrackingNumber(value: string) {
  return value.trim().toUpperCase().replace(/\s+/g, "");
}
