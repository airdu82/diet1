import { neon } from "@neondatabase/serverless";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  let data: any[] = [];
  let errorMsg = "";

  try {
    if (!process.env.DATABASE_URL) {
      throw new Error("Database connection string not configured. Please add DATABASE_URL to your Vercel Environment Variables.");
    }
    
    const sql = neon(process.env.DATABASE_URL);
    
    // Ensure table exists just in case they visit admin first
    await sql`
      CREATE TABLE IF NOT EXISTS requisitions (
          id SERIAL PRIMARY KEY,
          name VARCHAR(50) NOT NULL,
          age INTEGER NOT NULL,
          diet_preference VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    data = await sql`SELECT * FROM requisitions ORDER BY created_at DESC`;
  } catch (err: any) {
    errorMsg = err.message;
  }

  return (
    <main className="container" style={{ maxWidth: '800px', margin: '2rem auto' }}>
      <div className="header">
        <h1>Database View</h1>
        <p>Recent Diet Requisitions</p>
      </div>

      {errorMsg ? (
        <div className="message error">{errorMsg}</div>
      ) : (
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
      )}
    </main>
  );
}
