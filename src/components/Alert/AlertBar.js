const AlertBar = ({ type, message, dismissible, dismissibleTimeout }) => {
  return (
    <div className={`alertBar alertBar--${type}`}>
      <p>{message}</p>
    </div>
  );
};

export default AlertBar;
