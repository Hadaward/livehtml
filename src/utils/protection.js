export function protect(object) {
    return new Proxy(object, {
        deleteProperty: () => false,
        set(target, key, value) {
            if (Object.hasOwn(target, key))
                target[key] = value;

            return true;
        }
    })
}
