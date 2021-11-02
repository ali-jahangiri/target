import React from "react";
import ReactGridLayout from "react-grid-layout";
import "../../node_modules/react-resizable/css/styles.css";
import "../../node_modules/react-grid-layout/css/styles.css";

import { colors , getRandomItem , idGenerator } from "../utils";

// const Handler = React.forwardRef((props, ref) => {
//   console.log(props);
//   const filteredProps = {
//     onMouseDown : props.onMouseDown,
//     onMouseUp : props.onMouseUp,
//     onTouchEnd : props.onTouchEnd,
//   }
//   return <div className="react-resizable-handle" style={{ width : 50 , height : 10 , background : "black" }} ref={ref} {...filteredProps  }>

//   </div>
// })


// const DevPlayground = () => {
//     const layout = [
//         {i: 'a', x: 0, y: 0, w: 1, h: 2, static: true},
//         {i: 'b', x: 1, y: 0, w: 3, h: 2, minW: 2, maxW: 4},
//         {i: 'c', x: 4, y: 0, w: 1, h: 2}
//       ];
//       return (
//         // <div style={{ display : "flex" ,  }}>
//         //     <div style={{ width : "80%" }}>
            
//         //     </div>
//         //   {/* <div style={{ width : "20%" }}>
//         //     {
//         //       new Array(24).fill("").map((el , i) => <div style={{ height : 100 }} key={i}>{i + 1}</div>)
//         //     }
//         //   </div> */}
//         // </div>
//         <ReactGridLayout 
//             onLayoutChange={(...rest) =>console.log(rest)}
//             autoSize
//             margin={[0 , 0]}
//             // style={{ background : "lightblue" }} 
//             // className="layout" 
//             // layout={[layout , ...new Array(19).fill('').map((el , i) => ({ i : idGenerator() , x : 0 , y : 0 , w : 12 ,minW : 12}))]} 
//             layout={layout} 
//             cols={12} 
//             // isDraggable={false}
//             // isResizable={false}
//             // isBounded
//             // transformScale={.9}
//             // allowOverlap
//             // preventCollision
//             // isDroppable={false}
//             // resizeHandles={["e" ,'ne']}
//             // onDragStart={(...rest) => console.log(rest)}
//             // resizeHandle={<Handler />}
//             rowHeight={100} 
//             width={window.innerHeight}>
//             {
//               layout.map((el , i) => <div key={el.i} style={{background : `#${getRandomItem(colors)}` , userSelect : "none" }}>{i}{i}</div>)
//             }
//           </ReactGridLayout>
//       )
// }



// export default DevPlayground;

// eslint-disable-next-line import/no-anonymous-default-export
export default () => {
  const layout = [
    {i: 'a', x: 0, y: 0, w: 12, h: 1 , minW: 5 , maxW : 12},
    {i: 'b', x: 1, y: 0, w: 12, h: 1, minW: 5 , maxW : 12},
    ...new Array(21).fill("").map((el , i) => ({ i : idGenerator() , x: 4, y: 0, w: 12, h: 1 , minW: 12 , maxW : 12 , type : 'empty' })),
    
    {i: 'c', x: 4, y: 0, w: 12, h: 1 , minW: 5 , maxW : 12},
  ];
  return (
    <div style={{ display : 'flex'  }}>
      <div style={{ width : "10%" }}>
        {
          new Array(24).fill('').map((el , i) => <div style={{ display : "flex" , alignItems : "center" , justifyContent : "center" , height : 100}} key={i}>{i + 1}</div>)
        }
      </div>
      <div style={{ width : "90%" }}>
        <ReactGridLayout 
        className="layout" 
        layout={layout} 
        cols={12} 
        rowHeight={100}
        width={window.innerWidth - 130}
        margin={[0 , 0]}>
        {
                layout.map((el , i) => el.type === "empty" ?<div key={el.i} style={{ width : "100%" , height : 100 }}></div> : <div key={el.i}  style={{background : el.type === "empty" ? "white" : `#${getRandomItem(colors)}` , userSelect : "none" }}></div>)
              }
      </ReactGridLayout>
      </div>
    </div>
  )
}