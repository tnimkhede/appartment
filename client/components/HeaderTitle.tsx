import React from "react";
import { StyleSheet, View, Image } from "react-native";
import { Feather } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, Colors } from "@/constants/theme";

interface HeaderTitleProps {
  title?: string;
}

export function HeaderTitle({ title }: HeaderTitleProps) {
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;

  return (
    <View style={styles.container}>
      <View style={[styles.iconWrapper, { backgroundColor: colors.primary + '20' }]}>
        <Feather name="home" size={18} color={colors.primary} />
      </View>
      <ThemedText style={styles.title}>{title || "AptManager"}</ThemedText>
    </View>
  );
}

export default function HeaderTitleDefault() {
  return <HeaderTitle />;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  iconWrapper: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
  },
});
