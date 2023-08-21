import { isPlainObject } from 'lodash';

export function isObject(object: unknown): object is Record<string, unknown> {
  return isPlainObject(object);
}

export function isArrayOfObjects(object: unknown): object is Array<Record<string, unknown>> {
  return Array.isArray(object) && object.every(isObject);
}
