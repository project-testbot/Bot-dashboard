import React from 'react';
import { cn } from '@/lib/utils';

interface ContractStatusProps {
  label: string;
  status: 'Success' | 'Warning' | 'Error' | 'Info';
  value: string;
}

const ContractStatus: React.FC<ContractStatusProps> = ({ label, status, value }) => {
  const getStatusStyle = () => {
    switch (status) {
      case 'Success':
        return 'bg-green-900/20 text-green-400';
      case 'Warning':
        return 'bg-yellow-900/20 text-yellow-400';
      case 'Error':
        return 'bg-red-900/20 text-red-400';
      case 'Info':
      default:
        return 'bg-blue-900/20 text-blue-400';
    }
  };
  
  const getIndicatorColor = () => {
    switch (status) {
      case 'Success':
        return 'bg-green-400';
      case 'Warning':
        return 'bg-yellow-400';
      case 'Error':
        return 'bg-red-400';
      case 'Info':
      default:
        return 'bg-blue-400';
    }
  };
  
  return (
    <div className={cn('flex items-center rounded-full px-3 py-1 text-sm', getStatusStyle())}>
      <span className={cn('h-2 w-2 rounded-full mr-2', getIndicatorColor())}></span>
      <span>{label}: {value}</span>
    </div>
  );
};

export default ContractStatus;
