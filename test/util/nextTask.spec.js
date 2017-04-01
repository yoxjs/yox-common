
import * as nextTask from '../../util/nextTask'

describe('util/nextTask', () => {
  it('add', () => {

    let i = 0

    nextTask.add(
      function () {
        i += 5
      }
    )

    nextTask.add(
      function () {
        i -= 3
      }
    )

    expect(i).toBe(0)

    nextTask.run()

    expect(i).toBe(2)

  })

})
