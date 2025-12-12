import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { Platform, StyleSheet } from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/context/AuthContext";
import { useScreenOptions } from "@/hooks/useScreenOptions";

import DashboardScreen from "@/screens/DashboardScreen";
import TicketsScreen from "@/screens/TicketsScreen";
import PaymentsScreen from "@/screens/PaymentsScreen";
import FacilitiesScreen from "@/screens/FacilitiesScreen";
import MoreScreen from "@/screens/MoreScreen";
import VisitorEntryScreen from "@/screens/VisitorEntryScreen";
import ReportsScreen from "@/screens/ReportsScreen";
import ResidentsScreen from "@/screens/ResidentsScreen";
import HeaderTitle from "@/components/HeaderTitle";

export type MainTabParamList = {
  DashboardTab: undefined;
  TicketsTab: undefined;
  PaymentsTab: undefined;
  FacilitiesTab: undefined;
  MoreTab: undefined;
  VisitorTab: undefined;
  ReportsTab: undefined;
  ResidentsTab: undefined;
  FinanceTab: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function MainTabNavigator() {
  const { theme, isDark } = useTheme();
  const { user } = useAuth();
  const screenOptions = useScreenOptions();

  const role = user?.role || 'resident';

  const getTabBarIcon = (name: keyof typeof Feather.glyphMap) => 
    ({ color, size }: { color: string; size: number }) => (
      <Feather name={name} size={size} color={color} />
    );

  return (
    <Tab.Navigator
      initialRouteName="DashboardTab"
      screenOptions={{
        tabBarActiveTintColor: theme.tabIconSelected,
        tabBarInactiveTintColor: theme.tabIconDefault,
        tabBarStyle: {
          position: "absolute",
          backgroundColor: Platform.select({
            ios: "transparent",
            android: theme.backgroundRoot,
          }),
          borderTopWidth: 0,
          elevation: 0,
        },
        tabBarBackground: () =>
          Platform.OS === "ios" ? (
            <BlurView
              intensity={100}
              tint={isDark ? "dark" : "light"}
              style={StyleSheet.absoluteFill}
            />
          ) : null,
        ...screenOptions,
      }}
    >
      <Tab.Screen
        name="DashboardTab"
        component={DashboardScreen}
        options={{
          title: "Home",
          headerTitle: () => <HeaderTitle />,
          tabBarIcon: getTabBarIcon("home"),
        }}
      />

      {role === 'resident' ? (
        <>
          <Tab.Screen
            name="FacilitiesTab"
            component={FacilitiesScreen}
            options={{
              title: "Facilities",
              headerTitle: "Book Facilities",
              tabBarIcon: getTabBarIcon("calendar"),
            }}
          />
          <Tab.Screen
            name="TicketsTab"
            component={TicketsScreen}
            options={{
              title: "Tickets",
              headerTitle: "My Tickets",
              tabBarIcon: getTabBarIcon("alert-circle"),
            }}
          />
          <Tab.Screen
            name="PaymentsTab"
            component={PaymentsScreen}
            options={{
              title: "Payments",
              headerTitle: "Bills & Payments",
              tabBarIcon: getTabBarIcon("credit-card"),
            }}
          />
        </>
      ) : null}

      {role === 'management' ? (
        <>
          <Tab.Screen
            name="ResidentsTab"
            component={ResidentsScreen}
            options={{
              title: "Residents",
              headerTitle: "Residents",
              tabBarIcon: getTabBarIcon("users"),
            }}
          />
          <Tab.Screen
            name="ReportsTab"
            component={ReportsScreen}
            options={{
              title: "Reports",
              headerTitle: "Reports & Analytics",
              tabBarIcon: getTabBarIcon("bar-chart-2"),
            }}
          />
          <Tab.Screen
            name="FinanceTab"
            component={PaymentsScreen}
            options={{
              title: "Finance",
              headerTitle: "Financial Overview",
              tabBarIcon: getTabBarIcon("dollar-sign"),
            }}
          />
        </>
      ) : null}

      {role === 'security' ? (
        <>
          <Tab.Screen
            name="VisitorTab"
            component={VisitorEntryScreen}
            options={{
              title: "Entry",
              headerTitle: "Gate Entry",
              tabBarIcon: getTabBarIcon("user-plus"),
            }}
          />
        </>
      ) : null}

      {role === 'maintenance' ? (
        <>
          <Tab.Screen
            name="TicketsTab"
            component={TicketsScreen}
            options={{
              title: "Tickets",
              headerTitle: "Service Tickets",
              tabBarIcon: getTabBarIcon("tool"),
            }}
          />
        </>
      ) : null}

      <Tab.Screen
        name="MoreTab"
        component={MoreScreen}
        options={{
          title: "More",
          headerTitle: "More",
          tabBarIcon: getTabBarIcon("menu"),
        }}
      />
    </Tab.Navigator>
  );
}
