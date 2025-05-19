import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { getIcon } from '../utils/iconUtils';
import { fetchTasks, updateTask, deleteTask } from '../services/taskService';
import { setTasks, setLoading, setError } from '../store/taskSlice';

const KanbanBoard = ({ openTaskForm, filter }) => {
  const dispatch = useDispatch();
  const { tasks, loading } = useSelector((state) => state.tasks);
  const [deletingTaskId, setDeletingTaskId] = useState(null);
  const [movingTaskId, setMovingTaskId] = useState(null);

  // Icons
  const PencilIcon = getIcon('Pencil');
  const TrashIcon = getIcon('Trash');
  const CalendarIcon = getIcon('Calendar');
  const AlertCircleIcon = getIcon('AlertCircle');
  const TagIcon = getIcon('Tag');

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

  // Group tasks by status
  const todoTasks = tasks.filter(task => task.status === 'todo');
  const inProgressTasks = tasks.filter(task => task.status === 'in-progress');
  const completedTasks = tasks.filter(task => task.status === 'completed');

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

  // Handle task status change
  const handleStatusChange = async (taskId, newStatus) => {
    const task = tasks.find(t => t.Id === taskId);
    if (!task) return;
    
    try {
      setMovingTaskId(taskId);
      const updatedTask = await updateTask(taskId, { ...task, status: newStatus });
      const updatedTasks = tasks.map(t => t.Id === taskId ? updatedTask : t);
      dispatch(setTasks(updatedTasks));
      toast.success('Task updated successfully');
    } catch (error) {
      toast.error(`Failed to update task: ${error.message}`);
    } finally {
      setMovingTaskId(null);
    }
  };

  // Render task card
  const TaskCard = ({ task }) => {
    const isPriority = task.priority === 'high';
    const isDeleting = deletingTaskId === task.Id;
    const isMoving = movingTaskId === task.Id;
    const formattedDate = task.dueDate ? format(new Date(task.dueDate), 'MMM d, yyyy') : null;
    
    return (
      <div className={`relative mb-3 rounded-lg bg-white p-4 shadow-md dark:bg-gray-800 ${isDeleting || isMoving ? 'opacity-50' : ''}`}>
        {isPriority && (
          <div className="absolute -right-1 -top-1 h-4 w-4 rounded-full bg-red-500" />
        )}
        <div className="mb-2 flex justify-between">
          <h3 className="font-medium">{task.title}</h3>
          <div className="flex space-x-1">
            <button 
              onClick={() => openTaskForm(task)}
              className="rounded p-1 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
              disabled={isDeleting || isMoving}
            >
              <PencilIcon className="h-4 w-4" />
            </button>
            <button 
              onClick={() => handleDeleteTask(task.Id)}
              className="rounded p-1 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
              disabled={isDeleting || isMoving}
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
        <p className="mb-3 text-sm text-gray-600 dark:text-gray-300">
          {task.description?.length > 100 
            ? `${task.description.substring(0, 100)}...` 
            : task.description}
        </p>
        <div className="flex flex-wrap gap-2">
          {task.tags && task.tags.split(',').map((tag, index) => (
            <span 
              key={index}
              className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-800 dark:bg-gray-700 dark:text-gray-200"
            >
              <TagIcon className="mr-1 h-3 w-3" />
              {tag.trim()}
            </span>
          ))}
        </div>
        <div className="mt-3 flex items-center text-xs text-gray-500 dark:text-gray-400">
          {formattedDate && (
            <span className="flex items-center">
              <CalendarIcon className="mr-1 h-3 w-3" />
              {formattedDate}
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="mt-6">
      {loading && tasks.length === 0 ? (
        <div className="flex items-center justify-center p-8">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* TO DO Column */}
          <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-850">
            <h3 className="mb-4 font-medium">To Do ({todoTasks.length})</h3>
            {todoTasks.length === 0 ? (
              <div className="flex h-24 items-center justify-center rounded-lg border-2 border-dashed border-gray-200 p-4 text-center text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
                No tasks to do
              </div>
            ) : (
              <div className="space-y-2">
                {todoTasks.map(task => (
                  <div key={task.Id}>
                    <TaskCard task={task} />
                    <div className="mt-2 flex justify-end">
                      <button
                        onClick={() => handleStatusChange(task.Id, 'in-progress')}
                        className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                        disabled={isMoving}
                      >
                        Move to In Progress →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* IN PROGRESS Column */}
          <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-850">
            <h3 className="mb-4 font-medium">In Progress ({inProgressTasks.length})</h3>
            {inProgressTasks.length === 0 ? (
              <div className="flex h-24 items-center justify-center rounded-lg border-2 border-dashed border-gray-200 p-4 text-center text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
                No tasks in progress
              </div>
            ) : (
              <div className="space-y-2">
                {inProgressTasks.map(task => (
                  <div key={task.Id}>
                    <TaskCard task={task} />
                    <div className="mt-2 flex justify-between">
                      <button
                        onClick={() => handleStatusChange(task.Id, 'todo')}
                        className="text-xs text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300"
                        disabled={isMoving}
                      >
                        ← Move to To Do
                      </button>
                      <button
                        onClick={() => handleStatusChange(task.Id, 'completed')}
                        className="text-xs text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                        disabled={isMoving}
                      >
                        Move to Completed →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* COMPLETED Column */}
          <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-850">
            <h3 className="mb-4 font-medium">Completed ({completedTasks.length})</h3>
            {completedTasks.length === 0 ? (
              <div className="flex h-24 items-center justify-center rounded-lg border-2 border-dashed border-gray-200 p-4 text-center text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
                No completed tasks
              </div>
            ) : (
              <div className="space-y-2">
                {completedTasks.map(task => (
                  <div key={task.Id}>
                    <TaskCard task={task} />
                    <div className="mt-2 flex justify-start">
                      <button
                        onClick={() => handleStatusChange(task.Id, 'in-progress')}
                        className="text-xs text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300"
                        disabled={isMoving}
                      >
                        ← Move to In Progress
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default KanbanBoard;