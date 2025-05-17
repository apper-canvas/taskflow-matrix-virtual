import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { getIcon } from '../utils/iconUtils';
import { setActiveFilter, setSearchTerm, setViewMode } from '../store/taskSlice';
import TaskList from './TaskList';
import KanbanBoard from './KanbanBoard';
import TaskFormModal from './TaskFormModal';

const MainFeature = () => {
  const dispatch = useDispatch();
  const { viewMode, activeFilter, searchTerm } = useSelector((state) => state.tasks);
  const { isAuthenticated } = useSelector((state) => state.user);

  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Icons
  const PlusIcon = getIcon('Plus');
  const SearchIcon = getIcon('Search');
  const ClipboardListIcon = getIcon('ClipboardList');
  const LayoutGridIcon = getIcon('LayoutGrid');
  const FilterIcon = getIcon('Filter');

  // Handle view mode change
  const handleViewModeChange = (mode) => {
    dispatch(setViewMode(mode));
  };

  // Handle filter change
  const handleFilterChange = (e) => {
    dispatch(setActiveFilter(e.target.value));
  };

  // Handle search
  const handleSearchChange = (e) => {
    dispatch(setSearchTerm(e.target.value));
  };

  // Task form handlers
  const openTaskForm = (task = null) => {
    if (!isAuthenticated) {
      toast.error('Please log in to manage tasks');
      return;
    }
    setEditingTask(task);
    setIsTaskFormOpen(true);
  };

  const closeTaskForm = () => {
    setIsTaskFormOpen(false);
    setEditingTask(null);
  };

  // Create filter object for services
  const filter = {
    status: activeFilter === 'todo' || activeFilter === 'in-progress' || activeFilter === 'completed' ? activeFilter : undefined,
    priority: activeFilter === 'high-priority' ? 'high' : undefined,
    searchTerm: searchTerm || undefined
  };

  return (
    <div className="space-y-6">
      {/* Controls bar */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleViewModeChange('kanban')}
            className={`rounded-lg p-2 text-gray-600 transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 ${
              viewMode === 'kanban' ? 'bg-gray-100 dark:bg-gray-800' : ''
            }`}
            aria-label="Kanban view"
          >
            <LayoutGridIcon className="h-5 w-5" />
          </button>
          <button
            onClick={() => handleViewModeChange('list')}
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
              onChange={handleSearchChange}
              className="w-full bg-transparent px-3 py-2 text-sm outline-none dark:text-white md:w-36 lg:w-48"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="relative">
            <select
              value={activeFilter}
              onChange={handleFilterChange}
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
      {viewMode === 'kanban' && <KanbanBoard openTaskForm={openTaskForm} filter={filter} />}
      
      {/* List View */}
      {viewMode === 'list' && <TaskList openTaskForm={openTaskForm} filter={filter} />}
      
      {/* Task Form Modal */}
      <TaskFormModal 
        isOpen={isTaskFormOpen} 
        onClose={closeTaskForm} 
        task={editingTask} 
      />
    </div>
  );
};

export default MainFeature;