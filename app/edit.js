/* global dragula, $, win */
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

  // document.querySelector('.settings-container').addEventListener('click', settings_set_path)
})

let edit = (function () {
  // VARIABLES
  let templateActionRow = document.getElementById('template-action-row')
  let templateCommentRow = document.getElementById('template-comment-row')
  let tasTable = document.getElementById('tas-table-tbody')
  let actionRowAttributes = {
    '.frame-input': 'value',
    '.hor': 'value',
    '.ver': 'value',
    '.tele': 'checked',
    '.gauss': 'checked',
    '.jump': 'checked',
    '.custom-jump': 'value'
  }

  let defaultActionRowValues = {
    '.frame-input': '1',
    '.hor': 'none',
    '.ver': 'none',
    '.tele': false,
    '.gauss': false,
    '.jump': false,
    '.custom-jump': 'none'
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
  function createActionRow (values = defaultActionRowValues) {
    let newRow = document.importNode(templateActionRow.content, true)

    for (let query in values) {
      let data = values[query]
      newRow.querySelector(query)[actionRowAttributes[query]] = data
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
    let options = Object.assign({}, defaultActionRowValues, {'.frame-input': frameNumber})
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

  function addAction (values) {
    let newActionRow = createActionRow(values)

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
