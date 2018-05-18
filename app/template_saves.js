function template_saves_edit_click() {
  var table = document.getElementById("template_savefiles_table");
  table.getElementsByTagName("tbody")[0].innerHTML = table.rows[0].innerHTML;

  var template_saves = template_saves_to_list()
  for (var i in template_saves) {
    let name = template_saves[i]['name']
    let data = template_saves[i]['savefile']
    create_template_save_table_row(table, name, data)
  }
  $('#template_save_modal').modal('show');
}

function template_saves_save_changes() {
  var savelist = [];
  $('#template_savefiles_table').find('input').each(function(i) {
    savelist.push({'name':this.value, 'savefile':$(this).data('savefile')})
  })
  load_template_saves(savelist);
  $('#template_save_modal').modal('hide');
  return;
}

function create_template_save_table_row(table, name, data) {
  var row = table.insertRow();
  $(row.insertCell()).append($('<input class="form-control" value="' + name + '">').data('savefile', data));
  row.insertCell().innerHTML = '<a class="button" onclick="set_or_change_templatesave(this)">Set/Change</a>';
  row.insertCell().innerHTML = '<i style="color:darkred;" onclick="remove_template_save(this)" class="glyphicon glyphicon-remove button"></i>'
}

function set_or_change_templatesave(button) {
  var path = get_path_from_dialog({defaultpath:'save0.dat',title:'Select savefile to add',filters: [{ name: 'OTS savefile', extensions: ['dat'] },{ name: 'All files', extensions: ['*'] }]})
  if (path) {
    console.log(path)
    let input = $(button).closest('tr').find('input')
    let savefile = [...read_from_file(path)]
    input.data('savefile', savefile)
  }
}

function add_template_save() {
  create_template_save_table_row(template_savefiles_table, '', [])
}

function remove_template_save(button) {
  template_savefiles_table.deleteRow($(button).closest('tr')[0].rowIndex)
}

function load_template_saves(save_list) {
	var ddl = document.getElementById('ddl_template_save')
	ddl.innerHTML = ""
	ddl.add(new Option('None', 'none'))
	ddl.add(new Option('Clear', 'clear'))
	if (save_list) {
		for (let template_save of save_list) {
			var opt = new Option(template_save['name'], template_save['name'])
			$(opt).data('savefile',template_save['savefile'])
			ddl.add(opt)
		}
	}
	return;
}

function template_saves_to_list() {
	var save_list = []
  var options = document.getElementById('ddl_template_save').options
	for (let opt of options) {
		if (opt.index < 2) {
			continue;
		}
		save_list.push({'name':opt.value, 'savefile': $(opt).data('savefile')})
	}
	return save_list
}
