/**
 * @vitest-environment jsdom
 */
import { describe, it, expect } from 'vitest'
import { 
  transformKeyToLowerCamelCase, 
  transformParams, 
  transformData,
  transformKeyToUnderLine,
  transformRes
} from '../core'

describe('test', () => {
  it('a_b transform to aB', () => {
    expect(transformKeyToLowerCamelCase('a_b')).toMatchInlineSnapshot('"aB"')
  })

  it('a_b_b transform to aBB', () => {
    expect(transformKeyToLowerCamelCase('a_b_b')).toMatchInlineSnapshot('"aBB"')
  })

  it('Ab transform to Ab', () => {
    expect(transformKeyToLowerCamelCase('Ab')).toMatchInlineSnapshot('"Ab"')
  })

  it('aA transform a_b', () => {
    expect(transformKeyToUnderLine('aA')).toMatchInlineSnapshot('"a_a"')
  })

  it('aAV transform a_b', () => {
    expect(transformKeyToUnderLine('aAV')).toMatchInlineSnapshot('"a_a_v"')
  })

  it('test transformParams', () => {
    const config = {
      params: {
        a_b: 'aa',
      }
    }
    transformParams(config)
    expect(config).toMatchInlineSnapshot(`
      {
        "params": {
          "aB": "aa",
        },
      }
    `)
  })

  it('test transformParams', () => {
    const config = {
      params: {
        aB: 'aa',
      }
    }
    transformParams(config, false)
    expect(config).toMatchInlineSnapshot(`
      {
        "params": {
          "a_b": "aa",
        },
      }
    `)
  })

  it('test transformData objectData', () => {
    const config = {
      data: {
        a_b: 'ab'
      }
    }
    transformData(config)
    expect(config).toMatchInlineSnapshot(`
      {
        "data": {
          "aB": "ab",
        },
      }
    `)
  })

  it('test transformData formData', () => {
    const formData = new FormData()
    formData.append('a_b', 'ab')
    const config = {
      data: formData
    }
    transformData(config)
    expect(config.data.get('aB')).toMatchInlineSnapshot('"ab"')
    expect(config.data.get('a_b')).toBeNull()
  })

  it('test transformRes', () => {
    const config = {
      da_ta: {
        a_b: 'ab',
        a_c: [
          {
            a_b: 'b' 
          }
        ]
      }
    }
    transformRes(config)
    expect(config).toMatchInlineSnapshot(`
      {
        "daTa": {
          "aB": "ab",
          "aC": [
            {
              "aB": "b",
            },
          ],
        },
      }
    `)
  })
})