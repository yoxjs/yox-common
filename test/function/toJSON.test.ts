
import toJSON from '../../function/toJSON'

it('toJSON', () => {
  let obj = { a: 1 }
  expect(toJSON(obj)).toBe(JSON.stringify(obj))
})