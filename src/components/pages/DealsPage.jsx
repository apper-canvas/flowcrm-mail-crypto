import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Empty from "@/components/ui/Empty";
import Header from "@/components/organisms/Header";

const DealsPage = ({ onMenuClick }) => {
  return (
    <div className="space-y-6">
      <Header title="Deals" onMenuClick={onMenuClick}>
        <Button variant="primary" disabled>
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          Add Deal
        </Button>
      </Header>

      <div className="px-6">
        <Empty
          title="Deals Pipeline Coming Soon"
          description="Track your sales opportunities and manage your pipeline. This feature will help you monitor deal progress, forecast revenue, and close more sales."
          icon="DollarSign"
          actionLabel="Coming Soon"
        />
      </div>
    </div>
  );
};

export default DealsPage;