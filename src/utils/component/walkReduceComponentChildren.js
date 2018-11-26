import { concat, forEach, isObjectLike, resolve, walk, isEmpty } from '@serverless/utils'
import isComponent from './isComponent'

const reduceWalkee = (accum, value, keys, iteratee, recur) => {
  const visited = new Set()

  let result = accum
  if (isObjectLike(value) && !visited.has(value)) {
    visited.add(value)
    if (isComponent(value) && !isEmpty(keys)) {
      result = iteratee(accum, value, keys)
    } else {
      forEach((childValue, childKdx) => {
        const newKeys = concat(keys, [childKdx])
        result = recur(result, resolve(childValue), newKeys, iteratee)
      }, value)
    }
  }
  return result
}

/**
 * Walk reduce the component and component's children using the given reducer function
 *
 * @func
 * @param {Function} fn The iterator function. Receives three values, the accumulator and the current element from the walk and the current set of keys from the entire depth of the walk.
 * @param {*} accum The accumulator value.
 * @param {Component} component The component to walk.
 * @returns {*} The final, accumulated value.
 */
const walkReduceComponentChildren = (iteratee, accum, component) =>
  walk(reduceWalkee, iteratee, accum, component, [])

export default walkReduceComponentChildren
