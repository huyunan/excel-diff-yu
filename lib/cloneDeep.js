function each(obj, cb) {
    if (obj) {
        if (Array.isArray(obj)) {
            obj.forEach(cb);
        } else {
            Object.keys(obj).forEach(key => {
                cb(obj[key], key);
            });
        }
    }
}

function cloneDeep(obj, preserveUndefined) {
    if (preserveUndefined === undefined) {
        preserveUndefined = true;
    }
    let clone;
    if (obj === null) {
        return null;
    }
    if (obj instanceof Date) {
        return obj;
    }
    if (obj instanceof Array) {
        clone = [];
    } else if (typeof obj === 'object') {
        clone = {};
    } else {
        return obj;
    }
    each(obj, (value, name) => {
        if (value !== undefined) {
            clone[name] = cloneDeep(value, preserveUndefined);
        } else if (preserveUndefined) {
            clone[name] = undefined;
        }
    });
    return clone;
}

module.exports = cloneDeep;