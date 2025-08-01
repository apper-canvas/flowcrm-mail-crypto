import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import CompanyCard from "@/components/organisms/CompanyCard";
import AddCompanyForm from "@/components/organisms/AddCompanyForm";
import { companiesService } from "@/services/api/companiesService";
import ApperIcon from "@/components/ApperIcon";
import SearchBar from "@/components/molecules/SearchBar";
import Header from "@/components/organisms/Header";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";

const CompaniesPage = ({ onMenuClick }) => {
  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);

  // Load companies
  useEffect(() => {
    loadCompanies();
  }, []);

  // Filter companies when search or industry filter changes
  useEffect(() => {
    let filtered = companies;

    if (searchQuery) {
      filtered = filtered.filter(company =>
        company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        company.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
        company.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedIndustry) {
      filtered = filtered.filter(company => company.industry === selectedIndustry);
    }

    setFilteredCompanies(filtered);
  }, [companies, searchQuery, selectedIndustry]);

  const loadCompanies = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await companiesService.getAll();
      setCompanies(data);
    } catch (err) {
      setError('Failed to load companies');
      console.error('Error loading companies:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCompany = async (companyData) => {
    try {
      const newCompany = await companiesService.create(companyData);
      setCompanies(prev => [newCompany, ...prev]);
      toast.success('Company added successfully');
    } catch (err) {
      toast.error('Failed to add company');
      throw err;
    }
  };

  const handleUpdateCompany = async (companyData) => {
    try {
      const updatedCompany = await companiesService.update(editingCompany.Id, companyData);
      setCompanies(prev => 
        prev.map(company => 
          company.Id === editingCompany.Id ? updatedCompany : company
        )
      );
      toast.success('Company updated successfully');
      setEditingCompany(null);
    } catch (err) {
      toast.error('Failed to update company');
      throw err;
    }
  };

  const handleDeleteCompany = async (companyId) => {
    if (!window.confirm('Are you sure you want to delete this company?')) {
      return;
    }

    try {
      await companiesService.delete(companyId);
      setCompanies(prev => prev.filter(company => company.Id !== companyId));
      toast.success('Company deleted successfully');
    } catch (err) {
      toast.error('Failed to delete company');
      throw err;
    }
  };

  const handleEditCompany = (company) => {
    setEditingCompany(company);
    setShowAddForm(true);
  };

  const handleCloseForm = () => {
    setShowAddForm(false);
    setEditingCompany(null);
  };

  const industries = [...new Set(companies.map(company => company.industry))].sort();

  if (loading) {
    return (
      <div className="space-y-6">
        <Header title="Companies" onMenuClick={onMenuClick}>
          <Button variant="primary" disabled>
            <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
            Add Company
          </Button>
        </Header>
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Header title="Companies" onMenuClick={onMenuClick}>
          <Button variant="primary" disabled>
            <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
            Add Company
          </Button>
        </Header>
        <Error message={error} onRetry={loadCompanies} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Header title="Companies" onMenuClick={onMenuClick}>
        <Button variant="primary" onClick={() => setShowAddForm(true)}>
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          Add Company
        </Button>
      </Header>

      <div className="px-6">
        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search companies..."
          />
          
          {industries.length > 0 && (
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700">
                Filter by Industry:
              </label>
              <select
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">All Industries</option>
                {industries.map(industry => (
                  <option key={industry} value={industry}>
                    {industry}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Companies Grid */}
        {filteredCompanies.length === 0 ? (
          <Empty
            title={searchQuery || selectedIndustry ? "No companies found" : "No companies yet"}
            description={
              searchQuery || selectedIndustry 
                ? "Try adjusting your search or filters to find companies."
                : "Add your first company to start organizing your business relationships."
            }
            icon="Building2"
            actionLabel="Add Company"
            onAction={() => setShowAddForm(true)}
          />
        ) : (
          <>
            <div className="mb-4 text-sm text-gray-600">
              Showing {filteredCompanies.length} of {companies.length} companies
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCompanies.map(company => (
                <CompanyCard
                  key={company.Id}
                  company={company}
                  onUpdate={handleEditCompany}
                  onDelete={handleDeleteCompany}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Add/Edit Company Form */}
      <AddCompanyForm
        isOpen={showAddForm}
        onClose={handleCloseForm}
        onSubmit={editingCompany ? handleUpdateCompany : handleAddCompany}
        company={editingCompany}
      />
    </div>
  );
};

export default CompaniesPage;
