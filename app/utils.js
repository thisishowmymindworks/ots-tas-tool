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
const readonly_scripts_dir = path.join(__dirname, '\\..\\files\\scripts')
const scripts_dir = path.join(remote.app.getPath('userData'), '\\scripts')
var current_save_file = "";
//var settings = load_settings();
copy_script_files()

let utils = (function () {
  // VARIABLES
  // EVENT DELEGATION
  // "PRIVATE" FUNCTIONS
  // EXPOSED FUNCTIONS
  function readJson (path, options) {
    return fs.readJsonSync(path, options)
  }

  function outputJson (path, data) {
    return fs.outputJsonSync(path, data)
  }

  function pathExists (path) {
    return fs.pathExistsSync(path)
  }

  function getPathFromDialog (filters) {
    var pathArray = dialog.showOpenDialog(filters)
    if (pathArray === undefined) {
      return false
    } else {
      return pathArray[0]
    }
  }
  return {
    readJson: readJson,
    outputJson: outputJson,
    pathExists: pathExists,
    pathFromDialog: getPathFromDialog
  }
})()

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
  fs.copySync(readonly_scripts_dir, scripts_dir);
}

function exit() {
  if (confirm("Are you sure you want to exit? \n(All unsaved changes will be lost)")) {
    window.close()
  }
}

function replace_script(class_name, script_file) {
  if (!fs.existsSync(path.join(settings[settings['useWhichOts']]['otsPath'],'..','ots.swf')) || !fs.existsSync(settings['ffdecPath'])) {
    flash_message_small('OTS and/or ffdec path has not been set, please do so in the settings menu','warning')
    return false;
  }
  var ots_swf_path = path.join(settings[settings['useWhichOts']]['otsPath'],'..','ots.swf')
  try {
    var cmd = '\"' + [settings['ffdecPath'], '-replace', ots_swf_path, ots_swf_path,  class_name, script_file].join('\" \"') + '\"'
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
    fs.writeFileSync(path, iconv.encode(data,'win1252'))
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
