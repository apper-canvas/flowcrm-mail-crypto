import React from "react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";

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

  const activityData = [
    {
      id: 1,
      type: "Email",
      description: "Sent follow-up email regarding proposal",
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      icon: "Mail"
    },
    {
      id: 2,
      type: "Call",
      description: "Initial discovery call - 45 minutes",
      timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      icon: "Phone"
    },
    {
      id: 3,
      type: "Meeting",
      description: "Product demo presentation",
      timestamp: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      icon: "Calendar"
    }
  ];

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
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {activityData.map((activity, index) => (
                <div key={activity.id} className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <ApperIcon name={activity.icon} className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                      <Badge variant="default" size="sm">{activity.type}</Badge>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {formatDate(activity.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
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