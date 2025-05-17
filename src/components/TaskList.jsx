import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { getIcon } from '../utils/iconUtils';
import { setTasks, setLoading, setError } from '../store/taskSlice';
import { fetchTasks, updateTask, deleteTask } from '../services/taskService';

const TaskList = ({ openTaskForm, filter }) => {
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
  
  // Status color classes
  const statusColors = {
    todo: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
    'in-progress': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
    completed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
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

  if (!tasks || tasks.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700">
        <div className="text-center">
          <p className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-4">No tasks found</p>
          <button
            onClick={() => openTaskForm()}
            className="btn btn-primary"
          >
            Create Your First Task
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900/50">
            <tr>
              <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-white sm:pl-6">Task</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Status</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Priority</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Due Date</th>
              <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {tasks.map(task => (
              <tr key={task.Id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="whitespace-normal py-4 pl-4 pr-3 text-sm sm:pl-6">
                  <div className="max-w-xs">
                    <div className="font-medium text-gray-900 dark:text-white">{task.title}</div>
                    {task.description && (
                      <div className="mt-1 truncate text-gray-500 dark:text-gray-400">
                        {task.description.length > 60
                          ? `${task.description.substring(0, 60)}...`
                          : task.description}
                      </div>
                    )}
                    
                    {task.tags && task.tags.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {typeof task.tags === 'string' 
                          ? task.tags.split(',').map(tag => (
                              <span 
                                key={tag} 
                                className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                              >
                                {tag.trim()}
                              </span>
                            ))
                          : Array.isArray(task.tags) && task.tags.map(tag => (
                              <span 
                                key={tag} 
                                className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                              >
                                {tag}
                              </span>
                            ))
                        }
                      </div>
                    )}
                  </div>
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm">
                  <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                    statusColors[task.status]
                  }`}>
                    {task.status === 'todo' ? 'To Do' : 
                     task.status === 'in-progress' ? 'In Progress' : 
                     'Completed'}
                  </span>
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm">
                  <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                    priorityColors[task.priority]
                  }`}>
                    {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                  </span>
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                  {task.dueDate ? (
                    <div className="flex items-center">
                      <CalendarIcon className="mr-1 h-4 w-4" />
                      {task.dueDate}
                    </div>
                  ) : (
                    <span>Not set</span>
                  )}
                </td>
                <td className="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                  <div className="flex justify-end gap-2">
                    {task.status !== 'completed' && (
                      <button
                        onClick={() => handleUpdateTaskStatus(task.Id, 'completed')}
                        className="rounded p-1 text-green-600 hover:bg-green-100 dark:text-green-400 dark:hover:bg-green-900/30"
                        aria-label="Mark as completed"
                      >
                        <CheckIcon className="h-4 w-4" />
                      </button>
                    )}
                    
                    <button
                      onClick={() => openTaskForm(task)}
                      className="rounded p-1 text-indigo-600 hover:bg-indigo-100 dark:text-indigo-400 dark:hover:bg-indigo-900/30"
                      aria-label="Edit task"
                    >
                      <EditIcon className="h-4 w-4" />
                    </button>
                    
                    <button
                      onClick={() => handleDeleteTask(task.Id)}
                      className="rounded p-1 text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/30"
                      aria-label="Delete task"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TaskList;