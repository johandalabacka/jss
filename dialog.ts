import { run } from './run.ts'

export function showDialog(title : string, description : string, iconPath : string = '') {
    const cmd = [
      '/Library/Application Support/JAMF/bin/jamfHelper.app/Contents/MacOS/jamfHelper',
      '-windowType', 'utility',
      '-button1', 'OK', '-defaultButton', '1',
      '-title', title,
      '-description', description
    ]
    if (iconPath) {
      cmd.push('-icon')
      cmd.push(iconPath)
      cmd.push('-iconSize')
      cmd.push('64')
    }

    return run(cmd, {stderr: undefined})
}