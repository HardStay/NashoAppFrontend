import React from "react";
import DeleteIcon from "@mui/icons-material/Delete";

const PopupHapus = ({ show, onClose, children }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-4 w-1/3">
        <div className="flex justify-between items-center">
          <div className="flex items-center text-lg font-medium text-[#B3261E]">
            <DeleteIcon /> Hapus Soal
          </div>
          <button onClick={onClose} className="text-black">
            X
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default PopupHapus;
