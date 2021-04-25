import { runInShell } from './run.ts'

interface DialogOptions {
  buttons? : string[],
  iconPath? : string,
  runInBackground? : boolean
}

export function showDialog(title : string, description : string,
  {buttons, iconPath, runInBackground} : DialogOptions = {buttons: ['OK'], iconPath: '', runInBackground: false}) {
    let cmd = [
      '/Library/Application Support/JAMF/bin/jamfHelper.app/Contents/MacOS/jamfHelper',
      '-windowType', 'utility',
      '-title', title,
      '-description', description
    ]
    if (! buttons || buttons.length === 0) {
      cmd = cmd.concat(['-button1', 'OK', '-defaultButton', '1'])
    } else {
      if (buttons.length >= 1) {
        cmd = cmd.concat(['-button1', buttons[0], '-defaultButton', '1'])
      }
      if (buttons && buttons.length >= 2) {
        cmd = cmd.concat(['-button2', buttons[1]])
      }
    }
    
    if (iconPath) {
      cmd = cmd.concat('-icon', iconPath, '-iconSize', '64')
    }

    if (runInBackground) {
      cmd.push('&') // To run in background
    }

    return runInShell(cmd, {stdout: undefined})
}