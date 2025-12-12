import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useScreenOptions } from "@/hooks/useScreenOptions";
import { useAuth } from "@/context/AuthContext";

import LoginScreen from "@/screens/LoginScreen";
import MainTabNavigator from "@/navigation/MainTabNavigator";
import CreateTicketScreen from "@/screens/CreateTicketScreen";
import NoticesScreen from "@/screens/NoticesScreen";
import PollsScreen from "@/screens/PollsScreen";
import EmergencyScreen from "@/screens/EmergencyScreen";
import VendorsScreen from "@/screens/VendorsScreen";
import StaffScreen from "@/screens/StaffScreen";
import ResidentsScreen from "@/screens/ResidentsScreen";
import ReportsScreen from "@/screens/ReportsScreen";
import DocumentsScreen from "@/screens/DocumentsScreen";
import VisitorEntryScreen from "@/screens/VisitorEntryScreen";
import SettingsScreen from "@/screens/SettingsScreen";

export type RootStackParamList = {
  Login: undefined;
  Main: undefined;
  CreateTicket: undefined;
  NoticesScreen: undefined;
  NoticeDetail: { noticeId: string };
  PollsScreen: undefined;
  EmergencyScreen: undefined;
  VendorsScreen: undefined;
  StaffScreen: undefined;
  ResidentsScreen: undefined;
  ReportsScreen: undefined;
  DocumentsScreen: undefined;
  VisitorEntry: undefined;
  DeliveryLog: undefined;
  VehicleLog: undefined;
  SettingsScreen: undefined;
  HelpScreen: undefined;
  UnitDetailsScreen: undefined;
  FamilyScreen: undefined;
  VehiclesScreen: undefined;
  ParkingScreen: undefined;
  TicketDetail: { ticketId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootStackNavigator() {
  const screenOptions = useScreenOptions({ transparent: false });
  const { isAuthenticated } = useAuth();

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      {!isAuthenticated ? (
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
      ) : (
        <>
          <Stack.Screen
            name="Main"
            component={MainTabNavigator}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="CreateTicket"
            component={CreateTicketScreen}
            options={{ headerTitle: "New Ticket" }}
          />
          <Stack.Screen
            name="NoticesScreen"
            component={NoticesScreen}
            options={{ headerTitle: "Notices & Events" }}
          />
          <Stack.Screen
            name="PollsScreen"
            component={PollsScreen}
            options={{ headerTitle: "Polls & Voting" }}
          />
          <Stack.Screen
            name="EmergencyScreen"
            component={EmergencyScreen}
            options={{ headerTitle: "Emergency Contacts" }}
          />
          <Stack.Screen
            name="VendorsScreen"
            component={VendorsScreen}
            options={{ headerTitle: "Vendors" }}
          />
          <Stack.Screen
            name="StaffScreen"
            component={StaffScreen}
            options={{ headerTitle: "Staff" }}
          />
          <Stack.Screen
            name="ResidentsScreen"
            component={ResidentsScreen}
            options={{ headerTitle: "Residents" }}
          />
          <Stack.Screen
            name="ReportsScreen"
            component={ReportsScreen}
            options={{ headerTitle: "Reports & Analytics" }}
          />
          <Stack.Screen
            name="DocumentsScreen"
            component={DocumentsScreen}
            options={{ headerTitle: "Documents" }}
          />
          <Stack.Screen
            name="VisitorEntry"
            component={VisitorEntryScreen}
            options={{ headerTitle: "Gate Entry" }}
          />
          <Stack.Screen
            name="DeliveryLog"
            component={VisitorEntryScreen}
            options={{ headerTitle: "Delivery Log" }}
          />
          <Stack.Screen
            name="VehicleLog"
            component={VisitorEntryScreen}
            options={{ headerTitle: "Vehicle Log" }}
          />
          <Stack.Screen
            name="SettingsScreen"
            component={SettingsScreen}
            options={{ headerTitle: "Settings" }}
          />
          <Stack.Screen
            name="HelpScreen"
            component={EmergencyScreen}
            options={{ headerTitle: "Help & FAQ" }}
          />
          <Stack.Screen
            name="ParkingScreen"
            component={ResidentsScreen}
            options={{ headerTitle: "Parking Management" }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}
