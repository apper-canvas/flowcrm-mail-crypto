import React, { useState } from "react";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import { cn } from "@/utils/cn";

const ContactsTable = ({ contacts, onContactClick, onSort, sortField, sortDirection }) => {
  const columns = [
    { key: "name", label: "Name", sortable: true },
    { key: "company", label: "Company", sortable: true },
    { key: "email", label: "Email", sortable: true },
    { key: "phone", label: "Phone", sortable: false },
    { key: "lastActivity", label: "Last Activity", sortable: true }
  ];

  const handleSort = (key) => {
    if (onSort) {
      onSort(key);
    }
  };

  const formatLastActivity = (date) => {
    try {
      return format(new Date(date), "MMM d, yyyy");
    } catch {
      return "Never";
    }
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="bg-white rounded-lg shadow-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={cn(
                    "px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider",
                    column.sortable && "cursor-pointer hover:text-gray-900 select-none"
                  )}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.label}</span>
                    {column.sortable && (
                      <div className="flex flex-col">
                        <ApperIcon 
                          name="ChevronUp" 
                          className={cn(
                            "w-3 h-3 -mb-1",
                            sortField === column.key && sortDirection === "asc" 
                              ? "text-primary-500" 
                              : "text-gray-300"
                          )} 
                        />
                        <ApperIcon 
                          name="ChevronDown" 
                          className={cn(
                            "w-3 h-3",
                            sortField === column.key && sortDirection === "desc" 
                              ? "text-primary-500" 
                              : "text-gray-300"
                          )} 
                        />
                      </div>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {contacts.map((contact) => (
              <tr
                key={contact.Id}
                className="table-row-hover cursor-pointer"
                onClick={() => onContactClick(contact)}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {getInitials(contact.name)}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{contact.name}</div>
                      {contact.position && (
                        <div className="text-sm text-gray-500">{contact.position}</div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">{contact.company}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-gray-900">{contact.email}</div>
                  <div className="text-sm text-gray-500">{contact.phone}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-gray-900">{contact.phone}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-gray-900">{formatLastActivity(contact.lastActivity)}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ContactsTable;