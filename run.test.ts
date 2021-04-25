import { assert, assertEquals } from 'https://deno.land/std@0.93.0/testing/asserts.ts'
import {run, runInShell, getCurrentScript, escapeShellArgs } from './run.ts'

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

Deno.test({
  name: 'escape shell args - not needed',
  fn: () => {
    const args = escapeShellArgs(['/bin/ls', '-la', '/tmp'])
    assertEquals(args, '/bin/ls -la /tmp')
  },
})

Deno.test({
  name: 'escape shell args - spaces',
  fn: () => {
    const args = escapeShellArgs(['/bin/ls', '-la', '/my dir'])
    assertEquals(args, `/bin/ls -la '/my dir'`)
  },
})

Deno.test({
  name: 'escape shell args - citation',
  fn: () => {
    const args = escapeShellArgs(['echo', `It is 'cool'`])
    assertEquals(args, `echo 'It is '\\''cool'\\'''`)
  },
})

Deno.test({
  name: 'run as script, escape shell args - citation',
  fn: async () => {
    const { stdout } = await runInShell(['echo', `It is 'cool'`])
    assertEquals(stdout, `It is 'cool'\n`)
  },
})