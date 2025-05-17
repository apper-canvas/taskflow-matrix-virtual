import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  tasks: [],
  loading: false,
  error: null,
  activeFilter: 'all',
  searchTerm: '',
  viewMode: 'kanban'
};

export const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setTasks: (state, action) => {
      state.tasks = action.payload;
      state.loading = false;
      state.error = null;
    },
    addTask: (state, action) => {
      state.tasks.push(action.payload);
    },
    updateTask: (state, action) => {
      const index = state.tasks.findIndex(task => task.Id === action.payload.Id);
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
    },
    removeTask: (state, action) => {
      state.tasks = state.tasks.filter(task => task.Id !== action.payload);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    setActiveFilter: (state, action) => {
      state.activeFilter = action.payload;
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    setViewMode: (state, action) => {
      state.viewMode = action.payload;
    }
  }
});

export const { setTasks, addTask, updateTask, removeTask, setLoading, setError, setActiveFilter, setSearchTerm, setViewMode } = taskSlice.actions;

export default taskSlice.reducer;