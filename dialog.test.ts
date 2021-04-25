import {assertEquals} from "https://deno.land/std/testing/asserts.ts"
import { showDialog } from './dialog.ts'

Deno.test({
  name: "dialog",
  fn: async () => {
    const iconPath = '/Applications/Utilities/Unison LU.app/Contents/Resources/Unison.icns'
    const result = await showDialog('Test', 'Some test text',
      { buttons: ['OK'], iconPath })
    console.log({result})
    assertEquals("world", "world");
  },
});