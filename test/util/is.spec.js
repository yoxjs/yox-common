
import * as is from '../../util/is'

describe('util/is', () => {
  it('function', () => {

    expect(
      is.func(
        function () {}
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
      is.func()
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
      is.array({ length: 0 })
    )
    .toBe(false)

    expect(
      is.array(null)
    )
    .toBe(false)

    expect(
      is.array()
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
      is.object(new Date())
    )
    .not.toBe(true)

    expect(
      is.object(new RegExp())
    )
    .not.toBe(true)

    expect(
      is.object([ ])
    )
    .not.toBe(true)

    expect(
      is.object(new String(''))
    )
    .not.toBe(true)

    expect(
      is.object(new Number(1))
    )
    .not.toBe(true)

    expect(
      is.object(new Boolean(true))
    )
    .not.toBe(true)

    expect(
      is.object(null)
    )
    .not.toBe(true)

    expect(
      is.object()
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
    .toBe(true)

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
    .toBe(true)

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
    .toBe(true)

    expect(
      is.boolean(new Boolean(false))
    )
    .toBe(true)

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
      is.boolean()
    )
    .toBe(false)

  })

  it('primitive', () => {

    expect(
      is.primitive(null)
    )
    .toBe(true)

    expect(
      is.primitive()
    )
    .toBe(true)

    expect(
      is.primitive('')
    )
    .toBe(true)

    expect(
      is.primitive(1)
    )
    .toBe(true)

    expect(
      is.primitive(true)
    )
    .toBe(true)

    expect(
      is.primitive(false)
    )
    .toBe(true)

    expect(
      is.primitive({ })
    )
    .toBe(false)

    expect(
      is.primitive([ ])
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
})
