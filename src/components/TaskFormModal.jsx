import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { getIcon } from '../utils/iconUtils';
import { addTask, updateTask as updateTaskAction } from '../store/taskSlice';
import { createTask, updateTask } from '../services/taskService';

const TaskFormModal = ({ isOpen, onClose, task = null }) => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    dueDate: '',
    tags: []
  });
  
  const [tagInput, setTagInput] = useState('');
  
  // Icons
  const XIcon = getIcon('X');
  
  // Initialize form with task data when editing
  useEffect(() => {
    if (task) {
      const processedTags = task.tags && typeof task.tags === 'string' 
        ? task.tags.split(',').map(tag => tag.trim()) 
        : task.tags || [];
      
      setFormData({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'todo',
        priority: task.priority || 'medium',
        dueDate: task.dueDate || '',
        tags: processedTags
      });
    } else {
      setFormData({
        title: '',
        description: '',
        status: 'todo',
        priority: 'medium',
        dueDate: '',
        tags: []
      });
    }
    
    setTagInput('');
    setFormError('');
  }, [task, isOpen]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleTagKeyPress = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, tagInput.trim()]
        }));
      }
      setTagInput('');
    }
  };
  
  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    
    if (!formData.title.trim()) {
      setFormError('Please enter a task title');
      return;
    }
    
    if (!isAuthenticated) {
      setFormError('You need to be logged in to create or edit tasks');
      return;
    }
    
    setLoading(true);
    
    try {
      // Format tags for storage
      const tagsForStorage = Array.isArray(formData.tags) ? formData.tags.join(',') : formData.tags;
      
      if (task) {
        // Update existing task
        const updatedTask = await updateTask(task.Id, {
          ...formData,
          tags: tagsForStorage
        });
        
        dispatch(updateTaskAction(updatedTask));
        toast.success('Task updated successfully');
      } else {
        // Create new task
        const newTask = await createTask({
          ...formData,
          tags: tagsForStorage
        });
        
        dispatch(addTask(newTask));
        toast.success('Task created successfully');
      }
      
      onClose();
    } catch (error) {
      console.error("Task operation failed:", error);
      setFormError(error.message || 'Failed to save the task');
      toast.error(error.message || 'Failed to save the task');
    } finally {
      setLoading(false);
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity dark:bg-gray-900 dark:bg-opacity-75" 
          onClick={onClose}
        />
        
        <span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">&#8203;</span>
        
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="inline-block w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left align-bottom shadow-xl transition-all dark:bg-gray-800 sm:my-8 sm:align-middle sm:max-w-lg sm:p-6"
        >
          <div className="flex items-center justify-between pb-3">
            <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
              {task ? 'Edit Task' : 'Add New Task'}
            </h3>
            <button
              onClick={onClose}
              className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none dark:bg-gray-800 dark:text-gray-500 dark:hover:text-gray-400"
            >
              <XIcon className="h-5 w-5" />
            </button>
          </div>
          
          {formError && (
            <div className="mb-4 rounded-md bg-red-50 p-3 dark:bg-red-900/30">
              <p className="text-sm text-red-700 dark:text-red-400">{formError}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                placeholder="Task title"
                required
              />
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="3"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                placeholder="Task description"
              />
            </div>
            
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                >
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Priority
                </label>
                <select
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
            
            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Due Date
              </label>
              <input
                type="date"
                id="dueDate"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
              />
            </div>
            
            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Tags
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <input
                  type="text"
                  id="tags"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyPress}
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                  placeholder="Add tag and press Enter"
                />
              </div>
              
              {formData.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {formData.tags.map(tag => (
                    <span 
                      key={tag} 
                      className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1.5 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-500 dark:text-gray-500 dark:hover:bg-gray-600 dark:hover:text-gray-400"
                      >
                        <XIcon className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Press Enter after each tag to add it
              </p>
            </div>
            
            <div className="mt-5 flex justify-end gap-2 sm:mt-6">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 dark:focus:ring-offset-gray-800"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <svg className="mr-2 h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {task ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  task ? 'Update Task' : 'Add Task'
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default TaskFormModal;