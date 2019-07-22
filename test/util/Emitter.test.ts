
import Emitter from 'yox-common/src/util/Emitter'

test('on', () => {

  let emitter = new Emitter()
  let i = 0

  let listener = function () {
    i++
  }

  expect(emitter.has('click')).toBe(false)

  emitter.on('click', { fn: listener })
  expect(i).toBe(0)

  expect(emitter.has('click')).toBe(true)
  expect(emitter.has('click', listener)).toBe(true)

  emitter.fire('click')
  expect(i).toBe(1)

  emitter.fire('click')
  expect(i).toBe(2)

})

test('on context', () => {

  let emitter = new Emitter()

  let $this: any

  let listener = function () {
    $this = this
  }

  emitter.on('click', { fn: listener, ctx: listener })

  emitter.fire('click')
  expect($this).toBe(listener)

})

test('on namespace', () => {

  let emitter = new Emitter(true)

  let a = 0, b = 0, c = 0

  let listenerA = function () {
    a++
  }

  let listenerB = function () {
    b++
  }

  let listener = function () {
    c++
  }

  expect(emitter.has('click.a')).toBe(false)
  expect(emitter.has('click.b')).toBe(false)
  expect(emitter.has('click')).toBe(false)
  expect(emitter.has('click.c')).toBe(false)

  emitter.on('click.a', { fn: listenerA })
  emitter.on('click.b', { fn: listenerB })
  emitter.on('click', { fn: listener })

  expect(emitter.has('click.a')).toBe(true)
  expect(emitter.has('click.b')).toBe(true)
  expect(emitter.has('click')).toBe(true)
  // 因为 click 可以监听到 click.c，因此为 true
  expect(emitter.has('click.c')).toBe(true)

  expect(a).toBe(0)
  expect(b).toBe(0)
  expect(c).toBe(0)

  emitter.fire('click')

  expect(a).toBe(1)
  expect(b).toBe(1)
  expect(c).toBe(1)

  emitter.fire('click.a')

  expect(a).toBe(2)
  expect(b).toBe(1)
  expect(c).toBe(2)

  emitter.fire('click.b')

  expect(a).toBe(2)
  expect(b).toBe(2)
  expect(c).toBe(3)

  emitter.fire('click.c')

  expect(a).toBe(2)
  expect(b).toBe(2)
  expect(c).toBe(4)

  emitter.fire({
    type: 'click',
    ns: 'a'
  })

  expect(a).toBe(3)
  expect(b).toBe(2)
  expect(c).toBe(5)

})

test('once', () => {

  let emitter = new Emitter()
  let i = 0

  emitter.on(
    'click',
    {
      max: 1,
      fn: function () {
        i++
      },
    }
  )

  expect(emitter.has('click')).toBe(true)
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

  let dValue = 0, dListener = function () {
    dValue++
  }

  emitter.on('a', aListener)
  emitter.on('a.b', bListener)
  emitter.on('a.b.c', cListener)
  emitter.on('a.d', dListener)

  // 全局 a 事件
  emitter.fire('a')
  expect(aValue).toBe(1)
  expect(bValue).toBe(1)
  expect(cValue).toBe(1)
  expect(dValue).toBe(1)

  // b 命名空间下的 a 事件
  emitter.fire('a.b')
  expect(aValue).toBe(2)
  expect(bValue).toBe(2)
  expect(cValue).toBe(1)
  expect(dValue).toBe(1)

  // b.c 命名空间下的 a 事件
  emitter.fire('a.b.c')
  expect(aValue).toBe(3)
  expect(bValue).toBe(2)
  expect(cValue).toBe(2)
  expect(dValue).toBe(1)

  expect(emitter.has('a.b')).toBe(true)
  expect(emitter.has('a.b', aListener)).toBe(true)
  expect(emitter.has('a.b', bListener)).toBe(true)
  expect(emitter.has('a.b', cListener)).toBe(false)

  emitter.off('a.b', bListener)
  // 还有 aListener 在监听
  expect(emitter.has('a.b')).toBe(true)
  expect(emitter.has('a.b', aListener)).toBe(true)
  expect(emitter.has('a.b', bListener)).toBe(false)

  expect(emitter.has('a.d')).toBe(true)
  emitter.off('.d')
  expect(emitter.has('a.d')).toBe(false)

  emitter.off()
  expect(emitter.has('a')).toBe(false)
  expect(emitter.has('a.b')).toBe(false)
  expect(emitter.has('a.b.c')).toBe(false)

})
