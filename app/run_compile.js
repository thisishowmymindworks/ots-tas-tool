function compile_to_json() {
	var tas = {
		"up_down": {},
		"left_right": {},
		"jump": {},
		"teleshot": {},
		"gauss": {},
		"boss_frame": 9999999999,
		"skip_frame": 9999999999,
		"max_frame": 1}


	$(".action").each(function() {
		var frame = $(this).find(".frame_input").val();
		if (tas["max_frame"]<+frame) {
			tas["max_frame"] = +frame
		}
		if ($(this).find(".hor").val() != 'none') {
			tas["left_right"][frame] = +$(this).find(".hor").val();
		}
		if ($(this).find(".ver").val() != 'none') {
			tas["up_down"][frame] = +$(this).find(".ver").val();
		}
		if ($(this).find(".tele").prop('checked')) {
			tas["teleshot"][frame] = true;
		}
		if ($(this).find(".gauss").prop('checked')) {
			tas["gauss"][frame] = true;
		}
		if ($(this).find(".jump").prop('checked')) {
			tas["jump"][frame] = true;
			tas["jump"][""+(+frame+25)] = false;
		}
		if ($(this).find(".custom_jump").val() != 'none') {
			tas["jump"][frame] = JSON.parse($(this).find(".custom_jump").val());
		}
	})
	if ($("#boss_frame").val() && +$("#boss_frame").val()>0) {
		tas["boss_frame"] = +$("#boss_frame").val()

		if (tas["max_frame"] < (+tas["boss_frame"]+200)) {
			tas["max_frame"] = (+tas["boss_frame"]+200)
		}
	}

	if ($('#cb_dialogue_skipping')[0].checked && ($("#skip_frame").val())) {
		tas["skip_frame"] = +$("#skip_frame").val()
	}

	return tas;
}

function compile_tas() {
	if (!fs.existsSync(settings['ots-path'])) {
		flash_message_small('Cannot compile tas since the OTS path has not been set, please do so in the settings menu','error')
		return;
	}

	try {
		fs.outputJsonSync(path.join(settings['ots-path'], '..','/tas/otas.json'), compile_to_json())
		return true;
	} catch (e) {
		flash_message_small('Error saving the TAS to file.','error')
		console.log(e)
		return false
	}

}

function runTAS(should_compile) {
	if (!fs.existsSync(settings['ots-path'])) {
		flash_message_small('Cannot run OTS since the path has not been set, please do so in the settings menu','error')
		return
	}

	if (should_compile) {
		if (!compile_tas()) {
			return false;
		}
	}

	if (settings['clear-saves']) {
		for (var i = 0;i<3;i++) {
			var slot_path = path.join(settings['savefiles-path'], 'save'+i+'.dat');
			if (fs.existsSync(slot_path)) {
				fs.removeSync(slot_path);
			}
		}
	}

	if (settings['insert-template']) {
		if (fs.existsSync(path.join(settings['savefiles-path'], 'save3.dat'))) {
			fs.copySync(path.join(settings['savefiles-path'], 'save3.dat'), path.join(settings['savefiles-path'], 'save0.dat'))
		}
	}

	try {
		shell.execSync('taskkill /IM \"' + settings['ots-path'] + '\"');
	}
	catch (e) {}
	shell.exec('\"' + settings['ots-path'] + '\"')
}

function install_components() {
	if (replace_script('save.UserData', path.join(scripts_dir, settings['ots-version'], 'UserData(tas).as'))) {
		if (replace_script('controls.ControlsProvider', path.join(scripts_dir, settings['ots-version'], 'ControlsProvider(tas).as'))) {
			flash_message_small('TAS components successfully installed!','success')
			return;
		}
	}
}

function uninstall_components() {
	if (replace_script('save.UserData', path.join(scripts_dir, settings['ots-version'], 'UserData(vanilla).as'))) {
		if (replace_script('controls.ControlsProvider', path.join(scripts_dir, settings['ots-version'], 'ControlsProvider(vanilla).as'))){
			flash_message_small('TAS components successfully uninstalled!','success')
			return;
		}
	}
}
