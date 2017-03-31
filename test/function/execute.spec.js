
import execute from '../../function/execute'

describe('function/execute', () => {
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
})
