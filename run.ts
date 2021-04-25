
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
  options : RunOptions = {}
  ) : Promise<{status: Deno.ProcessStatus, stdout: string, stderr: string}> {

  const runOptions : RunOptions2 = {
    cmd,
    stdout: undefined,
    stderr: undefined
  }
  // deno-lint-ignore no-prototype-builtins
  if (options.hasOwnProperty('stdout')) {
    runOptions.stdout = options.stdout
  } else {
    runOptions.stdout = "piped"
  }
  // deno-lint-ignore no-prototype-builtins
  if (options.hasOwnProperty('stderr')) {
    runOptions.stderr = options.stdout
  } else {
    runOptions.stderr = "piped"
  }
  const p = Deno.run(runOptions)
  const status = await p.status()
  const t = new TextDecoder()
  let stdout = ''
  let stderr = ''
  if (runOptions.stdout == "piped") {
    stdout = t.decode(await p.output())
  }
  if (runOptions.stderr == "piped") {
    stderr = t.decode(await p.stderrOutput())
  }
  p.close()
  return { status, stdout, stderr }
}

export function escapeShellArgs(args : string[]) : string {
  return args.map( (arg : string) => {
    arg = arg.replaceAll(/([\$])/g, (s : string) => `\\${s}`)
    arg = arg.replaceAll(`'`, `'\\''`)
    if (arg.includes(' ') || arg.includes('\'')) {
      return `'${arg}'`
    }
    return arg
  }).join(' ')
}

export function runInShell(cmd : string[], options : RunOptions = {}
) : Promise<{status: Deno.ProcessStatus, stdout: string, stderr: string}> {
  const cmdShell = ['/bin/sh', '-c', escapeShellArgs(cmd)]
  return run(cmdShell, options)
}

export async function runScriptAsCurrentUser() : Promise<{status: Deno.ProcessStatus, stdout: string, stderr: string}> {
  if (Deno.env.get('USER') !== 'root') {
    return {
      status: {
        success: false,
        code: -1
      },
      stdout: '',
      stderr: 'Must be root to run script as current user'
    }
  }
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


