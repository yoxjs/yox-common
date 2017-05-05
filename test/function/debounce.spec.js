
import debounce from '../../function/debounce'

describe('function/debounce', () => {
  it('debounce sync', done => {

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
        done()
      },
      100
    )

  })
  it('debounce not sync', done => {

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
        done()
      },
      100
    )

  })
})
