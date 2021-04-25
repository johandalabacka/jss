import { assert } from 'https://deno.land/std@0.93.0/testing/asserts.ts'
import {run, getCurrentScript } from './run.ts'

Deno.test({
  name: 'Successful run',
  fn: async () => {
    const {status, stdout, stderr} = await run(['ls', '-1'])
    assert(status.success)
    assert(stdout.includes('run.test.ts'))
    assert(stderr === '')
  },
})

Deno.test({
  name: 'Failed run',
  fn: async () => {
    const {status, stdout, stderr} = await run(['ls', '--xxxx'])
    assert(!status.success)
    assert(stdout === '')
    assert(stderr.includes('illegal option'))
  },
})

Deno.test({
  name: 'get current script',
  fn: () => {
    const path = getCurrentScript()
    assert(path.endsWith('$deno$test.ts'))
  },
})
