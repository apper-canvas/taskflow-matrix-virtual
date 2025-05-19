import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { getIcon } from '../utils/iconUtils';
import { fetchTasks, deleteTask } from '../services/taskService';
import { setTasks, setLoading, setError } from '../store/taskSlice';

const TaskList = ({ openTaskForm, filter }) => {
  const dispatch = useDispatch();
  const { tasks, loading } = useSelector((state) => state.tasks);
  const [deletingTaskId, setDeletingTaskId] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: 'dueDate',
    direction: 'asc',
  });

  // Icons
  const PencilIcon = getIcon('Pencil');
  const TrashIcon = getIcon('Trash');
  const ChevronUpIcon = getIcon('ChevronUp');
  const ChevronDownIcon = getIcon('ChevronDown');
  const CheckIcon = getIcon('Check');
  const ClockIcon = getIcon('Clock');
  const FlagIcon = getIcon('Flag');

  // Fetch tasks
  useEffect(() => {
    const loadTasks = async () => {
      try {
        dispatch(setLoading(true));
        const tasksData = await fetchTasks(filter);
        dispatch(setTasks(tasksData));
      } catch (error) {
        dispatch(setError(error.message));
        toast.error(`Failed to load tasks: ${error.message}`);
      } finally {
        dispatch(setLoading(false));
      }
    };

    loadTasks();
  }, [dispatch, filter]);

  // Handle task deletion
  const handleDeleteTask = async (taskId) => {
    try {
      setDeletingTaskId(taskId);
      await deleteTask(taskId);
      dispatch(setTasks(tasks.filter(task => task.Id !== taskId)));
      toast.success('Task deleted successfully');
    } catch (error) {
      toast.error(`Failed to delete task: ${error.message}`);
    } finally {
      setDeletingTaskId(null);
    }
  };

  // Sort tasks
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortedTasks = () => {
    const sortableTasks = [...tasks];
    if (sortConfig.key) {
      sortableTasks.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];
        
        // Handle date comparison
        if (sortConfig.key === 'dueDate') {
          aValue = aValue ? new Date(aValue) : new Date(0);
          bValue = bValue ? new Date(bValue) : new Date(0);
        }
        
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableTasks;
  };

  // Helper for status badges
  const getStatusBadge = (status) => {
    let color = '';
    let icon = null;
    
    switch (status) {
      case 'todo':
        color = 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
        icon = <ClockIcon className="mr-1 h-3 w-3" />;
        break;
      case 'in-progress':
        color = 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
        icon = <ClockIcon className="mr-1 h-3 w-3" />;
        break;
      case 'completed':
        color = 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
        icon = <CheckIcon className="mr-1 h-3 w-3" />;
        break;
      default:
        color = 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
    
    return (
      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${color}`}>
        {icon}
        {status === 'todo' ? 'To Do' : 
         status === 'in-progress' ? 'In Progress' : 
         status === 'completed' ? 'Completed' : status}
      </span>
    );
  };

  // Helper for priority badges
  const getPriorityBadge = (priority) => {
    let color = '';
    
    switch (priority) {
      case 'high':
        color = 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
        break;
      case 'medium':
        color = 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
        break;
      case 'low':
        color = 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
        break;
      default:
        color = 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
    
    return (
      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${color}`}>
        <FlagIcon className="mr-1 h-3 w-3" />
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </span>
    );
  };

  const sortedTasks = getSortedTasks();

  return (
    <div className="mt-6 overflow-x-auto rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
      {loading && tasks.length === 0 ? (
        <div className="flex items-center justify-center p-8">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      ) : (
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th 
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300 cursor-pointer"
                onClick={() => requestSort('title')}
              >
                <div className="flex items-center">
                  Title
                  {sortConfig.key === 'title' && (
                    sortConfig.direction === 'asc' ? 
                    <ChevronUpIcon className="ml-1 h-4 w-4" /> : 
                    <ChevronDownIcon className="ml-1 h-4 w-4" />
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300 cursor-pointer"
                onClick={() => requestSort('status')}
              >
                <div className="flex items-center">
                  Status
                  {sortConfig.key === 'status' && (
                    sortConfig.direction === 'asc' ? 
                    <ChevronUpIcon className="ml-1 h-4 w-4" /> : 
                    <ChevronDownIcon className="ml-1 h-4 w-4" />
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300 cursor-pointer"
                onClick={() => requestSort('priority')}
              >
                <div className="flex items-center">
                  Priority
                  {sortConfig.key === 'priority' && (
                    sortConfig.direction === 'asc' ? 
                    <ChevronUpIcon className="ml-1 h-4 w-4" /> : 
                    <ChevronDownIcon className="ml-1 h-4 w-4" />
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300 cursor-pointer"
                onClick={() => requestSort('dueDate')}
              >
                <div className="flex items-center">
                  Due Date
                  {sortConfig.key === 'dueDate' && (
                    sortConfig.direction === 'asc' ? 
                    <ChevronUpIcon className="ml-1 h-4 w-4" /> : 
                    <ChevronDownIcon className="ml-1 h-4 w-4" />
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
            {sortedTasks.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                  No tasks found
                </td>
              </tr>
            ) : (
              sortedTasks.map((task) => (
                <tr key={task.Id} className={deletingTaskId === task.Id ? 'opacity-50' : ''}>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{task.title}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {task.description && task.description.length > 50 
                        ? `${task.description.substring(0, 50)}...` 
                        : task.description}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {getStatusBadge(task.status)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {getPriorityBadge(task.priority)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {task.dueDate ? format(new Date(task.dueDate), 'MMM d, yyyy') : '-'}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    <button
                      onClick={() => openTaskForm(task)}
                      className="mr-2 text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                      disabled={deletingTaskId === task.Id}
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteTask(task.Id)}
                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      disabled={deletingTaskId === task.Id}
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TaskList;