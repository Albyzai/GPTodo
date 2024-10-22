import isThenable from './isThenable.ts';

type Func<T> = (...args: unknown[]) => T | Promise<T>;

type TryCatchResult<T, D> = Promise<[T | D, Error | null]>;

function execute<T>(cb: () => T): T | Error {
  try {
    return cb();
  } catch (error) {
    return error instanceof Error ? error : new Error(String(error));
  }
}

export default function tryCatch<T, D = (T | null)>(
  cb: Func<T>,
  defaultValue: D = null as D
): TryCatchResult<T, D> {
  const result = execute(cb);

  if (result instanceof Error) {
    return Promise.resolve([defaultValue, result]);
  }

  if (isThenable(result)) {
    return result.then(
      (resolvedValue: T): [T, null] => [resolvedValue, null],
      (error: Error): [D, Error] => [defaultValue, error]
    );
  }

  return Promise.resolve([result as T, null]);
}