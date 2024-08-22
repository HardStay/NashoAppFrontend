import React from "react";

const PopupSuccess = ({ show, onClose, children }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-4 w-1/3">
        <div>{children}</div>
      </div>
    </div>
  );
};

export default PopupSuccess;
