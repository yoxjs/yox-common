
import debounce from '../../function/debounce'

describe('function/debounce', () => {
  it('debounce immediate', () => {

    let i = 0

    let fn = debounce(
      function () {
        i++
      },
      500,
      true
    )

    fn()
    expect(i).toBe(1)
    fn()
    expect(i).toBe(1)
    fn()
    expect(i).toBe(1)

  })
  it('debounce not immediate', done => {

    let i = 0

    let fn = debounce(
      function () {
        i++
        expect(i).toBe(1)
        done()
      },
      500
    )

    fn()
    expect(i).toBe(0)
    fn()
    expect(i).toBe(0)
    fn()
    expect(i).toBe(0)

  })
})
