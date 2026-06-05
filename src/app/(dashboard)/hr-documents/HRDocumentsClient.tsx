"use client";

import React, { useState } from "react";

// Simple placeholder client component for HR Documents management
export default function HRDocumentsClient() {
  const [docName, setDocName] = useState("");
  const [documents, setDocuments] = useState<string[]>([]);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docName) return;
    setDocuments([...documents, docName]);
    setDocName("");
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1 className="text-2xl font-bold mb-4">HR Documents</h1>
      <form onSubmit={handleAdd} className="grid gap-4 max-w-md mb-8">
        <input
          type="text"
          placeholder="Document Name"
          value={docName}
          onChange={(e) => setDocName(e.target.value)}
          className="p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
        >
          Add Document
        </button>
      </form>
      <h2 className="text-xl font-semibold mb-2">Saved HR Documents</h2>
      {documents.length === 0 ? (
        <p>No HR documents added yet.</p>
      ) : (
        <ul className="list-disc pl-5">
          {documents.map((d, i) => (
            <li key={i}>{d}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
