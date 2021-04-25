import {assertEquals} from "https://deno.land/std/testing/asserts.ts"
import { showDialog } from './dialog.ts'

Deno.test({
  name: "dialog",
  fn: async () => {
    const iconPath = '/Applications/Unison LU.app/Contents/Resources/Unison.icns'
    const result = await showDialog('Test', 'Some test text', iconPath)
    console.log(result)
    assertEquals("world", "world");
  },
});