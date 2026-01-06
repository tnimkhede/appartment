import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Bill, Ticket, Visitor, FacilityBooking, Notice, Poll, User, Staff,
  Unit, Vendor, EmergencyContact, Facility, Document,
} from '@/data/mockData';
import {
  ticketService,
  billService,
  visitorService,
  facilityService,
  noticeService,
  pollService,
  userService,
  staffService,
  unitService,
  vendorService,
  emergencyService,
  documentService,
} from '@/services/api';
import { useAuth } from './AuthContext';

interface DataContextType {
  bills: Bill[];
  tickets: Ticket[];
  visitors: Visitor[];
  facilityBookings: FacilityBooking[];
  notices: Notice[];
  polls: Poll[];
  users: User[];
  staff: Staff[];
  units: Unit[];
  vendors: Vendor[];
  emergencyContacts: EmergencyContact[];
  facilities: Facility[];
  documents: Document[];
  refreshData: () => Promise<void>;
  addTicket: (ticket: any) => Promise<void>;
  updateTicket: (id: string, updates: Partial<Ticket>) => Promise<void>;
  addVisitor: (visitor: any) => Promise<void>;
  checkOutVisitor: (id: string) => Promise<void>;
  addFacilityBooking: (booking: any) => Promise<void>;
  updateFacilityBooking: (id: string, updates: Partial<FacilityBooking>) => Promise<void>;
  payBill: (id: string) => Promise<void>;
  votePoll: (pollId: string, optionIndex: number, userId: string) => Promise<void>;
  addUser: (user: any) => Promise<void>;
  updateUser: (id: string, updates: Partial<User>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  addStaff: (staff: any) => Promise<void>;
  updateStaff: (id: string, updates: Partial<Staff>) => Promise<void>;
  deleteStaff: (id: string) => Promise<void>;
  // Add other methods as needed
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [bills, setBills] = useState<Bill[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [facilityBookings, setFacilityBookings] = useState<FacilityBooking[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [polls, setPolls] = useState<Poll[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const loadData = async () => {
    try {
      const [
        fetchedBills,
        fetchedTickets,
        fetchedVisitors,
        fetchedBookings,
        fetchedNotices,
        fetchedPolls,
        fetchedUsers,
        fetchedStaff,
        fetchedUnits,
        fetchedVendors,
        fetchedEmergency,
        fetchedFacilities,
        fetchedDocuments
      ] = await Promise.all([
        billService.getAll(),
        ticketService.getAll(),
        visitorService.getAll(),
        facilityService.getBookings(),
        noticeService.getAll(),
        pollService.getAll(),
        userService.getAll(),
        staffService.getAll(),
        unitService.getAll(),
        vendorService.getAll(),
        emergencyService.getAll(),
        facilityService.getAll(),
        documentService.getAll()
      ]);

      setBills(fetchedBills);
      setTickets(fetchedTickets);
      setVisitors(fetchedVisitors);
      setFacilityBookings(fetchedBookings);
      setNotices(fetchedNotices);
      setPolls(fetchedPolls);
      setUsers(fetchedUsers);
      setStaff(fetchedStaff);
      setUnits(fetchedUnits);
      setVendors(fetchedVendors);
      setEmergencyContacts(fetchedEmergency);
      setFacilities(fetchedFacilities);
      setDocuments(fetchedDocuments);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const addTicket = async (ticket: any) => {
    try {
      const newTicket = await ticketService.create(ticket);
      setTickets(prev => [newTicket, ...prev]);
    } catch (error) {
      console.error('Error adding ticket:', error);
      throw error;
    }
  };

  const updateTicket = async (id: string, updates: Partial<Ticket>) => {
    try {
      const updatedTicket = await ticketService.update(id, updates);
      setTickets(prev => prev.map(t => t.id === id ? updatedTicket : t));
    } catch (error) {
      console.error('Error updating ticket:', error);
      throw error;
    }
  };

  const addVisitor = async (visitor: any) => {
    try {
      const newVisitor = await visitorService.checkIn(visitor);
      setVisitors(prev => [newVisitor, ...prev]);
    } catch (error) {
      console.error('Error adding visitor:', error);
      throw error;
    }
  };

  const checkOutVisitor = async (id: string) => {
    try {
      const updatedVisitor = await visitorService.checkOut(id);
      setVisitors(prev => prev.map(v => v.id === id ? updatedVisitor : v));
    } catch (error) {
      console.error('Error checking out visitor:', error);
      throw error;
    }
  };

  const addFacilityBooking = async (booking: any) => {
    try {
      const newBooking = await facilityService.createBooking(booking);
      setFacilityBookings(prev => [newBooking, ...prev]);
    } catch (error) {
      console.error('Error adding facility booking:', error);
      throw error;
    }
  };

  const updateFacilityBooking = async (id: string, updates: Partial<FacilityBooking>) => {
    try {
      const updatedBooking = await facilityService.updateBooking(id, updates);
      setFacilityBookings(prev => prev.map(b => b.id === id ? updatedBooking : b));
    } catch (error) {
      console.error('Error updating facility booking:', error);
      throw error;
    }
  };

  const payBill = async (id: string) => {
    try {
      const updatedBill = await billService.pay(id);
      setBills(prev => prev.map(b => b.id === id ? updatedBill : b));
    } catch (error) {
      console.error('Error paying bill:', error);
      throw error;
    }
  };

  const votePoll = async (pollId: string, optionIndex: number, userId: string) => {
    try {
      const updatedPoll = await pollService.vote(pollId, optionIndex);
      setPolls(prev => prev.map(p => p.id === pollId ? updatedPoll : p));
    } catch (error) {
      console.error('Error voting poll:', error);
      throw error;
    }
  };

  const addUser = async (user: any) => {
    try {
      const newUser = await userService.create(user);
      setUsers(prev => [...prev, newUser]);
    } catch (error) {
      console.error('Error adding user:', error);
      throw error;
    }
  };

  const updateUser = async (id: string, updates: Partial<User>) => {
    try {
      const updatedUser = await userService.update(id, updates);
      setUsers(prev => prev.map(u => u.id === id ? updatedUser : u));
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  };

  const deleteUser = async (id: string) => {
    try {
      await userService.delete(id);
      setUsers(prev => prev.filter(u => u.id !== id));
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  };

  const addStaff = async (staffMember: any) => {
    try {
      const newStaff = await staffService.create(staffMember);
      setStaff(prev => [...prev, newStaff]);
    } catch (error) {
      console.error('Error adding staff:', error);
      throw error;
    }
  };

  const updateStaff = async (id: string, updates: Partial<Staff>) => {
    try {
      const updatedStaff = await staffService.update(id, updates);
      setStaff(prev => prev.map(s => s.id === id ? updatedStaff : s));
    } catch (error) {
      console.error('Error updating staff:', error);
      throw error;
    }
  };

  const deleteStaff = async (id: string) => {
    try {
      await staffService.delete(id);
      setStaff(prev => prev.filter(s => s.id !== id));
    } catch (error) {
      console.error('Error deleting staff:', error);
      throw error;
    }
  };

  return (
    <DataContext.Provider value={{
      bills,
      tickets,
      visitors,
      facilityBookings,
      notices,
      polls,
      users,
      staff,
      units,
      vendors,
      emergencyContacts,
      refreshData: loadData,
      addTicket,
      updateTicket,
      addVisitor,
      checkOutVisitor,
      addFacilityBooking,
      updateFacilityBooking,
      payBill,
      votePoll,
      addUser,
      updateUser,
      deleteUser,
      addStaff,
      updateStaff,
      deleteStaff,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
