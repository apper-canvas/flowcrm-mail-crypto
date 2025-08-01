import React from "react";

const Loading = () => {
  return (
    <div className="space-y-6 p-6">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="h-8 w-48 bg-gray-200 rounded shimmer"></div>
        <div className="h-10 w-32 bg-gray-200 rounded shimmer"></div>
      </div>
      
      {/* Search bar skeleton */}
      <div className="h-12 w-80 bg-gray-200 rounded shimmer"></div>
      
      {/* Table skeleton */}
      <div className="bg-white rounded-lg shadow-card overflow-hidden">
        {/* Table header */}
        <div className="grid grid-cols-5 gap-4 p-4 border-b border-gray-100">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-6 bg-gray-200 rounded shimmer"></div>
          ))}
        </div>
        
        {/* Table rows */}
        {[...Array(8)].map((_, i) => (
          <div key={i} className="grid grid-cols-5 gap-4 p-4 border-b border-gray-50">
            {[...Array(5)].map((_, j) => (
              <div key={j} className="h-5 bg-gray-100 rounded shimmer"></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Loading;