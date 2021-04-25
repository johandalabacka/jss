import { assertEquals } from "https://deno.land/std@0.93.0/testing/asserts.ts";
import { getCurrentUser, getCurrentLocale } from './user.ts'

Deno.test({
  name: "Get current user",
  fn: async()  => {
    assertEquals(await getCurrentUser(), Deno.env.get('USER'))
  },
})

Deno.test({
  name: "Get current locale",
  fn: async()  => {
    assertEquals(await getCurrentLocale(), 'sv_SE')
  },
})