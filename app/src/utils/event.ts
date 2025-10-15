export function withPreventDefault<
  E extends { preventDefault: () => void },
  R,
  T extends (e: E) => R,
>(fn: T): (e: E) => R {
  return function (e: E) {
    e.preventDefault();
    return fn(e);
  };
}
