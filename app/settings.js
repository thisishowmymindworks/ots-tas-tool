/* global utils, path, remote, UIkit */
let settings = (function () {
  // VARIABLES
  let settings = {}
  let settingsPath = path.join(remote.app.getPath('userData'), '\\otas.settings')
  let settingsContainer = document.querySelector('.settings-container')
  let settingsModal = document.getElementById('settings-modal')
  let dialogOptions = {
    'otsPath': {
      title: 'Select the executable/app that runs OTS',
      filters: [
        { name: 'OTS', extensions: ['exe', 'app'] },
        { name: 'All files', extensions: ['*'] }
      ]
    },
    'savefilePath': {
      defaultpath: remote.app.getPath('appData'),
      title: 'Select the folder that contains OTS\'s savefiles',
      properties: ['openDirectory']
    },
    'ffdecPath': {
      title: 'Select either ffdec.bat for windows, or ffdec.sh for mac',
      filters: [
        { name: 'FFDEC', extensions: ['bat', 'sh'] },
        { name: 'All files', extensions: ['*'] }
      ]
    }
  }
  let allowedExtensions = {
    'otsPath': ['.exe', '.app'],
    'ffdecPath': ['.bat', '.sh']
  }
  // EVENT DELEGATION
  settingsContainer.addEventListener('click', function (event) {
    if (event.target.getAttribute('data-action') === 'set-path') {
      let pathType = event.target.previousElementSibling.getAttribute('data-path-type')
      let options = dialogOptions[pathType]
      let selectedPath = utils.pathFromDialog(options)
      if (selectedPath && (!allowedExtensions.hasOwnProperty(pathType) || allowedExtensions[pathType].includes(path.parse(selectedPath).ext))) {
        event.target.previousElementSibling.value = selectedPath
      }
    }
  })
  // "PRIVATE" FUNCTIONS
  // EXPOSED FUNCTIONS
  function loadSettings () {
    let settingsTemplate = {
      'steam': {
        'otsPath': '',
        'savefilesPath': ''
      },
      'itch': {
        'otsPath': '',
        'savefilesPath': ''
      },
      'ffdecPath': '',
      'useWhichOts': 'steam'
    }
    let settingsObject = utils.readJson(settingsPath, { throws: false })

    settings = Object.assign({}, settingsTemplate, settingsObject)
  }

  function saveSettings () {
    // UPDATE SETTINGS AND WRITE TO FILE
    var steamTab = document.getElementById('settings-tab-steam')
    settings.steam.otsPath = steamTab.querySelector('[data-path-type="otsPath"]').value
    settings.steam.savefilesPath = steamTab.querySelector('[data-path-type="savefilePath"]').value

    var itchTab = document.getElementById('settings-tab-itch')
    settings.itch.otsPath = itchTab.querySelector('[data-path-type="otsPath"]').value
    settings.itch.savefilesPath = itchTab.querySelector('[data-path-type="savefilePath"]').value

    settings.useWhichOts = document.getElementById('use-which-ots').value
    settings.ffdecPath = document.querySelector('[data-path-type="ffdecPath"]').value

    try {
      utils.outputJson(settingsPath, settings)
      UIkit.modal(settingsModal).hide()
    } catch (e) {
      // PROBABLY NEED TO NOT CLOSE MODAL AND SHOW ERROR IN SETTINGS MENU
      // flash_message_small('Could not save settings!', 'error')
      console.log(e)
    }
  }

  function openSettingsMenu () {
    let steamTab = document.getElementById('settings-tab-steam')

    if (utils.pathExists(settings.steam.otsPath)) {
      steamTab.querySelector('[data-path-type="otsPath"]').value = settings.steam.otsPath
    }

    if (utils.pathExists(settings.steam.savefilesPath)) {
      steamTab.querySelector('[data-path-type="savefilePath"]').value = settings.steam.savefilesPath
    }

    let itchTab = document.getElementById('settings-tab-itch')

    if (utils.pathExists(settings.itch.otsPath)) {
      itchTab.querySelector('[data-path-type="otsPath"]').value = settings.itch.otsPath
    }

    if (utils.pathExists(settings.steam.savefilesPath)) {
      itchTab.querySelector('[data-path-type="savefilePath"]').value = settings.itch.savefilesPath
    }

    if (utils.pathExists(settings.ffdecPath)) {
      document.querySelector('[data-path-type="ffdecPath"]').value = settings.ffdecPath
    }

    document.getElementById('use-which-ots').value = settings.useWhichOts

    steamTab.style.display = 'none'
    itchTab.style.display = 'none'
    document.getElementById('settings-tab-' + settings.useWhichOts).style.display = 'flex'

    UIkit.modal(settingsModal).show()
  }

  function getSetting (settingKey) {
    return settings[settingKey] || settings[settings['useWhichOts']][settingKey]
  }

  loadSettings()
  return {
    load: loadSettings,
    save: saveSettings,
    openMenu: openSettingsMenu,
    get: getSetting
  }
})()
