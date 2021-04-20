export async function run(...cmd : string[]) : Promise<{status: Deno.ProcessStatus, stdout: string, stderr: string}> {
  const p = Deno.run({
    // -P as a passwd entry
    cmd,
    stdout: "piped",
    stderr: "piped"
  })
  const status = await p.status()
  const stdout = new TextDecoder().decode(await p.output())
  const stderr = new TextDecoder().decode(await p.stderrOutput())
  return {status, stdout, stderr }
}