const ImageBlock = ({ value : { size , path , alignment } }) => {

    return (
        <div className="imageBlock">
            <div className={`imageBlock__image imageBlock__image--${alignment}`} style={{ width : size.width , height : size.height , background : `url(${path})` }} />
        </div>
    )
}



export default ImageBlock;