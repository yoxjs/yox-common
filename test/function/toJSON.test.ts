
import toJSON from '../../src/function/toJSON'

it('toJSON', () => {
  let obj = { a: 1 }
  expect(toJSON(obj)).toBe(JSON.stringify(obj))
})