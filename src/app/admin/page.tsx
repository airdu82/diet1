"use client";

import { useEffect, useState } from "react";

export default function AdminPage() {
  const [data, setData] = useState<any[]>([]);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    try {
      // Load from local storage (acting as our mock database for the UI)
      const mockDb = JSON.parse(localStorage.getItem("mock_db") || "[]");
      // Sort by newest first
      mockDb.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      setData(mockDb);
      
      if (mockDb.length === 0) {
        setErrorMsg("Warning: Showing local mock database. Submit the form on the home page first to see data here!");
      }
    } catch (err: any) {
      setErrorMsg("Failed to load mock database.");
    }
  }, []);

  return (
    <main className="container" style={{ maxWidth: '800px', margin: '2rem auto' }}>
      <div className="header">
        <h1>Database View</h1>
        <p>Recent Diet Requisitions</p>
      </div>

      {errorMsg && <div className="message error" style={{ marginBottom: '1rem' }}>{errorMsg}</div>}

      <div style={{ overflowX: 'auto', background: 'var(--bg-color)', borderRadius: '0.5rem' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '1rem' }}>ID</th>
              <th style={{ padding: '1rem' }}>Name</th>
              <th style={{ padding: '1rem' }}>Age</th>
              <th style={{ padding: '1rem' }}>Diet Preference</th>
              <th style={{ padding: '1rem' }}>Date</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No requisitions found in the database.
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr key={row.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{row.id}</td>
                  <td style={{ padding: '1rem', fontWeight: '500' }}>{row.name}</td>
                  <td style={{ padding: '1rem' }}>{row.age}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ 
                      background: 'var(--primary-color)', 
                      padding: '0.25rem 0.5rem', 
                      borderRadius: '0.25rem',
                      fontSize: '0.875rem' 
                    }}>
                      {row.diet_preference}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                    {new Date(row.created_at).toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
