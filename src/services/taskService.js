// taskService.js - Service for task data operations

// Helper to initialize ApperClient
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

// The table name for tasks
const TABLE_NAME = 'task';

// Fields with visibility "Updateable" to be used in create/update operations
const UPDATEABLE_FIELDS = [
  'Name',
  'Tags',
  'Owner',
  'title',
  'description',
  'status',
  'priority',
  'dueDate', 
  'tags'
];

/**
 * Fetches all tasks with optional filtering
 */
export const fetchTasks = async (filter = {}) => {
  try {
    const apperClient = getApperClient();
    
    // Create query parameters based on filter
    const params = {
      fields: ['Id', 'Name', 'Tags', 'Owner', 'title', 'description', 'status', 'priority', 'dueDate', 'tags', 'CreatedOn'],
      orderBy: [
        {
          field: 'CreatedOn',
          direction: 'DESC'
        }
      ]
    };
    
    // Add where conditions if filter is provided
    if (filter.status) {
      params.where = [
        {
          fieldName: 'status',
          operator: 'ExactMatch',
          values: [filter.status]
        }
      ];
    }
    
    if (filter.priority) {
      if (!params.where) params.where = [];
      params.where.push({
        fieldName: 'priority',
        operator: 'ExactMatch',
        values: [filter.priority]
      });
    }
    
    if (filter.searchTerm) {
      if (!params.whereGroups) params.whereGroups = [];
      params.whereGroups.push({
        operator: 'OR',
        subGroups: [
          {
            conditions: [
              {
                fieldName: 'title',
                operator: 'Contains',
                values: [filter.searchTerm]
              }
            ],
            operator: ''
          },
          {
            conditions: [
              {
                fieldName: 'description',
                operator: 'Contains',
                values: [filter.searchTerm]
              }
            ],
            operator: ''
          }
        ]
      });
    }

    const response = await apperClient.fetchRecords(TABLE_NAME, params);
    
    if (!response || !response.data) {
      return [];
    }
    
    return response.data;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
};

/**
 * Gets a single task by ID
 */
export const getTaskById = async (taskId) => {
  try {
    const apperClient = getApperClient();
    const response = await apperClient.getRecordById(TABLE_NAME, taskId);
    return response.data;
  } catch (error) {
    console.error(`Error fetching task with ID ${taskId}:`, error);
    throw error;
  }
};

/**
 * Creates a new task
 */
export const createTask = async (taskData) => {
  try {
    const apperClient = getApperClient();
    
    // Filter to only include updateable fields
    const taskRecord = {};
    Object.keys(taskData).forEach(key => {
      if (UPDATEABLE_FIELDS.includes(key)) {
        taskRecord[key] = taskData[key];
      }
    });
    
    const params = {
      records: [taskRecord]
    };
    
    const response = await apperClient.createRecord(TABLE_NAME, params);
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to create task');
    }
    
    return response.results[0].data;
  } catch (error) {
    console.error("Error creating task:", error);
    throw error;
  }
};

/**
 * Updates an existing task
 */
export const updateTask = async (taskId, taskData) => {
  try {
    const apperClient = getApperClient();
    
    // Filter to only include updateable fields + Id
    const taskRecord = { Id: taskId };
    Object.keys(taskData).forEach(key => {
      if (UPDATEABLE_FIELDS.includes(key)) {
        taskRecord[key] = taskData[key];
      }
    });
    
    const params = {
      records: [taskRecord]
    };
    
    const response = await apperClient.updateRecord(TABLE_NAME, params);
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to update task');
    }
    
    return response.results[0].data;
  } catch (error) {
    console.error(`Error updating task with ID ${taskId}:`, error);
    throw error;
  }
};

/**
 * Deletes a task
 */
export const deleteTask = async (taskId) => {
  try {
    const apperClient = getApperClient();
    
    const params = {
      RecordIds: [taskId]
    };
    
    const response = await apperClient.deleteRecord(TABLE_NAME, params);
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to delete task');
    }
    
    return true;
  } catch (error) {
    console.error(`Error deleting task with ID ${taskId}:`, error);
    throw error;
  }
};