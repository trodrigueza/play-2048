export function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function addRandom(board) {
  const n = Math.sqrt(board.length)
  const emptyCells = []
  for (let i = 0; i < n * n; i++) {
    if (board[i] === null) {
      emptyCells.push(i)
    }
  }
  const i = emptyCells[getRandomInt(0, emptyCells.length - 1)]
  const newBoard = board.slice()
  newBoard[i] = Math.random() > 0.1 ? 2 : 4
  return newBoard
}

export function initializeBoard(n) {
  const board = Array(n * n).fill(null);
  const i1 = getRandomInt(0, n * n - 1);
  let i2 = getRandomInt(0, n * n - 1);
  while (i1 === i2) {
    i2 = getRandomInt(0, n * n - 1);
  }
  board[i1] = Math.random() > 0.1 ? 2 : 4;
  board[i2] = Math.random() > 0.1 ? 2 : 4;
  return board;
}

export function moveLeft(board) {
  const n = Math.sqrt(board.length)
  let score = 0
  let newBoard = []
  for (let i = 0; i < n; i++) {
    const row = board.slice(i * n, i * n + n)
    let newRow = []
    for (let j = 0; j < n; j++) {
      if (row[j] !== null) {
        newRow.push(row[j])
      }
    }
    for (let j = 0; j < newRow.length - 1; j++) {
      if (newRow[j] === newRow[j + 1]) {
        newRow[j] *= 2
        newRow[j + 1] = null
        score += newRow[j]
      }
    }
    newRow = newRow.filter((value) => value !== null)
    if (newRow.length < n) {
      newRow = newRow.concat(Array(n - newRow.length).fill(null))
    }
    newBoard = newBoard.concat(newRow)
  }
  return [newBoard, score]
}

export function moveRight(board) {
  const n = Math.sqrt(board.length)
  let score = 0
  let newBoard = []
  for (let i = 0; i < n; i++) {
    const row = board.slice(i * n, i * n + n)
    let newRow = []
    for (let j = 0; j < n; j++) {
      if (row[j] !== null) {
        newRow.push(row[j])
      }
    }
    for (let j = newRow.length - 1; j > 0; j--) {
      if (newRow[j] === newRow[j - 1]) {
        newRow[j] *= 2
        newRow[j - 1] = null
        score += newRow[j]
      }
    }
    newRow = newRow.filter((value) => value !== null)
    if (newRow.length < n) {
      newRow = Array(n - newRow.length).fill(null).concat(newRow)
    }
    newBoard = newBoard.concat(newRow)
  }
  return [newBoard, score]
}

export function moveUp(board) {
  const n = Math.sqrt(board.length)
  let score = 0
  let newBoard = Array(n * n).fill(null)
  for (let i = 0; i < n; i++) {
    let column = []
    for (let j = 0; j < n; j++) {
      if (board[j * n + i] !== null) {
        column.push(board[j * n + i])
      }
    }
    for (let j = 0; j < column.length - 1; j++) {
      if (column[j] === column[j + 1]) {
        column[j] *= 2
        column[j + 1] = null
        score += column[j]
      }
    }
    column = column.filter((value) => value !== null)
    if (column.length < n) {
      column = column.concat(Array(n - column.length).fill(null))
    }
    for (let j = 0; j < n; j++) {
      newBoard[j * n + i] = column[j]
    }
  }
  return [newBoard, score]
}

export function moveDown(board) {
  const n = Math.sqrt(board.length)
  let score = 0
  let newBoard = Array(n * n).fill(null)
  for (let i = 0; i < n; i++) {
    let column = []
    for (let j = 0; j < n; j++) {
      if (board[j * n + i] !== null) {
        column.push(board[j * n + i])
      }
    }
    for (let j = column.length - 1; j > 0; j--) {
      if (column[j] === column[j - 1]) {
        column[j] *= 2
        column[j - 1] = null
        score += column[j]
      }
    }
    column = column.filter((value) => value !== null)
    if (column.length < n) {
      column = Array(n - column.length).fill(null).concat(column)
    }
    for (let j = 0; j < n; j++) {
      newBoard[j * n + i] = column[j]
    }
  }
  return [newBoard, score]
}

export function checkOnGoing(board) {
  const n = Math.sqrt(board.length)
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (board[i * n + j] === null) {
        return true
      }
      if (j > 0 && board[i * n + j] === board[i * n + j - 1]) {
        return true
      }
      if (j < n - 1 && board[i * n + j] === board[i * n + j + 1]) {
        return true
      }
      if (i > 0 && board[i * n + j] === board[(i - 1) * n + j]) {
        return true
      }
      if (i < n - 1 && board[i * n + j] === board[(i + 1) * n + j]) {
        return true
      }
    }
  }
  return false
}

export function areProbablyJsonIsomorphic(a1, a2) {
  /* 
     Returns whether obj1 is isomorphic to obj2; that is
      the tree of lists [..] and objects {..} have,
      branch-by-branch, recursively identical values,
      after the processing done by the JSON.stringify spec,
      https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#description
                
     WARNINGS:
       1) any propName:propVal must have been created with
          their fields defined in the same order
       2) - does not support Sets or Maps, 
          - is confused by Functions and Symbols, 
          - is confused by undefined and non-own and 
             non-enumerable properties, 
          - collapses sparse arrays, 
          - considers null and +/-Infinity and undefined 
             to be the same when in an Array, 
          - can be tricked with .toJson() methods, 
          and other and future things noted in the above link
          dependent on the ECMAScript version running
  */
  return JSON.stringify(a1) == JSON.stringify(a2);
}