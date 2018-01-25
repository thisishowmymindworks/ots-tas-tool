function load_settings() {
  var settings_object = fs.readJsonSync(settings_file, { throws: false });

  if (settings_object) {
    if (!settings_object['ots-version']) {
      settings_object['ots-version'] = 'steam';
    }
    return settings_object;
  }
  return {'ots-path':'','ffdec-path':'','templatesave-path':'','ots-version':'steam'}
}

function save_settings() {
  // UPDATE SETTINGS AND WRITE TO FILE
  settings['ots-path'] = $('#settings_ots_path').val();
  settings['ffdec-path'] = $('#settings_ffdec_path').val();
  settings['ots-version'] = $('input[name=ots_version]:checked').val();

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
  if (fs.pathExistsSync(settings['ots-path'])) {
    $('#settings_ots_path').val(settings['ots-path'])
  }

  if (fs.pathExistsSync(settings['ots-path'])) {
    $('#settings_ffdec_path').val(settings['ffdec-path'])
  }

  $('input[name=ots_version][value=' + settings['ots-version'] + ']').prop('checked', true);

  $('#settings_modal').modal('show');
}


function set_ots_path() {
  var ots_path = get_path_from_dialog({title:'Select the executable/app that runs OTS',filters: [{ name: 'OTS', extensions: ['exe','app'] },{ name: 'All files', extensions: ['*'] }]})
  if (ots_path && path.parse(ots_path).ext == '.exe') {
    $('#settings_ots_path').val(ots_path)
  } else {
    // CREATE SOME WAY TO SHOW ERRORS IN THE SETTINGS MENU
  }
}

function set_ffdec_path() {
  var ffdec_path = get_path_from_dialog({title:'Select either ffdec.bat for windows, or ffdec.sh for mac',filters: [{ name: 'FFDEC', extensions: ['bat','sh'] },{ name: 'All files', extensions: ['*'] }]})
  if (ffdec_path && (path.parse(ffdec_path).ext == '.sh' || path.parse(ffdec_path).ext == '.bat')) {
    $('#settings_ffdec_path').val(ffdec_path)
  }
}
