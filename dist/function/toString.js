import * as env from '../util/env';
import * as char from '../util/char';
export default function (target, defaultValue = char.CHAR_BLANK) {
    return target != env.NULL && target.toString
        ? target.toString()
        : defaultValue;
}
//# sourceMappingURL=toString.js.map