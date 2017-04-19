
import * as string from '../../util/string'

describe('util/string', () => {

  it('camelCase', () => {
    expect(string.camelCase('a-b')).toBe('aB')
    expect(string.camelCase('a_b')).toBe('a_b')
    expect(string.camelCase('ab')).toBe('ab')
  })

  it('falsy', () => {
    expect(string.falsy('ab')).toBe(false)
    expect(string.falsy('')).toBe(true)
    expect(string.falsy()).toBe(true)
    expect(string.falsy(true)).toBe(true)
    expect(string.falsy(false)).toBe(true)
    expect(string.falsy(undefined)).toBe(true)
  })

  it('trim', () => {
    expect(string.trim(' ab')).toBe('ab')
    expect(string.trim(' ab ')).toBe('ab')
    expect(string.trim('ab')).toBe('ab')
  })

  it('slice', () => {
    let str = '123456'
    expect(string.slice('123456', 2)).toBe(str.slice(2))
    expect(string.slice('123456', 2, 4)).toBe(str.slice(2, 4))
    expect(string.slice('123456', 2, -1)).toBe(str.slice(2, -1))
  })

  it('split', () => {
    let arr = string.split('123;456', ';')
    expect(arr.length).toBe(2)
    expect(arr[0]).toBe('123')
    expect(arr[1]).toBe('456')

    arr = string.split('123 ; 456', ';')
    expect(arr.length).toBe(2)
    expect(arr[0]).toBe('123')
    expect(arr[1]).toBe('456')
  })

  it('startsWith', () => {
    expect(string.startsWith('123', '12')).toBe(true)
    expect(string.startsWith('123', '1234')).toBe(false)
  })

  it('endsWith', () => {
    expect(string.endsWith('123', '23')).toBe(true)
    expect(string.endsWith('123', '0123')).toBe(false)
  })

})
