import { utils} from '../src/utils'
import { describe, it, expect } from '@jest/globals'

describe('utils', () => {

  it('isNumber', () => {
    expect(utils.isNumber(1,2,3)).toEqual()
    expect(() =>utils.isNumber('1',2,3)).toThrow(TypeError)
    expect(() =>utils.isNumber(null,2,3)).toThrow(TypeError)
    expect(() =>utils.isNumber(NaN,2,3)).toThrow(TypeError)
  })
})