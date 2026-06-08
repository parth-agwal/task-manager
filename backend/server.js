const express = require('express');
const cors = require('cors');
const db = require('./db');
const path = require('path');
const fs = require('fs');
const app = express();

const DATA_FILE = path.join(__dirname, 'data.json');

app.use(cors());
app.use(express.json());
const port = process.env.PORT || 8000;

/* ---------------- LOAD LAST PROCESSED DATE ---------------- */
var processedDate = new Date();

try {
  const filedata = fs.readFileSync(DATA_FILE, 'utf8');
  const jsonObject = JSON.parse(filedata);
  processedDate = new Date(jsonObject.date);
} catch (err) {
  // If data file doesn't exist, create an empty JSON file
  if (err.code === 'ENOENT') {
    var yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    var jsonData = {
      date: yesterday.toLocaleDateString('en-CA')
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(jsonData, null, 2));
    processedDate = yesterday;
  } else {
    throw err;
  }
}

/* ---------------- GET ALL TASKS ---------------- */
app.get('/tasks', (req, res) => {
  if (processedDate.getDate() != new Date().getDate()) {
    console.log("abc");
    var overdue = 'Overdue';
    var active = 'Active';
    const task1 = db.prepare('UPDATE tasks SET status = ? WHERE dueDate < DATETIME() and status = ? ').run(overdue, active)
    processedDate = new Date();
    const jsonData = {
      date: processedDate
    };
    fs.writeFileSync(
      DATA_FILE,
      JSON.stringify(jsonData, null, 2)
    );
  }
  const tasks = db.prepare('SELECT * FROM tasks  order by createdOn desc; ').all();
  res.json(tasks);
});

/* ---------------- ADD TASK ---------------- */
app.post('/tasks', (req, res) => {
  const { title, description, dueDate } = req.body;
  const createdOn = new Date().toLocaleDateString('en-CA');

  const today = new Date().toISOString().split('T')[0];
  var status = 'Active'
  status = dueDate < today ? 'Overdue' : 'Active'

  db.prepare(`
    INSERT INTO tasks (title, description, dueDate, status, createdOn)
    VALUES (?, ?, ?, ?, ?)
  `).run(title, description, dueDate, status, createdOn);

  res.json({ message: 'Task Added' });
});

/* ---------------- DELETE TASK ---------------- */
app.delete('/tasks/:id', (req, res) => {
  const { id } = req.params;

  db.prepare('DELETE FROM tasks WHERE id = ?').run(id);

  res.json({ success: true });
});

/* ---------------- UPDATE TASK (EDIT) ---------------- */
app.put('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { title, description, dueDate } = req.body;

  const today = new Date().toISOString().split('T')[0];

  let status = dueDate < today ? 'Overdue' : 'Active';

  db.prepare(`
    UPDATE tasks
    SET title = ?,
        description = ?,
        dueDate = ?,
        status = ?
    WHERE id = ?
  `).run(
    title,
    description,
    dueDate,
    status,
    id
  );

  res.json({ message: 'Task Updated' });
});
/* ---------------- TOGGLE STATUS ---------------- */
app.put('/tasks/status/:id', (req, res) => {
  const { id } = req.params;

  const task = db.prepare(
    'SELECT status, dueDate FROM tasks WHERE id = ?'
  ).get(id);

  const today = new Date().toISOString().split('T')[0];

  let newStatus;

  if (task.status === 'Completed') {
    newStatus =
      task.dueDate < today ? 'Overdue' : 'Active';
  } else {
    newStatus = 'Completed';
  }

  db.prepare(`
    UPDATE tasks
    SET status = ?
    WHERE id = ?
  `).run(newStatus, id);

  res.json({ message: 'Status Updated' });
});


/* ---------------- START SERVER ---------------- */
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
// app.listen(8000, () => {
//   console.log('Server running on port 8000');
// });
