import { useState, useEffect } from 'react';

function App() {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({ first_name: '', last_name: '', email: '', phone_number: '' });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');
  
  // Connection status states: 'idle', 'testing', 'connected', 'failed'
  const [dbStatus, setDbStatus] = useState('idle'); 

  const API_URL = 'http://3.255.84.18:5000/api';

  // Fetch Users (Read)
  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_URL}/users`);
      const data = await response.json();
      setUsers(data);
      triggerNotification('Contacts list updated');
    } catch (err) {
      console.error('Error fetching data:', err);
      triggerNotification('Error loading contacts');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const triggerNotification = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
  };

  // Live Database Connection Checker
  const checkDatabaseConnection = async () => {
    setDbStatus('testing');
    try {
      const response = await fetch(`${API_URL}/healthcheck`);
      const data = await response.json();
      if (data.status === 'success') {
        setDbStatus('connected');
      } else {
        setDbStatus('failed');
      }
    } catch (err) {
      console.error(err);
      setDbStatus('failed');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await fetch(`${API_URL}/users/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        setEditingId(null);
        triggerNotification('Contact updated successfully');
      } else {
        await fetch(`${API_URL}/users`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        triggerNotification('Contact added successfully');
      }
      setFormData({ first_name: '', last_name: '', email: '', phone_number: '' });
      fetchUsers();
    } catch (err) {
      console.error('Error submitting form:', err);
    }
  };

  const handleEdit = (user) => {
    setEditingId(user.user_id);
    setFormData({
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      phone_number: user.phone_number || '',
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      try {
        await fetch(`${API_URL}/users/${id}`, { method: 'DELETE' });
        triggerNotification('Contact deleted');
        fetchUsers();
      } catch (err) {
        console.error('Error deleting contact:', err);
      }
    }
  };

  const handleShowAll = () => {
    setEditingId(null);
    setFormData({ first_name: '', last_name: '', email: '', phone_number: '' });
    fetchUsers();
  };

  // Clean Theme Styles
  const styles = {
    container: {
      maxWidth: '850px',
      margin: '40px auto',
      padding: '30px',
      fontFamily: '"Helvetica Neue", Arial, sans-serif',
      backgroundColor: '#fbf9f3', 
      borderRadius: '12px',
      boxShadow: '0 8px 24px rgba(27, 42, 74, 0.06)',
      border: '1px solid #e6e1d6',
      color: '#2b2b2b'
    },
    header: {
      textAlign: 'center',
      marginBottom: '20px',
      borderBottom: '2px solid #1b2a4a', 
      paddingBottom: '15px'
    },
    title: {
      fontSize: '2.2rem',
      color: '#1b2a4a',
      margin: '0 0 5px 0',
      fontWeight: '700',
    },
    metaPanel: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px',
      padding: '10px 15px',
      backgroundColor: '#f0ede4',
      borderRadius: '6px'
    },
    statusBadge: (status) => ({
      padding: '5px 10px',
      borderRadius: '4px',
      fontSize: '0.85rem',
      fontWeight: 'bold',
      color: 'white',
      backgroundColor: status === 'connected' ? '#2e7d32' : status === 'failed' ? '#c62828' : status === 'testing' ? '#f57c00' : '#706e64'
    }),
    form: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
      gap: '12px',
      marginBottom: '25px',
      backgroundColor: '#ffffff',
      padding: '20px',
      borderRadius: '8px',
      border: '1px solid #e1dbcd'
    },
    input: {
      padding: '10px 14px',
      borderRadius: '6px',
      border: '1px solid #ccc7b9',
      fontSize: '0.95rem',
      backgroundColor: '#fafafa',
    },
    buttonGroup: {
      gridColumn: '1 / -1',
      display: 'flex',
      gap: '10px',
      justifyContent: 'flex-end',
      marginTop: '10px'
    },
    btnCheck: {
      backgroundColor: '#fff',
      color: '#1b2a4a',
      border: '1px solid #1b2a4a',
      padding: '6px 12px',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '0.85rem',
      fontWeight: '500'
    },
    btnPrimary: {
      backgroundColor: '#1b2a4a', 
      color: 'white',
      border: 'none',
      padding: '10px 20px',
      borderRadius: '6px',
      cursor: 'pointer',
      fontWeight: 'bold',
    },
    btnSecondary: {
      backgroundColor: '#706e64', 
      color: 'white',
      border: 'none',
      padding: '10px 20px',
      borderRadius: '6px',
      cursor: 'pointer',
    },
    btnShowAll: {
      backgroundColor: '#df4747', 
      color: 'white',
      border: 'none',
      padding: '10px 20px',
      borderRadius: '6px',
      cursor: 'pointer',
      fontWeight: 'bold',
    },
    toast: {
      color: '#1b2a4a',
      fontSize: '0.9rem',
      fontWeight: '500',
      fontStyle: 'italic'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      overflow: 'hidden',
      border: '1px solid #e1dbcd'
    },
    th: {
      backgroundColor: '#1b2a4a',
      color: '#ffffff',
      padding: '14px',
      textAlign: 'left',
      fontSize: '0.95rem',
    },
    td: {
      padding: '12px 14px',
      borderBottom: '1px solid #e1dbcd',
      color: '#4a4a4a',
      fontSize: '0.95rem'
    },
    actionBtnEdit: {
      background: 'none',
      border: '1px solid #1b2a4a',
      color: '#1b2a4a',
      padding: '4px 10px',
      borderRadius: '4px',
      cursor: 'pointer',
      marginRight: '6px',
    },
    actionBtnDelete: {
      background: 'none',
      border: '1px solid #df4747',
      color: '#df4747',
      padding: '4px 10px',
      borderRadius: '4px',
      cursor: 'pointer',
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Phonebook Directory</h1>
      </div>

      {/* Utility Panel: System Notification & Database Checker */}
      <div style={styles.metaPanel}>
        <div style={styles.toast}>{message || 'System ready'}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button type="button" onClick={checkDatabaseConnection} style={styles.btnCheck}>
            Check DB Connection
          </button>
          <span style={styles.statusBadge(dbStatus)}>
            {dbStatus === 'idle' && 'Status: Unknown'}
            {dbStatus === 'testing' && 'Testing Connection...'}
            {dbStatus === 'connected' && 'Connected Successfully!'}
            {dbStatus === 'failed' && 'Connection Failed!'}
          </span>
        </div>
      </div>

      {/* Entry Form */}
      <form onSubmit={handleSubmit} style={styles.form}>
        <input style={styles.input} name="first_name" placeholder="First Name" value={formData.first_name} onChange={handleChange} required />
        <input style={styles.input} name="last_name" placeholder="Last Name" value={formData.last_name} onChange={handleChange} required />
        <input style={styles.input} name="email" type="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required />
        <input style={styles.input} name="phone_number" placeholder="Phone Number" value={formData.phone_number} onChange={handleChange} />
        
        <div style={styles.buttonGroup}>
          <button type="button" onClick={handleShowAll} style={styles.btnShowAll}>
            Show All
          </button>
          <button type="submit" style={styles.btnPrimary}>
            {editingId ? 'Update Contact' : 'Add Contact'}
          </button>
          {editingId && (
            <button type="button" onClick={() => { setEditingId(null); setFormData({ first_name: '', last_name: '', email: '', phone_number: '' }); }} style={styles.btnSecondary}>
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Table Display */}
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>First Name</th>
            <th style={styles.th}>Last Name</th>
            <th style={styles.th}>Email</th>
            <th style={styles.th}>Phone Number</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan="5" style={{ ...styles.td, textAlign: 'center', color: '#999' }}>
                No records found.
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user.user_id}>
                <td style={styles.td}>{user.first_name}</td>
                <td style={styles.td}>{user.last_name}</td>
                <td style={styles.td}>{user.email}</td>
                <td style={styles.td}>{user.phone_number || 'N/A'}</td>
                <td style={styles.td}>
                  <button onClick={() => handleEdit(user)} style={styles.actionBtnEdit}>Edit</button>
                  <button onClick={() => handleDelete(user.user_id)} style={styles.actionBtnDelete}>Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;
