import { assert, assertEquals } from "https://deno.land/std@0.93.0/testing/asserts.ts";
import { addLine } from './file.ts'

Deno.test({
  name: "Add line",
  fn: async()  => {
    const tmpFile = Deno.makeTempFileSync()
    Deno.writeTextFileSync(tmpFile, 'apa\nbanan\ncello\n')
    const wasAdded = await addLine(tmpFile, 'deno')
    const content = Deno.readTextFileSync(tmpFile)
    Deno.removeSync(tmpFile)

    assert(wasAdded, 'line was not added')
    assertEquals(content, 'apa\nbanan\ncello\ndeno\n')
  },
})

Deno.test({
  name: "Add line (and newline before)",
  fn: async()  => {
    const tmpFile = Deno.makeTempFileSync()
    Deno.writeTextFileSync(tmpFile, 'apa\nbanan\ncello')
    const wasAdded = await addLine(tmpFile, 'deno')
    const content = Deno.readTextFileSync(tmpFile)
    Deno.removeSync(tmpFile)

    assert(wasAdded, 'line was not added')
    assertEquals(content, 'apa\nbanan\ncello\ndeno\n')
  },
})

Deno.test({
  name: "Add line (not needed)",
  fn: async()  => {
    const tmpFile = Deno.makeTempFileSync()
    Deno.writeTextFileSync(tmpFile, 'apa\nbanan\ncello\ndeno\n')
    const wasAdded = await addLine(tmpFile, 'deno')
    const content = Deno.readTextFileSync(tmpFile)
    Deno.removeSync(tmpFile)
    assert(!wasAdded, 'line was added')
    assertEquals(content, 'apa\nbanan\ncello\ndeno\n')
  },
})

Deno.test({
  name: "Add line (empty file)",
  fn: async()  => {
    const tmpFile = Deno.makeTempFileSync()
    const wasAdded = await addLine(tmpFile, 'deno')
    const content = Deno.readTextFileSync(tmpFile)
    Deno.removeSync(tmpFile)

    assert(wasAdded, 'line was not added')
    assertEquals(content, 'deno\n')
  },
})

Deno.test({
  name: "Add line (file not exists)",
  fn: async()  => {
    const tmpFile = Deno.makeTempFileSync()
    Deno.removeSync(tmpFile) // Remove it
    await addLine(tmpFile, 'deno')
    const content = Deno.readTextFileSync(tmpFile)
    Deno.removeSync(tmpFile)

    assertEquals(content, 'deno\n')
  },
})