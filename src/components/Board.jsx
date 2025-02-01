import { useEffect, useState } from 'react'
import { PropTypes } from 'prop-types'
import { Tile } from './Tile'
import { Score } from './Score'
import { initializeBoard, addRandom, moveUp, moveDown, moveLeft, moveRight, areProbablyJsonIsomorphic, checkOnGoing } from '../logic'
// import { BOARD } from '../constants'

export function Board({ n = 4 }) {
  const initialBoard = initializeBoard(n);
  const [score, setScore] = useState(() => {
    const savedScore = window.localStorage.getItem('score')
    return savedScore ? JSON.parse(savedScore) : 0
  })

  const [bestScore, setBestScore] = useState(() => {
    const savedBestScore = window.localStorage.getItem('bestScore')
    return savedBestScore ? JSON.parse(savedBestScore) : 0
  })

  const [onGoing, setOnGoing] = useState(() => {
    const savedOnGoing = window.localStorage.getItem('onGoing')
    return savedOnGoing ? JSON.parse(savedOnGoing) : "1"
  })

  const [board, setBoard] = useState(() => {
    const savedBoard = window.localStorage.getItem('board')
    return savedBoard ? JSON.parse(savedBoard) : initialBoard
  })

  const resetGame = () => {
    setBestScore(Math.max(score, bestScore))
    setBoard(initializeBoard(n))
    setScore(0)
    setOnGoing(true)
    window.localStorage.removeItem('board')
    window.localStorage.removeItem('score')
    window.localStorage.removeItem('onGoing')
  }

  useEffect(() => {
    window.localStorage.setItem('board', JSON.stringify(board))
    window.localStorage.setItem('score', JSON.stringify(score))
    window.localStorage.setItem('bestScore', JSON.stringify(bestScore))
    window.localStorage.setItem('onGoing', JSON.stringify(onGoing))

    if (!checkOnGoing(board)) {
      setOnGoing("2")
    }
  }, [board, score, bestScore, onGoing])

  useEffect(() => {
    const handleKeyDown = (event) => {
      let newBoard = board.slice()
      let newScore = 0
      switch (event.key) {
        case 'ArrowUp':
          [newBoard, newScore] = moveUp(board)
          break
        case 'ArrowDown':
          [newBoard, newScore] = moveDown(board)
          break
        case 'ArrowLeft':
          [newBoard, newScore] = moveLeft(board)
          break
        case 'ArrowRight':
          [newBoard, newScore] = moveRight(board)
          break
        default:
          break
      }
      if (areProbablyJsonIsomorphic(board, newBoard)) {
        return
      }

      newBoard = addRandom(newBoard)
      setBoard(newBoard)
      setScore(score + newScore)
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  })
  const buttonText = onGoing == "1" ? "Reset" : "Play Again"
  return (
    <main className="board">
      <h1>2048</h1>
      <Score score={score} bestScore={bestScore} />
      <section className="game">
        {
          board.map((value, index) => {
            return (
              <Tile
                key={index}
                value={value}
              >
                {board[index]}
              </Tile>
            )
          })
        }
      </section>
      <button onClick={resetGame}>{buttonText}</button>

      {onGoing == "2" && (
        <section className="game-over">
          <div>
            <h2>Game Over</h2>
            <div>
              <p>Score:</p>
              <strong>{score}</strong>
            </div>
            Do you know the highest theoretical tile you can get is <strong>131072</strong>!
          </div>
        </section>
      )}
    </main>
  )
}

Board.propTypes = {
  n: PropTypes.number,
}