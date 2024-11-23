/**
 * Create a memoized function that stores the values in the provided
 * MapLike collection.
 * @example
 * const getSymbol = withCache(new Map(), key => Symbol(key));
 * getSymbol('john') === getSymbol('john') // => true
 */
export default function withCache<K extends object, V, C extends Map<K, V> | WeakMap<K, V>>(
  cache: C,
  factory: (key: K, cache: C) => V,
): (key: K) => V {
  return (key: K) => {
    const maybe = cache.get(key);
    if (maybe !== undefined) {
      return maybe;
    }

    const value = factory(key, cache);
    cache.set(key, value);
    return value;
  };
}
