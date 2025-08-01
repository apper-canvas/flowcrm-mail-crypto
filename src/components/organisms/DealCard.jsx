import React, { useState } from "react";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import { cn } from "@/utils/cn";

const DealCard = ({ deal, onUpdate, onDelete, isDragging }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch {
      return 'Invalid date';
    }
  };

  const getProbabilityColor = (probability) => {
    if (probability >= 80) return 'success';
    if (probability >= 60) return 'warning';
    if (probability >= 40) return 'info';
    return 'secondary';
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${deal.name}"?`)) {
      setIsDeleting(true);
      try {
        await onDelete(deal.Id);
      } catch (error) {
        setIsDeleting(false);
      }
    }
  };

  return (
    <div
      className={cn(
        "bg-white border border-gray-200 rounded-lg p-4 cursor-pointer transition-all duration-200",
        "hover:shadow-card-hover hover:border-primary-200",
        isDragging && "shadow-lg border-primary-300 bg-primary-50",
        isDeleting && "opacity-50 pointer-events-none"
      )}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 text-sm leading-tight mb-1 truncate">
            {deal.name}
          </h4>
          <p className="text-xs text-gray-600 truncate">
            {deal.company}
          </p>
        </div>
        <ApperIcon name="GripVertical" size={16} className="text-gray-400 ml-2 flex-shrink-0" />
      </div>

      {/* Value */}
      <div className="mb-3">
        <span className="text-lg font-bold text-primary-600">
          {formatCurrency(deal.value)}
        </span>
      </div>

      {/* Contact */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-xs font-medium text-primary-700">
            {getInitials(deal.contactName)}
          </span>
        </div>
        <span className="text-xs text-gray-600 truncate">
          {deal.contactName}
        </span>
      </div>

      {/* Probability Badge */}
      <div className="flex items-center justify-between">
        <Badge 
          variant={getProbabilityColor(deal.probability)}
          size="sm"
        >
          {deal.probability}% likely
        </Badge>
        
        <button
          onClick={handleDelete}
          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-50 rounded transition-all"
          disabled={isDeleting}
        >
          <ApperIcon 
            name={isDeleting ? "Loader2" : "Trash2"} 
            size={14} 
            className={cn(
              "text-red-400 hover:text-red-600",
              isDeleting && "animate-spin"
            )} 
          />
        </button>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="mt-4 pt-3 border-t border-gray-100 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">Expected Close:</span>
            <span className="text-gray-700">
              {formatDate(deal.expectedCloseDate)}
            </span>
          </div>
          
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">Last Activity:</span>
            <span className="text-gray-700">
              {formatDate(deal.lastActivity)}
            </span>
          </div>

          {deal.notes && (
            <div className="text-xs">
              <span className="text-gray-500 block mb-1">Notes:</span>
              <p className="text-gray-700 leading-relaxed">
                {deal.notes}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DealCard;