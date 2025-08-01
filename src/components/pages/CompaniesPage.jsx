import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Empty from "@/components/ui/Empty";
import Header from "@/components/organisms/Header";

const CompaniesPage = ({ onMenuClick }) => {
  return (
    <div className="space-y-6">
      <Header title="Companies" onMenuClick={onMenuClick}>
        <Button variant="primary" disabled>
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          Add Company
        </Button>
      </Header>

      <div className="px-6">
        <Empty
          title="Company Management Coming Soon"
          description="Organize your business relationships by company. Track company information, key contacts, and business opportunities all in one place."
          icon="Building2"
          actionLabel="Coming Soon"
        />
      </div>
    </div>
  );
};

export default CompaniesPage;