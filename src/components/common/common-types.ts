// even though I didn't use these I think they are a good piece of code that could be used at a later date
export type OptionalKeys<T> = { [K in keyof T as undefined extends T[K] ? K : never]: T[K] };
export type RequiredKeys<T> = { [K in keyof T as undefined extends T[K] ? never : K]: T[K] };
