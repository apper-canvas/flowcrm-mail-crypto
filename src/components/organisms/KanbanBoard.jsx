import React from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import ApperIcon from "@/components/ApperIcon";
import DealCard from "@/components/organisms/DealCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";

const DEAL_STAGES = [
  { id: "Lead", title: "Lead", color: "bg-gray-100", textColor: "text-gray-700" },
  { id: "Qualified", title: "Qualified", color: "bg-blue-100", textColor: "text-blue-700" },
  { id: "Proposal", title: "Proposal", color: "bg-yellow-100", textColor: "text-yellow-700" },
  { id: "Closed Won", title: "Closed Won", color: "bg-green-100", textColor: "text-green-700" }
];

const KanbanBoard = ({ deals, onUpdateDeal, onDeleteDeal, isLoading, error }) => {
  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} />;
  }

  const getDealsByStage = (stage) => {
    return deals.filter(deal => deal.stage === stage);
  };

  const getStageTotal = (stage) => {
    return getDealsByStage(stage).reduce((total, deal) => total + deal.value, 0);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const { draggableId, destination } = result;
    const dealId = parseInt(draggableId);
    const newStage = destination.droppableId;

    // Find the deal being moved
    const deal = deals.find(d => d.Id === dealId);
    if (!deal || deal.stage === newStage) return;

    try {
      await onUpdateDeal(dealId, { stage: newStage });
    } catch (error) {
      console.error("Failed to update deal stage:", error);
    }
  };

  return (
    <div className="h-full">
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 h-full">
          {DEAL_STAGES.map((stage) => {
            const stageDeals = getDealsByStage(stage.id);
            const stageTotal = getStageTotal(stage.id);

            return (
              <div key={stage.id} className="flex flex-col bg-white rounded-lg shadow-card">
                <div className={`p-4 rounded-t-lg ${stage.color}`}>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className={`font-semibold ${stage.textColor}`}>
                      {stage.title}
                    </h3>
                    <span className={`text-sm font-medium px-2 py-1 rounded-full ${stage.color} ${stage.textColor}`}>
                      {stageDeals.length}
                    </span>
                  </div>
                  <div className={`text-sm ${stage.textColor}`}>
                    Total: {formatCurrency(stageTotal)}
                  </div>
                </div>

                <Droppable droppableId={stage.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex-1 p-4 min-h-[200px] transition-colors ${
                        snapshot.isDraggingOver ? 'bg-gray-50' : ''
                      }`}
                    >
                      <div className="space-y-3">
                        {stageDeals.map((deal, index) => (
                          <Draggable
                            key={deal.Id}
                            draggableId={deal.Id.toString()}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`transition-transform ${
                                  snapshot.isDragging ? 'rotate-2 scale-105' : ''
                                }`}
                              >
                                <DealCard
                                  deal={deal}
                                  onUpdate={onUpdateDeal}
                                  onDelete={onDeleteDeal}
                                  isDragging={snapshot.isDragging}
                                />
                              </div>
                            )}
                          </Draggable>
                        ))}
                      </div>
                      {provided.placeholder}
                      
                      {stageDeals.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-32 text-gray-400">
                          <ApperIcon name="Package" size={24} className="mb-2" />
                          <span className="text-sm">No deals</span>
                        </div>
                      )}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>
    </div>
  );
};

export default KanbanBoard;