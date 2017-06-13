
import Emitter from '../../util/Emitter'

describe('util/Emitter', () => {
  it('on', () => {

    let emitter = new Emitter()
    let i = 0

    let listener = function () {
      i++
      expect(this).toBe(listener)
    }

    emitter.on('click', listener)
    expect(i).toBe(0)

    expect(emitter.has('click')).toBe(true)
    expect(emitter.has('click', listener)).toBe(true)

    emitter.fire('click', null, listener)
    expect(i).toBe(1)

    emitter.fire('click', null, listener)
    expect(i).toBe(2)

  })

  it('once', () => {

    let emitter = new Emitter()
    let i = 0

    emitter.once('click', function () {
      i++
    })
    expect(i).toBe(0)

    emitter.fire('click')
    expect(i).toBe(1)

    emitter.fire('click')
    expect(i).toBe(1)

    expect(emitter.has('click')).toBe(false)

  })

  it('off', () => {

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

  it('namespace', () => {

    let emitter = new Emitter()

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

    emitter.fire('a')
    expect(aValue).toBe(1)
    expect(bValue).toBe(1)
    expect(cValue).toBe(1)

    emitter.fire('a.b')
    expect(aValue).toBe(2)
    expect(bValue).toBe(2)
    expect(cValue).toBe(1)

    emitter.fire('a.b.c')
    expect(aValue).toBe(3)
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

})
