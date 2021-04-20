async function getCurrentUser() {
    const uid = await Deno.lstat("/dev/console").uid
    const p = Deno.run({
      // -P as a passwd entry
      cmd: ['id', '-P', uid],
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
