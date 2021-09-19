
const TodoInput = ({ value , onChange , hashtagInterpolate }) => {
    return (
        // <div style={{ display : 'flex' , alignItems : "center" }}>
            <input 
            className={`todoInjector__input ${hashtagInterpolate ? "todoInjector__input--interpolate" : ""}`} 
            placeholder={`Write something`} 
            value={value} 
            onChange={onChange} />
            // {
            //     !value && <div style={{ opacity : .7 }}>
            //         <span>.</span>
            //         <span>.</span>
            //         <span>.</span>
            //     </div>
            // }
        // {/* </div> */}
    )
}


export default TodoInput;