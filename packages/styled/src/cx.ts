// Modified from https://github.com/joe-bell/cva/tree/main/packages/cva

export type ClassValue = string | undefined | ClassValue[];

function toString(mix: ClassValue) {
  let i: number;
  let currentValue: ClassValue;
  let result = "";

  if (typeof mix === "string" || typeof mix === "number") {
    result += mix;
  } else if (Array.isArray(mix)) {
    const len = mix.length;
    for (i = 0; i < len; i++) {
      if (mix[i]) {
        if ((currentValue = toString(mix[i]))) {
          result && (result += " ");
          result += currentValue;
        }
      }
    }
  }

  return result;
}

/**
 * Takes a number of strings or an array of strings and returns a merged class.
 *
 * @example
 * ```ts
 * clsx('hello', true && 'foo', false && 'bar');
 * // => "hello foo"
 *
 * // Arrays
 * clsx(['foo', 0, false, 'bar']);
 * //=> 'foo bar'
 *
 * // Arrays (variadic)
 * clsx(['foo'], ['', 0, false, 'bar'], [['baz', [['hello'], 'there']]]);
 * //=> 'foo bar baz hello there'
 *
 * // Any non-string values are ignored.
 * clsx({ foo: true });
 * //=> ""
 * ```
 * @param inputs
 */
export function cx(...inputs: ClassValue[]) {
  let i = 0;
  let currentValue: string;
  let result = "";
  const len = inputs.length;
  for (; i < len; i++) {
    if (inputs[i]) {
      if ((currentValue = toString(inputs[i]))) {
        result && (result += " ");
        result += currentValue;
      }
    }
  }
  return result;
}

export type Cx = typeof cx;
