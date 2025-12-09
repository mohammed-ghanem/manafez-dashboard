// hooks/useAuthApi.ts
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { hydrateAuthFromCookies } from '@/store/auth/authSlice';

export const useAuthApi = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { token, isHydrated } = useSelector((state: RootState) => state.auth);

  // Ensure auth is hydrated before making API calls
  useEffect(() => {
    if (!isHydrated) {
      dispatch(hydrateAuthFromCookies());
    }
  }, [dispatch, isHydrated]);

  const getAuthHeaders = () => {
    if (!token) return {};
    
    return {
      Authorization: `Bearer ${token}`,
    };
  };

  return {
    token,
    isAuthenticated: !!token,
    isHydrated,
    getAuthHeaders,
  };
};