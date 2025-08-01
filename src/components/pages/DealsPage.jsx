import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import KanbanBoard from "@/components/organisms/KanbanBoard";
import AddDealForm from "@/components/organisms/AddDealForm";
import dealsService from "@/services/api/dealsService";
import ApperIcon from "@/components/ApperIcon";
import Modal from "@/components/molecules/Modal";
import Header from "@/components/organisms/Header";
import Button from "@/components/atoms/Button";

const DealsPage = ({ onMenuClick }) => {
  const [deals, setDeals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const loadDeals = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const dealsData = await dealsService.getAll();
      setDeals(dealsData);
    } catch (err) {
      setError("Failed to load deals");
      toast.error("Failed to load deals");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDeals();
  }, []);

  const handleAddDeal = async (dealData) => {
    try {
      const newDeal = await dealsService.create(dealData);
      setDeals(prev => [newDeal, ...prev]);
      setIsAddModalOpen(false);
      toast.success("Deal added successfully!");
    } catch (error) {
      toast.error("Failed to add deal");
      throw error;
    }
  };

  const handleUpdateDeal = async (dealId, updates) => {
    try {
      const updatedDeal = await dealsService.update(dealId, updates);
      setDeals(prev => prev.map(deal => 
        deal.Id === dealId ? updatedDeal : deal
      ));
      toast.success("Deal updated successfully!");
    } catch (error) {
      toast.error("Failed to update deal");
      throw error;
    }
  };

  const handleDeleteDeal = async (dealId) => {
    try {
      await dealsService.delete(dealId);
      setDeals(prev => prev.filter(deal => deal.Id !== dealId));
      toast.success("Deal deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete deal");
      throw error;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Deals" onMenuClick={onMenuClick}>
        <Button 
          variant="primary" 
          onClick={() => setIsAddModalOpen(true)}
        >
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          Add Deal
        </Button>
      </Header>

      <div className="flex-1 p-6">
        <KanbanBoard
          deals={deals}
          onUpdateDeal={handleUpdateDeal}
          onDeleteDeal={handleDeleteDeal}
          isLoading={isLoading}
          error={error}
        />
      </div>

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Deal"
        size="lg"
      >
        <AddDealForm
          onSubmit={handleAddDeal}
          onCancel={() => setIsAddModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default DealsPage;