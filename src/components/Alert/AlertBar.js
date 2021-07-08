const AlertBar = ({ type, message, dismissible, dismissibleTimeout }) => {
  return (
    <div className={`alertBar alertBar--${type || "hidden"}`}>
      <p>{message}</p>
    </div>
  );
};

export default AlertBar;
