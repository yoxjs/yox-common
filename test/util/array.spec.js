
import * as is from '../../util/is'
import * as array from '../../util/array'

describe('util/array', () => {

  it('each callback params', () => {
    let test = [1, 2, 3]
    let index = 0;
    let firstIsItem = false
    let secondIsIndex = false
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
  })

  it('each callback reversed', () => {
    let test = [1, 2, 3]
    let index = test.length - 1
    array.each(
      test,
      (item, i) => {
        expect(i === index--)
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

  it('toArray not array like', () => {
    let result = array.toArray(1)
    expect(is.array(result)).toBe(true)
    expect(result.length).toBe(0)
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
  it('merge', () => {
    let array1 = [1, 2, 3]
    let array2 = [4, 5, 6]
    let newArray = array.merge(array1, array2)

    expect(newArray).not.toBe(array1)
    expect(newArray).not.toBe(array2)
    expect(array1.length).toBe(3)
    expect(array2.length).toBe(3)
    expect(newArray.length).toBe(6)

    array.each(
      newArray,
      function (value, index) {
        expect(value).toBe(index + 1)
      }
    )

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
    expect(array.remove(test, unexisted)).toBe(false)
    expect(test.length).toBe(3)

    expect(array.has(test, removed1)).toBe(true)
    expect(array.remove(test, removed1)).toBe(true)
    expect(array.has(test, removed1)).toBe(false)
    expect(test.length).toBe(2)

    expect(array.has(test, removed2, false)).toBe(true)
    expect(array.remove(test, removed2, false)).toBe(true)
    expect(array.has(test, removed2, false)).toBe(false)
    expect(test.length).toBe(1)

  })
  it('falsy', () => {
    expect(array.falsy([1])).toBe(false)
    expect(array.falsy([])).toBe(true)
    expect(array.falsy(null)).toBe(true)
    expect(array.falsy()).toBe(true)
    expect(array.falsy('')).toBe(true)
    expect(array.falsy(1)).toBe(true)
    expect(array.falsy({ })).toBe(true)
    expect(array.falsy({ length: 4 })).toBe(true)
  })
})
