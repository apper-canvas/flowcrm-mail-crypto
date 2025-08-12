import contactsData from "@/services/mockData/contacts.json";

class ContactsService {
  constructor() {
    this.contacts = [...contactsData];
  }

  async delay() {
    return new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200));
  }

  async getAll() {
    await this.delay();
    return [...this.contacts];
  }

  async getById(id) {
    await this.delay();
    const contact = this.contacts.find(c => c.Id === parseInt(id));
    if (!contact) {
      throw new Error("Contact not found");
    }
    return { ...contact };
  }

  async create(contactData) {
    await this.delay();
    
    const newId = Math.max(...this.contacts.map(c => c.Id), 0) + 1;
    const newContact = {
      Id: newId,
      ...contactData,
      createdAt: new Date().toISOString(),
      lastActivity: new Date().toISOString()
    };
    
    this.contacts.unshift(newContact);
    return { ...newContact };
  }

  async update(id, contactData) {
    await this.delay();
    
    const index = this.contacts.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Contact not found");
    }
    
    this.contacts[index] = {
      ...this.contacts[index],
      ...contactData,
      Id: parseInt(id)
    };
    
    return { ...this.contacts[index] };
  }

  async delete(id) {
    await this.delay();
    
    const index = this.contacts.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Contact not found");
    }
    
    this.contacts.splice(index, 1);
    return true;
  }
}

export default new ContactsService();