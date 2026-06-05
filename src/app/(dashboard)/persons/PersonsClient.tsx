"use client";

import React, { useState, useEffect } from "react";
import { addPerson, getAllPersons, Person } from "@/lib/storage/personStorage";

// Simple client component for managing persons
export default function PersonsClient() {
  const [persons, setPersons] = useState<Person[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [designation, setDesignation] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [taxId, setTaxId] = useState("");
  const [bankAccount, setBankAccount] = useState("");
  const [salary, setSalary] = useState("");

  // Load existing persons on mount
  useEffect(() => {
    setPersons(getAllPersons());
  }, []);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    const newPerson: Person = {
      id: Date.now().toString(),
      name,
      email,
      designation,
      role: designation,
      address,
      phone,
      taxId,
      bankAccount,
      salary,
    };
    addPerson(newPerson);
    setPersons([...persons, newPerson]);
    // reset fields
    setName("");
    setEmail("");
    setDesignation("");
    setAddress("");
    setPhone("");
    setTaxId("");
    setBankAccount("");
    setSalary("");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 space-y-6 bg-[#F8F9FF]">
      <h1 className="text-2xl font-bold mb-4">Person Management</h1>
      <form onSubmit={handleAdd} className="grid gap-4 w-full max-w-md sm:max-w-lg mb-8">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Designation"
          value={designation}
          onChange={(e) => setDesignation(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Tax ID (PAN/VAT)"
          value={taxId}
          onChange={(e) => setTaxId(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Bank Account"
          value={bankAccount}
          onChange={(e) => setBankAccount(e.target.value)}
          className="p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Salary / Annual Compensation"
          value={salary}
          onChange={(e) => setSalary(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Add Person
        </button>
      </form>

      <h2 className="text-xl font-semibold mb-2">Saved Persons</h2>
      {persons.length === 0 ? (
        <p>No persons added yet.</p>
      ) : (
        <ul className="list-disc pl-5">
          {persons.map((p) => (
            <li key={p.id}>
              {p.name} – {p.email} – {p.designation}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
