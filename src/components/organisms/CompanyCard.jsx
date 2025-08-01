import React, { useState } from 'react';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import { cn } from '@/utils/cn';

const CompanyCard = ({ company, onUpdate, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getIndustryColor = (industry) => {
    const colors = {
      'Technology': 'bg-blue-100 text-blue-800',
      'Healthcare': 'bg-green-100 text-green-800',
      'Finance': 'bg-purple-100 text-purple-800',
      'Manufacturing': 'bg-orange-100 text-orange-800',
      'Retail': 'bg-pink-100 text-pink-800',
      'Consulting': 'bg-indigo-100 text-indigo-800',
      'Marketing': 'bg-yellow-100 text-yellow-800',
      'Venture Capital': 'bg-red-100 text-red-800'
    };
    return colors[industry] || 'bg-gray-100 text-gray-800';
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (isDeleting) return;
    
    setIsDeleting(true);
    try {
      await onDelete(company.Id);
    } catch (error) {
      console.error('Failed to delete company:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    onUpdate(company);
  };

  const handleWebsiteClick = (e) => {
    e.stopPropagation();
    if (company.website) {
      window.open(company.website, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-card-hover transition-all duration-200 group">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center text-white font-semibold text-sm">
            {getInitials(company.name)}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-lg leading-tight">
              {company.name}
            </h3>
            <Badge 
              variant="secondary" 
              className={cn("mt-1", getIndustryColor(company.industry))}
            >
              {company.industry}
            </Badge>
          </div>
        </div>
        
        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleEdit}
            className="text-gray-500 hover:text-gray-700"
          >
            <ApperIcon name="Edit2" className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-gray-500 hover:text-red-600"
          >
            <ApperIcon 
              name={isDeleting ? "Loader2" : "Trash2"} 
              className={cn("w-4 h-4", isDeleting && "animate-spin")} 
            />
          </Button>
        </div>
      </div>

      {/* Description */}
      {company.description && (
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {company.description}
        </p>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-center text-primary-600 mb-1">
            <ApperIcon name="Users" className="w-4 h-4 mr-1" />
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {company.contactCount}
          </div>
          <div className="text-xs text-gray-500">
            Contact{company.contactCount !== 1 ? 's' : ''}
          </div>
        </div>
        
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-center text-accent-600 mb-1">
            <ApperIcon name="DollarSign" className="w-4 h-4 mr-1" />
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {formatCurrency(company.totalDealValue)}
          </div>
          <div className="text-xs text-gray-500">
            Total Value
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        {company.website ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleWebsiteClick}
            className="text-primary-600 hover:text-primary-700 text-sm"
          >
            <ApperIcon name="ExternalLink" className="w-3 h-3 mr-1" />
            Visit Website
          </Button>
        ) : (
          <div className="text-xs text-gray-400">No website</div>
        )}
        
        <div className="text-xs text-gray-400">
          Added {new Date(company.createdAt).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};

export default CompanyCard;