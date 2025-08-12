import mockCompanies from '@/services/mockData/companies.json';
import mockContacts from '@/services/mockData/contacts.json';
import mockDeals from '@/services/mockData/deals.json';

let companies = [...mockCompanies];
let nextId = Math.max(...companies.map(c => c.Id)) + 1;

export const companiesService = {
  async getAll() {
    // Add contact and deal counts to each company
    return companies.map(company => ({
      ...company,
      contactCount: mockContacts.filter(contact => contact.company === company.name).length,
      totalDealValue: mockDeals
        .filter(deal => deal.company === company.name)
        .reduce((sum, deal) => sum + deal.value, 0)
    }));
  },

  async getById(id) {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('Invalid company ID');
    }
    
    const company = companies.find(c => c.Id === id);
    if (!company) {
      throw new Error('Company not found');
    }
    
    return {
      ...company,
      contactCount: mockContacts.filter(contact => contact.company === company.name).length,
      totalDealValue: mockDeals
        .filter(deal => deal.company === company.name)
        .reduce((sum, deal) => sum + deal.value, 0)
    };
  },

  async create(companyData) {
    const newCompany = {
      Id: nextId++,
      name: companyData.name,
      industry: companyData.industry,
      website: companyData.website || '',
      description: companyData.description || '',
      createdAt: new Date().toISOString()
    };
    
    companies.unshift(newCompany);
    
    return {
      ...newCompany,
      contactCount: 0,
      totalDealValue: 0
    };
  },

  async update(id, companyData) {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('Invalid company ID');
    }

    const index = companies.findIndex(c => c.Id === id);
    if (index === -1) {
      throw new Error('Company not found');
    }

    companies[index] = {
      ...companies[index],
      name: companyData.name,
      industry: companyData.industry,
      website: companyData.website || '',
      description: companyData.description || ''
    };

    return {
      ...companies[index],
      contactCount: mockContacts.filter(contact => contact.company === companies[index].name).length,
      totalDealValue: mockDeals
        .filter(deal => deal.company === companies[index].name)
        .reduce((sum, deal) => sum + deal.value, 0)
    };
  },

  async delete(id) {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('Invalid company ID');
    }

    const index = companies.findIndex(c => c.Id === id);
    if (index === -1) {
      throw new Error('Company not found');
    }

companies.splice(index, 1);
    return true;
  },

  // Alias method to match expected naming convention from AnalyticsPage
  async getCompanies() {
    return this.getAll();
  }
};