
import * as keypath from 'yox-common/src/util/keypath'

test('join', () => {

  expect(
    keypath.join('a.b.c', 'd')
  )
  .toBe('a.b.c.d')

  expect(
    keypath.join('a.b.c', '')
  )
  .toBe('a.b.c')

  expect(
    keypath.join('', 'a.b.c')
  )
  .toBe('a.b.c')

  expect(
    keypath.join('a.0.c', '1')
  )
  .toBe('a.0.c.1')

  expect(
    keypath.join('0', 'a.b')
  )
  .toBe('0.a.b')

  expect(
    keypath.join('1', '2')
  )
  .toBe('1.2')

  expect(
    keypath.join('1', '')
  )
  .toBe('1')

})

test('match', () => {

  expect(
    keypath.match('a', 'a')
  )
  .toBe(1)

  expect(
    keypath.match('a.b', 'a')
  )
  .toBe(2)

  expect(
    keypath.match('a.b', 'a.')
  )
  .toBe(-1)

  expect(
    keypath.match('a.b', 'b')
  )
  .toBe(-1)

})

test('each', () => {

  let keys = ['a', 'b', 'c']
  let index = -1

  keypath.each(
    keys.join('.'),
    function (key, isLast) {
      index++
      expect(key).toBe(keys[index])
      if (key === keys[keys.length - 1]) {
        expect(isLast).toBe(true)
      }
    }
  )

})

test('isFuzzy', () => {

  expect(
    keypath.isFuzzy('a.b')
  )
  .toBe(false)

  expect(
    keypath.isFuzzy('a.*')
  )
  .toBe(true)

})

test('matchFuzzy', () => {

  expect(
    keypath.matchFuzzy('a.b', 'a.*')
  )
  .toBe('b')

  expect(
    keypath.matchFuzzy('a.b', 'b.*')
  )
  .toBe(undefined)

})