/* global edit, utils, confirm */
let savefile = (function () {
  // VARIABLES
  let currentSaveFile = ''
  // EVENT DELEGATION
  // "PRIVATE" FUNCTIONS
  function tasToJson () {
    let tasObject = {
      'entries': [],
      'boss_frame': document.getElementById('boss-frame').value,
      'should_skip_dialogue': document.getElementById('cb-dialogue-skipping').checked,
      'dialogue_skip_frame': document.getElementById('skip-frame').value,
      'template-saves': '' // INSERT TEMPLATE SAVE HERE
    }

    let entries = document.querySelectorAll('.entry')

    for (let entryElement of entries) {
      let entryObject = {}

      if (entryElement.classList.contains('comment')) {
        entryObject.type = 'comment'
        entryObject.comment = entryElement.querySelector('.comment-input').value
      } else if (entryElement.classList.contains('action')) {
        entryObject.type = 'action'
        entryObject.frame = entryElement.querySelector('.frame-input').value
        entryObject.hor = entryElement.querySelector('.hor').value
        entryObject.ver = entryElement.querySelector('.ver').value
        entryObject.tele = entryElement.querySelector('.tele').checked
        entryObject.gauss = entryElement.querySelector('.gauss').checked
        entryObject.jump = entryElement.querySelector('.jump').checked
        entryObject.custom_jump = entryElement.querySelector('.custom-jump').value
      }
      tasObject.entries.push(entryObject)
    }

    return JSON.stringify(tasObject)
  }

  function jsonToTas (data) {
    edit.clearAll()

    var tasObject = JSON.parse(data)
    for (let entry of tasObject) {
      if (entry.type === 'comment') {
        edit.addCommentRow(entry.comment)
      } else if (entry.type === 'action') {
        let values = {
          '.frame-input': entry.frame,
          '.hor': entry.hor,
          '.ver': entry.ver,
          '.tele': entry.tele,
          '.gauss': entry.gauss,
          '.jump': entry.jump,
          '.custom-jump': entry.custom_jump
        }
        edit.addActionRow(values)
      }
    }

    document.getElementById('boss-frame').value = tasObject.boss_frame
    document.getElementById('skip-frame').value = tasObject.dialogue_skip_frame
    document.getElementById('cb-dialogue-skipping').checked = tasObject.should_skip_dialogue
    // load_template_saves(js_object['template-saves'])
  }

  // EXPOSED FUNCTIONS
  function save () {
    if (utils.writeToFile(currentSaveFile, tasToJson())) {
      utils.flashLargeMessage('Saved!')
    } else {
      saveAs()
    }
  }

  function saveAs () {
    let saveFilePath = utils.pathFromSaveDialog({
      filters: [
        { name: 'OTAS save file', extensions: ['otts'] },
        { name: 'All files', extensions: ['*'] }
      ]
    })

    if (saveFilePath === undefined) {
      console.log('You didn\'t save the file')
    } else {
      if (utils.writeToFile(saveFilePath, tasToJson())) {
        currentSaveFile = saveFilePath
        utils.flashLargeMessage('Saved!')
      } else {
        // FLASH ERROR MESSAGE
      }
    }
  }

  function loadFromFile () {
    let filePath = utils.getPathFromDialog({
      filters: [
        { name: 'OTAS save file', extensions: ['otts'] },
        { name: 'All files', extensions: ['*'] }
      ]
    })

    if (filePath === undefined) {
      console.log('No file selected')
    } else {
      let saveDate = utils.readFromFile(filePath)
      jsonToTas(saveDate)
      currentSaveFile = filePath
    }
  }

  function newFile () {
    if (currentSaveFile || document.getElementById('tas-table-tbody').children.length) {
      if (confirm('Are you sure you want to create a new file? \n(All unsaved changes will be lost)')) {
        currentSaveFile = ''
        edit.clearAll()
      }
    } else {
      edit.clearAll()
    }
  }

  return {
    save: save,
    saveAs: saveAs,
    loadFromFile: loadFromFile,
    newFile: newFile
  }
})()
