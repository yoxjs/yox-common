
/**
 * 为了压缩，定义的常用字符
 */

export function charAt(str, index = 0) {
  return str.charAt(index)
}

export function codeAt(str, index = 0) {
  return str.charCodeAt(index)
}

export const CHAR_BLANK = ''

export const CHAR_DOT = '.'
export const CODE_DOT = codeAt(CHAR_DOT)

export const CHAR_HASH = '#'
export const CODE_HASH = codeAt(CHAR_HASH)

export const CHAR_DASH = '-'
export const CODE_DASH = codeAt(CHAR_DASH)

export const CHAR_EQUAL = '='
export const CODE_EQUAL = codeAt(CHAR_EQUAL)

export const CHAR_SLASH = '/'
export const CODE_SLASH = codeAt(CHAR_SLASH)

export const CHAR_COMMA = ','
export const CODE_COMMA = codeAt(CHAR_COMMA)

export const CHAR_COLON = ':'
export const CODE_COLON = codeAt(CHAR_COLON)

export const CHAR_SEMCOL = ';'
export const CODE_SEMCOL = codeAt(CHAR_SEMCOL)

export const CHAR_SQUOTE = "'"
export const CODE_SQUOTE = codeAt(CHAR_SQUOTE)

export const CHAR_DQUOTE = '"'
export const CODE_DQUOTE = codeAt(CHAR_DQUOTE)

export const CHAR_OPAREN = '('
export const CODE_OPAREN = codeAt(CHAR_OPAREN)

export const CHAR_CPAREN = ')'
export const CODE_CPAREN = codeAt(CHAR_CPAREN)

export const CHAR_OBRACK = '['
export const CODE_OBRACK = codeAt(CHAR_OBRACK)

export const CHAR_CBRACK = ']'
export const CODE_CBRACK = codeAt(CHAR_CBRACK)

export const CHAR_OBRACE = '{'
export const CODE_OBRACE = codeAt(CHAR_OBRACE)

export const CHAR_CBRACE = '}'
export const CODE_CBRACE = codeAt(CHAR_CBRACE)

export const CHAR_LEFT = '<'
export const CODE_LEFT = codeAt(CHAR_LEFT)

export const CHAR_RIGHT = '>'
export const CODE_RIGHT = codeAt(CHAR_RIGHT)

export const CHAR_QUMARK = '?'
export const CODE_QUMARK = codeAt(CHAR_QUMARK)

export const CHAR_TAB = '\t'
export const CODE_TAB = codeAt(CHAR_TAB)

export const CHAR_BREAKLINE = '\n'
export const CODE_BREAKLINE = codeAt(CHAR_BREAKLINE)

export const CHAR_WHITESPACE = ' '
export const CODE_WHITESPACE = codeAt(CHAR_WHITESPACE)
