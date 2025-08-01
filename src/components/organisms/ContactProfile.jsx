import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Input from "@/components/atoms/Input";
import Modal from "@/components/molecules/Modal";
import ActivitiesService from "@/services/api/activitiesService";
const ContactProfile = ({ contact, onBack, onEdit }) => {
  const getInitials = (name) => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (date) => {
    try {
      return format(new Date(date), "MMMM d, yyyy 'at' h:mm a");
    } catch {
      return "Unknown";
    }
  };
// Activity management state
  const [activities, setActivities] = useState([]);
  const [activitiesLoading, setActivitiesLoading] = useState(true);
  const [activitiesError, setActivitiesError] = useState(null);
  const [showAddActivity, setShowAddActivity] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);

  // Activity form state
  const [activityForm, setActivityForm] = useState({
    type: 'Email',
    description: '',
    timestamp: new Date().toISOString().slice(0, 16)
  });

  // Load activities for this contact
  useEffect(() => {
    loadActivities();
  }, [contact.Id]);

  const loadActivities = async () => {
    try {
      setActivitiesLoading(true);
      setActivitiesError(null);
      const contactActivities = await ActivitiesService.getByContactId(contact.Id);
      setActivities(contactActivities);
    } catch (error) {
      console.error('Error loading activities:', error);
      setActivitiesError('Failed to load activities');
      toast.error('Failed to load activities');
    } finally {
      setActivitiesLoading(false);
    }
  };

  const handleAddActivity = async (e) => {
    e.preventDefault();
    
    if (!activityForm.description.trim()) {
      toast.error('Activity description is required');
      return;
    }

    try {
      const newActivity = {
        contactId: contact.Id,
        type: activityForm.type,
        description: activityForm.description.trim(),
        timestamp: new Date(activityForm.timestamp).toISOString()
      };

      await ActivitiesService.create(newActivity);
      toast.success('Activity added successfully');
      
      // Reset form and close modal
      setActivityForm({
        type: 'Email',
        description: '',
        timestamp: new Date().toISOString().slice(0, 16)
      });
      setShowAddActivity(false);
      
      // Reload activities
      await loadActivities();
    } catch (error) {
      console.error('Error adding activity:', error);
      toast.error('Failed to add activity');
    }
  };

  const handleEditActivity = async (e) => {
    e.preventDefault();
    
    if (!activityForm.description.trim()) {
      toast.error('Activity description is required');
      return;
    }

    try {
      await ActivitiesService.update(editingActivity.Id, {
        type: activityForm.type,
        description: activityForm.description.trim(),
        timestamp: new Date(activityForm.timestamp).toISOString()
      });
      
      toast.success('Activity updated successfully');
      
      // Reset form and close modal
      setActivityForm({
        type: 'Email',
        description: '',
        timestamp: new Date().toISOString().slice(0, 16)
      });
      setEditingActivity(null);
      
      // Reload activities
      await loadActivities();
    } catch (error) {
      console.error('Error updating activity:', error);
      toast.error('Failed to update activity');
    }
  };

  const handleDeleteActivity = async (activityId) => {
    if (!window.confirm('Are you sure you want to delete this activity?')) {
      return;
    }

    try {
      await ActivitiesService.delete(activityId);
      toast.success('Activity deleted successfully');
      await loadActivities();
    } catch (error) {
      console.error('Error deleting activity:', error);
      toast.error('Failed to delete activity');
    }
  };

  const openEditModal = (activity) => {
    setEditingActivity(activity);
    setActivityForm({
      type: activity.type,
      description: activity.description,
      timestamp: new Date(activity.timestamp).toISOString().slice(0, 16)
    });
  };

  const closeActivityModal = () => {
    setShowAddActivity(false);
    setEditingActivity(null);
    setActivityForm({
      type: 'Email',
      description: '',
      timestamp: new Date().toISOString().slice(0, 16)
    });
  };

  const getActivityIcon = (type) => {
    const activityType = ActivitiesService.ACTIVITY_TYPES.find(t => t.value === type);
    return activityType ? activityType.icon : 'FileText';
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" onClick={onBack} className="p-2">
          <ApperIcon name="ArrowLeft" className="w-5 h-5" />
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">Contact Profile</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contact Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info Card */}
          <div className="bg-white rounded-lg shadow-card p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  {getInitials(contact.name)}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{contact.name}</h2>
                  <p className="text-gray-600">{contact.position} at {contact.company}</p>
                </div>
              </div>
              <Button variant="secondary" onClick={onEdit}>
                <ApperIcon name="Edit2" className="w-4 h-4 mr-2" />
                Edit
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
                  <div className="flex items-center space-x-2">
                    <ApperIcon name="Mail" className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900">{contact.email}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Phone</label>
                  <div className="flex items-center space-x-2">
                    <ApperIcon name="Phone" className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900">{contact.phone}</span>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Company</label>
                  <div className="flex items-center space-x-2">
                    <ApperIcon name="Building2" className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900">{contact.company}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Created</label>
                  <div className="flex items-center space-x-2">
                    <ApperIcon name="Calendar" className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900">{formatDate(contact.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>

            {contact.tags && contact.tags.length > 0 && (
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-500 mb-2">Tags</label>
                <div className="flex flex-wrap gap-2">
                  {contact.tags.map((tag, index) => (
                    <Badge key={index} variant="primary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {contact.notes && (
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-500 mb-2">Notes</label>
                <p className="text-gray-900 bg-gray-50 p-4 rounded-lg">{contact.notes}</p>
              </div>
            )}
          </div>

{/* Activity Timeline */}
          <div className="bg-white rounded-lg shadow-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
              <Button
                size="sm"
                onClick={() => setShowAddActivity(true)}
                className="flex items-center gap-2"
              >
                <ApperIcon name="Plus" size={16} />
                Add Activity
              </Button>
            </div>
            
            {activitiesLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
              </div>
            ) : activitiesError ? (
              <div className="text-center py-8">
                <p className="text-red-600 mb-4">{activitiesError}</p>
                <Button size="sm" onClick={loadActivities}>
                  Retry
                </Button>
              </div>
            ) : activities.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <ApperIcon name="Activity" className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-sm">No activities recorded yet</p>
                <p className="text-xs mt-1">Add your first activity to start tracking interactions</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {activities.map((activity) => (
                  <motion.div
                    key={activity.Id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start space-x-4 group hover:bg-gray-50 p-2 rounded-lg transition-colors"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center flex-shrink-0">
                      <ApperIcon name={getActivityIcon(activity.type)} className="w-5 h-5 text-primary-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0 mr-2">
                          <p className="text-sm font-medium text-gray-900 mb-1">{activity.description}</p>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Badge variant="default" size="sm">{activity.type}</Badge>
                            <span>•</span>
                            <span>{formatDate(new Date(activity.timestamp))}</span>
                            {activity.createdBy && (
                              <>
                                <span>•</span>
                                <span>by {activity.createdBy}</span>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => openEditModal(activity)}
                            className="p-1 hover:bg-gray-200 rounded text-gray-400 hover:text-gray-600"
                            title="Edit activity"
                          >
                            <ApperIcon name="Edit2" size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteActivity(activity.Id)}
                            className="p-1 hover:bg-gray-200 rounded text-gray-400 hover:text-red-600"
                            title="Delete activity"
                          >
                            <ApperIcon name="Trash2" size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Add/Edit Activity Modal */}
          <Modal
            isOpen={showAddActivity || editingActivity}
            onClose={closeActivityModal}
            title={editingActivity ? 'Edit Activity' : 'Add New Activity'}
          >
            <form onSubmit={editingActivity ? handleEditActivity : handleAddActivity} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Activity Type
                </label>
                <select
                  value={activityForm.type}
                  onChange={(e) => setActivityForm(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {ActivitiesService.ACTIVITY_TYPES.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={activityForm.description}
                  onChange={(e) => setActivityForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the activity..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  rows={3}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={activityForm.timestamp}
                  onChange={(e) => setActivityForm(prev => ({ ...prev, timestamp: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={closeActivityModal}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingActivity ? 'Update Activity' : 'Add Activity'}
                </Button>
              </div>
            </form>
          </Modal>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Button variant="primary" className="w-full">
                <ApperIcon name="Mail" className="w-4 h-4 mr-2" />
                Send Email
              </Button>
              <Button variant="secondary" className="w-full">
                <ApperIcon name="Phone" className="w-4 h-4 mr-2" />
                Make Call
              </Button>
              <Button variant="secondary" className="w-full">
                <ApperIcon name="Calendar" className="w-4 h-4 mr-2" />
                Schedule Meeting
              </Button>
            </div>
          </div>

          {/* Associated Deals */}
          <div className="bg-white rounded-lg shadow-card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Associated Deals</h3>
            <div className="text-center py-8">
              <ApperIcon name="DollarSign" className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">No deals associated yet</p>
              <Button variant="ghost" size="sm" className="mt-2">
                <ApperIcon name="Plus" className="w-4 h-4 mr-1" />
                Add Deal
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ContactProfile;