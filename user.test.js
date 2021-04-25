import { assertEquals } from "https://deno.land/std@0.93.0/testing/asserts.ts";
import { getCurrentUser, getCurrentLocale } from './user.ts'

Deno.test({
  name: "Get current user",
  fn: async()  => {
    const user = await getCurrentUser()
    assertEquals(user.username, Deno.env.get('USER'))
    assertEquals(user.home, Deno.env.get('HOME'))
  },
})

Deno.test({
  name: "Get current locale",
  fn: async()  => {
    assertEquals(await getCurrentLocale(), 'sv_SE')
  },
})