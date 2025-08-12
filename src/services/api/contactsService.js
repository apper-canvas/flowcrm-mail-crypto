import contactsData from "@/services/mockData/contacts.json";
import React from "react";
import Error from "@/components/ui/Error";

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class ContactsService {
  constructor() {
    this.contacts = [...contactsData]
  }

  async getAll() {
    await delay(300)
    return this.contacts
  }

  async getById(id) {
    await delay(200)
    return this.contacts.find(contact => contact.id === id)
  }

  async create(contactData) {
    await delay(400)
    const newContact = {
      id: Date.now().toString(),
      ...contactData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    this.contacts.push(newContact)
    return newContact
  }

  async update(id, contactData) {
    await delay(400)
    const index = this.contacts.findIndex(contact => contact.id === id)
    if (index !== -1) {
      this.contacts[index] = {
        ...this.contacts[index],
        ...contactData,
        updatedAt: new Date().toISOString()
      }
      return this.contacts[index]
    }
    throw new Error('Contact not found')
  }

  async delete(id) {
    await delay(300)
    const index = this.contacts.findIndex(contact => contact.id === id)
    if (index !== -1) {
      this.contacts.splice(index, 1)
      return true
    }
    throw new Error('Contact not found')
  }
}

// Create and export a single instance
const contactsService = new ContactsService()
export default contactsService