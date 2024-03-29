
import * as is from 'yox-common/src/util/is'

test('function', () => {

  expect(
    is.func(
      function () {}
    )
  )
  .toBe(true)

  expect(
    is.func(
      new Function()
    )
  )
  .toBe(true)

  expect(
    is.func(
      parseInt
    )
  )
  .toBe(true)

  expect(
    is.func(null)
  )
  .toBe(false)

  expect(
    is.func(undefined)
  )
  .toBe(false)

  expect(
    is.func(' ')
  )
  .toBe(false)

})

test('array', () => {

  expect(
    is.array([])
  )
  .toBe(true)

  expect(
    is.array(new Array())
  )
  .toBe(true)

  expect(
    is.array({ length: 0 })
  )
  .toBe(false)

  expect(
    is.array(null)
  )
  .toBe(false)

  expect(
    is.array(undefined)
  )
  .toBe(false)

  expect(
    is.array(' ')
  )
  .toBe(false)

})

test('object', () => {

  expect(
    is.object({})
  )
  .toBe(true)

  expect(
    is.object(new Object())
  )
  .toBe(true)

  expect(
    is.object(new Date())
  )
  .toBe(true)

  expect(
    is.object(new RegExp(''))
  )
  .toBe(true)

  expect(
    is.object([ ])
  )
  .toBe(true)

  expect(
    is.object(new String(''))
  )
  .toBe(true)

  expect(
    is.object(new Number(1))
  )
  .toBe(true)

  expect(
    is.object(new Boolean(true))
  )
  .toBe(true)

  expect(
    is.object(null)
  )
  .not.toBe(true)

  expect(
    is.object(undefined)
  )
  .not.toBe(true)

  expect(
    is.object(1)
  )
  .not.toBe(true)

  expect(
    is.object(true)
  )
  .not.toBe(true)

  expect(
    is.object('1')
  )
  .not.toBe(true)

})

test('string', () => {

  expect(
    is.string(null)
  )
  .toBe(false)

  expect(
    is.string({})
  )
  .toBe(false)

  expect(
    is.string(1)
  )
  .toBe(false)

  expect(
    is.string(true)
  )
  .toBe(false)

  // 不支持封装类型
  expect(
    is.string(new String(''))
  )
  .toBe(false)

  expect(
    is.string('')
  )
  .toBe(true)

})

test('number', () => {

  expect(
    is.number(null)
  )
  .toBe(false)

  expect(
    is.number({})
  )
  .toBe(false)

  expect(
    is.number('')
  )
  .toBe(false)

  expect(
    is.number(true)
  )
  .toBe(false)

  // 不支持封装类型
  expect(
    is.number(new Number(1))
  )
  .toBe(false)

  expect(
    is.number(1)
  )
  .toBe(true)

  expect(
    is.number(NaN)
  )
  .toBe(false)

})

test('boolean', () => {

  expect(
    is.boolean(true)
  )
  .toBe(true)

  expect(
    is.boolean(false)
  )
  .toBe(true)

  // 不支持封装类型
  expect(
    is.boolean(new Boolean(true))
  )
  .toBe(false)

  // 不支持封装类型
  expect(
    is.boolean(new Boolean(false))
  )
  .toBe(false)

  expect(
    is.boolean('')
  )
  .toBe(false)

  expect(
    is.boolean(1)
  )
  .toBe(false)

  expect(
    is.boolean(0)
  )
  .toBe(false)

  expect(
    is.boolean(null)
  )
  .toBe(false)

  expect(
    is.boolean(undefined)
  )
  .toBe(false)

})

test('numeric', () => {

  expect(
    is.numeric(null)
  )
  .toBe(false)

  expect(
    is.numeric(NaN)
  )
  .toBe(false)

  expect(
    is.numeric({})
  )
  .toBe(false)

  expect(
    is.numeric('1.1str')
  )
  .toBe(false)

  expect(
    is.numeric('1.')
  )
  .toBe(true)

  expect(
    is.numeric('.1')
  )
  .toBe(true)

  expect(
    is.numeric(1)
  )
  .toBe(true)

  expect(
    is.numeric('1.1')
  )
  .toBe(true)

})
