import { useEffect, useState } from "react";
import reactDom from "react-dom";

import AlertBar from "./AlertBar";

const AlertContainer = ({ dismissibleTimeout = 1000 }) => {
  const [alertType, setAlertType] = useState(null);
  const [config, setConfig] = useState(null);

  useEffect(() => {
    setConfig(null);
  }, [alertType]);

  useEffect(() => {
    window.alertTypeHandler = (type, message, config) => {
      setAlertType({ type, message });
      setConfig(config);
      let timer = setTimeout(() => {
        setAlertType({ type : null , message : '' })
        clearTimeout(timer)
      }, dismissibleTimeout);
    };
  }, []);

  useEffect(() => {
    if(alertType) {
      // let timer = setTimeout(() => {
      //   setAlertType({ type : null , message : '' })
      //   clearTimeout(timer)
      // }, dismissibleTimeout);
    }
  } , [])

  const Render = () => {
    if (alertType) {
      return (
        <AlertBar
          dismissibleTimeout={dismissibleTimeout}
          {...alertType}
          {...config}
        />
      );
    }
    return null;
  };
  return reactDom.createPortal(
    <Render />,
    document.getElementById("alertRoot")
  );
};

export default AlertContainer;
