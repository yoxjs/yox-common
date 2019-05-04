
let nextTick = require('../../dist/function/nextTick').default

it('nextTick', done => {
  let i = 0
  nextTick(() => {
    expect(i).toBe(1)
    i++
    expect(i).toBe(2)
    done()
  })
  expect(i).toBe(0)
  i++
})