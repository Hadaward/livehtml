/**
 * Asserts a condition, generating an error if it is not met.
 * @param {boolean} condition 
 * @param {string} message 
 * @param {Error} errorConstructor 
 * @example
 * assert(false, "This sould throw an reference error", ReferenceError);
 */
export function assert(condition, message, errorConstructor) {
    if (typeof condition !== "boolean")
        throw new TypeError(`(condition) ${String(condition)} expected to be boolean but got ${typeof condition}`);
    else if (typeof message !== "string")
        throw new TypeError(`(message) ${String(message)} expected to be a string but got ${typeof message}`);
    else if (typeof errorConstructor !== "function" || (errorConstructor !== Error && errorConstructor.__proto__ !== Error)) {
        throw new TypeError(`(errorConstructor) ${String(errorConstructor)} expected to be a instance of Exception but got ${typeof errorConstructor}`);
    }

    if (!condition)
        throw new errorConstructor(message);
}

/**
 * Asserts a type, generating a type error if the type is not the expected one.
 * @param {any} value 
 * @param {string} expectedType
 * @example
 * assertType("1", "number", "myNumber"); // should throw TypeError('(myNumber) 1 expected to be number but got string');
 */
export function assertType(value, expectedType, valueName = "value") {
    assert(typeof expectedType === "string", `(expectedType) ${String(expectedType)} expected to be a string but got ${typeof expectedType}`, TypeError);
    assert(typeof valueName === "string", `(valueName) ${String(valueName)} expected to be a string but got ${typeof valueName}`, TypeError);
    assert(typeof value === expectedType, `(${valueName}) ${String(value)} expected to be ${expectedType} but got ${typeof value}`, TypeError);
}

export function lock(object) {
    return new Proxy(object, {
        deleteProperty: () => false,
        set(target, key, value) {
            if (Object.hasOwn(target, key))
                target[key] = value;

            return true;
        }
    })
}