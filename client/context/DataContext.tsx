import React, { createContext, useContext, useState, ReactNode } from 'react';
import {
  Bill, Ticket, Visitor, FacilityBooking, Notice, Poll,
  BILLS, TICKETS, VISITORS, FACILITY_BOOKINGS, NOTICES, POLLS,
} from '@/data/mockData';

interface DataContextType {
  bills: Bill[];
  tickets: Ticket[];
  visitors: Visitor[];
  facilityBookings: FacilityBooking[];
  notices: Notice[];
  polls: Poll[];
  addTicket: (ticket: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTicket: (id: string, updates: Partial<Ticket>) => void;
  addVisitor: (visitor: Omit<Visitor, 'id'>) => void;
  checkOutVisitor: (id: string) => void;
  addFacilityBooking: (booking: Omit<FacilityBooking, 'id'>) => void;
  updateFacilityBooking: (id: string, updates: Partial<FacilityBooking>) => void;
  payBill: (id: string) => void;
  votePoll: (pollId: string, optionId: string, userId: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [bills, setBills] = useState<Bill[]>(BILLS);
  const [tickets, setTickets] = useState<Ticket[]>(TICKETS);
  const [visitors, setVisitors] = useState<Visitor[]>(VISITORS);
  const [facilityBookings, setFacilityBookings] = useState<FacilityBooking[]>(FACILITY_BOOKINGS);
  const [notices] = useState<Notice[]>(NOTICES);
  const [polls, setPolls] = useState<Poll[]>(POLLS);

  const addTicket = (ticket: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString().split('T')[0];
    const newTicket: Ticket = {
      ...ticket,
      id: `t${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    };
    setTickets(prev => [newTicket, ...prev]);
  };

  const updateTicket = (id: string, updates: Partial<Ticket>) => {
    setTickets(prev => prev.map(t =>
      t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString().split('T')[0] } : t
    ));
  };

  const addVisitor = (visitor: Omit<Visitor, 'id'>) => {
    const newVisitor: Visitor = {
      ...visitor,
      id: `vis${Date.now()}`,
    };
    setVisitors(prev => [newVisitor, ...prev]);
  };

  const checkOutVisitor = (id: string) => {
    setVisitors(prev => prev.map(v =>
      v.id === id ? { ...v, checkOutTime: new Date().toISOString() } : v
    ));
  };

  const addFacilityBooking = (booking: Omit<FacilityBooking, 'id'>) => {
    const newBooking: FacilityBooking = {
      ...booking,
      id: `fb${Date.now()}`,
    };
    setFacilityBookings(prev => [newBooking, ...prev]);
  };

  const updateFacilityBooking = (id: string, updates: Partial<FacilityBooking>) => {
    setFacilityBookings(prev => prev.map(b =>
      b.id === id ? { ...b, ...updates } : b
    ));
  };

  const payBill = (id: string) => {
    setBills(prev => prev.map(b =>
      b.id === id ? { ...b, status: 'paid', paidDate: new Date().toISOString().split('T')[0] } : b
    ));
  };

  const votePoll = (pollId: string, optionId: string, userId: string) => {
    setPolls(prev => prev.map(p => {
      if (p.id === pollId && !p.votedBy.includes(userId)) {
        return {
          ...p,
          votedBy: [...p.votedBy, userId],
          options: p.options.map(o =>
            o.id === optionId ? { ...o, votes: o.votes + 1 } : o
          ),
        };
      }
      return p;
    }));
  };

  return (
    <DataContext.Provider value={{
      bills,
      tickets,
      visitors,
      facilityBookings,
      notices,
      polls,
      addTicket,
      updateTicket,
      addVisitor,
      checkOutVisitor,
      addFacilityBooking,
      updateFacilityBooking,
      payBill,
      votePoll,
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
