
import * as is from '../../util/is'
import * as keypath from '../../util/keypath'

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
    keypath.join('a.0.c', 1)
  )
  .toBe('a.0.c.1')

  expect(
    keypath.join(0, 'a.b')
  )
  .toBe('0.a.b')

  expect(
    keypath.join(1, 2)
  )
  .toBe('1.2')

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
