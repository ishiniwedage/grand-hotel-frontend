import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStaffByEmployeeId, logStaffAccess } from '../services/API';

function StaffAccessPage() {
    const [employeeId, setEmployeeId] = useState('');
    const [roomNumber, setRoomNumber] = useState('');
    const [reason, setReason] = useState('');
    const [staff, setStaff] = useState(null);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleVerify = async () => {
        setError('');
        setStaff(null);
        if (!employeeId) {
            setError('Please enter your Employee ID.');
            return;
        }
        try {
            const res = await getStaffByEmployeeId(employeeId);
            if (res.data) {
                setStaff(res.data);
            } else {
                setError('Employee not found.');
            }
        } catch {
            setError('Employee not found. Please check your ID.');
        }
    };

    const handleAccess = async () => {
        setError('');
        if (!roomNumber || !reason) {
            setError('Please enter room number and reason.');
            return;
        }
        try {
            setLoading(true);
            await logStaffAccess(employeeId, roomNumber, reason);
            setSuccess(true);
        } catch {
            setError('Failed to log access. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.header}>
                    <h1 style={styles.hotelName}>🏨 Grand Hotel</h1>
                    <p style={styles.tagline}>Staff Room Access</p>
                </div>

                <div style={styles.body}>
                    {!success ? (
                        <>
                            <div style={styles.step}>
                                <h3 style={styles.stepTitle}>Step 1 — Enter Employee ID</h3>
                                <div style={styles.searchRow}>
                                    <input
                                        style={styles.input}
                                        placeholder="e.g. EMP001"
                                        value={employeeId}
                                        onChange={e => setEmployeeId(e.target.value)}
                                    />
                                    <button style={styles.verifyButton} onClick={handleVerify}>
                                        Verify
                                    </button>
                                </div>
                            </div>

                            {staff && (
                                <div style={styles.staffInfo}>
                                    <p style={styles.staffName}>✅ {staff.name}</p>
                                    <p style={styles.staffDetail}>Role: {staff.role}</p>
                                    <p style={styles.staffDetail}>ID: {staff.employeeId}</p>
                                </div>
                            )}

                            {staff && (
                                <div style={styles.step}>
                                    <h3 style={styles.stepTitle}>Step 2 — Log Room Access</h3>

                                    <label style={styles.label}>Room Number</label>
                                    <input
                                        style={styles.input}
                                        type="number"
                                        placeholder="Enter room number (1-20)"
                                        value={roomNumber}
                                        onChange={e => setRoomNumber(e.target.value)}
                                    />

                                    <label style={styles.label}>Reason</label>
                                    <select
                                        style={styles.input}
                                        value={reason}
                                        onChange={e => setReason(e.target.value)}
                                    >
                                        <option value="">-- Select reason --</option>
                                        <option value="Cleaning">Cleaning</option>
                                        <option value="Maintenance">Maintenance</option>
                                        <option value="Room Service">Room Service</option>
                                    </select>

                                    {error && <p style={styles.error}>⚠️ {error}</p>}

                                    <button
                                        style={loading ? styles.buttonDisabled : styles.button}
                                        onClick={handleAccess}
                                        disabled={loading}
                                    >
                                        {loading ? 'Logging...' : '🔐 Log Room Access'}
                                    </button>
                                </div>
                            )}

                            {error && !staff && <p style={styles.error}>⚠️ {error}</p>}
                        </>
                    ) : (
                        <div style={styles.successBox}>
                            <p style={styles.successIcon}>✅</p>
                            <h3 style={styles.successTitle}>Access Logged!</h3>
                            <p style={styles.successDetail}>
                                {staff?.name} accessed Room {roomNumber}
                            </p>
                            <p style={styles.successDetail}>Reason: {reason}</p>
                            <p style={styles.successDetail}>
                                Time: {new Date().toLocaleString()}
                            </p>
                            <button
                                style={styles.button}
                                onClick={() => {
                                    setSuccess(false);
                                    setStaff(null);
                                    setEmployeeId('');
                                    setRoomNumber('');
                                    setReason('');
                                }}
                            >
                                Log Another Access
                            </button>
                        </div>
                    )}

                    <button style={styles.backButton} onClick={() => navigate('/dashboard')}>
                        ← Back
                    </button>
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: { minHeight: '100vh', backgroundColor: '#f0f4f8', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' },
    card: { backgroundColor: 'white', borderRadius: '16px', width: '100%', maxWidth: '480px', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', overflow: 'hidden' },
    header: { backgroundColor: '#e67e22', padding: '24px', textAlign: 'center' },
    hotelName: { color: 'white', margin: 0, fontSize: '1.8rem' },
    tagline: { color: '#fdebd0', margin: '6px 0 0 0' },
    body: { padding: '28px', display: 'flex', flexDirection: 'column', gap: '16px' },
    step: { display: 'flex', flexDirection: 'column', gap: '10px' },
    stepTitle: { color: '#2c3e50', margin: 0, fontSize: '1rem' },
    searchRow: { display: 'flex', gap: '10px' },
    label: { color: '#2c3e50', fontWeight: 'bold', fontSize: '0.9rem' },
    input: { padding: '10px 12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.95rem', width: '100%', boxSizing: 'border-box' },
    verifyButton: { padding: '10px 16px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', whiteSpace: 'nowrap' },
    staffInfo: { backgroundColor: '#eafaf1', borderRadius: '10px', padding: '14px' },
    staffName: { margin: '0 0 4px 0', color: '#27ae60', fontWeight: 'bold' },
    staffDetail: { margin: '2px 0', color: '#555', fontSize: '0.9rem' },
    error: { color: '#e74c3c', backgroundColor: '#fdecea', padding: '10px', borderRadius: '8px', fontSize: '0.9rem', margin: 0 },
    button: { padding: '12px', backgroundColor: '#e67e22', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1rem', cursor: 'pointer', fontWeight: 'bold' },
    buttonDisabled: { padding: '12px', backgroundColor: '#95a5a6', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1rem', cursor: 'not-allowed' },
    backButton: { padding: '10px', backgroundColor: '#ecf0f1', color: '#555', border: 'none', borderRadius: '8px', fontSize: '0.95rem', cursor: 'pointer' },
    successBox: { textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' },
    successIcon: { fontSize: '3rem', margin: 0 },
    successTitle: { color: '#27ae60', margin: 0 },
    successDetail: { color: '#555', margin: 0, fontSize: '0.95rem' }
};

export default StaffAccessPage;