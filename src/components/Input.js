const Input = ({ placeholder , value , onChange }) => {
    return (
        <input className="inputCustom" placeholder={placeholder} value={value} onChange={({ target : { value } }) => onChange(value)} />
    )
}   

export default Input;