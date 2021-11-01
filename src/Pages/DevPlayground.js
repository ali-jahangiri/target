// import ReactGridLayout from "react-grid-layout";
// import /node_modules/react-grid-layout/css/styles.css
// /node_modules/react-resizable/css/styles.css

import ReactGridLayout from "react-grid-layout";


const DevPlayground = () => {
    const layout = [
        {i: 'a', x: 0, y: 0, w: 1, h: 2, static: true},
        {i: 'b', x: 1, y: 0, w: 3, h: 2, minW: 2, maxW: 4},
        {i: 'c', x: 1, y: 0, w: 1, h: 2}
      ];
      return (
        <ReactGridLayout className="layout" layout={layout} cols={12} rowHeight={30} width={1200}>
          <div style={{ width : "2rem" , height : "2rem" , background : "blue" }} key="a">a</div>
          <div style={{ width : "2rem" , height : "2rem" , background : "blue" }} key="b">b</div>
          <div style={{ width : "2rem" , height : "2rem" , background : "blue" }} key="c">c</div>
        </ReactGridLayout>
      )
}



export default DevPlayground;