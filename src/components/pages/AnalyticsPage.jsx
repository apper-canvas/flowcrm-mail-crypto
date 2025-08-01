import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Empty from "@/components/ui/Empty";
import Header from "@/components/organisms/Header";

const AnalyticsPage = ({ onMenuClick }) => {
  return (
    <div className="space-y-6">
      <Header title="Analytics" onMenuClick={onMenuClick} />

      <div className="px-6">
        <Empty
          title="Analytics Dashboard Coming Soon"
          description="Get insights into your sales performance with detailed analytics. Track conversion rates, pipeline health, and team productivity metrics."
          icon="BarChart3"
          actionLabel="Coming Soon"
        />
      </div>
    </div>
  );
};

export default AnalyticsPage;