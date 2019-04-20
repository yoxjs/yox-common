
import debounce from '../../src/function/debounce'

test('set sync to true', done => {
  let i = 0

  let fn = debounce(
    function () {
      i++
    },
    100,
    true
  )

  fn()
  expect(i).toBe(1)
  fn()
  expect(i).toBe(1)
  fn()
  expect(i).toBe(1)

  setTimeout(
    function () {
      expect(i).toBe(1)
      fn()
      expect(i).toBe(2)
      done()
    },
    200
  )
})

it('set sync to false', done => {

  let i = 0

  let fn = debounce(
    function () {
      i++
    },
    100
  )

  fn()
  expect(i).toBe(0)
  fn()
  expect(i).toBe(0)
  fn()
  expect(i).toBe(0)

  setTimeout(
    function () {
      expect(i).toBe(1)
      fn()
      expect(i).toBe(1)
      done()
    },
    200
  )

})