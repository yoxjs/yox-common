
import Emitter from '../../src/util/Emitter'
import Event from '../../src/util/Event';

test('on', () => {

  let emitter = new Emitter()
  let i = 0

  let listener = function () {
    i++
    expect(this).toBe(listener)
  }

  emitter.on('click', listener, { ctx: listener })
  expect(i).toBe(0)

  expect(emitter.has('click')).toBe(true)
  expect(emitter.has('click', listener)).toBe(true)

  emitter.fire('click', null)
  expect(i).toBe(1)

  emitter.fire('click', null)
  expect(i).toBe(2)

})

test('once', () => {

  let emitter = new Emitter()
  let i = 0

  emitter.on(
    'click',
    function () {
      i++
    },
    {
      max: 1
    }
  )
  expect(i).toBe(0)

  emitter.fire('click')
  expect(i).toBe(1)

  emitter.fire('click')
  expect(i).toBe(1)

  expect(emitter.has('click')).toBe(false)

})

test('off', () => {

  let emitter = new Emitter()
  let i = 0

  emitter.on('click', function () {
    i++
  })
  expect(i).toBe(0)

  emitter.fire('click')
  expect(i).toBe(1)

  emitter.off('click')

  emitter.fire('click')
  expect(i).toBe(1)

})

test('namespace', () => {

  let emitter = new Emitter(true)

  let aValue = 0, aListener = function () {
    aValue++
  }

  let bValue = 0, bListener = function () {
    bValue++
  }

  let cValue = 0, cListener = function () {
    cValue++
  }

  emitter.on('a', aListener)
  emitter.on('a.b', bListener)
  emitter.on('a.b.c', cListener)

  // 全局 a 事件
  emitter.fire(new Event('a'))
  expect(aValue).toBe(1)
  expect(bValue).toBe(1)
  expect(cValue).toBe(1)

  // b 命名空间下的 a 事件
  emitter.fire('a.b')
  expect(aValue).toBe(1)
  expect(bValue).toBe(2)
  expect(cValue).toBe(1)

  // b.c 命名空间下的 a 事件
  emitter.fire('a.b.c')
  expect(aValue).toBe(1)
  expect(bValue).toBe(2)
  expect(cValue).toBe(2)

  expect(emitter.has('a.b')).toBe(true)
  expect(emitter.has('a.b', cListener)).toBe(false)
  expect(emitter.has('a.b', bListener)).toBe(true)

  emitter.off('a.b', cListener)
  expect(emitter.has('a.b')).toBe(true)
  expect(emitter.has('a.b', cListener)).toBe(false)
  expect(emitter.has('a.b', bListener)).toBe(true)

  emitter.off('a.b', bListener)
  expect(emitter.has('a.b')).toBe(false)
  expect(emitter.has('a.b', cListener)).toBe(false)
  expect(emitter.has('a.b', bListener)).toBe(false)

  emitter.off()
  expect(emitter.has('a')).toBe(false)
  expect(emitter.has('a.b')).toBe(false)
  expect(emitter.has('a.b.c')).toBe(false)

})
