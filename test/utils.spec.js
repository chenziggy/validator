import { utils, handleSelectorsValues} from '../src/utils'
import { describe, it, expect } from '@jest/globals'

describe('utils', () => {

  it('isNumber', () => {
    expect(utils.isNumber(1,2,3)).toEqual()
    expect(() =>utils.isNumber('1',2,3)).toThrow(TypeError)
    expect(() =>utils.isNumber(null,2,3)).toThrow(TypeError)
    expect(() =>utils.isNumber(NaN,2,3)).toThrow(TypeError)
  })

  it('formatTime', () => {
    expect(utils.formatTime(100000000)).toBe('01天03:46:40')
  })

  it('handleSelectorsValues', () => {
    expect(handleSelectorsValues({values: [1,1, null], nodeList: [{}, {}, {value: 1}]})).toEqual([1,1,1])
    expect(handleSelectorsValues({values: [null,1, null], nodeList: [{value: 1}, {}, {value: 1}]})).toEqual([1,1,1])
  })
})

