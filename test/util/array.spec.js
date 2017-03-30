
import * as is from '../../util/is'
import * as array from '../../util/array'

describe('util/array', () => {

  it('each callback params', () => {
    let test = [1]
    let firstIsItem = false
    let secondIsIndex = false
    array.each(test, (item, index) => {
      if (item === test[0]) {
        firstIsItem = true
      }
      if (index === 0) {
        secondIsIndex = true
      }
    })
    expect(firstIsItem).toBe(true)
    expect(secondIsIndex).toBe(true)
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
  it('has', () => {
    expect(array.has([1], 1)).toBe(true)
    expect(array.has([1], 0)).toBe(false)
  })
  it('last', () => {
    expect(array.last([1])).toBe(1)
    expect(array.last([])).toBe(undefined)
  })
  it('remove', () => {
    let test = [1, 2, 3]
    let removed = 2

    expect(array.has(test, removed)).toBe(true)
    array.remove(test, removed)
    expect(array.has(test, removed)).toBe(false)
    expect(test.length).toBe(2)

  })
  it('falsy', () => {
    expect(array.falsy([])).toBe(true)
    expect(array.falsy([1])).toBe(false)
    expect(array.falsy(null)).toBe(true)
    expect(array.falsy()).toBe(true)
    expect(array.falsy('')).toBe(true)
    expect(array.falsy(1)).toBe(true)
    expect(array.falsy({ })).toBe(true)
    expect(array.falsy({ length: 4 })).toBe(true)
  })
})
