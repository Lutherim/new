import React, { useState } from 'react';
import { CloseIcon, DatabaseIcon, CopyIcon, DownloadIcon, CheckIcon } from '../icons';
import { SUPABASE_SQL_SCHEMA, downloadSupabaseSchemaFile } from '../data/supabaseSchema';

interface SupabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseModal: React.FC<SupabaseModalProps> = ({
  isOpen,
  onClose
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-[#FBF9F5] dark:bg-[#231F1D] border border-[#78866B]/30 dark:border-[#78866B]/45 rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-fadeIn transition-colors">
        
        {/* Header */}
        <div className="p-5 border-b border-[#78866B]/20 dark:border-[#78866B]/30 bg-[#F5F2EB] dark:bg-[#1C1816] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0891B2]/15 dark:bg-[#0891B2]/25 text-[#0891B2] dark:text-[#22D3EE] flex items-center justify-center">
              <DatabaseIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-[#3B2F2F] dark:text-[#F5F2EB]">
                Supabase PostgreSQL Database Schema
              </h3>
              <p className="text-xs text-[#5A4E4D] dark:text-[#C4BDB5]">
                Includes tables, Row Level Security (RLS) policies, foreign keys & indexes.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#78866B] dark:text-[#A3B19F] hover:text-[#3B2F2F] dark:hover:text-[#F5F2EB] hover:bg-stone-200/50 dark:hover:bg-[#2B2522] transition-colors"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Guide Strip */}
        <div className="px-5 py-3 bg-[#ECFEFF] dark:bg-[#083344]/50 border-b border-[#0891B2]/20 text-xs text-[#0E7490] dark:text-[#67E8F9] flex items-center justify-between flex-wrap gap-2">
          <span>
            💡 <strong>Quick Setup:</strong> Paste this schema directly into your Supabase Dashboard → <strong>SQL Editor</strong> → Run.
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-lg bg-white dark:bg-[#1C1816] border border-[#0891B2]/40 text-[#0891B2] dark:text-[#22D3EE] hover:bg-[#0891B2]/10 font-bold transition-colors flex items-center gap-1.5"
            >
              {copied ? <CheckIcon className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <CopyIcon className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy SQL'}</span>
            </button>
            <button
              onClick={downloadSupabaseSchemaFile}
              className="px-3 py-1.5 rounded-lg bg-[#0891B2] text-white hover:bg-[#0E7490] font-bold transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <DownloadIcon className="w-3.5 h-3.5" />
              <span>Download .sql</span>
            </button>
          </div>
        </div>

        {/* SQL Code Preview Container */}
        <div className="flex-1 overflow-y-auto p-5 bg-[#141211] text-stone-200 font-mono text-xs leading-relaxed select-all">
          <pre className="whitespace-pre-wrap">{SUPABASE_SQL_SCHEMA}</pre>
        </div>

        {/* Footer info */}
        <div className="p-4 bg-[#F5F2EB] dark:bg-[#1C1816] border-t border-[#78866B]/20 dark:border-[#78866B]/30 text-xs text-[#5A4E4D] dark:text-[#C4BDB5] flex items-center justify-between">
          <span>Target Platform: PostgreSQL 15+ / Supabase Auth</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#3B2F2F] dark:bg-[#D97736] text-white text-xs font-semibold hover:bg-[#2A2121] dark:hover:bg-[#C86D3B] transition-colors"
          >
            Close Preview
          </button>
        </div>

      </div>
    </div>
  );
};
