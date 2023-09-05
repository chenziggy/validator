import { operate } from '../src/operate'
import { describe, it, expect } from '@jest/globals'

describe('operate', () => {
  it('===', () => {
    const operation = operate['===']
    expect(
      operation(1,1)
    ).toEqual({res: true})
    expect(
      operation(1,2)
    ).toEqual({res: false})
  })

  it('<', () => {
    const operation = operate['<']
    expect(
      operation(1,2)
    ).toEqual({res: true})
    expect(
      operation(2,2)
    ).toEqual({res: false})
  })

  it('>', () => {
    const operation = operate['>']
    expect(
      operation(1,2)
    ).toEqual({res: false})
    expect(
      operation(3,2)
    ).toEqual({res: true})
  })

  it('startsWith', () => {
    const operation = operate['startsWith']
    expect(
      operation('abc','ab')
    ).toEqual({res: true})
    expect(
      operation('abc', 'bd')
    ).toEqual({res: false})
  })

  it('inRange', () => {
    const operation = operate['inRange']
    expect(
      operation(1 ,1, 2)
    ).toEqual({res: true})
    expect(
      operation(1, 2, 3)
    ).toEqual({res: false})
  })

  it('time<', () => {
    const operation = operate['time<']
      const currentDate = new Date()
    expect(
      operation(Date.now(), currentDate.setDate(currentDate.getDate() + 1), 25*60)
    ).toMatchObject({res: true})
    expect(
      operation(Date.now(), currentDate.setDate(currentDate.getDate() + 1), 23*60)
    ).toMatchObject({res: false})
  })

  it('time>', () => {
    const operation = operate['time>']
      const currentDate = new Date()
    expect(
      operation( currentDate.setDate(currentDate.getDate() + 1),Date.now(), 25*60)
    ).toMatchObject({res: false})
    expect(
      operation( currentDate.setDate(currentDate.getDate() + 1), Date.now(), 23*60)
    ).toMatchObject({res: true})
  })

  it('async', async () => {
    const operation = operate['async']
    expect(
      await operation(() => Promise.resolve(1), null, '===',{}, [1] )
    ).toEqual({res: true})

    expect(
      await operation(() => Promise.resolve(1), null, '<',{}, [2] )
    ).toEqual({res: true})
  })
})
