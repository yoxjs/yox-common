
import * as object from 'yox-common/src/util/object'

test('falsy', () => {

  expect(object.falsy([])).toBe(true)
  expect(object.falsy([1,2])).toBe(true)
  expect(object.falsy(new Date())).toBe(true)
  expect(object.falsy(undefined)).toBe(true)
  expect(object.falsy(null)).toBe(true)
  expect(object.falsy(NaN)).toBe(true)
  expect(object.falsy(1)).toBe(true)
  expect(object.falsy(0)).toBe(true)
  expect(object.falsy(true)).toBe(true)
  expect(object.falsy(false)).toBe(true)

  expect(object.falsy({})).toBe(true)
  expect(object.falsy({ name: 1 })).toBe(false)

})

test('each callback params', () => {
  let key = 'a'
  let value = 1
  let test = {
    [key]: value
  }
  let firstIsValue = false
  let secondIsKey = false
  object.each(test, (v, k) => {
    if (value === v) {
      firstIsValue = true
    }
    if (key === k) {
      secondIsKey = true
    }
  })
  expect(firstIsValue).toBe(true)
  expect(secondIsKey).toBe(true)
})

test('each interrupt', () => {
  let test = {
    a: 'a',
    b: 'b',
    c: 'c',
  }
  let index = 0
  object.each(test, (value, key) => {
    index++
    if (key === 'b') {
      return false
    }
  })
  expect(index).not.toBe(Object.keys(test).length)
})

test('clear', () => {
  let test = {
    a: 'a',
    b: 'b',
    c: 'c',
  }
  object.clear(test)
  expect(Object.keys(test).length).toBe(0)
})

test('extend', () => {
  let test1 = { a: 1 }
  let test2 = { b: 2 }
  let result = object.extend(test1, test2)

  expect(result).toBe(test1)
  expect(object.keys(result).length).toBe(2)
  expect(object.keys(test2).length).toBe(1)
})

test('merge', () => {

  let test1 = { a: 1 }
  let test2 = { b: 2 }
  let result = object.merge(test1, test2)

  expect(typeof result).toBe('object')
  if (result) {
    // 新对象
    expect(result).not.toBe(test1)
    expect(result).not.toBe(test2)
    expect(object.keys(result).length).toBe(2)
    expect(object.keys(test1).length).toBe(1)
    expect(object.keys(test2).length).toBe(1)
  }

  result = object.merge(test1)
  expect(result).toBe(test1)

  result = object.merge(undefined, test2)
  expect(result).toBe(test2)

  result = object.merge()
  expect(result).toBe(undefined)

})

test('copy', () => {

  let obj = { a: 1 }
  let objCopy = object.copy(obj)
  let arr = [ 'a' ]
  let arrCopy = object.copy(arr)

  expect(obj).not.toBe(objCopy)
  expect(arr).not.toBe(arrCopy)
  expect(obj.a).toBe(objCopy.a)
  expect(arr[0]).toBe(arrCopy[0])

  expect(object.copy(null)).toBe(null)
  expect(object.copy(1)).toBe(1)
  expect(object.copy('1')).toBe('1')

  let obj1 = { user: { name: 'a' }}
  expect(object.copy(obj1, true).user).not.toBe(obj1.user)

  let obj2 = {
    list: [
      { name: '1' },
      { name: '2' }
    ]
  }
  objCopy = object.copy(obj2, true)
  expect(obj2).not.toBe(objCopy)
  expect(obj2.list).not.toBe(objCopy.list)
  expect(obj2.list[0]).not.toBe(objCopy.list[0])
  expect(obj2.list[1]).not.toBe(objCopy.list[1])
})

test('get', () => {
  let test = {
    user: {
      name: 'musicode',
      age: 1,
      extra: {
        married: true
      }
    }
  }

  let result = object.get(test, 'user')
  expect(result != null).toBe(true)
  if (result) {
    expect(result.value).toBe(test.user)
  }

  result = object.get(test, 'user.name')
  expect(result != null).toBe(true)
  if (result) {
    expect(result.value).toBe(test.user.name)
  }

  result = object.get(test, 'user.haha')
  expect(result == null).toBe(true)

  result = object.get(test, 'other.haha')
  expect(result == null).toBe(true)


  result = object.get(test, 'user.extra.married')
  expect(result != null).toBe(true)
  if (result) {
    expect(result.value).toBe(test.user.extra.married)
  }

  result = object.get(test, 'toString')
  expect(result != null).toBe(true)
  if (result) {
    expect(result.value).toBe(Object.prototype.toString)
  }


  result = object.get([1], '0')
  expect(result != null).toBe(true)
  if (result) {
    expect(result.value).toBe(1)
  }

  result = object.get('123', 'length')
  expect(result != null).toBe(true)
  if (result) {
    expect(result.value).toBe(3)
  }

  result = object.get([1], 'length')
  expect(result != null).toBe(true)
  if (result) {
    expect(result.value).toBe(1)
  }

})

test('set', () => {

  let test = {
    user: {
      name: 'musicode',
      age: 1,
      extra: {
        married: false
      }
    }
  }

  object.set(test, 'user.name', 'haha')

  let result = object.get(test, 'user.name')
  expect(result != null).toBe(true)
  if (result) {
    expect(result.value).toBe('haha')
  }


  // 没有自动填充
  object.set(test, 'a.b', 'haha', false)

  result = object.get(test, 'a.b')
  expect(result == null).toBe(true)



  // 自动填充
  object.set(test, 'a.b', 'haha', true)

  result = object.get(test, 'a.b')
  expect(result != null).toBe(true)
  if (result) {
    expect(result.value).toBe('haha')
  }



  let test1 = [ { age: 1 } ]

  result = object.get(test1, '0.age')
  expect(result != null).toBe(true)
  if (result) {
    expect(result.value).toBe(1)
  }


  object.set(test1, '0.age', 2)

  result = object.get(test1, '0.age')
  expect(result != null).toBe(true)
  if (result) {
    expect(result.value).toBe(2)
  }


})

test('has', () => {
  let test1 = {}
  let test2 = { a: 1 }
  expect(object.has(test1, 'a')).toBe(false)
  expect(object.has(test1, 'toString')).toBe(true)
  expect(object.has(test2, 'a')).toBe(true)
  expect(object.has(test2, 'toString')).toBe(true)
})

test('falsy', () => {
  expect(object.falsy({})).toBe(true)
  expect(object.falsy(null)).toBe(true)
  expect(object.falsy(undefined)).toBe(true)
  expect(object.falsy(NaN)).toBe(true)
  expect(object.falsy(1)).toBe(true)
  expect(object.falsy(0)).toBe(true)
  expect(object.falsy('')).toBe(true)
  expect(object.falsy(true)).toBe(true)
  expect(object.falsy(false)).toBe(true)

  expect(object.falsy({name: 'xx'})).toBe(false)
})