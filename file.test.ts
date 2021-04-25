import { assertEquals } from "https://deno.land/std@0.93.0/testing/asserts.ts";
import { addLine } from './file.ts'

Deno.test({
  name: "Add line",
  fn: async()  => {
    const tmpFile = Deno.makeTempFileSync()
    Deno.writeTextFileSync(tmpFile, 'apa\nbanan\ncello\n')
    await addLine(tmpFile, 'deno')
    const content = Deno.readTextFileSync(tmpFile)
    Deno.removeSync(tmpFile)

    assertEquals(content, 'apa\nbanan\ncello\ndeno\n')
  },
})

Deno.test({
  name: "Add line (and newline before)",
  fn: async()  => {
    const tmpFile = Deno.makeTempFileSync()
    Deno.writeTextFileSync(tmpFile, 'apa\nbanan\ncello')
    await addLine(tmpFile, 'deno')
    const content = Deno.readTextFileSync(tmpFile)
    Deno.removeSync(tmpFile)

    assertEquals(content, 'apa\nbanan\ncello\ndeno\n')
  },
})

Deno.test({
  name: "Add line (not needed)",
  fn: async()  => {
    const tmpFile = Deno.makeTempFileSync()
    Deno.writeTextFileSync(tmpFile, 'apa\nbanan\ncello\ndeno\n')
    await addLine(tmpFile, 'deno')
    const content = Deno.readTextFileSync(tmpFile)
    Deno.removeSync(tmpFile)

    assertEquals(content, 'apa\nbanan\ncello\ndeno\n')
  },
})

Deno.test({
  name: "Add line (empty file)",
  fn: async()  => {
    const tmpFile = Deno.makeTempFileSync()
    await addLine(tmpFile, 'deno')
    const content = Deno.readTextFileSync(tmpFile)
    Deno.removeSync(tmpFile)

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