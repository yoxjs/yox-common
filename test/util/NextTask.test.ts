
import NextTask from 'yox-common/src/util/NextTask'

test('append', done => {

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

test('prepend', done => {

  let a = 0, b = 0

  let nextTask = new NextTask()

  nextTask.append(
    function () {
      a = 1
      expect(a).toBe(1)
      expect(b).toBe(2)
      done()
    }
  )

  nextTask.prepend(
    function () {
      b = 2
      expect(a).toBe(0)
      expect(b).toBe(2)
    }
  )

  expect(a).toBe(0)
  expect(b).toBe(0)

})

test('run', done => {

  let a = 0, b = 0

  let nextTask = new NextTask()

  nextTask.append(
    function () {
      a = 1
      expect(a).toBe(1)
      expect(b).toBe(2)
    }
  )

  nextTask.prepend(
    function () {
      b = 2
      expect(a).toBe(0)
      expect(b).toBe(2)
    }
  )

  expect(a).toBe(0)
  expect(b).toBe(0)

  nextTask.run()

  expect(a).toBe(1)
  expect(b).toBe(2)

  expect(nextTask.tasks.length).toBe(0)
  done()

})