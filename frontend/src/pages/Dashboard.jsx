import React, { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { PlusCircle, Trash2, Edit2, CheckCircle, Clock, PlayCircle } from 'lucide-react';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState({ title: '', description: '', status: 'pending' });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const { data } = await api.get('/tasks');
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenNew = () => {
    setCurrentTask({ title: '', description: '', status: 'pending' });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (task) => {
    setCurrentTask(task);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await api.put(`/tasks/${currentTask._id}`, currentTask);
      } else {
        await api.post('/tasks', currentTask);
      }
      setIsModalOpen(false);
      fetchTasks();
    } catch (error) {
      console.error('Error saving task', error);
      alert('Failed to save task');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await api.delete(`/tasks/${id}`);
        fetchTasks();
      } catch (error) {
        console.error('Error deleting task', error);
      }
    }
  };

  const StatusIcon = ({ status }) => {
    switch (status) {
      case 'completed': return <CheckCircle size={16} />;
      case 'in-progress': return <PlayCircle size={16} />;
      default: return <Clock size={16} />;
    }
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', marginTop: '4rem' }}>Loading tasks...</div>;

  return (
    <div className="dashboard fade-in">
      <div className="dashboard-header">
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Your Tasks</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage and organize your personal tasks</p>
        </div>
        <button onClick={handleOpenNew} className="btn btn-primary">
          <PlusCircle size={18} /> <span className="btn-text">New Task</span>
        </button>
      </div>

      {tasks.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <h3 style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>No tasks found</h3>
          <p>You haven't added any tasks yet. Create one to get started!</p>
          <button onClick={handleOpenNew} className="btn btn-primary" style={{ marginTop: '1.5rem' }}>
            <PlusCircle size={18} /> <span className="btn-text">Add Your First Task</span>
          </button>
        </div>
      ) : (
        <div className="tasks-grid">
          {tasks.map((task) => (
            <div key={task._id} className="glass-panel task-card">
              <div className="task-header">
                <h3 className="task-title">{task.title}</h3>
                <div className="task-actions">
                  <button onClick={() => handleOpenEdit(task)} className="icon-btn" title="Edit">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => handleDelete(task._id)} className="icon-btn" style={{ color: '#ef4444' }} title="Delete">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <p className="task-desc">{task.description}</p>
              
              <div className="task-footer">
                <span className={`badge badge-${task.status === 'in-progress' ? 'progress' : task.status}`}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <StatusIcon status={task.status} /> {task.status.replace('-', ' ')}
                  </span>
                </span>
                
                {user?.role === 'admin' && (
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    by {task.user?.name || 'User'}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Basic Modal */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(255, 255, 255, 0.8)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '500px', transform: 'none' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>{isEditing ? 'Edit Task' : 'Create New Task'}</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Task Title</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={currentTask.title}
                  onChange={(e) => setCurrentTask({...currentTask, title: e.target.value})}
                  required 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea 
                  className="form-input" 
                  rows="4"
                  value={currentTask.description}
                  onChange={(e) => setCurrentTask({...currentTask, description: e.target.value})}
                  required 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Status</label>
                <select 
                  className="form-input" 
                  value={currentTask.status}
                  onChange={(e) => setCurrentTask({...currentTask, status: e.target.value})}
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }}
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '2rem' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn" style={{ background: 'transparent', color: 'var(--text-secondary)' }}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {isEditing ? 'Save Changes' : 'Create Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
