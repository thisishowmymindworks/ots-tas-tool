// PACKAGES
window.$ = window.jQuery = require('jquery');
require('jquery-mousewheel')($);
const path = require('path')
const remote = require('electron').remote;
const dialog = remote.dialog;
const fs = require('fs');
const shell = require('child_process');


// GLOBAL VARS
const win = remote.getCurrentWindow();
const settings_file = path.join(remote.app.getPath('userData'),'\\otas.settings')
const readonly_scripts_dir = path.join(__dirname, '\\..\\files')
const scripts_dir = path.join(remote.app.getPath('userData'), '\\scripts')
var current_save_file = "";
var settings = load_settings();
update_settings_menu()
copy_script_files()

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

function copy_script_files() {
  var script_files = ['UserData(vanilla).as', 'UserData(tas).as','ControlsProvider(vanilla).as','ControlsProvider(tas).as']
  if (!fs.existsSync(scripts_dir)) {
    fs.mkdirSync(scripts_dir)
    for (var i = 0;i<script_files.length;i++) {
      copy_file(path.join(readonly_scripts_dir,script_files[i]),path.join(scripts_dir,script_files[i]))
    }
  }
}

function exit() {
  if (confirm("Are you sure you want to exit? \n(All unsaved changes will be lost)")) {
    window.close()
  }
}

function replace_script(class_name, script_file) {
  if (!fs.existsSync(path.join(settings['ots-path'],'..','ots.swf')) || !fs.existsSync(settings['ffdec-path'])) {
    flash_message_small('OTS and/or ffdec path has not been set, please do so in the settings menu','warning')
    return false;
  }
  var ots_swf_path = path.join(settings['ots-path'],'..','ots.swf')
  try {
    var cmd = '\"' + [settings['ffdec-path'], '-replace', ots_swf_path, ots_swf_path,  class_name, script_file].join('\" \"') + '\"'
    shell.execSync(cmd)
    return true;
  } catch (e) {
    // HANDLE ERROR!
    flash_message_small('Could not replace script! See the console (f12) for the full error message')
    console.log(e)
    return false;
  }
}

function read_from_file(path) {
  if (path && fs.statSync(path).isFile()) {
    try {
      return fs.readFileSync(path)
    } catch (e) {
      // HANDLE ERROR!
      return false;
    }
  } else {
    return false;
  }
}

function write_to_file(path, data) {
  try {
    fs.writeFileSync(path, data)
    return true;
  } catch (e) {
    // HANDLE ERROR!
    return false;
  }
}

function get_path_from_dialog(filters) {
  var path_array = dialog.showOpenDialog(filters);
  if (path_array === undefined) {
    return false
  } else {
    return path_array[0]
  }
}

function flash_message_large(msg) {
  $("#flash_container_large").show()
  $("#flash_message_large").html(msg).fadeIn("slow")
  setTimeout(function() {$("#flash_container_large, #flash_message_large").fadeOut("fast")},1000)
}

function flash_message_small(msg, css_class) {
  $('#small_message').html(msg)
  $('#small_message_container').removeClass().slideDown()
  if (css_class !== undefined) {
    $('#small_message_container').addClass(css_class)
  }
}

function copy_file(path_from, path_to) {
  try {
    var data = read_from_file(path_from)
    write_to_file(path_to, data)
  } catch (e) {
    flash_message_small('Failed to copy file ' + path_from +' to ' + path_to +'. Press f12 to see the full error text')
    console.log("Error \n" + e)
  }
}
