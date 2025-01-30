import './Input.css'
import PropTypes from 'prop-types'
const Input = ({label,placeholder,children,type='text',className=''}) => {
    
  return (
    <>
        <label htmlFor={children}>{children}</label>
        <input type={type} name={label} id={children} className={`input ${className}`} placeholder={placeholder}/>
    </>
  )
}
Input.propTypes = {
    label : PropTypes.string.isRequired,
    placeholder : PropTypes.string.isRequired,
    type : PropTypes.string,
    className : PropTypes.string,
    children : PropTypes.node.isRequired,
}

export default Input