export async function getCurrentUser() {
    const stat = await Deno.lstat("/dev/console")
    if (! stat?.uid) {
      return null
    }
    const p = Deno.run({
      // -P as a passwd entry
      cmd: ['id', '-P', stat.uid.toString()],
      stdout: "piped"
    })
    const status = await p.status()
    const output = new TextDecoder().decode(await p.output())
    if (!status.success) {
      return null
    }
    // Get first field (username)
    const [username] = output.split(':')
    return username
}
