
let toJSON = require('../../dist/function/toJSON').default

it('toJSON', () => {
  let obj = { a: 1 }
  expect(toJSON(obj)).toBe(JSON.stringify(obj))
})