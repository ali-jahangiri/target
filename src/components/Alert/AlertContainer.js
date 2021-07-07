import { useEffect, useState } from "react";
import reactDom from "react-dom";

import AlertBar from "./AlertBar";

const AlertContainer = ({ dismissibleTimeout = 5000 }) => {
  const [alertType, setAlertType] = useState(null);
  const [config, setConfig] = useState(null);

  useEffect(() => {
    setConfig(null);
  }, [alertType]);

  useEffect(() => {
    window.alertTypeHandler = (type, message, config) => {
      setAlertType({ type, message });
      setConfig(config);
    };
  }, []);

  const Render = () => {
    if (alertType) {
      let timer = setTimeout(() => {}, dismissibleTimeout);
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
