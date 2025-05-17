import React from 'react';
import { Github, MessageCircleCode } from 'lucide-react';
import { CONTRACT_ADDRESS } from '@/lib/constants';
import { shortenAddress } from '@/lib/utils';

const Footer: React.FC = () => {
  return (
    <footer className="bg-card border-t border-border px-6 py-4 text-center text-muted-foreground text-sm">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div>
          <p>CrashSafe Arbitrage Bot v1.0.2</p>
        </div>
        <div className="flex items-center space-x-4 mt-2 md:mt-0">
          <span>
            Contract: <a 
              href={`https://sepolia.etherscan.io/address/${CONTRACT_ADDRESS}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              {shortenAddress(CONTRACT_ADDRESS, 4)}
            </a>
          </span>
          <a 
            href="https://github.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-foreground transition"
          >
            <Github className="h-4 w-4" />
          </a>
          <a 
            href="https://discord.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-foreground transition"
          >
            <MessageCircleCode className="h-4 w-4" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
