export function randomIntFromInterval(min: number, max: number) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function getLetter(n: number): string {
  if (n < 1) {
    return '';
  } else if (n > 26) {
    return `${getLetter(Math.floor(n / 26))}${getLetter(n - 26)}`;
  }
  return String.fromCharCode(64 + n);
}
