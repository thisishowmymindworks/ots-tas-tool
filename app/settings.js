function load_settings() {
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
  let settingsObject = fs.readJsonSync(settings_file, { throws: false });

  if (settingsObject) {
    return Object.assign({}, settingsTemplate, settingsObject);
  }
  return settingsTemplate;
}

function save_settings() {
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
    fs.outputJsonSync(settings_file, settings)
    UIkit.modal(settings_modal).hide()
  } catch (e) {
    // PROBABLY NEED TO NOT CLOSE MODAL AND SHOW ERROR IN SETTINGS MENU
    flash_message_small('Could not save settings!','error')
    console.log(e)
  }


}

function open_settings_menu() {
  let steamTab = document.getElementById('settings-tab-steam')

  if (fs.pathExistsSync(settings.steam.otsPath)) {
    steamTab.querySelector('[data-path-type="otsPath"]').value = settings.steam.otsPath
  }

  if (fs.pathExistsSync(settings.steam.savefilesPath)) {
    steamTab.querySelector('[data-path-type="savefilePath"]').value = settings.steam.savefilesPath
  }

  let itchTab = document.getElementById('settings-tab-itch')

  if (fs.pathExistsSync(settings.itch.otsPath)) {
    itchTab.querySelector('[data-path-type="otsPath"]').value = settings.itch.otsPath
  }

  if (fs.pathExistsSync(settings.steam.savefilesPath)) {
    itchTab.querySelector('[data-path-type="savefilePath"]').value = settings.itch.savefilesPath
  }

  if (fs.pathExistsSync(settings.ffdecPath)) {
    document.querySelector('[data-path-type="ffdecPath"]').value = settings.ffdecPath
  }

  document.getElementById('use-which-ots').value = settings.useWhichOts

  steamTab.style.display = 'none'
  itchTab.style.display = 'none'
  document.getElementById('settings-tab-'+settings.useWhichOts).style.display = 'flex'

  UIkit.modal(settings_modal).show()
}

function settings_set_path(event) {
  let dialogOptions = {
    'otsPath' : {title:'Select the executable/app that runs OTS',filters: [{ name: 'OTS', extensions: ['exe','app'] },{ name: 'All files', extensions: ['*'] }]},
    'savefilePath' : {defaultpath:remote.app.getPath('appData'),title:'Select the folder that contains OTS\' savefiles',properties: ['openDirectory']},
    'ffdecPath' : {title:'Select either ffdec.bat for windows, or ffdec.sh for mac',filters: [{ name: 'FFDEC', extensions: ['bat','sh'] },{ name: 'All files', extensions: ['*'] }]}
  }

  let allowedExtensions = {
    'otsPath' : ['.exe','.app'],
    'ffdecPath' : ['.bat', '.sh']
  }

  if (event.target.getAttribute('data-action') === 'set-path') {
    let pathType = event.target.previousElementSibling.getAttribute('data-path-type')
    let options = dialogOptions[pathType]
    let selectedPath = get_path_from_dialog(options)
    if (selectedPath && (!allowedExtensions.hasOwnProperty(pathType) || allowedExtensions[pathType].includes(path.parse(selectedPath).ext))) {
      event.target.previousElementSibling.value = selectedPath
    }
  }
}
