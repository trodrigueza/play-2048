import { useEffect, useState } from 'react'
import { PropTypes } from 'prop-types'
import { Tile } from './Tile'
import { Score } from './Score'
import { initializeBoard, addRandom, moveUp, moveDown, moveLeft, moveRight, areProbablyJsonIsomorphic, checkOnGoing } from '../logic'
import { db, collection, runTransaction, doc, addDoc } from '../firebase';
import { useSwipeable } from 'react-swipeable'
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

  const [username, setUsername] = useState(() => {
    const savedUsername = window.localStorage.getItem('username')
    return savedUsername ? JSON.parse(savedUsername) : ''
  })

  const handleSaveScore = async () => {
    handleSaveGame()
    if (!username.trim()) return;

    try {
      const usernameTrim = username.trim()
      const scoresRef = collection(db, "scores")
      const userDocRef = doc(scoresRef, usernameTrim)

      await runTransaction(db, async (transaction) => {
        const docSnap = await transaction.get(userDocRef);

        if (docSnap.exists()) {
          const currentScore = docSnap.data().score;
          if (score > currentScore) {
            transaction.update(userDocRef, {
              score: score,
              date: new Date()
            })
          }
        } else {
          transaction.set(userDocRef, {
            name: username.trim(),
            score: score,
            date: new Date()
          })
        }
      })
      resetGame()
    } catch (error) {
      console.error("Failed to save score: ", error);
    }
  }

  const handleSaveGame = async () => {
    if (score == 0) return
    try {
      await addDoc(collection(db, "games"), {
        name: username,
        score: score,
        date: new Date()
      });
    } catch (error) {
      console.error("Error saving game: ", error);
    }
  };

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
    window.localStorage.setItem('username', JSON.stringify(username))

    if (!checkOnGoing(board)) {
      setOnGoing("2")
    }
  }, [board, score, bestScore, onGoing, username])

  const performMove = (direction) => {
    let newBoard = board.slice()
    let newScore = 0
    switch (direction) {
      case 'left':
        [newBoard, newScore] = moveLeft(board)
        break
      case 'right':
        [newBoard, newScore] = moveRight(board)
        break
      case 'up':
        [newBoard, newScore] = moveUp(board)
        break
      case 'down':
        [newBoard, newScore] = moveDown(board)
        break
      default:
        return
    }
    if (areProbablyJsonIsomorphic(board, newBoard)) {
      return
    }

    newBoard = addRandom(newBoard)
    setBoard(newBoard)
    setScore(score + newScore)
  }

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (
        event.key === 'ArrowLeft' ||
        event.key === 'ArrowRight' ||
        event.key === 'ArrowUp' ||
        event.key === 'ArrowDown'
      ) {
        event.preventDefault()
      }

      switch (event.key) {
        case 'ArrowLeft':
          performMove('left')
          break
        case 'ArrowRight':
          performMove('right')
          break
        case 'ArrowUp':
          performMove('up')
          break
        case 'ArrowDown':
          performMove('down')
          break
        default:
          return
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  })

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => performMove('left'),
    onSwipedRight: () => performMove('right'),
    onSwipedUp: () => performMove('up'),
    onSwipedDown: () => performMove('down'),
    preventDefaultTouchmoveEvent: true,
    // trackMouse: true 
  })

  const saveText = username != '' ? "Play Again" : "Save score"
  const formText = username != '' ? "Username:" : "Would you like to save your score?"
  return (
    <main className="board">
      <h1>2048</h1>
      <p>{username === '' ? "Complete a game to set username" : ""}</p>
      <Score score={score} bestScore={bestScore} />
      <section className="game" {...swipeHandlers}>
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
      <button onClick={() => { handleSaveGame(); resetGame(); }}>Reset</button>

      {onGoing == "2" && (
        <section className="game-over">
          <div>
            <h2>Game Over</h2>
            <div>
              <p>Score:</p>
              <strong>{score}</strong>
            </div>
            <div className="score-form">
              <h3>{formText}</h3>
              <input
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <button onClick={handleSaveScore}>{saveText}</button>
            </div>
          </div>
        </section>
      )}
    </main>
  )
}

Board.propTypes = {
  n: PropTypes.number,
}