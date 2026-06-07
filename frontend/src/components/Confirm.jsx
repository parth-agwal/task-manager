import './confirm.css';

function Confirm({
  showConfirm,
  setShowConfirm,
  deleteTask,
  task,
}) {
  if (!showConfirm) return null;

  const handleClose = () => {
    setShowConfirm(false);
  };

  return (
    <div className="confirm-overlay">
      <div className="confirm-box">
        <h4>
          Are you sure you want to delete the task
          <span className="text-danger"> "{task?.Title}" </span>?
        </h4>

        <div className="d-flex gap-2 justify-content-center">
          <button
            className="btn btn-danger"
            onClick={deleteTask}
          >
            Delete
          </button>

          <button
            className="btn btn-secondary"
            onClick={handleClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default Confirm