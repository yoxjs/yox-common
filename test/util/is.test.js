
let is = require('../../dist/util/is')

it('function', () => {

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

it('array', () => {

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

it('object', () => {

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

it('string', () => {

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

  expect(
    is.string(new String(''))
  )
  .toBe(false)

  expect(
    is.string('')
  )
  .toBe(true)

})

it('number', () => {

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

  expect(
    is.number(new Number(1))
  )
  .toBe(false)

  expect(
    is.number(1)
  )
  .toBe(true)

})

it('boolean', () => {

  expect(
    is.boolean(true)
  )
  .toBe(true)

  expect(
    is.boolean(false)
  )
  .toBe(true)

  expect(
    is.boolean(new Boolean(true))
  )
  .toBe(false)

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

it('numeric', () => {

  expect(
    is.numeric(null)
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
    is.numeric(1)
  )
  .toBe(true)

  expect(
    is.numeric('1.1')
  )
  .toBe(true)

})
