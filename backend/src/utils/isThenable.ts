export default function isThenable(obj: unknown): obj is PromiseLike<unknown> {
  return Boolean(obj) && typeof (obj as { then?: unknown }).then === "function";
}
