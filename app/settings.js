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
  var steamTab = document.getElementById('settings_tab_steam')
  settings.steam.otsPath = steamTab.querySelector('.ots_path').value
  settings.steam.savefilesPath = steamTab.querySelector('.savefile_path').value

  var itchTab = document.getElementById('settings_tab_itch')
  settings.itch.otsPath = itchTab.querySelector('.ots_path').value
  settings.itch.savefilesPath = itchTab.querySelector('.savefile_path').value

  settings.useWhichOts = document.getElementById('use_which_ots').value
  settings.ffdecPath = document.querySelector('.ffdec_path').value

  try {
    fs.outputJsonSync(settings_file, settings)
    $('#settings_modal').modal('hide');
  } catch (e) {
    // PROBABLY NEED TO NOT CLOSE MODAL AND SHOW ERROR IN SETTINGS MENU
    flash_message_small('Could not save settings!','error')
    console.log(e)
  }


}

function open_settings_menu() {
  var steamTab = document.getElementById('settings_tab_steam')

  if (fs.pathExistsSync(settings.steam.otsPath)) {
    steamTab.querySelector('.ots_path').value = settings.steam.otsPath
  }

  if (fs.pathExistsSync(settings.steam.savefilesPath)) {
    steamTab.querySelector('.savefile_path').value = settings.steam.savefilesPath
  }

  var itchTab = document.getElementById('settings_tab_itch')

  if (fs.pathExistsSync(settings.itch.otsPath)) {
    itchTab.querySelector('.ots_path').value = settings.itch.otsPath
  }

  if (fs.pathExistsSync(settings.steam.savefilesPath)) {
    itchTab.querySelector('.savefile_path').value = settings.itch.savefilesPath
  }

  if (fs.pathExistsSync(settings.ffdecPath)) {
    document.querySelector('.ffdec_path').value = settings.ffdecPath
  }

  use_which_ots.value = settings.useWhichOts

  settings_tab_steam.style.display = 'none'
  settings_tab_itch.style.display = 'none'
  document.getElementById('settings_tab_'+settings.useWhichOts).style.display = 'flex'

  $('#settings_modal').modal('show');
}

function settings_set_path(event) {
  let dialogOptions = {
    'ots_path' : {title:'Select the executable/app that runs OTS',filters: [{ name: 'OTS', extensions: ['exe','app'] },{ name: 'All files', extensions: ['*'] }]},
    'savefile_path' : {defaultpath:remote.app.getPath('appData'),title:'Select the folder that contains OTS\' savefiles',properties: ['openDirectory']},
    'ffdec_path' : {title:'Select either ffdec.bat for windows, or ffdec.sh for mac',filters: [{ name: 'FFDEC', extensions: ['bat','sh'] },{ name: 'All files', extensions: ['*'] }]}
  }

  let allowedExtensions = {
    'ots_path' : ['.exe','.app'],
    'ffdec_path' : ['.bat', '.sh']
  }

  if (event.target.getAttribute('data-action') === 'set-path') {
    let pathType = event.target.previousElementSibling.classList[0]
    let options = dialogOptions[pathType]
    let selectedPath = get_path_from_dialog(options)
    if (selectedPath && (!allowedExtensions.hasOwnProperty(pathType) || allowedExtensions[pathType].includes(path.parse(selectedPath).ext))) {
      event.target.previousElementSibling.value = selectedPath
    }
  }
}
