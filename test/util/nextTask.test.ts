
import NextTask from '../../util/NextTask'

test('add', done => {

  let i = 0

  let nextTask = new NextTask()
  nextTask.append(
    function () {
      i += 5
    }
  )

  nextTask.append(
    function () {
      i -= 3
      expect(i).toBe(2)
      done()
    }
  )

  expect(i).toBe(0)

})
