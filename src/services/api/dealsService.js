import dealsData from "@/services/mockData/deals.json";

class DealsService {
  constructor() {
    this.deals = [...dealsData];
  }

  async delay() {
    return new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200));
  }

  async getAll() {
    await this.delay();
    return [...this.deals];
  }

  async getById(id) {
    await this.delay();
    const deal = this.deals.find(d => d.Id === parseInt(id));
    if (!deal) {
      throw new Error("Deal not found");
    }
    return { ...deal };
  }

  async create(dealData) {
    await this.delay();
    
    const newId = Math.max(...this.deals.map(d => d.Id), 0) + 1;
    const newDeal = {
      Id: newId,
      ...dealData,
      stage: dealData.stage || "Lead",
      probability: this.getDefaultProbability(dealData.stage || "Lead"),
      createdAt: new Date().toISOString(),
      lastActivity: new Date().toISOString()
    };
    
    this.deals.unshift(newDeal);
    return { ...newDeal };
  }

  async update(id, dealData) {
    await this.delay();
    
    const index = this.deals.findIndex(d => d.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Deal not found");
    }
    
    const updatedDeal = {
      ...this.deals[index],
      ...dealData,
      Id: parseInt(id),
      lastActivity: new Date().toISOString()
    };

    // Update probability based on stage if stage changed
    if (dealData.stage && dealData.stage !== this.deals[index].stage) {
      updatedDeal.probability = this.getDefaultProbability(dealData.stage);
    }
    
    this.deals[index] = updatedDeal;
    return { ...updatedDeal };
  }

  async delete(id) {
    await this.delay();
    
    const index = this.deals.findIndex(d => d.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Deal not found");
    }
    
    this.deals.splice(index, 1);
    return true;
  }

  getDefaultProbability(stage) {
    const probabilities = {
      "Lead": 25,
      "Qualified": 50,
      "Proposal": 75,
      "Closed Won": 100
    };
    return probabilities[stage] || 25;
  }

async getByStage(stage) {
    await this.delay();
    return this.deals.filter(deal => deal.stage === stage).map(deal => ({ ...deal }));
  }

  async getAnalytics() {
    await this.delay();
    
    const activeDeals = this.deals.filter(deal => deal.stage !== 'Closed Won' && deal.stage !== 'Closed Lost');
    const totalPipelineValue = activeDeals.reduce((sum, deal) => sum + deal.value, 0);
    const activeDealsCount = activeDeals.length;
    
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthlyClosedDeals = this.deals.filter(deal => {
      if (deal.stage !== 'Closed Won') return false;
      const closeDate = new Date(deal.expectedCloseDate);
      return closeDate.getMonth() === currentMonth && closeDate.getFullYear() === currentYear;
    });
    
    const winRate = this.getWinRate();
    
    return {
      totalPipelineValue,
      activeDealsCount,
      monthlyClosedDealsCount: monthlyClosedDeals.length,
      monthlyClosedDealsValue: monthlyClosedDeals.reduce((sum, deal) => sum + deal.value, 0),
      winRate
    };
  }

  async getPipelineData() {
    await this.delay();
    
    const stages = ['Lead', 'Qualified', 'Proposal', 'Closed Won'];
    const stageData = stages.map(stage => {
      const stageDeals = this.deals.filter(deal => deal.stage === stage);
      const stageValue = stageDeals.reduce((sum, deal) => sum + deal.value, 0);
      return {
        stage,
        count: stageDeals.length,
        value: stageValue
      };
    });
    
    return stageData;
  }

  getWinRate() {
    const closedDeals = this.deals.filter(deal => 
      deal.stage === 'Closed Won' || deal.stage === 'Closed Lost'
    );
    
    if (closedDeals.length === 0) return 0;
    
    const wonDeals = closedDeals.filter(deal => deal.stage === 'Closed Won');
    return Math.round((wonDeals.length / closedDeals.length) * 100);
  }

  async getMonthlyClosedDeals() {
    await this.delay();
    
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    return this.deals.filter(deal => {
      if (deal.stage !== 'Closed Won') return false;
      const closeDate = new Date(deal.expectedCloseDate);
      return closeDate.getMonth() === currentMonth && closeDate.getFullYear() === currentYear;
    }).map(deal => ({ ...deal }));
  }
}

export default new DealsService();