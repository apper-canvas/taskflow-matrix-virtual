import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { getIcon } from '../utils/iconUtils';
import { setTasks, setLoading, setError } from '../store/taskSlice';
import { fetchTasks, updateTask, deleteTask } from '../services/taskService';

const KanbanBoard = ({ openTaskForm, filter }) => {
  const dispatch = useDispatch();
  const { tasks, loading, error } = useSelector((state) => state.tasks);
  const { isAuthenticated } = useSelector((state) => state.user);

  // Icons
  const CheckIcon = getIcon('Check');
  const EditIcon = getIcon('Edit');
  const TrashIcon = getIcon('Trash');
  const CalendarIcon = getIcon('Calendar');
  const TagIcon = getIcon('Tag');
  const StarIcon = getIcon('Star');

  // Load tasks
  useEffect(() => {
    const loadTasks = async () => {
      if (!isAuthenticated) return;
      
      try {
        dispatch(setLoading(true));
        const tasksData = await fetchTasks(filter);
        dispatch(setTasks(tasksData));
      } catch (error) {
        console.error("Failed to load tasks:", error);
        dispatch(setError(error.message || "Failed to load tasks"));
        toast.error("Failed to load tasks: " + (error.message || "Unknown error"));
      }
    };
    
    loadTasks();
  }, [dispatch, isAuthenticated, filter]);

  // Function to get tasks by status
  const getTasksByStatus = (status) => {
    return tasks.filter(task => task.status === status);
  };

  // Function to update task status
  const handleUpdateTaskStatus = async (taskId, newStatus) => {
    try {
      const taskToUpdate = tasks.find(t => t.Id === taskId);
      if (!taskToUpdate) return;
      
      const updatedTask = await updateTask(taskId, { ...taskToUpdate, status: newStatus });
      
      // Update local state with the result
      const updatedTasks = tasks.map(task => 
        task.Id === taskId ? updatedTask : task
      );
      
      dispatch(setTasks(updatedTasks));
      toast.success(`Task moved to ${newStatus.replace('-', ' ')}`);
    } catch (error) {
      toast.error("Failed to update task: " + (error.message || "Unknown error"));
    }
  };

  // Function to delete a task
  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTask(taskId);
      
      // Update local state
      const filteredTasks = tasks.filter(task => task.Id !== taskId);
      dispatch(setTasks(filteredTasks));
      toast.success("Task deleted successfully");
    } catch (error) {
      toast.error("Failed to delete task: " + (error.message || "Unknown error"));
    }
  };

  // Priority color classes
  const priorityColors = {
    low: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    medium: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
    high: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
  };

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center">
        <p className="text-red-500 dark:text-red-400 mb-4">{error}</p>
        <button 
          onClick={() => dispatch(fetchTasks(filter))}
          className="btn btn-primary"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {/* To Do Column */}
      <div className="flex flex-col rounded-xl bg-gray-50 dark:bg-gray-800/50">
        <div className="border-b border-gray-200 p-4 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">To Do</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{getTasksByStatus('todo').length} tasks</p>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          <AnimatePresence>
            {getTasksByStatus('todo').length === 0 ? (
              <div className="flex h-24 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400">No tasks</p>
              </div>
            ) : (
              <div className="space-y-3">
                {getTasksByStatus('todo').map(task => (
                  <motion.div
                    key={task.Id}
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="rounded-lg bg-white p-4 shadow-soft dark:bg-gray-800"
                  >
                    <div className="mb-2 flex items-start justify-between">
                      <h4 className="text-md font-medium text-gray-900 dark:text-white">{task.title}</h4>
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => openTaskForm(task)}
                          className="rounded p-1 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                          aria-label="Edit task"
                        >
                          <EditIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteTask(task.Id)}
                          className="rounded p-1 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                          aria-label="Delete task"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    
                    {task.description && (
                      <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
                        {task.description}
                      </p>
                    )}
                    
                    <div className="mb-3 flex flex-wrap gap-1.5">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        priorityColors[task.priority]
                      }`}>
                        <StarIcon className="mr-1 h-3 w-3" />
                        {task.priority}
                      </span>
                      
                      {task.dueDate && (
                        <span className="inline-flex items-center rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300">
                          <CalendarIcon className="mr-1 h-3 w-3" />
                          {task.dueDate}
                        </span>
                      )}
                      
                      {task.tags && typeof task.tags === 'string' && task.tags.split(',').slice(0, 2).map(tag => (
                        <span 
                          key={tag} 
                          className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                        >
                          <TagIcon className="mr-1 h-3 w-3" />
                          {tag.trim()}
                        </span>
                      ))}
                      
                      {task.tags && Array.isArray(task.tags) && task.tags.slice(0, 2).map(tag => (
                        <span 
                          key={tag} 
                          className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                        >
                          <TagIcon className="mr-1 h-3 w-3" />
                          {tag}
                        </span>
                      ))}
                      
                      {task.tags && ((typeof task.tags === 'string' && task.tags.split(',').length > 2) || 
                                    (Array.isArray(task.tags) && task.tags.length > 2)) && (
                        <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                          +{typeof task.tags === 'string' ? task.tags.split(',').length - 2 : task.tags.length - 2}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex justify-end">
                      <button
                        onClick={() => handleUpdateTaskStatus(task.Id, 'in-progress')}
                        className="text-xs font-medium text-primary hover:text-primary-dark dark:text-primary-light dark:hover:text-primary"
                      >
                        Move to In Progress
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      {/* In Progress Column */}
      <div className="flex flex-col rounded-xl bg-gray-50 dark:bg-gray-800/50">
        <div className="border-b border-gray-200 p-4 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">In Progress</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{getTasksByStatus('in-progress').length} tasks</p>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          <AnimatePresence>
            {getTasksByStatus('in-progress').length === 0 ? (
              <div className="flex h-24 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400">No tasks</p>
              </div>
            ) : (
              <div className="space-y-3">
                {getTasksByStatus('in-progress').map(task => (
                  <motion.div
                    key={task.Id}
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="rounded-lg bg-white p-4 shadow-soft dark:bg-gray-800"
                  >
                    {/* Task content - similar to todo column */}
                    <div className="mb-2 flex items-start justify-between">
                      <h4 className="text-md font-medium text-gray-900 dark:text-white">{task.title}</h4>
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => openTaskForm(task)}
                          className="rounded p-1 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                          aria-label="Edit task"
                        >
                          <EditIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteTask(task.Id)}
                          className="rounded p-1 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                          aria-label="Delete task"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    
                    {/* Task actions */}
                    <div className="flex justify-between">
                      <button
                        onClick={() => handleUpdateTaskStatus(task.Id, 'todo')}
                        className="text-xs font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                      >
                        Move to To Do
                      </button>
                      <button
                        onClick={() => handleUpdateTaskStatus(task.Id, 'completed')}
                        className="text-xs font-medium text-primary hover:text-primary-dark dark:text-primary-light dark:hover:text-primary"
                      >
                        Mark Completed
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      {/* Completed Column */}
      <div className="flex flex-col rounded-xl bg-gray-50 dark:bg-gray-800/50">
        <div className="border-b border-gray-200 p-4 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Completed</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{getTasksByStatus('completed').length} tasks</p>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          <AnimatePresence>
            {getTasksByStatus('completed').length === 0 ? (
              <div className="flex h-24 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400">No tasks</p>
              </div>
            ) : (
              <div className="space-y-3">
                {getTasksByStatus('completed').map(task => (
                  <motion.div
                    key={task.Id}
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="rounded-lg bg-white p-4 shadow-soft dark:bg-gray-800"
                  >
                    {/* Task content - similar but with strikethrough */}
                    <div className="mb-2 flex items-start justify-between">
                      <h4 className="text-md font-medium text-gray-900 line-through dark:text-white">{task.title}</h4>
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => handleDeleteTask(task.Id)}
                          className="rounded p-1 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                          aria-label="Delete task"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    
                    {/* Task actions */}
                    <div className="flex justify-start">
                      <button
                        onClick={() => handleUpdateTaskStatus(task.Id, 'in-progress')}
                        className="text-xs font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                      >
                        Move to In Progress
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default KanbanBoard;