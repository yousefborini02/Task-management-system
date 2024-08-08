const pool = require("../config/db");

exports.createTask = async (req, res) => {
  try {
    const { task_name, task_description } = req.body;
    const userId = BigInt(req.user.id);
    const result = await pool.query(
      "INSERT INTO TASKS (TASK_NAME, TASK_DESCRIPTION, USER_ID) VALUES ($1, $2, $3) RETURNING *",
      [task_name, task_description, userId]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM TASKS WHERE USER_ID = $1", [
      req.user.id,
    ]);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateTask = async (req, res) => {
    try {
      const { id } = req.params;
      const { task_name, task_description } = req.body;
  
      console.log('Update request:', { id, task_name, task_description }); // Debugging line
  
      const result = await pool.query(
        "UPDATE TASKS SET TASK_NAME = $1, TASK_DESCRIPTION = $2 WHERE TASK_ID = $3 AND USER_ID = $4 RETURNING *",
        [task_name, task_description, id, req.user.id]
      );
  
      console.log('Update result:', result.rows); // Debugging line
  
      if (result.rows.length > 0) {
        res.json(result.rows[0]);
      } else {
        res.status(404).json({ error: "Task not found" });
      }
    } catch (error) {
      console.error('Error updating task:', error); // Improved error logging
      res.status(500).json({ error: error.message });
    }
  };
  

exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "UPDATE TASKS SET DELETED_AT = CURRENT_TIMESTAMP WHERE TASK_ID = $1 AND USER_ID = $2 RETURNING *",
      [id, req.user.id]
    );
    if (result.rows.length > 0) {
      res.json({ message: "Task deleted successfully" });
    } else {
      res.status(404).json({ error: "Task not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
