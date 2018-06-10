/* global settings, utils, path, iconv, shell */

let runCompile = (function () {
  // VARIABLES
  let templateSaveDropDown = document.getElementById('ddl-template-save')
  // EVENT DELEGATION
  // "PRIVATE" FUNCTIONS
  function compileToJson () {
    let tasObject = {
      'up_down': {},
      'left_right': {},
      'jump': {},
      'teleshot': {},
      'gauss': {},
      'boss_frame': 9999999999,
      'skip_frame': 9999999999,
      'max_frame': 1
    }

    let actionRows = document.querySelectorAll('.action')
    let skipFrame = document.getElementById('skip-frame').value
    let bossFrame = actionRows.getElementById('boss-frame').value

    for (let actionRow of actionRows) {
      let frameStr = actionRow.querySelector('.frame-input')
      let vertical = actionRow.querySelector('.ver').value
      let horizontal = actionRow.querySelector('.hor').value
      let teleShot = actionRow.querySelector('.tele').checked
      let gaussShot = actionRow.querySelector('.gauss').checked
      let jump = actionRow.querySelector('.jump').checked
      let customJump = actionRow.querySelector('.custom-jump')

      tasObject['max_frame'] = Math.max(tasObject['max_frame'], parseInt(frameStr), parseInt(bossFrame) + 200)

      if (vertical !== 'none') {
        tasObject['up_down'][frameStr] = parseInt(vertical)
      }

      if (horizontal !== 'none') {
        tasObject['left_right'][frameStr] = parseInt(horizontal)
      }

      if (teleShot) {
        tasObject['teleshot'][frameStr] = true
      }

      if (gaussShot) {
        tasObject['gauss'][frameStr] = true
      }

      if (jump) {
        let jumpEnd = (parseInt(frameStr) + 25).toString()
        tasObject['jump'][frameStr] = true
        tasObject['jump'][jumpEnd] = false
      }

      if (customJump !== 'none') {
        tasObject['jump'][frameStr] = (customJump === 'true')
      }
    }

    if (bossFrame && bossFrame > 0) {
      tasObject['boss_frame'] = bossFrame
    }

    if (document.getElementById('cb-dialogue-skipping').checked && skipFrame) {
      tasObject['skip_frame'] = parseInt(skipFrame)
    }

    return tasObject
  }

  function compileTas () {
    let otsPath = settings.get('otsPath')

    if (!utils.pathExists(otsPath)) {
      utils.flashSmallMessage('Cannot compile TAS since the OTS path has not been set, please do so in the settings menu', 'danger')
    } else {
      try {
        utils.outputJson(path.join(otsPath, '..', '/tas/otas.json'), compileToJson())
      } catch (e) {
        utils.flashSmallMessage('Error saving the TAS to file', 'danger')
        console.log(e)
      }
    }
  }
  // EXPOSED FUNCTIONS
  function installComponents () {
    if (utils.replaceScript('save.userData', 'UserData(tas).as')) {
      if (utils.replaceScript('controls.ControlsProvider', 'ControlsProvider(tas).as')) {
        utils.flashSmallMessage('TAS components successfully installed!', 'success')
      }
    }
  }

  function uninstallComponents () {
    if (utils.replaceScript('save.userData', 'UserData(vanilla).as')) {
      if (utils.replaceScript('controls.ControlsProvider', 'ControlsProvider(vanilla).as')) {
        utils.flashSmallMessage('TAS components successfully uninstalled!', 'success')
      }
    }
  }

  function runTas (shouldCompile) {
    if (!utils.pathExists(settings.get('otsPath'))) {
      utils.flashSmallMessage('Cannot run OTS since the path has not been set yet, please do so in the settings menu', 'danger')
    } else {
      let savefilesPath = settings.get('savefilesPath')
      let otsPath = settings.get('otsPath')

      if (shouldCompile) {
        if (!compileTas()) {
          return false
        }
      }

      if (templateSaveDropDown.selectedIndex !== 0) {
        for (let i = 0; i < 3; i++) {
          let slotPath = path.join(savefilesPath, `save${i}.dat`)
          if (utils.pathExists(slotPath)) {
            utils.deleteFile(slotPath)
          }
        }

        let savefile = templateSaveDropDown.saveFileData

        if (savefilesPath && savefile) {
          utils.writeToFile(path.join(savefilesPath, 'save0.dat'), iconv.decode(savefile, 'win1252'))
        }
      }

      try {
        shell.execSync(`taskkill /IM "${path.basename(otsPath)}"`)
      } catch (e) {}
      shell.exec(`"${otsPath}`)
    }
  }
  return {
    installComponents: installComponents,
    uninstallComponents: uninstallComponents,
    runTas: runTas
  }
})()
