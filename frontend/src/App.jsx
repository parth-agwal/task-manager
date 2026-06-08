import { useState, useEffect } from 'react';// React Hooks
import axios from 'axios';

// Styles
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
// AG Grid Imports
import { AgGridReact } from 'ag-grid-react';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
ModuleRegistry.registerModules([AllCommunityModule]);

import Form from './components/Form';
import Confirm from './components/Confirm';

import API_URL from './config';


function App() {

  const [rowData, setRowData] = useState([]);
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${API_URL}/tasks`);
      const formattedData = res.data.map((task) => ({
        id: task.id,
        Title: task.title,
        Description: task.description,
        DueDate: task.dueDate,
        Status: task.status,
        CreatedOn: task.createdOn,
      }));
      setRowData(formattedData);
    } catch (err) {
      console.error(err);
    }
  };

  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({
    Title: '',
    Description: '',
    DueDate: '',
  });

  const [editTaskId, setEditTaskId] = useState(null);
  const editTask = (task) => {
    setNewTask({
      Title: task.Title,
      Description: task.Description,
      DueDate: task.DueDate,
    });

    setEditTaskId(task.id);
    setShowModal(true);
  };

  const resetForm = () => {
    setNewTask({
      Title: '',
      Description: '',
      DueDate: '',
    });

    setEditTaskId(null);
  };

  const [showConfirm, setShowConfirm] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  const deleteTask = (task) => {
    setTaskToDelete(task);
    setShowConfirm(true);
  };

  const handleExecuteDelete = async () => {
    if (!taskToDelete) return;

    try {
      await axios.delete(`${API_URL}/tasks/${taskToDelete.id}`);
      fetchTasks();
    } catch (err) {
      console.error("Failed to delete task:", err);
    } finally {
      setShowConfirm(false);
      setTaskToDelete(null);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask((prevTask) => ({
      ...prevTask,
      [name]: value,
    }));
  };

  const toggleStatus = async (id) => {
    try {
      await axios.put(`${API_URL}/tasks/status/${id}`);
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const addTask = async () => {
    if (
      !newTask.Title) {
      alert('Please fill title');
      return;
    }
    if (editTaskId) {
      try {
        await axios.put(
          `${API_URL}/tasks/${editTaskId}`,
          {
            title: newTask.Title,
            description: newTask.Description,
            dueDate: newTask.DueDate,
          }
        );

        fetchTasks();
        setEditTaskId(null);
      } catch (err) {
        console.error(err);
      }
    }
    else {
      try {
        await axios.post(
          `${API_URL}/tasks`,
          {
            title: newTask.Title,
            description: newTask.Description,
            dueDate: newTask.DueDate,
          }
        );

        fetchTasks();
      } catch (err) {
        console.error(err);
      }
    }
    setNewTask({
      Title: '',
      Description: '',
      DueDate: '',
    });

    setShowModal(false);
  }

  const completedTasks = rowData.filter(
    (task) => task.Status === 'Completed'
  ).length;

  const activeTasks = rowData.filter(
    (task) => task.Status === 'Active'
  ).length

  const overdueTasks = rowData.filter((task) => {
    return task.Status === 'Overdue'
  }).length;

  const [showOverdueOnly, setShowOverdueOnly] = useState(false);

  const filteredData = showOverdueOnly
    ? rowData.filter(task => task.Status === 'Overdue')
    : rowData;

  const defaultColDef = {
    filter: true,
    floatingFilter: true,
    sortable: true,
    resizable: true,
  };

  //COLUMN STRUCTURES
  const [colDefs] = useState([
    {
      field: 'id', headerName: 'S.No',
      width: 80,
      filter: false,
      floatingFilter: false,
    },
    { field: 'Title', flex: 1 },
    { field: 'Description', flex: 1 },
    {
      field: 'Status',
      flex: 1,
      cellRenderer: (params) => (
        <span
          className={
            params.value === 'Overdue'
              ? 'status-overdue'
              : params.value === 'Completed'
                ? 'status-completed'
                : 'status-active'
          }
        >
          {params.value}
        </span>
      ),
    },
    { field: 'CreatedOn', headerName: 'CreatedOn', flex: 1 },
    { field: 'DueDate', headerName: 'Due Date', flex: 1 },

    {
      headerName: 'Actions',
      flex: 1,
      minWidth: 320,
      filter: false,
      floatingFilter: false,
      sortable: false,
      width: 300,
      cellRenderer: (params) => (
        <div className="d-flex gap-2">
          <button className="edit-btn"
            onClick={() => editTask(params.data)}
          >
            <i className="bi bi-pencil"></i> Edit
          </button>
          <button className="delete-btn"
            onClick={() => { deleteTask(params.data); }}
          >
            <i className="bi bi-trash"></i> Delete
          </button>
          <label
            className="switch"
            title={
              params.data.Status === 'Completed'
                ? "Mark as Active (will restore Active/Overdue based on due date)"
                : "Mark as Completed"
            }
          >
            <input
              type="checkbox"
              checked={params.data.Status === 'Completed'}
              onChange={() => toggleStatus(params.data.id)}
            />
            <span className="slider round"></span>
          </label>
        </div>
      ),
    }
  ]);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        {/* LEFT SIDE */}
        <div className="d-flex flex-column align-items-start gap-2">
          <h2 className="fw-bold mb-1">
            <i
              className="bi bi-clipboard-check fs-4"
              style={{ color: '#6c4cff' }}
            ></i>{' '}
            Task Manager</h2>
          <button
            className="add-task-btn"
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
          >
            <i className="bi bi-plus-lg"></i> Add Task
          </button>

          <button
            className={`toggle-btn ${showOverdueOnly ? 'active' : ''}`}
            onClick={() => setShowOverdueOnly(!showOverdueOnly)}
          >
            {showOverdueOnly
              ? 'Showing Overdue Tasks'
              : 'Show Overdue Tasks'}
          </button>
        </div>
        {/* RIGHT SIDE - STATS */}
        <div className="stats-row" style={{ marginBottom: 0 }}>
          {/* Total Tasks */}
          <div className="stat-card purple">
            <div className="stat-icon">
              <i className="bi bi-card-checklist"></i>
            </div>
            <div>
              <h6>Total Tasks</h6>
              <h2>{rowData.length}</h2>
            </div>
          </div>
          {/* Overdue Tasks */}
          <div className="stat-card red">
            <div className="stat-icon">
              <i className="bi bi-exclamation-circle"></i>
            </div>
            <div>
              <h6>Overdue Tasks</h6>
              <h2>{overdueTasks}</h2>
            </div>
          </div>
          {/* Active Tasks */}
          <div className="stat-card orange">
            <div className="stat-icon">
              <i className="bi bi-clock"></i>
            </div>

            <div>
              <h6>Active Tasks</h6>
              <h2>{activeTasks}</h2>
            </div>
          </div>

          {/* Completed Tasks */}
          <div className="stat-card green">
            <div className="stat-icon">
              <i className="bi bi-check-circle"></i>
            </div>

            <div>
              <h6>Completed Tasks</h6>
              <h2>{completedTasks}</h2>
            </div>
          </div>

        </div>
      </div>
      <div className="task-table-card">
        <h4 className="mb-3">Tasks</h4>

        {filteredData.length === 0 ? (
          <div className="empty-state">
            <i className="bi bi-inbox fs-1 mb-3 text-muted"></i>
            <h4>No tasks found</h4>
            <p>Create a new task to get started</p>
          </div>
        ) : (
          <div className="ag-theme-quartz" style={{ width: "100%" }}>
            <AgGridReact
              rowData={filteredData}
              columnDefs={colDefs}
              defaultColDef={defaultColDef}
              pagination={true}
              paginationPageSize={20}
              domLayout="autoHeight"
              rowHeight={38}
            />
          </div>
        )}
      </div>
      <br />

      <Form
        showModal={showModal}
        setShowModal={setShowModal}
        newTask={newTask}
        handleInputChange={handleInputChange}
        addTask={addTask}
        resetForm={resetForm}
      />
      <Confirm
        showConfirm={showConfirm}
        setShowConfirm={setShowConfirm}
        deleteTask={handleExecuteDelete}
        task={taskToDelete}
      />

    </div>
  );
}

export default App;