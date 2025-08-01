import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import contactsService from "@/services/api/contactsService";

const DEAL_STAGES = [
  { value: "Lead", label: "Lead" },
  { value: "Qualified", label: "Qualified" },
  { value: "Proposal", label: "Proposal" },
  { value: "Closed Won", label: "Closed Won" }
];

const AddDealForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    value: "",
    contactId: "",
    stage: "Lead",
    expectedCloseDate: "",
    notes: ""
  });

  const [contacts, setContacts] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingContacts, setIsLoadingContacts] = useState(true);

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      const contactsData = await contactsService.getAll();
      setContacts(contactsData);
    } catch (error) {
      toast.error("Failed to load contacts");
    } finally {
      setIsLoadingContacts(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = {
        ...prev,
        [name]: value
      };

      // Auto-fill company when contact is selected
      if (name === 'contactId' && value) {
        const selectedContact = contacts.find(c => c.Id === parseInt(value));
        if (selectedContact && !prev.company) {
          newData.company = selectedContact.company;
        }
      }

      return newData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.company.trim() || !formData.value) {
      toast.error("Deal name, company, and value are required");
      return;
    }

    if (!formData.contactId) {
      toast.error("Please select a contact");
      return;
    }

    const value = parseFloat(formData.value);
    if (isNaN(value) || value <= 0) {
      toast.error("Please enter a valid deal value");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const selectedContact = contacts.find(c => c.Id === parseInt(formData.contactId));
      
      const dealData = {
        name: formData.name.trim(),
        company: formData.company.trim(),
        value: value,
        contactId: parseInt(formData.contactId),
        contactName: selectedContact?.name || "",
        stage: formData.stage,
        expectedCloseDate: formData.expectedCloseDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        notes: formData.notes.trim()
      };
      
      await onSubmit(dealData);
    } catch (error) {
      console.error("Failed to add deal:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get unique companies from contacts for dropdown
  const uniqueCompanies = [...new Set(contacts.map(c => c.company).filter(Boolean))];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Deal Name *"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enterprise CRM Implementation"
          required
        />
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Company *
          </label>
          <select
            name="company"
            value={formData.company}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
          >
            <option value="">Select company...</option>
            {uniqueCompanies.map((company) => (
              <option key={company} value={company}>
                {company}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Deal Value *"
          name="value"
          type="number"
          value={formData.value}
          onChange={handleChange}
          placeholder="50000"
          min="0"
          step="1"
          required
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Contact *
          </label>
          <select
            name="contactId"
            value={formData.contactId}
            onChange={handleChange}
            required
            disabled={isLoadingContacts}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 disabled:bg-gray-50"
          >
            <option value="">
              {isLoadingContacts ? "Loading contacts..." : "Select contact..."}
            </option>
            {contacts.map((contact) => (
              <option key={contact.Id} value={contact.Id}>
                {contact.name} - {contact.company}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Stage
          </label>
          <select
            name="stage"
            value={formData.stage}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
          >
            {DEAL_STAGES.map((stage) => (
              <option key={stage.value} value={stage.value}>
                {stage.label}
              </option>
            ))}
          </select>
        </div>

        <Input
          label="Expected Close Date"
          name="expectedCloseDate"
          type="date"
          value={formData.expectedCloseDate ? formData.expectedCloseDate.split('T')[0] : ''}
          onChange={(e) => {
            const date = e.target.value;
            setFormData(prev => ({
              ...prev,
              expectedCloseDate: date ? new Date(date).toISOString() : ''
            }));
          }}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Notes
        </label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
          placeholder="Additional notes about this deal..."
        />
      </div>

      <div className="flex justify-end space-x-3 pt-6 border-t border-gray-100">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting || isLoadingContacts}
        >
          {isSubmitting ? (
            <>
              <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
              Adding...
            </>
          ) : (
            <>
              <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
              Add Deal
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default AddDealForm;