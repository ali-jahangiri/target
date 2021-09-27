import { useCallback, useEffect, useRef, useState } from "react";
import useKeyBaseState from "../Hook/useKeyBaseState";
import TextareaAutosize from "react-textarea-autosize";
import { debounce, requests, selfClearTimeout } from "../utils";
import { DescBlock, ImageBlock, LinkBlock, TextBlock } from "./ElementBlock"
import NewNoteThing from "./NewNoteThing";

const blocksClone = ({ key , ...rest }) => ({
    text : <TextBlock {...rest} key={key} />,
    image : <ImageBlock {...rest} key={key} />,
    description : <DescBlock {...rest} key={key} />,
    link : <LinkBlock {...rest} key={key} />
})

const NotePlayground = ({ setInnerPlaygroundController , leanDate }) => {
    const [content , setContent] = useKeyBaseState();
    const [loading, setLoading] = useState(true);
    const [isInEditMode, setIsInEditMode] = useState(false);
    const [haveAnyChangeInEditMode, setHaveAnyChangeInEditMode] = useState(false);
    const [tempContent, setTempContent] = useState({ thingList : [] });

    const isFirstRender = useRef(true);

    const addThingToNoteTreeHandler = (thingType , thingValue) => {
        setContent(prev => ({
            ...prev,
            thingList : [
                ...prev?.thingList,
                {
                    name : thingType,
                    value : thingValue
                }
            ]
        }));
    }


    const resetEditMode = () => {
        setIsInEditMode(false);
        setHaveAnyChangeInEditMode(false);
        setTempContent(content);
    }


    const stageTempContentHandler = () => {
        setContent("thingList" , tempContent.thingList)
        setIsInEditMode(false);
        setHaveAnyChangeInEditMode(false);
    }

    const removeThingTreeHandler = index => {
        setHaveAnyChangeInEditMode(true);
        setTempContent(prev => ({
            ...prev,
            thingList : prev.thingList.filter((_ , i) => i !== index)
        }))
    };

    const editThingHandler = (index , value) => {
        setHaveAnyChangeInEditMode(true);
        setTempContent(prev => ({
            ...prev,
            wasEdited : true,
            thingList : prev.thingList.map((el , i) => {
                if(i === index) {
                    if(!value) {
                        // TODO show a alert to user that you delete thing in background
                        // return removeThingTreeHandler(index)
                    }
                    else return { name : el.name , value }
                }else return el
            })
        }))
    };

    useEffect(function syncTempContentHandler() {
        if(isInEditMode) setTempContent(content)
    } , [content, isInEditMode]);

    useEffect(function attachEditTriggerToControllerChecker() {
        if(!loading) {
            if(content.thingList.length) {
                        setInnerPlaygroundController({
                            callback : () => {
                                if(!isInEditMode) setIsInEditMode(prev => !prev)
                                else stageTempContentHandler();
                            },
                            label : haveAnyChangeInEditMode ? "Save Change" : (isInEditMode ? "Back" : "Edit content"),
                            overwriteCloseTriggerCallback : haveAnyChangeInEditMode && isInEditMode ? resetEditMode : undefined,
                            closeTriggerConvertedTextTo : haveAnyChangeInEditMode && isInEditMode ?  "Cancel" : "Close"
                        })
                    }else setInnerPlaygroundController({callback : () => {}});
        }
        
    } , [content , isInEditMode , haveAnyChangeInEditMode, tempContent, loading]);

    
    useEffect(function contentInitializer() {
        requests.commends.note.initializeNote(leanDate)
            .then(res => {
                setContent(() => res)
                selfClearTimeout(() => setLoading(false) , 250);
            })
    } , []);

    const debouncedSynced = useCallback(debounce(passedSyncedContent => {
        if(!isFirstRender.current) {
            requests.commends.note.syncNote(leanDate,passedSyncedContent)
        }
        if(isFirstRender.current) isFirstRender.current = false
    } , 500) , []);


    useEffect(() => debouncedSynced(content) , [content]);

    const dynamicThingList = isInEditMode ? tempContent?.thingList : content.thingList

    return !loading ? (
        <div className="notePlayground">
            <TextareaAutosize
                placeholder="Give note a Title ..."
                value={content.title} 
                minRows={2}
                onChange={({ target : { value } }) => setContent("title" ,value)}
            />
            {
                dynamicThingList.map((el , i) => blocksClone({ key : i , isInEditMode , editContentHandler : value => editThingHandler(i , value) , removeContentHandler : () => removeThingTreeHandler(i) ,  ...el })[el.name])
            }
            <NewNoteThing
                hideBaseOnEditMode={isInEditMode} 
                addThingToNoteTreeHandler={addThingToNoteTreeHandler} />
        </div>
    ) : null
}



export default NotePlayground;