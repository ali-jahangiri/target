import { useCallback, useEffect, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import useKeyBaseState from "../Hook/useKeyBaseState";
import { debounce, idGenerator, requests } from "../utils";
import { DescBlock, ImageBlock, LinkBlock, TextBlock } from "./ElementBlock"
import NewNoteThing from "./NewNoteThing";

const blocksClone = ({ key , ...rest }) => ({
    text : <TextBlock {...rest} key={key} />,
    image : <ImageBlock {...rest} key={key} />,
    description : <DescBlock {...rest} key={key} />,
    link : <LinkBlock {...rest} key={key} />
})

const NotePlayground = ({ setInnerPlaygroundController , leanDate }) => {
    const [content , setContent] = useKeyBaseState({title : "" , thingList : []})
    const [isInEditMode, setIsInEditMode] = useState(false);
    const [haveAnyChangeInEditMode, setHaveAnyChangeInEditMode] = useState(false);
    const [tempContent, setTempContent] = useState(null);
    
    const [_noteId] = useState(() => idGenerator());

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
                        console.log('remove');
                        // return removeThingTreeHandler(index)
                    }
                    else return { name : el.name , value }
                }else return el
            })
        }))
    };

    useEffect(function syncTempContentHandler() {
        setTempContent(content)
    } , [content]);

    useEffect(function attachEditTriggerToControllerChecker() {
        if(content.thingList.length) {
            setInnerPlaygroundController({
                callback : () => {
                    if(!isInEditMode) setIsInEditMode(prev => !prev)
                    else stageTempContentHandler();
                },
                label : haveAnyChangeInEditMode ? "Save Change" : (isInEditMode ? "Back" : "Edit content"),
                overwriteCloseTriggerCallback : resetEditMode,
                closeTriggerConvertedTextTo : haveAnyChangeInEditMode && isInEditMode ?  "Cancel" : "Close"
            })
        }else setInnerPlaygroundController({callback : () => {}});
    } , [content , isInEditMode , haveAnyChangeInEditMode, tempContent]);

    
    const debouncedSynced = useCallback(debounce(passedSyncedContent => {
        if(passedSyncedContent.thingList.length && passedSyncedContent.title.trim()) {
            // Synced
            requests.commends.note.setNote(leanDate , {...passedSyncedContent , id : _noteId});
        }else {
            // Delete stored Note
            requests.commends.note.removeNote(leanDate , _noteId);
        }
    } , 500) , [])


    useEffect(() => debouncedSynced(content) , [content]);

    const dynamicThingList = isInEditMode ? tempContent.thingList : content.thingList

    return (
        <div className="notePlayground">
            <TextareaAutosize
                placeholder="Give note a Title ..."
                value={content.noteTitle} 
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
    )
}



export default NotePlayground;