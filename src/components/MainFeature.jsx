import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { getIcon } from '../utils/iconUtils';

// Initialize with sample tasks
const initialTasks = [
  {
    id: '1',
    title: 'Finalize project proposal',
    description: 'Complete the Q3 project proposal with budget and timeline',
    status: 'todo',
    priority: 'high',
    dueDate: '2023-07-15',
    tags: ['work', 'planning']
  },
  {
    id: '2',
    title: 'Weekly team meeting',
    description: 'Discuss project progress and address any roadblocks',
    status: 'todo',
    priority: 'medium',
    dueDate: '2023-07-10',
    tags: ['meeting', 'team']
  },
  {
    id: '3',
    title: 'Update design system',
    description: 'Implement new component variants and documentation',
    status: 'in-progress',
    priority: 'medium',
    dueDate: '2023-07-20',
    tags: ['design', 'development']
  },
  {
    id: '4',
    title: 'Prepare monthly report',
    description: 'Compile metrics and insights for the monthly performance report',
    status: 'completed',
    priority: 'high',
    dueDate: '2023-07-05',
    tags: ['reporting', 'analysis']
  }
];

const MainFeature = () => {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : initialTasks;
  });
  
  const [viewMode, setViewMode] = useState('kanban');
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    dueDate: '',
    tags: []
  });
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [tagInput, setTagInput] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Icons as components
  const PlusIcon = getIcon('Plus');
  const CheckIcon = getIcon('Check');
  const EditIcon = getIcon('Edit');
  const TrashIcon = getIcon('Trash');
  const XIcon = getIcon('X');
  const CalendarIcon = getIcon('Calendar');
  const TagIcon = getIcon('Tag');
  const SearchIcon = getIcon('Search');
  const ClipboardListIcon = getIcon('ClipboardList');
  const LayoutGridIcon = getIcon('LayoutGrid');
  const FilterIcon = getIcon('Filter');
  const StarIcon = getIcon('Star');
  const ClockIcon = getIcon('Clock');

  // Save tasks to localStorage when they change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);
  
  // Filter tasks based on activeFilter and searchTerm
  const filteredTasks = tasks.filter(task => {
    const matchesFilter = 
      activeFilter === 'all' || 
      (activeFilter === 'today' && task.dueDate === format(new Date(), 'yyyy-MM-dd')) ||
      (activeFilter === 'high-priority' && task.priority === 'high') ||
      activeFilter === task.status;
    
    const matchesSearch = 
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesFilter && matchesSearch;
  });
  
  // Function to get tasks by status
  const getTasksByStatus = (status) => {
    return filteredTasks.filter(task => task.status === status);
  };
  
  // Task form handlers
  const openTaskForm = (task = null) => {
    if (task) {
      setEditingTask(task);
      setNewTask({ ...task });
    } else {
      setEditingTask(null);
      setNewTask({
        title: '',
        description: '',
        status: 'todo',
        priority: 'medium',
        dueDate: '',
        tags: []
      });
    }
    setIsFormOpen(true);
  };
  
  const closeTaskForm = () => {
    setIsFormOpen(false);
    setEditingTask(null);
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask({ ...newTask, [name]: value });
  };
  
  const handleTagKeyPress = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!newTask.tags.includes(tagInput.trim())) {
        setNewTask({
          ...newTask,
          tags: [...newTask.tags, tagInput.trim()]
        });
      }
      setTagInput('');
    }
  };
  
  const removeTag = (tagToRemove) => {
    setNewTask({
      ...newTask,
      tags: newTask.tags.filter(tag => tag !== tagToRemove)
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!newTask.title.trim()) {
      toast.error('Please enter a task title');
      return;
    }
    
    if (editingTask) {
      // Update existing task
      setTasks(tasks.map(task => 
        task.id === editingTask.id ? { ...newTask, id: task.id } : task
      ));
      toast.success('Task updated successfully');
    } else {
      // Add new task
      const task = {
        ...newTask,
        id: Date.now().toString()
      };
      setTasks([...tasks, task]);
      toast.success('Task added successfully');
    }
    
    closeTaskForm();
  };
  
  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
    toast.success('Task deleted successfully');
  };
  
  const updateTaskStatus = (id, newStatus) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, status: newStatus } : task
    ));
    toast.info(`Task moved to ${newStatus.replace('-', ' ')}`);
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
  
  return (
    <div className="space-y-6">
      {/* Controls bar */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode('kanban')}
            className={`rounded-lg p-2 text-gray-600 transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 ${
              viewMode === 'kanban' ? 'bg-gray-100 dark:bg-gray-800' : ''
            }`}
            aria-label="Kanban view"
          >
            <LayoutGridIcon className="h-5 w-5" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`rounded-lg p-2 text-gray-600 transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 ${
              viewMode === 'list' ? 'bg-gray-100 dark:bg-gray-800' : ''
            }`}
            aria-label="List view"
          >
            <ClipboardListIcon className="h-5 w-5" />
          </button>
          
          <div className="ml-2 flex items-center rounded-lg border border-gray-300 bg-white dark:border-gray-700 dark:bg-gray-800">
            <SearchIcon className="ml-3 h-4 w-4 text-gray-500 dark:text-gray-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent px-3 py-2 text-sm outline-none dark:text-white md:w-36 lg:w-48"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="relative">
            <select
              value={activeFilter}
              onChange={(e) => setActiveFilter(e.target.value)}
              className="h-10 rounded-lg border border-gray-300 bg-white pl-10 pr-4 text-sm text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
            >
              <option value="all">All Tasks</option>
              <option value="today">Due Today</option>
              <option value="high-priority">High Priority</option>
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
            <FilterIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
          </div>
          
          <button
            onClick={() => openTaskForm()}
            className="flex h-10 items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-gray-900"
          >
            <PlusIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Add Task</span>
          </button>
        </div>
      </div>
      
      {/* Kanban View */}
      {viewMode === 'kanban' && (
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
                        key={task.id}
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
                              onClick={() => deleteTask(task.id)}
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
                          
                          {task.tags.slice(0, 2).map(tag => (
                            <span 
                              key={tag} 
                              className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                            >
                              <TagIcon className="mr-1 h-3 w-3" />
                              {tag}
                            </span>
                          ))}
                          
                          {task.tags.length > 2 && (
                            <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                              +{task.tags.length - 2}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex justify-end">
                          <button
                            onClick={() => updateTaskStatus(task.id, 'in-progress')}
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
                        key={task.id}
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
                              onClick={() => deleteTask(task.id)}
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
                          
                          {task.tags.slice(0, 2).map(tag => (
                            <span 
                              key={tag} 
                              className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                            >
                              <TagIcon className="mr-1 h-3 w-3" />
                              {tag}
                            </span>
                          ))}
                          
                          {task.tags.length > 2 && (
                            <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                              +{task.tags.length - 2}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex justify-between">
                          <button
                            onClick={() => updateTaskStatus(task.id, 'todo')}
                            className="text-xs font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                          >
                            Move to To Do
                          </button>
                          <button
                            onClick={() => updateTaskStatus(task.id, 'completed')}
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
                        key={task.id}
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="rounded-lg bg-white p-4 shadow-soft dark:bg-gray-800"
                      >
                        <div className="mb-2 flex items-start justify-between">
                          <h4 className="text-md font-medium text-gray-900 line-through dark:text-white">
                            {task.title}
                          </h4>
                          <div className="flex items-center space-x-1">
                            <button
                              onClick={() => deleteTask(task.id)}
                              className="rounded p-1 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                              aria-label="Delete task"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        
                        {task.description && (
                          <p className="mb-3 text-sm text-gray-500 line-through dark:text-gray-500">
                            {task.description}
                          </p>
                        )}
                        
                        <div className="mb-3 flex flex-wrap gap-1.5">
                          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-300">
                            <CheckIcon className="mr-1 h-3 w-3" />
                            Completed
                          </span>
                          
                          {task.dueDate && (
                            <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-400">
                              <CalendarIcon className="mr-1 h-3 w-3" />
                              {task.dueDate}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex justify-start">
                          <button
                            onClick={() => updateTaskStatus(task.id, 'in-progress')}
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
      )}
      
      {/* List View */}
      {viewMode === 'list' && (
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
                {filteredTasks.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                      No tasks found. Create a new task to get started.
                    </td>
                  </tr>
                ) : (
                  filteredTasks.map(task => (
                    <tr key={task.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
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
                          
                          {task.tags.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1">
                              {task.tags.map(tag => (
                                <span 
                                  key={tag} 
                                  className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                                >
                                  {tag}
                                </span>
                              ))}
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
                              onClick={() => updateTaskStatus(task.id, 'completed')}
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
                            onClick={() => deleteTask(task.id)}
                            className="rounded p-1 text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/30"
                            aria-label="Delete task"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {/* Task Form Modal */}
      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
              <div 
                className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity dark:bg-gray-900 dark:bg-opacity-75" 
                onClick={closeTaskForm}
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
                    {editingTask ? 'Edit Task' : 'Add New Task'}
                  </h3>
                  <button
                    onClick={closeTaskForm}
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none dark:bg-gray-800 dark:text-gray-500 dark:hover:text-gray-400"
                  >
                    <XIcon className="h-5 w-5" />
                  </button>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Title *
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={newTask.title}
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
                      value={newTask.description}
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
                        value={newTask.status}
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
                        value={newTask.priority}
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
                      value={newTask.dueDate}
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
                    
                    {newTask.tags.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {newTask.tags.map(tag => (
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
                      onClick={closeTaskForm}
                      className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 dark:focus:ring-offset-gray-800"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="inline-flex justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                    >
                      {editingTask ? 'Update Task' : 'Add Task'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MainFeature;