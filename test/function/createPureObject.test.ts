
import createPureObject from 'yox-common/src/function/createPureObject'

test('createPureObject', () => {

  let obj: any = createPureObject()

  obj.set('b', 1)

  expect(obj.get('a')).toBe(undefined)
  expect(obj.get('b')).toBe(1)
  expect(obj.get('toString')).toBe(undefined)

})
