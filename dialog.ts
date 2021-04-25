import { runInShell } from './run.ts'

interface DialogOptions {
  buttons : string[],
  iconPath : string,
  runInBackground : boolean
}

export function showDialog(title : string, description : string,
  options : DialogOptions = {buttons: ['OK'], iconPath: '', runInBackground: false}) {
    let cmd = [
      '/Library/Application Support/JAMF/bin/jamfHelper.app/Contents/MacOS/jamfHelper',
      '-windowType', 'utility',
      '-title', title,
      '-description', description
    ]
    if (options.buttons.length === 0) {
      cmd = cmd.concat(['-button1', 'OK', '-defaultButton', '1'])
    } else if (options.buttons.length >= 1) {
      cmd = cmd.concat(['-button1', options.buttons[0], '-defaultButton', '1'])
    }
    if (options.buttons.length >= 2) {
      cmd = cmd.concat(['-button2', options.buttons[1]])
    }
    
    if (options.iconPath) {
      cmd = cmd.concat('-icon', options.iconPath, '-iconSize', '64')
    }

    if (options.runInBackground) {
      cmd.push('&') // To run in background
    }

    return runInShell(cmd, {stderr: undefined})
}