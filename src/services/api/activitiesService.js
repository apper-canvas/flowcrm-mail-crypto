import activitiesData from "@/services/mockData/activities.json";

// Create a copy of the data to avoid mutations
let activities = [...activitiesData];
let nextId = Math.max(...activities.map(a => a.Id)) + 1;

// Simulate network delay
async function delay(ms = 300) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Get all activities
async function getAll() {
  await delay();
  return [...activities].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
}

// Get activities by contact ID
async function getByContactId(contactId) {
  await delay();
  if (!contactId || typeof contactId !== 'number') {
    throw new Error('Valid contact ID is required');
  }
  
  return activities
    .filter(activity => activity.contactId === contactId)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
}

// Get activity by ID
async function getById(id) {
  await delay();
  if (!id || typeof id !== 'number') {
    throw new Error('Valid activity ID is required');
  }
  
  const activity = activities.find(a => a.Id === id);
  if (!activity) {
    throw new Error('Activity not found');
  }
  
  return { ...activity };
}

// Create new activity
async function create(activityData) {
  await delay();
  
  // Validate required fields
  if (!activityData.contactId || typeof activityData.contactId !== 'number') {
    throw new Error('Valid contact ID is required');
  }
  
  if (!activityData.type || !activityData.description) {
    throw new Error('Activity type and description are required');
  }
  
  const newActivity = {
    Id: nextId++,
    contactId: activityData.contactId,
    type: activityData.type,
    description: activityData.description.trim(),
    timestamp: activityData.timestamp || new Date().toISOString(),
    createdBy: activityData.createdBy || "Current User",
    status: activityData.status || "completed"
  };
  
  activities.unshift(newActivity);
  return { ...newActivity };
}

// Update activity
async function update(id, activityData) {
  await delay();
  
  if (!id || typeof id !== 'number') {
    throw new Error('Valid activity ID is required');
  }
  
  const index = activities.findIndex(a => a.Id === id);
  if (index === -1) {
    throw new Error('Activity not found');
  }
  
  // Validate required fields if provided
  if (activityData.type !== undefined && !activityData.type) {
    throw new Error('Activity type cannot be empty');
  }
  
  if (activityData.description !== undefined && !activityData.description.trim()) {
    throw new Error('Activity description cannot be empty');
  }
  
  const updatedActivity = {
    ...activities[index],
    ...activityData,
    Id: id, // Ensure ID doesn't change
    description: activityData.description ? activityData.description.trim() : activities[index].description
  };
  
  activities[index] = updatedActivity;
  return { ...updatedActivity };
}

// Delete activity
async function deleteActivity(id) {
  await delay();
  
  if (!id || typeof id !== 'number') {
    throw new Error('Valid activity ID is required');
  }
  
  const index = activities.findIndex(a => a.Id === id);
  if (index === -1) {
    throw new Error('Activity not found');
  }
  
  const deletedActivity = { ...activities[index] };
  activities.splice(index, 1);
  return deletedActivity;
}

// Activity types configuration
const ACTIVITY_TYPES = [
  { value: 'Email', label: 'Email', icon: 'Mail' },
  { value: 'Call', label: 'Phone Call', icon: 'Phone' },
  { value: 'Meeting', label: 'Meeting', icon: 'Calendar' },
  { value: 'Note', label: 'Note', icon: 'FileText' },
  { value: 'Task', label: 'Task', icon: 'CheckSquare' }
];

class ActivitiesService {
  static getAll = getAll;
  static getByContactId = getByContactId;
  static getById = getById;
  static create = create;
  static update = update;
  static delete = deleteActivity;
  static ACTIVITY_TYPES = ACTIVITY_TYPES;
}

export default ActivitiesService;