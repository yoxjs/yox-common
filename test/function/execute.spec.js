
import execute from '../../function/execute'

describe('function/execute', () => {
  it('execute not a function', () => {

    execute(null)
    execute(undefined)
    execute(0)
    execute('')
    execute(true)
    execute(false)
    execute({})
    execute([ ])

  })
  it('execute context', () => {

    let context = { }

    execute(
      function () {
        expect(this).toBe(context)
      },
      context
    )

  })
  it('execute arguments', () => {

    let context = { }

    execute(
      function (a, b, c) {
        expect(this).toBe(context)
        expect(arguments.length).toBe(3)
        expect(a).toBe(1)
        expect(b).toBe(2)
        expect(c).toBe(3)
      },
      context,
      [ 1, 2, 3 ]
    )

    execute(
      function (a) {
        expect(this).toBe(context)
        expect(arguments.length).toBe(1)
        expect(a).toBe(1)
      },
      context,
      1
    )

  })
  it('execute return value', () => {

    expect(
      execute(
        function () {
          return 1
        }
      )
    )
    .toBe(1)

  })
})
