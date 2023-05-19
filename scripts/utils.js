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

export function extendHTMLElement(classObject, tagName) {
    const instances = [];

    Object.defineProperty(classObject, Symbol.hasInstance, {
        value(instance) {
            return instances.includes(instance);
        },
    });

    return new Proxy(classObject, {
        construct(target, args, newTarget) {
            const element = document.createElement(tagName);
            const instance = new target(element, ...args);
            const instanceProto = Object.getPrototypeOf(instance);

            for (const key of Object.getOwnPropertyNames(instanceProto)) {
                Object.defineProperty(element, key, {
                    get() {
                        return instance[key];
                    },
                    set(value) {
                        instance[key] = value;
                    }
                });
            }

            for (const key in instance) {
                Object.defineProperty(element, key, {
                    get() {
                        return instance[key];
                    },
                    set(value) {
                        instance[key] = value;
                    }
                });
            }

            for (const key in element) {
                Object.defineProperty(instance, key, {
                    get() {
                        return element[key];
                    },
                    set(value) {
                        element[key] = value;
                    }
                });
            }
            
            for (const key of Object.getOwnPropertyNames(newTarget.prototype)) {
                instance[key] = newTarget.prototype[key];
            }

            Object.defineProperty(instance, "#element", {
                get() {
                    return element;
                }
            });

            instances.push(element);

            return element;
        }
    });
}