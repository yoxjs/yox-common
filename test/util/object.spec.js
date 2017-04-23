
import * as object from '../../util/object'

describe('util/object', () => {

  it('sort', () => {
    let target = {
      a: 1,
      aaa: 3,
      aa: 2,
      aaaa: 4,
    }
    let result1 = object.sort(target)
    expect(result1.length).toBe(4)
    expect(result1[0]).toBe('a')
    expect(result1[1]).toBe('aa')
    expect(result1[2]).toBe('aaa')
    expect(result1[3]).toBe('aaaa')

    let result2 = object.sort(target, true)
    expect(result2[0]).toBe('aaaa')
    expect(result2[1]).toBe('aaa')
    expect(result2[2]).toBe('aa')
    expect(result2[3]).toBe('a')

  })

  it('each callback params', () => {
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

  it('each interrupt', () => {
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
    expect(index).not.toBe(3)
  })

  it('has', () => {
    let test1 = {}
    let test2 = { a: 1 }
    expect(object.has(test1, 'a')).toBe(false)
    expect(object.has(test1, 'toString')).toBe(false)
    expect(object.has(test2, 'a')).toBe(true)
    expect(object.has(test2, 'toString')).toBe(false)
  })

  it('extend', () => {
    let test1 = { a: 1 }
    let test2 = { b: 2 }
    let result = object.extend(test1, test2)

    expect(result).toBe(test1)
    expect(object.keys(result).length).toBe(2)
    expect(object.keys(test2).length).toBe(1)
  })

  it('copy', () => {
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

    obj = { user: { name: 'a' }}
    expect(object.copy(obj, true).user).not.toBe(obj.user)
  })

  it('get', () => {
    let test = {
      user: {
        name: 'musicode',
        age: 1,
        extra: {
          married: false
        }
      }
    }
    expect(object.get(test, 'toString').value).toBe(Object.prototype.toString)
    expect(object.get(test, 'user').value).toBe(test.user)
    expect(object.get(test, 'user.name').value).toBe(test.user.name)
    expect(object.get(test, 'user.haha')).toBe(undefined)
    expect(object.get(test, 'other.name')).toBe(undefined)
    expect(object.get(test, 'user.extra.married').value).toBe(test.user.extra.married)

    test = [ 1 ]
    expect(object.get(test, 0).value).toBe(1)
  })
  //
  // it('set', () => {
  //   let test = {
  //     user: {
  //       name: 'musicode',
  //       age: 1,
  //       extra: {
  //         married: false
  //       }
  //     }
  //   }
  //   object.set(test, 'user.name', 'haha')
  //   expect(object.get(test, 'user.name').value).toBe('haha')
  //
  //   object.set(test, 'a.b', 'haha', false)
  //   expect(object.get(test, 'a.b')).toBe(undefined)
  //
  //   object.set(test, 'a.b', 'haha', true)
  //   expect(object.get(test, 'a.b').value).toBe('haha')
  //
  // })
})
