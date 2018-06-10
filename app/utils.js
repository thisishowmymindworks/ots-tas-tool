/* global settings, confirm, UIkit */
// PACKAGES
window.$ = window.jQuery = require('jquery')
const path = require('path')
const remote = require('electron').remote
const dialog = remote.dialog
const fs = require('fs-extra') // MOVE INTO UTILS? MAYBE OTHERS AS WELL
const shell = require('child_process')
const iconv = require('iconv-lite')

// GLOBAL VARS
const win = remote.getCurrentWindow().removeAllListeners()
const settings_file = path.join(remote.app.getPath('userData'), '\\otas.settings')
var current_save_file = "";
//var settings = load_settings();

win.on('maximize', function() {
  $('#menu_maximize').html('&#x1f5d7;')
})

win.on('unmaximize', function() {
  $('#menu_maximize').html('&#x1f5d6;')
})

function window_minimize() {
  win.minimize();
}

function window_maximize() {
  if (win.isMaximized()) {
    win.unmaximize()
  } else {
    win.maximize()
  }
}

let utils = (function () {
  // VARIABLES
  let readOnlyScriptsDir = path.join(__dirname, '\\..\\files\\scripts')
  let scriptsDir = path.join(remote.app.getPath('userData'), '\\scripts')
  // EVENT DELEGATION

  // "PRIVATE" FUNCTIONS
  // EXPOSED FUNCTIONS
  function readFromFile (path) {
    if (path && fs.statSync(path).isFile()) {
      try {
        return fs.readFileSync(path)
      } catch (e) {
        // HANDLE ERROR!
        return false
      }
    } else {
      return false
    }
  }

  function writeToFile (path, data) {
    try {
      fs.writeFileSync(path, iconv.encode(data, 'win1252'))
      return true
    } catch (e) {
      // HANDLE ERROR!
      return false
    }
  }

  function readJson (path, options) {
    return fs.readJsonSync(path, options)
  }

  function outputJson (path, data) {
    return fs.outputJsonSync(path, data)
  }

  function pathExists (path) {
    return fs.pathExistsSync(path)
  }

  function deleteFile (path) {
    fs.removeSync(path)
  }

  function getPathFromDialog (filters) {
    var pathArray = dialog.showOpenDialog(filters)
    if (pathArray === undefined) {
      return false
    } else {
      return pathArray[0]
    }
  }

  function getSavePath (filters) {
    let savePath = dialog.showSaveDialog(filters)
    return savePath
  }

  function replaceScript (actionScriptClass, scriptFileName) {
    let ffdecPath = settings.get('ffdecPath')
    let swfPath = path.join(settings.get('otsPath'), '..', 'ots.swf')
    let scriptPath = path.join(scriptsDir, settings.get('useWhichOts'), scriptFileName)

    if (!fs.existsSync(swfPath) || !fs.existsSync(ffdecPath)) {
      flashSmallMessage('OTS and/or ffdec path has not been set, please do so in the settings menu.', 'warning')
      return false
    }

    try {
      let cmd = `"${ffdecPath}" -replace "${swfPath}" "${swfPath}" "${actionScriptClass}" "${scriptPath}"`
      shell.execSync(cmd)
      return true
    } catch (e) {
      // HANDLE ERROR!
      flashSmallMessage('Could not replace script! See the console (f12) for the full error message')
      console.log(e)
      return false
    }
  }

  function flashMessage (message, status, timeout = 4000, sizeClass) {
    UIkit.notification({
      message: `<div class="uk-flex uk-flex-center uk-flex-middle notification-container ${sizeClass}">
                  ${message}
                </div>`,
      status: status,
      timeout: timeout
    })
  }

  function flashSmallMessage (message, status, timeout) {
    flashMessage(`<h2 class="notification-htag">${message}</h2>`, status, timeout)
  }

  function flashLargeMessage (message, status, timeout) {
    flashMessage(`<h1 class="notification-htag">${message}</h1>`, status, timeout, 'notification-large')
  }

  function exit () {
    if (confirm('Are you sure you want to exit? \n(All unsaved changes will be lost)')) {
      window.close()
    }
  }

  fs.copySync(readOnlyScriptsDir, scriptsDir)
  return {
    readJson: readJson,
    outputJson: outputJson,
    pathExists: pathExists,
    deleteFile: deleteFile,
    pathFromDialog: getPathFromDialog,
    pathFromSaveDialog: getSavePath,
    readFromFile: readFromFile,
    writeToFile: writeToFile,
    replaceScript: replaceScript,
    flashSmallMessage: flashSmallMessage,
    flashLargeMessage: flashLargeMessage,
    exitApp: exit
  }
})()
