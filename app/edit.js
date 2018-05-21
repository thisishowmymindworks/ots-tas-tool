$(function() {

	$("#sortable").sortable({items:"tr.entry",handle:".drag_handle"});
	$("#sortable").disableSelection();
	$(".frame_input, #boss_frame, #skip_frame").spinner({min: 1});
	try {
		$(".entry input[type=checkbox]").checkboxradio();
	} catch(e) {}

	if (win.isMaximized()) {
		$('#menu_maximize').html('&#x1f5d7;')
	} else {
		$('#menu_maximize').html('&#x1f5d6;')
	}

	document.querySelector('.settings_container').addEventListener('click', settings_set_path)
});


function add_frames_between(start, end, delta) {
	$('#sortable .action .frame_input').each(function() {
		var value = +this.value
		if (value > start && value < end) {
			this.value = value+delta
		}
	})
}

function createActionRow(frameNumber) {
	var row = $("<tr class='entry action'><td class='drag_handle' style='vertical-align:middle;'>☰</td></tr>")
	row.append("<td><input class='frame_input' value='" + frameNumber + "''></td>")
	row.append("<td><select class='form-control hor'><option value='none'>None</option><option value='-1'>Left</option><option value='1'>Right</option><option value='0'>Stop</option></select></td>")
	row.append("<td><select class='form-control ver'><option value='none'>None</option><option value='-1'>Up</option><option value='1'>Down</option><option value='0'>Stop</option></select></td>")
	row.append("<td><label><input class='tele' type='checkbox' value='true'></label></td><td><label><input class='gauss' type='checkbox' value='true'></label></td><td><label><input class='jump' type='checkbox' value='true'></label></td>")
	row.append("<td><select class='form-control custom_jump'><option value='none'>None</option><option value='true'>Start</option><option value='false'>Stop</option></select></td>")
	row.append("<td style='vertical-align:middle;'><i onclick='duplicate(this)' class='glyphicon glyphicon-duplicate button'></i><i onclick='remove(this)' style='color:darkred;' class='glyphicon glyphicon-remove button'></i></td>")
	row.find(".frame_input").spinner({min: 1});
	row.find("input[type=checkbox]").checkboxradio();
	row.find("select").change(function() {
		$(this).toggleClass('dropdownActionSelected', $(this).val() != 'none')
	})
	return row;
}

function duplicate(btn) {
	var oldRow = $(btn).parent().parent()
	var row = createActionRow(oldRow.find(".frame_input").val());
	row.insertAfter(oldRow)
}

function addAction() {
	$("#sortable").append(createActionRow(1))
}

function createComment(comment) {
	var row = $("<tr class='entry comment'><td class='drag_handle' style='vertical-align:middle;'>☰</td></tr>")
	row.append("<td colspan='7'><input class='comment_input form-control' value='" +comment+ "'></td>")
	row.append("<td style='vertical-align:middle;'><i onclick='remove(this)' style='color:darkred;' class='glyphicon glyphicon-remove button'></i></td>")
	return row;
}

function addComment() {
	var row = createComment('');
	$("#sortable").append(row)
}

function remove(btn) {
	var row = $(btn).parent().parent();
	row.remove();
}

function toggle_dialogue_skipping() {
	var checked = $("#cb_dialogue_skipping")[0].checked;
	if (checked) {
		$('span.skipping + span.ui-spinner').animate({width:'100px'})
	} else {
		$('span.skipping + span.ui-spinner').animate({width:'0'})
	}
}
