
let string = require('../../dist/util/string')

it('camelize', () => {
  expect(string.camelize('a-b')).toBe('aB')
  expect(string.camelize('a-B')).toBe('aB')
  expect(string.camelize('a_b')).toBe('a_b')
  expect(string.camelize('ab')).toBe('ab')
  expect(string.camelize('1-a')).toBe('1A')
})

it('hyphenate', () => {
  expect(string.hyphenate('aB')).toBe('a-b')
  expect(string.hyphenate('a_b')).toBe('a_b')
  expect(string.hyphenate('ab')).toBe('ab')
  expect(string.hyphenate('1A')).toBe('1-a')
})

it('capitalize', () => {
  expect(string.capitalize('aB')).toBe('AB')
  expect(string.capitalize('a_b')).toBe('A_b')
  expect(string.capitalize('ab')).toBe('Ab')
  expect(string.capitalize('1A')).toBe('1A')
  expect(string.capitalize('a')).toBe('A')
  expect(string.capitalize('')).toBe('')
})

it('falsy', () => {
  expect(string.falsy('ab')).toBe(false)
  expect(string.falsy('')).toBe(true)
  expect(string.falsy(null)).toBe(true)
  expect(string.falsy(true)).toBe(true)
  expect(string.falsy(false)).toBe(true)
  expect(string.falsy(undefined)).toBe(true)
})

it('trim', () => {
  expect(string.trim(' ab')).toBe('ab')
  expect(string.trim(' ab ')).toBe('ab')
  expect(string.trim('ab')).toBe('ab')
  expect(string.trim(null)).toBe('')
  expect(string.trim(undefined)).toBe('')
  expect(string.trim({})).toBe('')
  expect(string.trim([])).toBe('')
  expect(string.trim(1)).toBe('')
  expect(string.trim(true)).toBe('')
  expect(string.trim(false)).toBe('')
})

it('slice', () => {
  let str = '123456'
  expect(string.slice(str, 2)).toBe(str.slice(2))
  expect(string.slice(str, 2, 4)).toBe(str.slice(2, 4))
  expect(string.slice(str, 2, -1)).toBe(str.slice(2, -1))
})

it('indexOf', () => {
  let str = '12<34567>89'
  expect(string.indexOf(str, '<')).toBe(str.indexOf('<'))
  expect(string.indexOf(str, '>')).toBe(str.indexOf('>'))
  expect(string.indexOf(str, '?')).toBe(str.indexOf('?'))
})

it('lastIndexOf', () => {
  let str = '12<34567>89'
  expect(string.lastIndexOf(str, '<')).toBe(str.lastIndexOf('<'))
  expect(string.lastIndexOf(str, '>')).toBe(str.lastIndexOf('>'))
  expect(string.lastIndexOf(str, '?')).toBe(str.lastIndexOf('?'))
})

it('has', () => {
  let str = '12<34567>89'
  expect(string.has(str, '<')).toBe(true)
  expect(string.has(str, '>')).toBe(true)
  expect(string.has(str, '?')).toBe(false)
})

it('startsWith', () => {
  expect(string.startsWith('123', '12')).toBe(true)
  expect(string.startsWith('123', '1234')).toBe(false)
})

it('endsWith', () => {
  expect(string.endsWith('123', '23')).toBe(true)
  expect(string.endsWith('123', '0123')).toBe(false)
})

