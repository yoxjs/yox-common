
import execute from '../../src/function/execute'

test('not a function', () => {

  let error: any

  try {
    execute(null)
    execute(undefined)
    execute(0)
    execute('')
    execute(true)
    execute(false)
    execute({})
    execute([])
  }
  catch (e) {
    error = e
  }

  expect(error).toBe(undefined)

})

test('context', () => {

  let context = { }

  let executed = false

  execute(
    function () {
      executed = true
      expect(this).toBe(context)
    },
    context
  )

  execute(
    function () {
      expect(this).toBe(undefined)
    }
  )

  expect(executed).toBe(true)

})

test('arguments', () => {

  let context = { }

  let args = [ 1, 2, 3 ]

  execute(
    function (a: any, b: any, c: any) {
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
    function (a: any) {
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

test('return value', () => {

  let value = 1

  expect(
    execute(
      function () {
        return value
      }
    )
  )
  .toBe(value)

  expect(
    execute(
      function () {

      }
    )
  )
  .toBe(undefined)

})
