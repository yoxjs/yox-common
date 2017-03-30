
import toString from '../../function/toString'

describe('function/toString', () => {
  it('defaultValue is empty string', () => {
    expect(
      toString(null)
    )
    .toBe('')
    expect(
      toString()
    )
    .toBe('')
  })
  it('custom defaultValue', () => {
    expect(
      toString(null, 1)
    )
    .toBe(1)
  })
  it('string', () => {
    expect(
      toString('1')
    )
    .toBe('1')
  })
  it('number', () => {
    expect(
      toString(1.1)
    )
    .toBe('1.1')
  })
  it('boolean to defaultValue', () => {
    expect(
      toString(true)
    )
    .toBe('true')
    expect(
      toString(false)
    )
    .toBe('false')
  })
  it('object to defaultValue', () => {
    expect(
      toString({})
    )
    .toBe('[object Object]')
  })
  it('array to defaultValue', () => {
    expect(
      toString({})
    )
    .toBe('[object Object]')
  })
})
