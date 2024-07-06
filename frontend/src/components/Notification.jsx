import React from "react";

const Notification = ({ type, message }) => {
  if (message === null) {
    return null;
  } else if (type === "Added") {
    return <div className="success">{message}</div>;
  } else if (type === "Updated") {
    return <div className="success">{message}</div>;
  } else if (type === "Error") {
    return <div className="error">{message}</div>;
  }
};

export default Notification;
