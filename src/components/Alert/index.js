import AlertContainer from "./AlertContainer";

const Alert = {
  setToWindowHandler(type, message) {
    window.alertTypeHandler(type, message);
  },
  warning(message) {
    this.setToWindowHandler("warning", message);
  },
  success(message) {
    this.setToWindowHandler("success", message);
  },
  error(message) {
    this.setToWindowHandler("error", message);
  },
};

export { AlertContainer };
export default Alert;
