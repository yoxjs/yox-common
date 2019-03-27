import * as is from '../util/is';
export default function (target, defaultValue = 0) {
    return is.numeric(target)
        ? +target
        : defaultValue;
}
//# sourceMappingURL=toNumber.js.map