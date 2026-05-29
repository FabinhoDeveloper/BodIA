import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginUser, createUser, setAuthToken, clearAuthToken } from '../services/api';
import { buildUserPayload } from '../services/api';

const AuthContext = createContext(null);

const TOKEN_KEY = '@bodia_token';
const USER_KEY = '@bodia_user';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  async function loadStoredAuth() {
    try {
      const [storedToken, storedUser] = await Promise.all([
        AsyncStorage.getItem(TOKEN_KEY),
        AsyncStorage.getItem(USER_KEY),
      ]);

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        setAuthToken(storedToken);
      }
    } catch (error) {
      console.log('[BodIA] Erro ao carregar sessão:', error.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function persistAuth(newToken, newUser) {
    try {
      await Promise.all([
        AsyncStorage.setItem(TOKEN_KEY, newToken),
        AsyncStorage.setItem(USER_KEY, JSON.stringify(newUser)),
      ]);
    } catch (error) {
      console.log('[BodIA] Erro ao salvar sessão:', error.message);
    }
  }

  async function clearPersistedAuth() {
    try {
      await Promise.all([
        AsyncStorage.removeItem(TOKEN_KEY),
        AsyncStorage.removeItem(USER_KEY),
      ]);
    } catch (error) {
      console.log('[BodIA] Erro ao limpar sessão:', error.message);
    }
  }

  const signIn = useCallback(async (email, password) => {
    const response = await loginUser(email, password);
    const { usuario, token: newToken } = response.data;

    setToken(newToken);
    setUser(usuario);
    setAuthToken(newToken);
    await persistAuth(newToken, usuario);

    return usuario;
  }, []);

  const signUp = useCallback(async (onboardingData, email, password, name) => {
    const payload = buildUserPayload(onboardingData, email, password);
    payload.nome = name.trim();

    const response = await createUser(payload);
    const { user: usuario, token: newToken } = response.data;

    setToken(newToken);
    setUser(usuario);
    setAuthToken(newToken);
    await persistAuth(newToken, usuario);

    return response.data;
  }, []);

  const signOut = useCallback(async () => {
    setToken(null);
    setUser(null);
    clearAuthToken();
    await clearPersistedAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!token,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}

export default AuthContext;
