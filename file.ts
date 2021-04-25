export async function addLine(path : string, line: string) {
  let content = ''
  try {
    content = await Deno.readTextFile(path)
  } catch (e) {
    if (!(e instanceof Deno.errors.NotFound)) {
      throw e
    }
    await Deno.writeTextFile(path, line + '\n')
  }
  const lineExists = content.split('\n').includes(line)
  if (lineExists) {
    return
  }
  let newContent = content
  if (content.length > 0 && !content.endsWith('\n')) {
    newContent += '\n'
  }
  newContent += line + '\n'
  await Deno.writeTextFile(path, newContent)
}