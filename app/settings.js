function load_settings() {
  var settings_str = '';
  try {
    settings_str = read_from_file(settings_file)
  } catch (e) {}

  if (settings_str) {
    try {
      return JSON.parse(settings_str)
    } catch (e) {
      flash_message_small('Could not load settings!')
    }
  }
  return {'ots-path':'','ffdec-path':'','templatesave-path':''}
}

function save_settings() {
  if (settings) {
    write_to_file(settings_file, JSON.stringify(settings))
  } else {
    flash_message_small('Could not save settings!','error')
  }
  update_settings_menu()
}

function update_settings_menu() {
  // OTS PATH MENU ITEM
  if (fs.existsSync(settings['ots-path'])) {
    $('#ots_path_menu_item').html('Change OTS path <span class="glyphicon glyphicon-ok"></span>')
  } else {
    $('#ots_path_menu_item').html('Set OTS path <span class="glyphicon glyphicon-remove"></span>')
  }

  // FFDEC PATH MENU ITEM
  if (fs.existsSync(settings['ffdec-path'])) {
    $('#ffdec_path_menu_item').html('Change ffdec path <span class="glyphicon glyphicon-ok"></span>')
  } else {
    $('#ffdec_path_menu_item').html('Set ffdec path <span class="glyphicon glyphicon-remove"></span>')
  }

  // TEMPLATE SAVE FIlE
  if (fs.existsSync(settings['templatesave-path'])) {
    $('#savefile_path_menu_item').html('Change template save path&nbsp;&nbsp;<span class="glyphicon glyphicon-ok"></span>')
  } else {
    $('#savefile_path_menu_item').html('Set template save path&nbsp;&nbsp;<span class="glyphicon glyphicon-remove"></span>')
  }

  // CLEAR SAVE FILE
  $('#cb_clear_saves').prop('checked', settings['clear-saves'])
  $('#cb_template_save').prop('disabled', !settings['clear-saves'])
  $('#template_save_path_menu_item').toggleClass('disabled-link', !settings['clear-saves'])

  // INSERT TEMPLATE Save
  $('#cb_template_save').prop('checked', settings['use-template-save'])
}

function set_ots_path() {
  var ots_path = get_path_from_dialog({title:'Select the executable/app that runs OTS',filters: [{ name: 'OTS', extensions: ['exe','app'] },{ name: 'All files', extensions: ['*'] }]})
  if (ots_path) {
    if (path.parse(ots_path).ext == '.exe') {
      settings['ots-path'] = ots_path
      if (!fs.existsSync(path.join(settings['ots-path'],'..','/tas'))) {
        fs.mkdirSync(path.join(settings['ots-path'],'..','/tas'))
      }
      save_settings()
    } else {
      flash_message_small('That\'s not an exe file! Please select the executable file that runs Out There Somewhere.','warning')
    }
  }
}

function set_ffdec_path() {
  var ffdec_path = get_path_from_dialog({title:'Select either ffdec.bat for windows, or ffdec.sh for mac',filters: [{ name: 'FFDEC', extensions: ['bat','sh'] },{ name: 'All files', extensions: ['*'] }]})
  if (ffdec_path) {
    if (path.parse(ffdec_path).ext == '.sh' || path.parse(ffdec_path).ext == '.bat') {
      settings['ffdec-path'] = ffdec_path
      save_settings()
    } else {
      flash_message_small('That\'s not the correct file, please select ffdec.bat for windows, and ffdec.sh for linux/mac.','warning')
    }
  }
}

function toggle_clear_saves(e) {
  e.stopPropagation();
  $('#cb_clear_saves').prop('checked', !$('#cb_clear_saves').prop('checked'))
  $('#cb_template_save').prop('disabled', !$('#cb_clear_saves').prop('checked'))
  $('#template_save_path_menu_item').toggleClass('disabled-link', !$('#cb_clear_saves').prop('checked'))
  settings['clear-saves'] = $('#cb_clear_saves').prop('checked')
  save_settings()
}

function toggle_template_save(e) {
  e.stopPropagation();
  if ($('#template_save_path_menu_item').hasClass('disabled-link')) {
    return
  }
  $('#cb_template_save').prop('checked', !$('#cb_template_save').prop('checked'))
  settings['use-template-save'] = $('#cb_template_save').prop('checked')
  save_settings()
}
