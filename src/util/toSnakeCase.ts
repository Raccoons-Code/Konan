export default function toSnakeCase(obj: any): any {
  if (typeof obj !== 'object' || !obj) return obj;
  if (obj instanceof Date) return obj;
  if (Array.isArray(obj)) return obj.map(toSnakeCase);
  return Object.fromEntries(Object.entries(obj).map(([key, value]) => [snakeCase(key), toSnakeCase(value)]));
}

export function snakeCase(text: string) {
  return text.replace(/\W+/g, '').replace(/(?!^[A-Z])[A-Z]+/g, (match) => `_${match}`).toLowerCase();
}