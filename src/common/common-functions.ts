export function isObject(object: unknown): object is Record<string, unknown> {
  if (object === null || object === undefined) {
    return false;
  }

  return typeof object === 'object';
}

export function isArrayOfObjects(object: unknown): object is Array<Record<string, unknown>> {
  return Array.isArray(object) && object.every(isObject);
}
