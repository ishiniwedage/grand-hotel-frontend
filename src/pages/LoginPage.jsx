import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = () => {
        if (username === 'admin' && password === 'admin123') {
            localStorage.setItem('isLoggedIn', 'true');
            navigate('/dashboard');
        } else {
            setError('Invalid username or password.');
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.header}>
                    <h1 style={styles.hotelName}>🏨 Grand Hotel</h1>
                    <p style={styles.tagline}>Management System</p>
                </div>

                <div style={styles.body}>
                    <h2 style={styles.title}>Management Login</h2>

                    <div style={styles.field}>
                        <label style={styles.label}>Username</label>
                        <input
                            style={styles.input}
                            type="text"
                            placeholder="Enter username"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                        />
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>Password</label>
                        <input
                            style={styles.input}
                            type="password"
                            placeholder="Enter password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleLogin()}
                        />
                    </div>

                    {error && <p style={styles.error}>⚠️ {error}</p>}

                    <button style={styles.button} onClick={handleLogin}>
                        Login
                    </button>

                    
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: {
        minHeight: '100vh',
        backgroundColor: '#f0f4f8',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    card: {
        backgroundColor: 'white',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '420px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
        overflow: 'hidden'
    },
    header: {
        backgroundColor: '#2c3e50',
        padding: '32px',
        textAlign: 'center'
    },
    hotelName: {
        color: 'white',
        margin: 0,
        fontSize: '2rem'
    },
    tagline: {
        color: '#bdc3c7',
        margin: '8px 0 0 0'
    },
    body: {
        padding: '32px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
    },
    title: {
        color: '#2c3e50',
        textAlign: 'center',
        margin: '0 0 8px 0'
    },
    field: {
        display: 'flex',
        flexDirection: 'column',
        gap: '6px'
    },
    label: {
        color: '#2c3e50',
        fontWeight: 'bold',
        fontSize: '0.9rem'
    },
    input: {
        padding: '10px 12px',
        borderRadius: '8px',
        border: '1px solid #ddd',
        fontSize: '1rem'
    },
    error: {
        color: '#e74c3c',
        backgroundColor: '#fdecea',
        padding: '10px',
        borderRadius: '8px',
        fontSize: '0.9rem',
        margin: 0
    },
    button: {
        padding: '13px',
        backgroundColor: '#2c3e50',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '1rem',
        cursor: 'pointer',
        fontWeight: 'bold'
    },
    hint: {
        textAlign: 'center',
        color: '#95a5a6',
        fontSize: '0.85rem',
        margin: 0
    }
};

export default LoginPage;