function Form({
  showModal,
  setShowModal,
  newTask,
  handleInputChange,
  addTask,
  resetForm,
}) {
  if (!showModal) return null;

  const handleClose = () => {
    resetForm();
    setShowModal(false);
  };

  return (
    <div
      className="modal show d-block"
      tabIndex="-1"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
    >
      <div className="modal-dialog">
        <div className="modal-content">

          {/* HEADER */}
          <div className="modal-header">
            <h5 className="modal-title">Add / Edit Task</h5>

            <button
              type="button"
              className="btn-close"
              onClick={handleClose}
            ></button>
          </div>

          {/* BODY */}
          <div className="modal-body">

            {/* TITLE */}
            <div className="mb-3">
              <label className="form-label">
                Title <span className="required">*</span>
              </label>

              <input
                type="text"
                className="form-control"
                name="Title"
                value={newTask.Title}
                onChange={handleInputChange}
              />
            </div>

            {/* DESCRIPTION */}
            <div className="mb-3">
              <label className="form-label">
                Description
              </label>

              <textarea
                className="form-control"
                rows="3"
                name="Description"
                placeholder="Description (Optional)"
                value={newTask.Description}
                onChange={handleInputChange}
              />
            </div>

            {/* DUE DATE */}
            <div className="mb-3">
              <label className="form-label">
                Due Date 
              </label>

              <input
                type="date"
                className="form-control"
                name="DueDate"
                value={newTask.DueDate}
                onChange={handleInputChange}
              />
            </div>

          </div>

          {/* FOOTER */}
          <div className="modal-footer">
            <button
              className="btn btn-secondary"
              onClick={handleClose}
            >
              Cancel
            </button>

            <button
              className="btn btn-primary"
              onClick={addTask}
            >
              Save Task
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Form;