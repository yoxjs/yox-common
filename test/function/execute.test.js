
let execute = require('../../dist/function/execute').default

test('execute not a function', () => {

  execute(null)
  execute(undefined)
  execute(0)
  execute('')
  execute(true)
  execute(false)
  execute({})
  execute([ ])

})

test('execute context', () => {

  let context = { }

  execute(
    function () {
      expect(this).toBe(context)
    },
    context
  )

})
test('execute arguments', () => {

  let context = { }

  let args = [ 1, 2, 3 ]

  execute(
    function (a, b, c) {
      expect(this).toBe(context)
      expect(arguments.length).toBe(args.length)
      expect(a).toBe(args[0])
      expect(b).toBe(args[1])
      expect(c).toBe(args[2])
    },
    context,
    args
  )

  let arg = 1
  execute(
    function (a) {
      expect(this).toBe(context)
      expect(arguments.length).toBe(1)
      expect(a).toBe(arg)
    },
    context,
    arg
  )

  execute(
    function () {
      expect(arguments.length).toBe(0)
    }
  )

})

test('execute return value', () => {

  let value = 1

  expect(
    execute(
      function () {
        return value
      }
    )
  )
  .toBe(value)

})
