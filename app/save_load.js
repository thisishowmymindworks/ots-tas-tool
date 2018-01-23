function tasToJSON() {
	var js_object = {'entries':[],'boss_frame':$('#boss_frame').val()};
	$(".entry").each(function() {
		var entry = {};
		if ($(this).hasClass('comment')) {
			entry.type = 'comment';
			entry.comment = $(this).find(".comment_input").val()
		} else {
			entry.type = 'action';
			entry.frame = $(this).find(".frame_input").val();
			entry.hor = $(this).find(".hor").val();
			entry.ver = $(this).find(".ver").val();
			entry.tele = $(this).find(".tele").prop('checked');
			entry.gauss = $(this).find(".gauss").prop('checked');
			entry.jump = $(this).find(".jump").prop('checked');
			entry.custom_jump = $(this).find(".custom_jump").val();
		}
		js_object.entries.push(entry);
	})
	return JSON.stringify(js_object);
}

function save() {
	if (write_to_file(current_save_file, tasToJSON())) {
		flash_message_large("Saved!")
	} else {
		saveAs();
	}
}

function saveAs() {
	dialog.showSaveDialog({ filters: [{ name: 'OTAS save file', extensions: ['otts'] },{ name: 'All files', extensions: ['*'] }]},(fileName) => {
		if (fileName === undefined){
			console.log("You didn't save the file");
			return;
		} else {
			if(write_to_file(fileName, tasToJSON())) {
				current_save_file = fileName;
				flash_message_large("Saved!")
			} else {
				// FLASH ERROR MESSAGE
			}
		}
	});
}

function jsonToTAS(data) {
	$("#sortable").find(".entry").remove();
	var js_object = JSON.parse(data);
	for (var i = 0; i<js_object.entries.length;i++) {
		var entry = js_object.entries[i];
		var row;
		if (entry.type == 'comment') {
			row = createComment(entry.comment)
		} else {
			row = createActionRow(entry.frame);
			$(row).find(".hor").val(entry.hor);
			$(row).find(".ver").val(entry.ver);
			$(row).find(".tele").prop('checked', entry.tele).checkboxradio("refresh");
			$(row).find(".gauss").prop('checked', entry.gauss).checkboxradio("refresh");
			$(row).find(".jump").prop('checked', entry.jump).checkboxradio("refresh");
			$(row).find(".custom_jump").val(entry.custom_jump);
		}
		$("#sortable").append(row)
	}
	$("#boss_frame").val(js_object['boss_frame'])
}

function loadFromFile() {
	dialog.showOpenDialog({ filters: [{ name: 'OTAS save file', extensions: ['otts'] },{ name: 'All files', extensions: ['*'] }]},(filepath) => {
		if(filepath === undefined || filepath[0] === undefined){
			console.log("No file selected");
			return;
		}

		fs.readFile(filepath[0], 'utf-8', (err, data) => {
			if(err){
				alert("An error ocurred reading the file :" + err.message);
				return;
			}
			jsonToTAS(data);
			current_save_file = filepath[0]
		});
	});
}

function newFile() {
	// NEEDS REWRITING (NEW, BUT NOT SAVED FILES WILL BE WIPED)
	// SHOULD PROBABLY ADD THE OPTION TO SAVE BEFORE CREATING NEW FILE
	// THEN YOU COULD SIMPLY RUN THE save() METHOD WHICH WILL RUN saveAS()
	// IF IT'S A BRAND NEW TAS
	if (current_save_file) {
		if (confirm("Are you sure you want to create a new file? \n(All unsaved changes will be lost)")) {
			current_save_file = ""
			$("#sortable").find(".entry").remove();
			$('#boss_frame').val("")
		} else {
			return;
		}
	} else {
		$("#sortable").find(".entry").remove();
		$('#boss_frame').val("")
	}
}
