import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  GraduationCap,
  Building2,
  BookOpen,
  Sparkles,
  Shield,
  Crown,
  Award,
  School,
} from 'lucide-react';
import { api } from '../services/api';
import { useToast } from './ToastContext';

import logoImg from '../assets/logo.png';

const BrandingContext = createContext(null);

export const BRAND_ICONS = {
  GraduationCap: { name: 'Graduation Cap (Education)', icon: GraduationCap },
  School: { name: 'School (Campus)', icon: School },
  Building2: { name: 'Building (Academic Block)', icon: Building2 },
  BookOpen: { name: 'Book (Programs)', icon: BookOpen },
  Sparkles: { name: 'Sparkles (Excellence)', icon: Sparkles },
  Shield: { name: 'Shield (Accredited)', icon: Shield },
  Crown: { name: 'Crown (Top Ranked)', icon: Crown },
  Award: { name: 'Award (Recognition)', icon: Award },
};

export const BrandingProvider = ({ children }) => {
  const toast = useToast();
  const [branding, setBranding] = useState(() => {
    try {
      const cached = localStorage.getItem('admission_crm_branding');
      if (cached) return JSON.parse(cached);
    } catch (e) {}
    return {
      appName: 'EduMerge Admission CRM',
      appShortName: 'EduMerge',
      tagline: 'Educational Institution Admission Management System',
      address: 'Campus Admissions Office, Main Academic Block',
      phone: '+91 98765 43210',
      gstin: '',
      logoType: 'image',
      logoIcon: 'GraduationCap',
      logoImage: logoImg,
      primaryColor: '#2563EB',
    };
  });
  const [loading, setLoading] = useState(true);

  const fetchBranding = useCallback(async () => {
    try {
      const res = await api.getBranding();
      if (res && res.success && res.data) {
        setBranding(res.data);
        localStorage.setItem('admission_crm_branding', JSON.stringify(res.data));
      }
    } catch (e) {
      console.warn('Error loading branding config:', e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBranding();
  }, [fetchBranding]);

  const updateBranding = async (updatedData) => {
    try {
      setBranding(updatedData);
      localStorage.setItem('admission_crm_branding', JSON.stringify(updatedData));

      const res = await api.updateBranding(updatedData);
      if (res && res.success && res.data) {
        setBranding(res.data);
        localStorage.setItem('admission_crm_branding', JSON.stringify(res.data));
      }
      toast.success('Institution branding updated successfully.', 'Branding Saved');
      return { success: true, data: updatedData };
    } catch (e) {
      console.warn('Backend branding sync notice:', e.message);
      toast.success('Branding saved locally!', 'Branding Updated');
      return { success: true, data: updatedData };
    }
  };

  const renderLogo = (size = 20, color = '#FFFFFF') => {
    const logoSrc = (branding.logoType === 'image' && branding.logoImage)
      ? branding.logoImage
      : '/logo.png';

    if (logoSrc) {
      return (
        <img
          src={logoSrc}
          alt={branding.appName || 'Institution Logo'}
          style={{
            width: typeof size === 'number' ? `${size}px` : size,
            height: typeof size === 'number' ? `${size}px` : size,
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
            borderRadius: '6px',
            display: 'block',
          }}
        />
      );
    }

    const IconComponent = BRAND_ICONS[branding.logoIcon]?.icon || GraduationCap;
    return <IconComponent size={size} color={color} strokeWidth={2.5} />;
  };

  return (
    <BrandingContext.Provider
      value={{
        branding,
        updateBranding,
        fetchBranding,
        loading,
        appName: branding.appName || 'EduMerge Admission CRM',
        appShortName: branding.appShortName || 'EduMerge',
        tagline: branding.tagline || 'Educational Institution Admission Management System',
        address: branding.address || 'Campus Admissions Office, Main Academic Block',
        phone: branding.phone || '+91 98765 43210',
        logoType: branding.logoType || 'image',
        logoIcon: branding.logoIcon || 'GraduationCap',
        logoImage: branding.logoImage || '',
        primaryColor: branding.primaryColor || '#2563EB',
        renderLogo,
      }}
    >
      {children}
    </BrandingContext.Provider>
  );
};

export const useBranding = () => {
  const context = useContext(BrandingContext);
  if (!context) {
    throw new Error('useBranding must be used within a BrandingProvider');
  }
  return context;
};
