
import guid from 'yox-common/src/function/guid'

test('guid', () => {

  expect(typeof guid()).toBe('number')

  // 不关心初始值，每次不一样就行了
  const existed = {}

  for (let i = 0; i < 10000; i++) {
    let id = guid()
    expect(existed[id]).toBe(undefined)
    existed[id] = true
  }

})
