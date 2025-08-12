import dealsData from '@/services/mockData/deals.json'

// Simulate API delay
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms))

class DealsService {
  constructor() {
    this.deals = [...dealsData]
  }

  // Main method expected by AnalyticsPage - renamed from getAll()
  async getDeals() {
    await delay()
    return [...this.deals]
  }

  // Keep getAll() for backward compatibility
  async getAll() {
    return this.getDeals()
  }

  async getById(id) {
    await delay()
    return this.deals.find(deal => deal.id === id) || null
  }

  async create(dealData) {
    await delay()
    const newDeal = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      probability: this.getDefaultProbability(dealData.stage),
      ...dealData
    }
    this.deals.push(newDeal)
    return newDeal
  }

  async update(id, dealData) {
    await delay()
    const index = this.deals.findIndex(deal => deal.id === id)
    if (index === -1) throw new Error('Deal not found')
    
    this.deals[index] = {
      ...this.deals[index],
      ...dealData,
      updatedAt: new Date().toISOString()
    }
    return this.deals[index]
  }

  async delete(id) {
    await delay()
    const index = this.deals.findIndex(deal => deal.id === id)
    if (index === -1) throw new Error('Deal not found')
    
    const deletedDeal = this.deals.splice(index, 1)[0]
    return deletedDeal
  }

  getDefaultProbability(stage) {
    const probabilities = {
      'New': 10,
      'Qualified': 25,
      'Proposal': 50,
      'Negotiation': 75,
      'Won': 100,
      'Lost': 0
    }
    return probabilities[stage] || 10
  }

  async getByStage(stage) {
    await delay()
    return this.deals.filter(deal => deal.stage === stage)
  }

  async getAnalytics() {
    await delay()
    const deals = [...this.deals]
    
    return {
      total: deals.length,
      totalValue: deals.reduce((sum, deal) => sum + (deal.value || 0), 0),
      byStage: deals.reduce((acc, deal) => {
        acc[deal.stage] = (acc[deal.stage] || 0) + 1
        return acc
      }, {}),
      winRate: this.getWinRate(),
      averageDealSize: deals.length > 0 ? deals.reduce((sum, deal) => sum + (deal.value || 0), 0) / deals.length : 0
    }
  }

  async getPipelineData() {
    await delay()
    const stages = ['New', 'Qualified', 'Proposal', 'Negotiation', 'Won', 'Lost']
    
    return stages.map(stage => ({
      stage,
      deals: this.deals.filter(deal => deal.stage === stage),
      totalValue: this.deals
        .filter(deal => deal.stage === stage)
        .reduce((sum, deal) => sum + (deal.value || 0), 0)
    }))
  }

  getWinRate() {
    const totalDeals = this.deals.length
    if (totalDeals === 0) return 0
    
    const wonDeals = this.deals.filter(deal => deal.stage === 'Won').length
    return Math.round((wonDeals / totalDeals) * 100)
  }

  async getMonthlyClosedDeals() {
    await delay()
    const closedDeals = this.deals.filter(deal => deal.stage === 'Won' || deal.stage === 'Lost')
    
    return closedDeals.reduce((acc, deal) => {
      const month = new Date(deal.createdAt).toLocaleString('default', { month: 'short' })
      if (!acc[month]) acc[month] = { won: 0, lost: 0 }
      acc[month][deal.stage.toLowerCase()]++
      return acc
    }, {})
  }
}

// Export instance instead of class to match expected import pattern
const dealsService = new DealsService()
export default dealsService