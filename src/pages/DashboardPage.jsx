import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    getAllRooms, getRoomByNumber, getBookingByRoom,
    getGuestById, getGuestByNationalId, getBookingsByGuest,
    getAccessLogByRoom
} from '../services/API';

function DashboardPage() {
    const [allRooms, setAllRooms] = useState([]);
    const [searchType, setSearchType] = useState('room');
    const [searchValue, setSearchValue] = useState('');
    const [room, setRoom] = useState(null);
    const [booking, setBooking] = useState(null);
    const [guest, setGuest] = useState(null);
    const [accessLog, setAccessLog] = useState([]);
    const [error, setError] = useState('');
    const [searched, setSearched] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        getAllRooms().then(res => setAllRooms(res.data));
    }, []);

    const handleSearch = async () => {
        setError('');
        setRoom(null);
        setBooking(null);
        setGuest(null);
        setAccessLog([]);
        setSearched(false);

        if (!searchValue) {
            setError('Please enter a search value.');
            return;
        }

        try {
            if (searchType === 'room') {
                const roomRes = await getRoomByNumber(searchValue);
                setRoom(roomRes.data);
                try {
                    const bookingRes = await getBookingByRoom(searchValue);
                    setBooking(bookingRes.data);
                    if (bookingRes.data?.guestId) {
                        const guestRes = await getGuestById(bookingRes.data.guestId);
                        setGuest(guestRes.data);
                    }
                    const logRes = await getAccessLogByRoom(searchValue);
                    setAccessLog(logRes.data);
                } catch {
                    setBooking(null);
                }
            } else {
                const guestRes = await getGuestByNationalId(searchValue);
                if (!guestRes.data) {
                    setError('Guest not found.');
                    return;
                }
                setGuest(guestRes.data);
                const bookingsRes = await getBookingsByGuest(guestRes.data.id);
                if (bookingsRes.data.length > 0) {
                    const b = bookingsRes.data[0];
                    setBooking(b);
                    const roomRes = await getRoomByNumber(b.roomNumber);
                    setRoom(roomRes.data);
                    const logRes = await getAccessLogByRoom(b.roomNumber);
                    setAccessLog(logRes.data);
                }
            }
            setSearched(true);
        } catch {
            setError('Not found. Please check your input.');
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return 'N/A';
        return new Date(dateStr).toLocaleString();
    };

    const handleLogout = () => {
        localStorage.removeItem('isLoggedIn');
        navigate('/');
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.hotelName}>🏨 Grand Hotel — Management Dashboard</h1>
                <div style={styles.headerButtons}>
                    <button style={styles.staffButton} onClick={() => navigate('/staff-access')}>
                        🛠️ Staff Access
                    </button>
                    <button style={styles.logoutButton} onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </div>

            <div style={styles.content}>
                <div style={styles.searchCard}>
                    <h2 style={styles.sectionTitle}>🔍 Search</h2>
                    <div style={styles.toggleRow}>
                        <button
                            style={searchType === 'room' ? styles.toggleActive : styles.toggle}
                            onClick={() => setSearchType('room')}
                        >
                            By Room Number
                        </button>
                        <button
                            style={searchType === 'guest' ? styles.toggleActive : styles.toggle}
                            onClick={() => setSearchType('guest')}
                        >
                            By National ID
                        </button>
                    </div>
                    <div style={styles.searchRow}>
                        <input
                            style={styles.input}
                            placeholder={searchType === 'room' ? 'Enter room number...' : 'Enter National ID...'}
                            value={searchValue}
                            onChange={e => setSearchValue(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleSearch()}
                        />
                        <button style={styles.searchButton} onClick={handleSearch}>
                            Search
                        </button>
                    </div>
                    {error && <p style={styles.error}>⚠️ {error}</p>}
                </div>

                {searched && (
                    <div style={styles.resultsGrid}>
                        {room && (
                            <div style={styles.resultCard}>
                                <h3 style={styles.cardTitle}>🛏️ Room Details</h3>
                                <div style={styles.row}>
                                    <span style={styles.label}>Room Number</span>
                                    <span style={styles.value}>Room {room.roomNumber}</span>
                                </div>
                                <div style={styles.row}>
                                    <span style={styles.label}>Type</span>
                                    <span style={styles.value}>{room.roomType}</span>
                                </div>
                                <div style={styles.row}>
                                    <span style={styles.label}>Price/Night</span>
                                    <span style={styles.value}>${room.pricePerNight}</span>
                                </div>
                                <div style={styles.row}>
                                    <span style={styles.label}>Status</span>
                                    <span style={room.available ? styles.available : styles.occupied}>
                                        {room.available ? '✅ Available' : '❌ Occupied'}
                                    </span>
                                </div>
                            </div>
                        )}

                        {guest && (
                            <div style={styles.resultCard}>
                                <h3 style={styles.cardTitle}>👤 Guest Details</h3>
                                <div style={styles.row}>
                                    <span style={styles.label}>Name</span>
                                    <span style={styles.value}>{guest.name}</span>
                                </div>
                                <div style={styles.row}>
                                    <span style={styles.label}>Email</span>
                                    <span style={styles.value}>{guest.email}</span>
                                </div>
                                <div style={styles.row}>
                                    <span style={styles.label}>Phone</span>
                                    <span style={styles.value}>{guest.phone}</span>
                                </div>
                                <div style={styles.row}>
                                    <span style={styles.label}>National ID</span>
                                    <span style={styles.value}>{guest.nationalId}</span>
                                </div>
                            </div>
                        )}

                        {booking && (
                            <div style={styles.resultCard}>
                                <h3 style={styles.cardTitle}>📋 Booking Details</h3>
                                <div style={styles.row}>
                                    <span style={styles.label}>Card ID</span>
                                    <span style={styles.value}>{booking.cardId}</span>
                                </div>
                                <div style={styles.row}>
                                    <span style={styles.label}>Status</span>
                                    <span style={booking.status === 'ACTIVE' ? styles.active : styles.checkedOut}>
                                        {booking.status}
                                    </span>
                                </div>
                                <div style={styles.row}>
                                    <span style={styles.label}>Check-In</span>
                                    <span style={styles.value}>{formatDate(booking.checkInTime)}</span>
                                </div>
                                <div style={styles.row}>
                                    <span style={styles.label}>Check-Out</span>
                                    <span style={styles.value}>{formatDate(booking.checkOutTime)}</span>
                                </div>
                            </div>
                        )}

                        {accessLog.length > 0 && (
                            <div style={styles.resultCard}>
                                <h3 style={styles.cardTitle}>🔐 Staff Access Log</h3>
                                {accessLog.map((log, index) => (
                                    <div key={index} style={styles.logItem}>
                                        <p style={styles.logName}>👷 {log.staffName} ({log.employeeId})</p>
                                        <p style={styles.logDetail}>Reason: {log.reason}</p>
                                        <p style={styles.logDetail}>Time: {formatDate(log.accessTime)}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                <div style={styles.overviewCard}>
                    <h2 style={styles.sectionTitle}>🏨 All Rooms Overview</h2>
                    <div style={styles.roomsGrid}>
                        {allRooms.map(r => (
                            <div
                                key={r.id}
                                style={r.available ? styles.roomAvailable : styles.roomOccupied}
                                onClick={() => { setSearchType('room'); setSearchValue(String(r.roomNumber)); }}
                            >
                                <p style={styles.roomNumber}>Room {r.roomNumber}</p>
                                <p style={styles.roomType}>{r.roomType}</p>
                                <p style={styles.roomStatus}>{r.available ? '✅' : '❌'}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: { minHeight: '100vh', backgroundColor: '#f0f4f8', fontFamily: 'Arial' },
    header: { backgroundColor: '#2c3e50', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    hotelName: { color: 'white', margin: 0, fontSize: '1.3rem' },
    headerButtons: { display: 'flex', gap: '10px' },
    staffButton: { padding: '8px 16px', backgroundColor: '#e67e22', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' },
    logoutButton: { padding: '8px 16px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' },
    content: { padding: '24px', maxWidth: '1200px', margin: '0 auto' },
    searchCard: { backgroundColor: 'white', borderRadius: '12px', padding: '24px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
    sectionTitle: { color: '#2c3e50', margin: '0 0 16px 0' },
    toggleRow: { display: 'flex', gap: '10px', marginBottom: '16px' },
    toggle: { padding: '8px 20px', backgroundColor: '#ecf0f1', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem' },
    toggleActive: { padding: '8px 20px', backgroundColor: '#2c3e50', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem' },
    searchRow: { display: 'flex', gap: '10px' },
    input: { flex: 1, padding: '10px 12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem' },
    searchButton: { padding: '10px 24px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '1rem' },
    error: { color: '#e74c3c', margin: '10px 0 0 0', fontSize: '0.9rem' },
    resultsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px', marginBottom: '24px' },
    resultCard: { backgroundColor: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
    cardTitle: { color: '#2c3e50', margin: '0 0 12px 0', fontSize: '1rem' },
    row: { display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f0f0f0' },
    label: { color: '#7f8c8d', fontSize: '0.9rem' },
    value: { color: '#2c3e50', fontWeight: '500', fontSize: '0.9rem' },
    available: { color: '#27ae60', fontWeight: 'bold' },
    occupied: { color: '#e74c3c', fontWeight: 'bold' },
    active: { backgroundColor: '#27ae60', color: 'white', padding: '2px 10px', borderRadius: '20px', fontSize: '0.85rem' },
    checkedOut: { backgroundColor: '#95a5a6', color: 'white', padding: '2px 10px', borderRadius: '20px', fontSize: '0.85rem' },
    logItem: { backgroundColor: '#f8f9fa', borderRadius: '8px', padding: '10px', marginBottom: '8px' },
    logName: { margin: '0 0 4px 0', color: '#2c3e50', fontWeight: 'bold', fontSize: '0.9rem' },
    logDetail: { margin: '2px 0', color: '#7f8c8d', fontSize: '0.85rem' },
    overviewCard: { backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
    roomsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '10px' },
    roomNumber: { margin: '0 0 4px 0', fontWeight: 'bold', color: '#2c3e50', fontSize: '0.9rem' },
    roomType: { margin: '0 0 4px 0', color: '#7f8c8d', fontSize: '0.75rem' },
    roomStatus: { margin: 0, fontSize: '1rem' },
    roomAvailable: { backgroundColor: '#eafaf1', border: '2px solid #27ae60', borderRadius: '10px', padding: '12px', textAlign: 'center', cursor: 'pointer' },
    roomOccupied: { backgroundColor: '#fdecea', border: '2px solid #e74c3c', borderRadius: '10px', padding: '12px', textAlign: 'center', cursor: 'pointer' }
};

export default DashboardPage;