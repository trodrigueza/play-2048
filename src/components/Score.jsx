import PropTypes from 'prop-types'

export function Score({ score, bestScore }) {
  return (
    <section className="score">
      <div className="score-current">
        <p>Score</p>
        <strong>{score}</strong>
      </div>

      <div className="score-best">
        <p>Best</p>
        <strong>{bestScore}</strong>
      </div>
    </section>
  )
}

Score.propTypes = {
  score: PropTypes.number.isRequired,
  bestScore: PropTypes.number.isRequired
}