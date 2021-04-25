import { run } from './run.ts'

/**
 * Return current logged in user's username
 * 
 * @returns username or null
 */
export async function getCurrentUser() {
    const stat = await Deno.lstat("/dev/console")
    if (! stat?.uid) {
      return null
    }
    const {status, stdout } = await run(['id', '-P', stat.uid.toString()])
    if (!status.success) {
      return null
    }
    // Get first field (username)
    // ling-jda:********:904518429:1412170593::0:0:Johan Dahl:/Users/ling-jda:/bin/zsh
    const [username,,uid,gid,,,,name,home,shell] = stdout.split(':')
    return {username, uid, gid, name, home, shell}
}

/**
 * Return current locale eg sv_SE, en_US ...
 * @returns current locale
 */
export async function getCurrentLocale() {
  const { stdout } = await run(['/usr/bin/defaults', 'read', '.GlobalPreferences', 'AppleLocale'])
  return stdout.trim()
}