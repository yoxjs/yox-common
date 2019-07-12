
import * as is from '../../src/util/is'
import * as array from '../../src/util/array'

it('each callback params', () => {
  let test = [1, 2, 3]
  let index = 0;
  let firstIsItem = false
  let secondIsIndex = false
  let thirdIsLength = false
  array.each(test, (item, i) => {
    expect(i).toBe(index++)
    if (item === test[0]) {
      firstIsItem = true
    }
    if (i === 0) {
      secondIsIndex = true
    }
  })
  expect(firstIsItem).toBe(true)
  expect(secondIsIndex).toBe(true)
  expect(thirdIsLength).toBe(true)
})

it('each callback reversed', () => {
  let test = [1, 2, 3]
  let index = test.length - 1
  array.each(
    test,
    (item, i) => {
      expect(i).toBe(index--)
    },
    true
  )
})

it('each interrupt', () => {
  let test = [1, 2, 3]
  let index
  array.each(test, (item, i) => {
    index = i
    if (i == 1) {
      return false
    }
  })
  expect(typeof index).toBe('number')
  expect(index).not.toBe(test.length - 1)
})

it('toArray array like', () => {
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
it('toArray array', () => {
  let faker = []
  let result = array.toArray(faker)
  expect(result).toBe(faker)
})
it('toObject', () => {
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
it('push', () => {
  let array1 = [1, 2, 3]
  let array2 = [4, 5, 6]
  let newArray = array.push(array1, array2)

  expect(newArray).toBe(undefined)
  expect(array1.length).toBe(6)
  expect(array2.length).toBe(3)

  array.each(
    array1,
    function (value, index) {
      expect(value).toBe(index + 1)
    }
  )

})
it('unshift', () => {
  let array1 = [4, 5, 6]
  let array2 = [3, 2, 1]
  let newArray = array.unshift(array1, array2)

  expect(newArray).toBe(undefined)
  expect(array1.length).toBe(6)
  expect(array2.length).toBe(3)

  array.each(
    array1,
    function (value, index) {
      expect(value).toBe(index + 1)
    }
  )

})
it('indexOf', () => {
  expect(array.indexOf([1, 2, 3], 2)).toBe(1)
  expect(array.indexOf([1, 2, 3], 0)).toBe(-1)
  expect(array.indexOf([1, 2, 3], '2', false)).toBe(1)
  expect(array.indexOf([1, 2, 3], '0')).toBe(-1)
})
it('has', () => {
  expect(array.has([1], 1)).toBe(true)
  expect(array.has([1], 0)).toBe(false)
  expect(array.has([1], '1', false)).toBe(true)
})
it('last', () => {
  expect(array.last([1])).toBe(1)
  expect(array.last([])).toBe(undefined)
})
it('remove', () => {
  let test = [1, 2, 3]
  let removed1 = 2
  let removed2 = '3'
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
it('falsy', () => {
  expect(array.falsy([1])).toBe(false)
  expect(array.falsy([])).toBe(true)
  expect(array.falsy(null)).toBe(true)
  expect(array.falsy(undefined)).toBe(true)
  expect(array.falsy('')).toBe(true)
  expect(array.falsy(1)).toBe(true)
  expect(array.falsy({ })).toBe(true)
  expect(array.falsy({ length: 4 })).toBe(true)
})
