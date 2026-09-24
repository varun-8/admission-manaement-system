import React, { useState, useEffect } from 'react';
import { GraduationCap, RefreshCw, CheckCircle2, ShieldCheck } from 'lucide-react';
import logoImg from '../../assets/logo.png';

export const AppLoadingScreen = ({
  statusMessage = 'Connecting to admission database...',
  onRetry,
  onBypass,
  isTakingLong = false,
}) => {
  const [progress, setProgress] = useState(20);
  const [dynamicMsg, setDynamicMsg] = useState('Connecting to admission database...');

  useEffect(() => {
    const t1 = setTimeout(() => {
      setProgress(52);
      setDynamicMsg('Synchronizing candidate leads & counseling pipelines...');
    }, 400);

    const t2 = setTimeout(() => {
      setProgress(82);
      setDynamicMsg('Loading course catalog & counselor workspace...');
    }, 1000);

    const t3 = setTimeout(() => {
      setProgress(98);
      setDynamicMsg('Ready! Launching admission workspace...');
    }, 1600);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: '#F8FAFC',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 999999,
        fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif",
        userSelect: 'none',
        padding: '24px',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '400px',
          backgroundColor: '#FFFFFF',
          borderRadius: '24px',
          border: '1.5px solid #E2E8F0',
          boxShadow: '0 25px 60px -15px rgba(15, 23, 42, 0.08)',
          padding: '40px 32px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '18px',
            backgroundColor: '#2563EB',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            marginBottom: '20px',
            boxShadow: '0 8px 20px rgba(37, 99, 235, 0.25)',
          }}
        >
          <GraduationCap size={32} />
        </div>

        <h1
          style={{
            fontSize: '20px',
            fontWeight: '800',
            color: '#0F172A',
            margin: '0 0 4px',
          }}
        >
          EDUMERGE CRM
        </h1>
        <p
          style={{
            fontSize: '12.5px',
            color: '#64748B',
            margin: '0 0 24px',
            fontWeight: '600',
          }}
        >
          Educational Institution Admission Management System
        </p>

        <div
          style={{
            width: '100%',
            height: '6px',
            backgroundColor: '#F1F5F9',
            borderRadius: '999px',
            overflow: 'hidden',
            marginBottom: '16px',
            border: '1px solid #E2E8F0',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${progress}%`,
              backgroundColor: '#2563EB',
              borderRadius: '999px',
              transition: 'width 0.45s ease',
            }}
          />
        </div>

        <span
          style={{
            fontSize: '12.5px',
            color: '#334155',
            fontWeight: '600',
          }}
        >
          {statusMessage || dynamicMsg}
        </span>
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          color: '#64748B',
          fontSize: '12px',
          fontWeight: '600',
        }}
      >
        <ShieldCheck size={15} color="#2563EB" />
        <span>Enterprise Admission Security Active</span>
      </div>
    </div>
  );
};
