import React, { useState, useEffect } from 'react';
import {
   Paper,
   Typography,
   TextField,
   Button,
   List,
   ListItem,
   ListItemText,
   IconButton,
   Checkbox,
   Divider,
   Box,
   Chip,
   AppBar,
   Toolbar,
 } from '@mui/material';

import {
   Add as AddIcon,
   Delete as DeleteIcon,
 } from '@mui/icons-material';

import '../styles/TodoApp.css';

export default function TodoApp() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!newTask.trim()) {
      setError('Please enter a task');
      return;
    }

    const task = {
      id: Date.now(),
      text: newTask.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
    };

    setTasks([...tasks, task]);
    setNewTask('');
    setError('');
  };

  const toggleTask = (taskId) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const pendingTasks = tasks.filter(task => !task.completed).length;
  const completedTasks = tasks.filter(task => task.completed).length;

  return (
    <div className="todo-container">
      <div className="content-wrapper">
        <div className="header-container">
          <AppBar position="static" elevation={0} sx={{ borderRadius: '12px' }}>
            <Toolbar>
              <Typography variant="h5" className="app-title">
                To-Do List
              </Typography>
              <Box sx={{ flexGrow: 1 }} />
              <Chip 
                label={`${pendingTasks} pending`}
                color="secondary"
                className="counter-chip"
                sx={{ mr: 1 }}
              />
              <Chip 
                label={`${completedTasks} completed`}
                color="success"
                className="counter-chip"
              />
            </Toolbar>
          </AppBar>
        </div>

        <Paper className="todo-card" elevation={3}>
          <Box>
            <form onSubmit={handleSubmit}>
              <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <TextField
                  fullWidth
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  placeholder="What needs to be done?"
                  variant="outlined"
                  error={!!error}
                  helperText={error}
                  className="todo-input"
                />
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<AddIcon />}
                  className="add-button"
                >
                  Add
                </Button>
              </Box>
            </form>

            <List>
              {tasks.map((task, index) => (
                <React.Fragment key={task.id}>
                  {index > 0 && <Divider />}
                  <ListItem className={`todo-item new-task ${task.completed ? 'completed' : ''}`}>
                    <Checkbox
                      checked={task.completed}
                      onChange={() => toggleTask(task.id)}
                    />
                    <ListItemText
                      primary={
                        <span className={`task-text ${task.completed ? 'task-completed' : ''}`}>
                          {task.text}
                        </span>
                      }
                    />
                    <IconButton
                      onClick={() => deleteTask(task.id)}
                      className="delete-button"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItem>
                </React.Fragment>
              ))}
            </List>

            {tasks.length === 0 && (
              <div className="empty-state">
                <Typography variant="h6">
                  No tasks yet
                </Typography>
                <Typography variant="body2">
                  Add a new task to get started!
                </Typography>
              </div>
            )}
          </Box>
        </Paper>
      </div>
    </div>
  );
}