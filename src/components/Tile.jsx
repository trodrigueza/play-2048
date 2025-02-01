import PropTypes from 'prop-types'

export function Tile({ value }) {
  const className = value != null ? `tile tile-${value}` : 'tile'
  return (
    <div className={className}>
      {value}
    </div>
  )
}

Tile.propTypes = {
  // index: PropTypes.number.isRequired,
  value: PropTypes.number,
};