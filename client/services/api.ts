import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const BASE_URL = Platform.OS === 'android'
    ? 'http://10.0.2.2:5000/api'
    : 'http://localhost:5000/api';

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const authService = {
    login: async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        return response.data;
    },
    getMe: async () => {
        const response = await api.get('/auth/me');
        return response.data;
    },
};

export const userService = {
    getAll: async () => {
        const response = await api.get('/users');
        return response.data;
    },
    getById: async (id) => {
        const response = await api.get(`/users/${id}`);
        return response.data;
    },
    create: async (data) => {
        const response = await api.post('/users', data);
        return response.data;
    },
    update: async (id, data) => {
        const response = await api.put(`/users/${id}`, data);
        return response.data;
    },
    delete: async (id) => {
        const response = await api.delete(`/users/${id}`);
        return response.data;
    },
};

export const staffService = {
    getAll: async () => {
        const response = await api.get('/users/staff/all');
        return response.data;
    },
    create: async (data) => {
        const response = await api.post('/users/staff', data);
        return response.data;
    },
    update: async (id, data) => {
        const response = await api.put(`/users/staff/${id}`, data);
        return response.data;
    },
    delete: async (id) => {
        const response = await api.delete(`/users/staff/${id}`);
        return response.data;
    },
};

export const unitService = {
    getAll: async () => {
        const response = await api.get('/units');
        return response.data;
    },
    getById: async (id) => {
        const response = await api.get(`/units/${id}`);
        return response.data;
    },
    create: async (data) => {
        const response = await api.post('/units', data);
        return response.data;
    },
    update: async (id, data) => {
        const response = await api.put(`/units/${id}`, data);
        return response.data;
    },
    delete: async (id) => {
        const response = await api.delete(`/units/${id}`);
        return response.data;
    },
    addFamilyMember: async (unitId, data) => {
        const response = await api.post(`/units/${unitId}/family`, data);
        return response.data;
    },
    updateFamilyMember: async (unitId, index, data) => {
        const response = await api.put(`/units/${unitId}/family/${index}`, data);
        return response.data;
    },
    deleteFamilyMember: async (unitId, index) => {
        const response = await api.delete(`/units/${unitId}/family/${index}`);
        return response.data;
    },
    addVehicle: async (unitId, data) => {
        const response = await api.post(`/units/${unitId}/vehicles`, data);
        return response.data;
    },
    updateVehicle: async (unitId, index, data) => {
        const response = await api.put(`/units/${unitId}/vehicles/${index}`, data);
        return response.data;
    },
    deleteVehicle: async (unitId, index) => {
        const response = await api.delete(`/units/${unitId}/vehicles/${index}`);
        return response.data;
    },
    addPet: async (unitId, data) => {
        const response = await api.post(`/units/${unitId}/pets`, data);
        return response.data;
    },
    deletePet: async (unitId, index) => {
        const response = await api.delete(`/units/${unitId}/pets/${index}`);
        return response.data;
    },
};

export const ticketService = {
    getAll: async () => {
        const response = await api.get('/tickets');
        return response.data;
    },
    getMyTickets: async () => {
        const response = await api.get('/tickets/my');
        return response.data;
    },
    create: async (data) => {
        const response = await api.post('/tickets', data);
        return response.data;
    },
    update: async (id, data) => {
        const response = await api.put(`/tickets/${id}`, data);
        return response.data;
    },
};

export const billService = {
    getAll: async () => {
        const response = await api.get('/bills');
        return response.data;
    },
    getMyBills: async () => {
        const response = await api.get('/bills/my');
        return response.data;
    },
    create: async (data) => {
        const response = await api.post('/bills', data);
        return response.data;
    },
    update: async (id, data) => {
        const response = await api.put(`/bills/${id}`, data);
        return response.data;
    },
    delete: async (id) => {
        const response = await api.delete(`/bills/${id}`);
        return response.data;
    },
    pay: async (id) => {
        const response = await api.put(`/bills/${id}/pay`);
        return response.data;
    },
};

export const visitorService = {
    getAll: async () => {
        const response = await api.get('/visitors');
        return response.data;
    },
    checkIn: async (data) => {
        const response = await api.post('/visitors/checkin', data);
        return response.data;
    },
    checkOut: async (id) => {
        const response = await api.put(`/visitors/${id}/checkout`);
        return response.data;
    },
    update: async (id, data) => {
        const response = await api.put(`/visitors/${id}`, data);
        return response.data;
    },
    delete: async (id) => {
        const response = await api.delete(`/visitors/${id}`);
        return response.data;
    },
};

export const facilityService = {
    getAll: async () => {
        const response = await api.get('/facilities');
        return response.data;
    },
    create: async (data) => {
        const response = await api.post('/facilities', data);
        return response.data;
    },
    update: async (id, data) => {
        const response = await api.put(`/facilities/${id}`, data);
        return response.data;
    },
    delete: async (id) => {
        const response = await api.delete(`/facilities/${id}`);
        return response.data;
    },
    getBookings: async () => {
        const response = await api.get('/facilities/bookings');
        return response.data;
    },
    createBooking: async (data) => {
        const response = await api.post('/facilities/bookings', data);
        return response.data;
    },
    updateBooking: async (id, data) => {
        const response = await api.put(`/facilities/bookings/${id}`, data);
        return response.data;
    },
    deleteBooking: async (id) => {
        const response = await api.delete(`/facilities/bookings/${id}`);
        return response.data;
    },
};

export const noticeService = {
    getAll: async () => {
        const response = await api.get('/notices');
        return response.data;
    },
    create: async (data) => {
        const response = await api.post('/notices', data);
        return response.data;
    },
    update: async (id, data) => {
        const response = await api.put(`/notices/${id}`, data);
        return response.data;
    },
    delete: async (id) => {
        const response = await api.delete(`/notices/${id}`);
        return response.data;
    },
};

export const pollService = {
    getAll: async () => {
        const response = await api.get('/polls');
        return response.data;
    },
    create: async (data) => {
        const response = await api.post('/polls', data);
        return response.data;
    },
    update: async (id, data) => {
        const response = await api.put(`/polls/${id}`, data);
        return response.data;
    },
    delete: async (id) => {
        const response = await api.delete(`/polls/${id}`);
        return response.data;
    },
    vote: async (id, optionIndex) => {
        const response = await api.post(`/polls/${id}/vote`, { optionIndex });
        return response.data;
    },
};

export const vendorService = {
    getAll: async () => {
        const response = await api.get('/vendors');
        return response.data;
    },
    create: async (data) => {
        const response = await api.post('/vendors', data);
        return response.data;
    },
    update: async (id, data) => {
        const response = await api.put(`/vendors/${id}`, data);
        return response.data;
    },
    delete: async (id) => {
        const response = await api.delete(`/vendors/${id}`);
        return response.data;
    },
};

export const documentService = {
    getAll: async () => {
        const response = await api.get('/documents');
        return response.data;
    },
    create: async (data) => {
        const response = await api.post('/documents', data);
        return response.data;
    },
};

export const parkingService = {
    getAll: async () => {
        const response = await api.get('/parking');
        return response.data;
    },
    create: async (data) => {
        const response = await api.post('/parking', data);
        return response.data;
    },
    update: async (id, data) => {
        const response = await api.put(`/parking/${id}`, data);
        return response.data;
    },
};

export const emergencyService = {
    getAll: async () => {
        const response = await api.get('/emergency');
        return response.data;
    },
};

export default api;
