
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

})
