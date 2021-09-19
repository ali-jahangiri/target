import { useState } from "react";
import { Resizable } from "re-resizable";
import PlaygroundInput from "./PlaygroundInput";
import { debounce } from "../../utils";


const ImagePlayground = () => {
    const [value, setValue] = useState("");
    const [imageSize, setImageSize] = useState({})

    const onResize = debounce((e, dir, ref) => {
        const { width , height } = ref.getClientRects()[0];
        setImageSize({width , height});
    } , 0);


    return (
        <div className="imagePlayground">
            <PlaygroundInput
                placeholder="Write a picture name or paste path of it"
                value={value}
                onChange={setValue} />
            {
                value && <Resizable
                            defaultSize={{ width : 900 , height : 0 }}
                            onResizeStop={onResize}
                            className="imagePlayground__image"
                            style={{ backgroundImage : `url(${value})` }}
                            maxWidth="100%"
                            minWidth={240}
                            minHeight={100}
                            maxHeight={700}
                            // grid={[10, 10]}
                        >
                </Resizable>
            }
        </div>
    )
}


export default ImagePlayground;