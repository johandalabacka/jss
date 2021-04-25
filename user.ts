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
    const [username] = stdout.split(':')
    return username
}

/**
 * Return current locale eg sv_SE, en_US ...
 * @returns current locale
 */
export async function getCurrentLocale() {
  const { stdout } = await run(['/usr/bin/defaults', 'read', '.GlobalPreferences', 'AppleLocale'])
  return stdout.trim()
}