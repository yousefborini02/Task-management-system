
import React, { useState, useEffect } from 'react';
import axios from './axios';
import { useNavigate } from 'react-router-dom';

const Task = () => {
  const [tasks, setTasks] = useState([]);
  const [taskData, setTaskData] = useState({
    task_name: '',
    task_description: ''
  });
  const [editing, setEditing] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:4024/api/tasks', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleChange = (e) => {
    setTaskData({
      ...taskData,
      [e.target.name]: e.target.value
    });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:4024/api/tasks', taskData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks([...tasks, response.data]);
      setTaskData({ task_name: '', task_description: '' });
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const { task_name, task_description } = taskData;

      console.log('Updating task:', { editing, task_name, task_description }); // Debugging line

      const response = await axios.put(`http://localhost:4024/api/tasks/${editing}`, { task_name, task_description }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log('Update response:', response.data); // Debugging line

      // Update the local state with the updated task
      setTasks(tasks.map(task => task.task_id === editing ? response.data : task));

      setEditing(null);
      setTaskData({ task_name: '', task_description: '' });
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDelete = async (task_id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:4024/api/tasks/${task_id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(tasks.filter(task => task.task_id !== task_id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const startEditing = (task) => {
    setEditing(task.task_id);
    setTaskData({ task_name: task.task_name, task_description: task.task_description });
  };

  const handleFormSubmit = (e) => {
    if (editing) {
      handleUpdate(e);
    } else {
      handleCreate(e);
    }
  };

  const handleLogOut = (e) => {
    e.preventDefault();
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div style={styles.container}>
      <div style={styles.form}>
        <h2 style={styles.title}>{editing ? 'Edit Task' : 'Create Task'}</h2>
        <form onSubmit={handleFormSubmit}>
          <input
            type="text"
            name="task_name"
            placeholder="Task Name"
            value={taskData.task_name}
            onChange={handleChange}
            required
            style={styles.input}
          />
          <textarea
            name="task_description"
            placeholder="Task Description"
            value={taskData.task_description}
            onChange={handleChange}
            required
            style={styles.textarea}
          />
          <button type="submit" style={styles.button}>
            {editing ? 'Confirm Edit' : 'Create Task'}
          </button>
        </form>
      </div>
      <div style={styles.taskList}>
        <h3 style={styles.subtitle}>Your Tasks</h3>
        {tasks.length === 0 ? (
          <p style={styles.noTasks}>No tasks available.</p>
        ) : (
          <ul style={styles.list}>
            {tasks.map(task => (
              <li key={task.task_id} style={styles.taskItem}>
                <div style={styles.taskContent}>
                  <h4 style={styles.taskName}>{task.task_name}</h4>
                  <p style={styles.taskDescription}>{task.task_description}</p>
                </div>
                <div style={styles.taskActions}>
                  <button onClick={() => startEditing(task)} style={styles.editButton}>Edit</button>
                  <button onClick={() => handleDelete(task.task_id)} style={styles.deleteButton}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        )}
        <button onClick={handleLogOut} style={styles.logoutButton}>Logout</button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    maxWidth: '900px',
    margin: '0 auto',
    fontFamily: 'Arial, sans-serif',
    color: '#333'
  },
  form: {
    background: '#f9f9f9',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
    marginBottom: '20px'
  },
  title: {
    marginBottom: '20px',
    textAlign: 'center',
    color: '#007BFF'
  },
  subtitle: {
    marginBottom: '10px',
    color: '#007BFF'
  },
  input: {
    width: '100%',
    padding: '12px',
    marginBottom: '12px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '16px'
  },
  textarea: {
    width: '100%',
    padding: '12px',
    marginBottom: '12px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '16px',
    minHeight: '100px'
  },
  button: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#007BFF',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px'
  },
  taskList: {
    background: '#f9f9f9',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
  },
  list: {
    listStyleType: 'none',
    padding: 0
  },
  taskItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px',
    borderBottom: '1px solid #ddd',
    marginBottom: '10px',
    borderRadius: '4px',
    backgroundColor: '#fff'
  },
  taskContent: {
    flex: 1
  },
  taskName: {
    margin: 0,
    fontSize: '18px'
  },
  taskDescription: {
    margin: '5px 0 0 0',
    color: '#666'
  },
  taskActions: {
    display: 'flex',
    gap: '10px'
  },
  editButton: {
    padding: '8px 12px',
    backgroundColor: '#ffc107',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px'
  },
  deleteButton: {
    padding: '8px 12px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px'
  },
  logoutButton: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    marginTop: '20px'
  },
  noTasks: {
    textAlign: 'center',
    color: '#666'
  }
};

export default Task;
