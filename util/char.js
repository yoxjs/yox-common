
import * as env from './env'

/**
 * 为了压缩，定义的常用字符
 *
 * @type {string}
 */

let source = {
  DOT: '.',
  DASH: '-',
  EQUAL: '=',
  SLASH: '/',
  COMMA: ',',
  COLON: ':',
  SEMCOL: ';',
  SQUOTE: "'",
  DQUOTE: '"',
  OPAREN: '(',
  CPAREN: ')',
  OBRACK: '[',
  CBRACK: ']',
  LEFT: '<',
  RIGHT: '>',
  OBRACE: '{',
  CBRACE: '}',
  QUMARK: '?',
  BACKSLASH: '\\',
  TAB: '\t',
  BREAKLINE: '\n',
  WHITESPACE: ' ',
}

let dist = {
  CHAR_BLANK: '',
}

// 不能依赖外面的模块，否则会产生循环依赖
for (let key in source) {
  dist[`CHAR_${key}`] = source[key]
  dist[`CODE_${key}`] = source[key].charCodeAt(0)
}

source = env.NULL

export default dist
