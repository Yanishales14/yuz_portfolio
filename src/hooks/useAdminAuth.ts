import { useState, useCallback } from 'react';
import { defaultAdminPassword } from '../models/portfolio';
import { adminRateLimiter } from './useRateLimit';

export function useAdminAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // NO localStorage — must enter password each time

  const login = useCallback((password: string): { success: boolean; error?: string } => {
    if (!adminRateLimiter.check()) {
      return { success: false, error: 'Too many attempts. Please wait 15 minutes.' };
    }
    adminRateLimiter.record();

    if (password === defaultAdminPassword) {
      setIsAuthenticated(true);
      adminRateLimiter.reset();
      return { success: true };
    }
    return { success: false, error: `Incorrect password. ${adminRateLimiter.remaining()} attempts remaining.` };
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
  }, []);

  return { isAuthenticated, login, logout };
}
