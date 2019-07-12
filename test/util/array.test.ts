
import * as is from '../../src/util/is'
import * as array from '../../src/util/array'

test('each callback params', () => {
  let test = [1, 2, 3]
  let index = 0
  array.each(test, (item, i) => {
    expect(i).toBe(index++)
    expect(item).toBe(test[i])
  })
})

test('each callback reversed', () => {
  let test = [1, 2, 3]
  let index = test.length - 1
  array.each(
    test,
    (item, i) => {
      expect(i).toBe(index--)
      expect(item).toBe(test[i])
    },
    true
  )
})

test('each interrupt', () => {
  let test = [1, 2, 3, 4]
  let index = -1, stopIndex = 1
  array.each(test, (item, i) => {
    index = i
    if (i === stopIndex) {
      return false
    }
  })
  expect(index).toBe(stopIndex)
})

test('toArray array like', () => {
  let faker = {
    length: 2,
    '0': 0,
    '1': 1,
  }
  let result = array.toArray(faker)
  expect(is.array(result)).toBe(true)
  expect(result).not.toBe(faker)
  expect(faker['0']).toBe(result[0])
  expect(faker['1']).toBe(result[1])
})

test('toArray array', () => {
  let faker: string[] = []
  let result = array.toArray(faker)
  expect(result).toBe(faker)
})

test('toObject', () => {
  var list = [
    {
      id: '1',
      name: 'yox1'
    },
    {
      id: '2',
      name: 'yox2'
    }
  ]
  var result = array.toObject(list, 'id');
  expect(result['1']).toBe(list[0])
  expect(result['2']).toBe(list[1])

  result = array.toObject(list, 'id', true);
  expect(result['1']).toBe(true)
  expect(result['2']).toBe(true)

})

test('push', () => {
  let array1 = [1, 2, 3]
  let array2 = [4, 5, 6]

  expect(array.push(array1, array2)).toBe(undefined)
  expect(array1.length).toBe(6)
  expect(array2.length).toBe(3)

  array.each(
    array1,
    function (value, index) {
      expect(value).toBe(index + 1)
    }
  )

})

test('unshift', () => {
  let array1 = [4, 5, 6]
  let array2 = [3, 2, 1]

  expect(array.unshift(array1, array2)).toBe(undefined)
  expect(array1.length).toBe(6)
  expect(array2.length).toBe(3)

  array.each(
    array1,
    function (value, index) {
      expect(value).toBe(index + 1)
    }
  )

})

test('indexOf', () => {
  expect(array.indexOf([1, 2, 3], 2)).toBe(1)
  expect(array.indexOf([1, 2, 3], 0)).toBe(-1)
  expect(array.indexOf([1, 2, 3], '2' as any, false)).toBe(1)
  expect(array.indexOf([1, 2, 3], '0' as any)).toBe(-1)
})

test('has', () => {
  expect(array.has([1], 1)).toBe(true)
  expect(array.has([1], 0)).toBe(false)
  expect(array.has([1], '1' as any, false)).toBe(true)
})

test('last', () => {
  expect(array.last([1])).toBe(1)
  expect(array.last([])).toBe(undefined)
})

test('remove', () => {
  let test = [1, 2, 3]
  let removed1 = 2
  let removed2 = '3' as any
  let unexisted = 4

  expect(array.has(test, unexisted)).toBe(false)
  expect(array.remove(test, unexisted)).toBe(0)
  expect(test.length).toBe(3)

  expect(array.has(test, removed1)).toBe(true)
  expect(array.remove(test, removed1)).toBe(1)
  expect(array.has(test, removed1)).toBe(false)
  expect(test.length).toBe(2)

  expect(array.has(test, removed2, false)).toBe(true)
  expect(array.remove(test, removed2, false)).toBe(1)
  expect(array.has(test, removed2, false)).toBe(false)
  expect(test.length).toBe(1)

  test = [1, 2, 3, 2, 2, 2]
  expect(array.remove(test, 2)).toBe(4)
  expect(test.length).toBe(2)

})

test('falsy', () => {
  expect(array.falsy([1])).toBe(false)
  expect(array.falsy([])).toBe(true)
  expect(array.falsy(null)).toBe(true)
  expect(array.falsy(undefined)).toBe(true)
  expect(array.falsy('')).toBe(true)
  expect(array.falsy(1)).toBe(true)
  expect(array.falsy({ })).toBe(true)
  expect(array.falsy({ length: 4 })).toBe(true)
})
