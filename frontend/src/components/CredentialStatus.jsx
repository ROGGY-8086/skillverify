import React from 'react';
import { CheckCircle2, Clock, AlertTriangle, XCircle } from 'lucide-react';

const CredentialStatus = ({ status, className = '' }) => {
  const normalizedStatus = status?.toLowerCase() || 'unverified';
  
  const config = {
    verified: {
      color: 'text-success bg-green-50 border-green-200',
      icon: CheckCircle2,
      label: 'Verified'
    },
    pending: {
      color: 'text-warning bg-yellow-50 border-yellow-200',
      icon: Clock,
      label: 'Pending'
    },
    suspicious: {
      color: 'text-orange-500 bg-orange-50 border-orange-200',
      icon: AlertTriangle,
      label: 'Suspicious'
    },
    unverified: {
      color: 'text-error bg-red-50 border-red-200',
      icon: XCircle,
      label: 'Unverified'
    }
  };

  const { color, icon: Icon, label } = config[normalizedStatus] || config.unverified;

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${color} ${className}`}>
      <Icon className="h-3.5 w-3.5" />
      <span>{label}</span>
    </div>
  );
};

export default CredentialStatus;
