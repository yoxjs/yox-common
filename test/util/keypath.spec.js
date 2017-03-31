
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

  })

})
