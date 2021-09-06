const LoaderConcept = ({ style , symbolColor = 'black' }) => {
    return (
        <div style={style} className="loaderConcept">
            <span style={{ color : symbolColor }}>*</span>
        </div>
    )
}


export default LoaderConcept;