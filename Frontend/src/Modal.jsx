import PropTypes from "prop-types";
import "./Modal.css";

const Modal = ({ isOpen, title, onClose, children }) => {
  if (!isOpen) {
    document.body.classList.remove("overflow-hidden");
    return <></>;
  }
  return (
    <>
      {document.body.classList.add("overflow-hidden")}
      <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-opacity-50 z-50">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full mx-4">
          <h2 className="text-xl font-semibold mb-4">{title}</h2>
          <div className="text-gray-700 mb-4 max-h-60 overflow-y-auto">
            {children}
          </div>
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};
export default Modal;
