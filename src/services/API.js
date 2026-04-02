import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api';

export const getAllRooms = () => axios.get(`${BASE_URL}/rooms`);
export const getRoomByNumber = (roomNumber) => axios.get(`${BASE_URL}/rooms/${roomNumber}`);
export const getBookingByRoom = (roomNumber) => axios.get(`${BASE_URL}/bookings/room/${roomNumber}`);
export const getBookingsByGuest = (guestId) => axios.get(`${BASE_URL}/bookings/guest/${guestId}`);
export const getGuestById = (id) => axios.get(`${BASE_URL}/guests/${id}`);
export const getGuestByNationalId = (nationalId) => axios.get(`${BASE_URL}/guests/national/${nationalId}`);
export const getAllStaff = () => axios.get(`${BASE_URL}/staff`);
export const getStaffByEmployeeId = (employeeId) => axios.get(`${BASE_URL}/staff/${employeeId}`);

export const logStaffAccess = (employeeId, roomNumber, reason) =>
    axios.post(`${BASE_URL}/staff/access?employeeId=${employeeId}&roomNumber=${roomNumber}&reason=${reason}`);

export const getAccessLogByRoom = (roomNumber) => axios.get(`${BASE_URL}/staff/access/${roomNumber}`);