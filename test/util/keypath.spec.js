
import * as is from '../../util/is'
import * as keypath from '../../util/keypath'

describe('util/keypath', () => {
  it('normalize', () => {

    expect(
      keypath.normalize('a.b.c')
    )
    .toBe('a.b.c')

    expect(
      keypath.normalize('a.0.c')
    )
    .toBe('a.0.c')

    expect(
      keypath.normalize('a[0].c')
    )
    .toBe('a.0.c')

    expect(
      keypath.normalize('a["b"].c')
    )
    .toBe('a.b.c')

    expect(
      keypath.normalize('a["b"][0]')
    )
    .toBe('a.b.0')

    expect(
      keypath.normalize('a["b"]["c"]')
    )
    .toBe('a.b.c')

  })

  it('parse', () => {

    let result1 = keypath.parse('a.b.c')

    expect(
      is.array(result1)
    )
    .toBe(true)

    expect(
      result1.length
    )
    .toBe(3)

    expect(result1[0]).toBe('a')
    expect(result1[1]).toBe('b')
    expect(result1[2]).toBe('c')


    let result2 = keypath.parse('a.b.this.c')

    expect(
      is.array(result2)
    )
    .toBe(true)

    expect(
      result2.length
    )
    .toBe(3)

    expect(result2[0]).toBe('a')
    expect(result2[1]).toBe('b')
    expect(result2[2]).toBe('c')

    let result3 = keypath.parse('a.b..c')

    expect(
      is.array(result3)
    )
    .toBe(true)

    expect(
      result3.length
    )
    .toBe(3)

    expect(result3[0]).toBe('a')
    expect(result3[1]).toBe('b')
    expect(result3[2]).toBe('c')

  })

  it('stringify', () => {

    expect(
      keypath.stringify(['a', 'b', 'c'])
    )
    .toBe('a.b.c')

    expect(
      keypath.stringify(['a', 'b', 'this', 'c'])
    )
    .toBe('a.b.c')

    expect(
      keypath.stringify(['a', 'b', '', 'c'])
    )
    .toBe('a.b.c')

  })

  it('startsWith', () => {

    expect(
      keypath.startsWith('a', 'a')
    )
    .toBe(1)

    expect(
      keypath.startsWith('a.b', 'a')
    )
    .toBe(2)

    expect(
      keypath.startsWith('a.b', 'a.')
    )
    .toBe(false)

    expect(
      keypath.startsWith('a.b', 'b')
    )
    .toBe(false)

  })

})
