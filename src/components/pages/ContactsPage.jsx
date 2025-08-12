import React, { useState, useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import Modal from "@/components/molecules/Modal";
import ContactsTable from "@/components/organisms/ContactsTable";
import ContactProfile from "@/components/organisms/ContactProfile";
import AddContactForm from "@/components/organisms/AddContactForm";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Header from "@/components/organisms/Header";
import contactsService from "@/services/api/contactsService";

const ContactsPage = ({ onMenuClick }) => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [selectedContact, setSelectedContact] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const loadContacts = async () => {
    setLoading(true);
    setError("");
    
    try {
      const data = await contactsService.getAll();
      setContacts(data);
    } catch (err) {
      setError("Failed to load contacts. Please try again.");
      console.error("Error loading contacts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContacts();
  }, []);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleAddContact = async (contactData) => {
    try {
      const newContact = await contactsService.create(contactData);
      setContacts(prev => [newContact, ...prev]);
      setShowAddModal(false);
    } catch (error) {
      throw error;
    }
  };

  const filteredAndSortedContacts = useMemo(() => {
    let filtered = contacts;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(contact =>
        contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.company.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (sortField === "lastActivity") {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      } else if (typeof aValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortDirection === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [contacts, searchTerm, sortField, sortDirection]);

  if (selectedContact) {
    return (
      <ContactProfile
        contact={selectedContact}
        onBack={() => setSelectedContact(null)}
        onEdit={() => toast.info("Edit functionality coming soon!")}
      />
    );
  }

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadContacts} />;

  return (
    <div className="space-y-6">
      <Header title="Contacts" onMenuClick={onMenuClick}>
        <Button variant="primary" onClick={() => setShowAddModal(true)}>
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          Add Contact
        </Button>
      </Header>

      <div className="px-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <SearchBar
            placeholder="Search contacts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="sm:w-80"
          />
          <div className="text-sm text-gray-600">
            {filteredAndSortedContacts.length} of {contacts.length} contacts
          </div>
          <button onClick={() => {
            let abc = {};
            console.log(abc.length);
          }}>temp</button>
        </div>

        {filteredAndSortedContacts.length === 0 ? (
          searchTerm ? (
            <Empty
              title="No contacts found"
              description={`No contacts match "${searchTerm}". Try adjusting your search terms.`}
              icon="Search"
              actionLabel="Clear Search"
              onAction={() => setSearchTerm("")}
            />
          ) : (
            <Empty
              title="No contacts yet"
              description="Start building your customer database by adding your first contact."
              icon="Users"
              actionLabel="Add Contact"
              onAction={() => setShowAddModal(true)}
            />
          )
        ) : (
          <ContactsTable
            contacts={filteredAndSortedContacts}
            onContactClick={setSelectedContact}
            onSort={handleSort}
            sortField={sortField}
            sortDirection={sortDirection}
          />
        )}
      </div>

      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Contact"
        size="lg"
      >
        <AddContactForm
          onSubmit={handleAddContact}
          onCancel={() => setShowAddModal(false)}
        />
      </Modal>
    </div>
  );
};

export default ContactsPage;