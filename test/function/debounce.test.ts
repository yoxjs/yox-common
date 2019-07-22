
import debounce from 'yox-common/src/function/debounce'

test('immediate', done => {
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
      fn()
      expect(i).toBe(2)
      done()
    },
    200
  )
})

test('not immediate', done => {

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
      fn()
      expect(i).toBe(1)
      done()
    },
    200
  )

})

test('async', done => {

  let i = 0

  // 即使 delay 传 0 也是异步
  let fn = debounce(
    function () {
      i++
    },
    0
  )

  fn()
  expect(i).toBe(0)

  setTimeout(
    function () {
      expect(i).toBe(1)
      fn()
      done()
    },
    200
  )

})