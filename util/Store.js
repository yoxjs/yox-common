
import * as is from './is'
import * as array from './array'
import * as object from './object'

export default class Store {

  constructor() {
    this.data = { }
  }

  /**
   * 同步取值
   *
   * @param {string} key
   * @return {*}
   */
  get(key) {
    return this.data[ key ]
  }

  /**
   * 异步取值
   *
   * @param {string} key
   * @param {Function} callback
   */
  getAsync(key, callback) {
    let { data } = this
    let value = data[ key ]
    if (is.func(value)) {
      let { $pending } = value
      if (!$pending) {
        $pending = value.$pending = [ callback ]
        value(function (replacement) {
          delete value.$pending
          data[ key ] = replacement
          array.each(
            $pending,
            function (callback) {
              callback(replacement)
            }
          )
        })
      }
      else {
        array.push($pending, callback)
      }
    }
    else {
      callback(value)
    }
  }

  set(key, value) {
    let { data } = this
    if (is.object(key)) {
      object.each(
        key,
        function (value, key) {
          data[ key ] = value
        }
      )
    }
    else if (is.string(key)) {
      data[ key ] = value
    }
  }

}
