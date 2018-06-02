/* global dragula, $, win, settings_set_path */
$(function () {
  dragula([document.getElementById('tas-table-tbody')], {
    mirrorContainer: document.getElementById('tas-table-tbody-mirror'),
    revertOnSpill: true,
    moves: function (el, container, handle) {
      return handle.classList.contains('drag-handle')
    }
  })

  if (win.isMaximized()) {
    $('#menu_maximize').html('&#x1f5d7;')
  } else {
    $('#menu_maximize').html('&#x1f5d6;')
  }

  document.querySelector('.settings-container').addEventListener('click', settings_set_path)
})

let edit = (function () {
  // VARIABLES
  let templateActionRow = document.getElementById('template-action-row')
  let templateCommentRow = document.getElementById('template-comment-row')
  let tasTable = document.getElementById('tas-table-tbody')
  let defaultRowOptions = {
    '.frame-input': {
      'attribute': 'value',
      'value': '1'
    },
    '.hor': {
      'attribute': 'value',
      'value': 'none'
    },
    '.ver': {
      'attribute': 'value',
      'value': 'none'
    },
    '.tele': {
      'attribute': 'checked',
      'value': false
    },
    '.gauss': {
      'attribute': 'checked',
      'value': false
    },
    '.jump': {
      'attribute': 'checked',
      'value': false
    },
    '.custom-jump': {
      'attribute': 'value',
      'value': 'none'
    }
  }

  // EVENT DELEGATION
  tasTable.addEventListener('click', function (event) {
    let dataAction = event.target.getAttribute('data-action')
    let row = event.target.closest('tr')

    if (dataAction === 'duplicate') {
      duplicateRow(row)
    } else if (dataAction === 'delete') {
      deleteRow(row)
    }
  })

  tasTable.addEventListener('input', function (event) {
    let tagType = event.target.tagName
    if (tagType === 'SELECT') {
      event.target.classList.toggle('dropdown-action-selected', event.target.selectedIndex)
    }
  })

  // "PRIVATE" FUNCTIONS
  function createActionRow (options = defaultRowOptions) {
    let newRow = document.importNode(templateActionRow.content, true)

    for (let query in options) {
      let data = options[ query ]
      newRow.querySelector(query)[data.attribute] = data.value
    }

    let dropDowns = newRow.querySelectorAll('select')
    for (let dropDown of dropDowns) {
      dropDown.classList.toggle('dropdown-action-selected', dropDown.selectedIndex)
    }

    return newRow
  }

  function createCommentRow (comment = '') {
    let newRow = document.importNode(templateCommentRow.content, true)
    newRow.querySelector('.comment-input').value = comment

    return newRow
  }

  function duplicateRow (row) {
    let frameNumber = row.querySelector('.frame-input').value
    let options = Object.assign({}, defaultRowOptions, {'.frame-input': {'attribute': 'value', 'value': frameNumber}})
    let newRow = createActionRow(options)

    tasTable.insertBefore(newRow, row.nextSibling)
  }

  function deleteRow (row) {
    tasTable.deleteRow(row.rowIndex - 1) // Minus one to compensate for the header
  }

  // EXPOSED FUNCTIONS
  function addFramesBetween (start, end, delta) {
    let frameInputs = document.querySelectorAll('.action .frame-input')
    for (let frameInput of frameInputs) {
      let value = +frameInput.value
      if (value > start && value < end) {
        frameInput.value = (value + delta)
      }
    }
  }

  function addAction (options) {
    let newActionRow = createActionRow(options)

    tasTable.appendChild(newActionRow)
  }

  function addComment (comment) {
    let newCommentRow = createCommentRow(comment)
    tasTable.appendChild(newCommentRow)
  }

  return {
    addFramesBetween: addFramesBetween,
    addActionRow: addAction,
    addCommentRow: addComment
  }
})()
