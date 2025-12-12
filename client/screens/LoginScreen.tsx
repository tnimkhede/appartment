import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Pressable, Image, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Button } from '@/components/Button';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/context/AuthContext';
import { Spacing, BorderRadius, Colors } from '@/constants/theme';

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const { theme, isDark } = useTheme();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please enter email and password');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    const result = await login(email, password);
    
    if (!result.success) {
      setError(result.error || 'Login failed');
    }
    
    setIsLoading(false);
  };

  const fillCredentials = (userEmail: string) => {
    setEmail(userEmail);
    setPassword('pass123');
    setError('');
  };

  const colors = isDark ? Colors.dark : Colors.light;

  return (
    <ThemedView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView 
          contentContainerStyle={[
            styles.scrollContent,
            { paddingTop: insets.top + Spacing.xxl, paddingBottom: insets.bottom + Spacing.xl }
          ]}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.logoContainer}>
            <View style={[styles.iconWrapper, { backgroundColor: colors.primaryLight }]}>
              <Feather name="home" size={40} color={colors.primary} />
            </View>
            <ThemedText style={styles.title}>AptManager</ThemedText>
            <ThemedText style={[styles.subtitle, { color: colors.textSecondary }]}>
              Apartment Management System
            </ThemedText>
          </View>

          <View style={styles.form}>
            {error ? (
              <View style={[styles.errorBox, { backgroundColor: colors.error + '20' }]}>
                <Feather name="alert-circle" size={16} color={colors.error} />
                <ThemedText style={[styles.errorText, { color: colors.error }]}>{error}</ThemedText>
              </View>
            ) : null}

            <View style={styles.inputGroup}>
              <ThemedText style={styles.label}>Email</ThemedText>
              <View style={[styles.inputWrapper, { borderColor: colors.border, backgroundColor: colors.backgroundDefault }]}>
                <Feather name="mail" size={20} color={colors.textSecondary} />
                <TextInput
                  style={[styles.input, { color: theme.text }]}
                  placeholder="Enter your email"
                  placeholderTextColor={colors.textSecondary}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <ThemedText style={styles.label}>Password</ThemedText>
              <View style={[styles.inputWrapper, { borderColor: colors.border, backgroundColor: colors.backgroundDefault }]}>
                <Feather name="lock" size={20} color={colors.textSecondary} />
                <TextInput
                  style={[styles.input, { color: theme.text }]}
                  placeholder="Enter your password"
                  placeholderTextColor={colors.textSecondary}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <Pressable onPress={() => setShowPassword(!showPassword)}>
                  <Feather name={showPassword ? 'eye-off' : 'eye'} size={20} color={colors.textSecondary} />
                </Pressable>
              </View>
            </View>

            <Button onPress={handleLogin} disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </View>

          <View style={styles.demoSection}>
            <ThemedText style={[styles.demoTitle, { color: colors.textSecondary }]}>
              Demo Accounts (tap to fill)
            </ThemedText>
            <View style={styles.demoAccounts}>
              <Pressable 
                style={[styles.demoAccount, { backgroundColor: colors.roleResident + '20', borderColor: colors.roleResident }]}
                onPress={() => fillCredentials('resident@apt.com')}
              >
                <Feather name="user" size={16} color={colors.roleResident} />
                <ThemedText style={[styles.demoAccountText, { color: colors.roleResident }]}>Resident</ThemedText>
              </Pressable>
              <Pressable 
                style={[styles.demoAccount, { backgroundColor: colors.roleManagement + '20', borderColor: colors.roleManagement }]}
                onPress={() => fillCredentials('admin@apt.com')}
              >
                <Feather name="briefcase" size={16} color={colors.roleManagement} />
                <ThemedText style={[styles.demoAccountText, { color: colors.roleManagement }]}>Admin</ThemedText>
              </Pressable>
              <Pressable 
                style={[styles.demoAccount, { backgroundColor: colors.roleSecurity + '20', borderColor: colors.roleSecurity }]}
                onPress={() => fillCredentials('security@apt.com')}
              >
                <Feather name="shield" size={16} color={colors.roleSecurity} />
                <ThemedText style={[styles.demoAccountText, { color: colors.roleSecurity }]}>Security</ThemedText>
              </Pressable>
              <Pressable 
                style={[styles.demoAccount, { backgroundColor: colors.roleMaintenance + '20', borderColor: colors.roleMaintenance }]}
                onPress={() => fillCredentials('maintenance@apt.com')}
              >
                <Feather name="tool" size={16} color={colors.roleMaintenance} />
                <ThemedText style={[styles.demoAccountText, { color: colors.roleMaintenance }]}>Maintenance</ThemedText>
              </Pressable>
            </View>
          </View>

          <ThemedText style={[styles.footer, { color: colors.textSecondary }]}>
            Hardcoded Demo App - All data is local
          </ThemedText>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.xl,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xxl,
  },
  iconWrapper: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: 16,
  },
  form: {
    gap: Spacing.lg,
    marginBottom: Spacing.xxl,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    padding: Spacing.md,
    borderRadius: BorderRadius.sm,
  },
  errorText: {
    fontSize: 14,
    flex: 1,
  },
  inputGroup: {
    gap: Spacing.sm,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: Spacing.inputHeight,
    borderWidth: 1,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: 16,
    height: '100%',
  },
  demoSection: {
    marginBottom: Spacing.xl,
  },
  demoTitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  demoAccounts: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    justifyContent: 'center',
  },
  demoAccount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  demoAccountText: {
    fontSize: 12,
    fontWeight: '600',
  },
  footer: {
    fontSize: 12,
    textAlign: 'center',
  },
});
