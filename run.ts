
import { getCurrentUser } from './user.ts'

interface RunOptions {
  stdout?: number | "null" | "inherit" | "piped" | undefined
  stderr?: number | "null" | "inherit" | "piped" | undefined
}

interface RunOptions2 extends RunOptions {
  cmd: string[]
}
/**
 * 
 * @param cmd - command and arguments
 * @param options - how to handle stdout and stderr
 * @returns {}
 */
export async function run(cmd : string[],
  options : RunOptions = {stdout: 'piped', stderr: 'piped'}
  ) : Promise<{status: Deno.ProcessStatus, stdout: string, stderr: string}> {

  const runOptions : RunOptions2 = {
    cmd,
    stdout: undefined,
    stderr: undefined
  }
  if (options.stdout) {
    runOptions.stdout = options.stdout
  }
  if (options.stderr) {
    runOptions.stderr = options.stdout
  }

  const p = Deno.run(runOptions)
  const status = await p.status()
  const t = new TextDecoder()
  let stdout = ''
  let stderr = ''
  if (options.stdout == "piped") {
    stdout = t.decode(await p.output())
  }
  if (options.stderr == "piped") {
    stderr = t.decode(await p.stderrOutput())
  }
  p.close()
  return { status, stdout, stderr }
}

export async function runScriptAsCurrentUser() : Promise<{status: Deno.ProcessStatus, stdout: string, stderr: string}> {
  const username = await getCurrentUser()
  if (!username) {
    return {
      status: {
        success: false,
        code: -1
      },
      stdout: '',
      stderr: 'Current user not found'
    }
  }
  const scriptPath = getCurrentScript()
  const tempScriptPath = await Deno.makeTempFile({suffix: '.ts'})
  await Deno.copyFile(scriptPath, tempScriptPath)
  await Deno.chmod(tempScriptPath, 0o755)
  const cmd = ['/usr/bin/sudo', '-u', username, tempScriptPath, ...Deno.args]
  const result = await run(cmd)
  await Deno.remove(tempScriptPath)
  return result
}

export function getCurrentScript() : string {
  const url = new URL(Deno.mainModule)
  return decodeURI(url.pathname)
}


