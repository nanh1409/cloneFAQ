export function sampleSize(arr: any[], n = 1) {
  const length = arr.length;
  if (!length || n < 1) return [];
  n = n > length ? length : n;
  let index = -1;
  const lastIndex = length - 1;
  const result = [...arr];
  while (++index < n) {
    const rand = index + Math.floor(Math.random() * (lastIndex - index + 1))
    const value = result[rand];
    result[rand] = result[index];
    result[index] = value;
  }
  return result.slice(0, n);
}

export function range(start: number, end?: number, step?: number) {
  if (end == undefined) {
    end = start
    start = 0
  }
  step = step === undefined ? (start < end ? 1 : -1) : step;
  let index = -1;
  let length = Math.max(Math.ceil((end - start) / (step || 1)), 0);
  const result = new Array(length);
  while (length--) {
    result[++index] = start;
    start += step;
  }
  return result;
}

export function isFunction(value: any) {
  return typeof value === 'function';
}

export function flatMap<R>(arr: R[][]) {
  return arr.flatMap((value) => value);
}

export function shuffle<R>(arr: R[]) {
  const length = arr.length;
  if (!length) return [];
  let index = -1
  const lastIndex = length - 1
  const result = [...arr];
  while (++index < length) {
    const rand = index + Math.floor(Math.random() * (lastIndex - index + 1))
    const value = result[rand]
    result[rand] = result[index]
    result[index] = value
  }
  return result
}