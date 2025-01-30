import './Button.css'
import PropTypes from 'prop-types'
const Button = ({onClick = null , children, type = 'button', className ='',backgroundColor = '#007bff' }) => {

  return (
    <>
        <button
            onClick = {onClick}
            type= {type}
            className= {`button ${className}`}
            style={{ backgroundColor : backgroundColor}}
        >
            {children}
        </button>
    </>
  )
}
Button.propTypes = {
    onClick : PropTypes.func,
    type : PropTypes.string,
    children : PropTypes.node.isRequired,
    className : PropTypes.string,
    backgroundColor : PropTypes.string

}
export default Button