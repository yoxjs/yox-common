
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
