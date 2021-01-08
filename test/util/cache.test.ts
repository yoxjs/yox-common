
import * as cache from 'yox-common/src/util/cache'

test('cache one key', () => {

  let fn = cache.createOneKeyCache(
    function (str) {
      return str.split('.')
    }
  )

  const list1 = fn('a.b.c')
  const list2 = fn('a.b.c')

  expect(list1).toBe(list2)
  expect(list1.length).toBe(3)
  expect(list1[0]).toBe('a')
  expect(list1[1]).toBe('b')
  expect(list1[2]).toBe('c')

  const list3 = fn('toString')
  expect(Array.isArray(list3)).toBe(true)
  expect(list3.length).toBe(1)
  expect(list3[0]).toBe('toString')

})

test('cache two key', () => {

  let fn = cache.createTwoKeyCache(
    function (key1, key2) {
      return [key1, key2]
    }
  )

  const list1 = fn('a', 'b')
  const list2 = fn('a', 'b')

  expect(list1).toBe(list2)
  expect(list1.length).toBe(2)
  expect(list1[0]).toBe('a')
  expect(list1[1]).toBe('b')

})