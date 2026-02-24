import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import './constants/activities.js'

function App() {
  const [tasks, setTasks] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');

  const handleAddTask = () => {
    const trimmedValue = inputValue.trim();
    
    // Validations
    if (trimmedValue === '') {
      setError('Task cannot be empty');
      return;
    }
    
    if (tasks.some(task => task.text.toLowerCase() === trimmedValue.toLowerCase())) {
      setError('Task already exists');
      return;
    }

    if (trimmedValue.length > 50) {
      setError('Task is too long (max 50 characters)');
      return;
    }

    const newTask = {
      id: Date.now(),
      text: trimmedValue,
      completed: false
    };
    setTasks([...tasks, newTask]);
    setInputValue('');
    setError('');
  };

  const handleToggleTask = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleDeleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddTask();
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    if (error) setError(''); // Clear error while typing
  };

  return (
    <div className="todo-container">
      <h1>My Tasks</h1>
      <div className="input-group">
        <input 
          type="text" 
          value={inputValue} 
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder="Enter a new task..."
          className={`task-input ${error ? 'error' : ''}`}
        />
        <button onClick={handleAddTask} id="add-btn">Add Task</button>
      </div>
      {error && <span className="error-message">{error}</span>}


      <ul className="task-list">
        {tasks.map(task => (
          <li key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
             <div className="task-content">
                <input 
                  type="checkbox" 
                  checked={task.completed} 
                  onChange={() => handleToggleTask(task.id)}
                  className="task-checkbox"
                />
                <span className="task-text">{task.text}</span>
             </div>
          </li>
        ))}
      </ul>

      {tasks.some(task => task.completed) && (
        <div className="actions-bar">
          <button 
            className="delete-global-btn" 
            onClick={() => setTasks(tasks.filter(t => !t.completed))}
          >
            Delete Completed Tasks
          </button>
        </div>
      )}
    </div>
  );
}

export default App
