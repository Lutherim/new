import React, { useState, useEffect, useRef } from 'react';
import { Message, User, Artisan } from '../types';
import { CloseIcon, SendIcon, CheckIcon, UserIcon } from '../icons';

interface MessagingDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  targetArtisan: Artisan | null;
  messages: Message[];
  onSendMessage: (text: string) => void;
}

export const MessagingDrawer: React.FC<MessagingDrawerProps> = ({
  isOpen,
  onClose,
  currentUser,
  targetArtisan,
  messages,
  onSendMessage
}) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  if (!isOpen || !targetArtisan) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText);
    setInputText('');
  };

  const quickPrompts = [
    'Are you available next week for a site visit?',
    'Could you send me an itemized quote?',
    'Do you supply raw timber / copper pipes?'
  ];

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-[#FBF9F5] dark:bg-[#1C1816] border-l border-[#78866B]/30 dark:border-[#78866B]/40 shadow-2xl flex flex-col animate-slideLeft transition-colors">
      
      {/* Drawer Header */}
      <div className="p-4 border-b border-[#78866B]/20 dark:border-[#78866B]/30 bg-[#F5F2EB] dark:bg-[#231F1D] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={targetArtisan.avatar}
              alt={targetArtisan.name}
              className="w-10 h-10 rounded-full object-cover border border-[#78866B]/30"
            />
            {targetArtisan.online && (
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#0891B2] border-2 border-white dark:border-[#231F1D]" />
            )}
          </div>
          <div>
            <h3 className="font-display text-sm font-bold text-[#3B2F2F] dark:text-[#F5F2EB]">
              {targetArtisan.name}
            </h3>
            <p className="text-[11px] text-[#78866B] dark:text-[#A3B19F]">
              {targetArtisan.trade} · Typically replies in 15m
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-full text-[#78866B] dark:text-[#A3B19F] hover:text-[#3B2F2F] dark:hover:text-[#F5F2EB] hover:bg-stone-200/50 dark:hover:bg-[#2B2522] transition-colors"
          aria-label="Close chat"
        >
          <CloseIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Messages List Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#FBF9F5] dark:bg-[#1C1816]">
        <div className="text-center py-2">
          <span className="text-[10px] font-semibold text-[#78866B] dark:text-[#A3B19F] bg-[#F5F2EB] dark:bg-[#231F1D] px-2.5 py-1 rounded-full border border-[#78866B]/20 dark:border-[#78866B]/35">
            Encrypted conversation with {targetArtisan.name}
          </span>
        </div>

        {messages.length === 0 ? (
          <div className="text-center py-12 text-xs text-[#5A4E4D] dark:text-[#C4BDB5] space-y-2">
            <p>No messages yet.</p>
            <p className="text-[11px] text-[#78866B] dark:text-[#A3B19F]">
              Start the discussion about your project specifications or quote details.
            </p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = currentUser ? msg.senderId === currentUser.id : msg.senderRole === 'customer';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                    isMe
                      ? 'bg-[#3B2F2F] text-[#FBF9F5] dark:bg-[#D97736] dark:text-[#FBF9F5] rounded-br-xs shadow-xs'
                      : 'bg-[#F5F2EB] dark:bg-[#231F1D] text-[#3B2F2F] dark:text-[#F5F2EB] border border-[#78866B]/25 dark:border-[#78866B]/35 rounded-bl-xs'
                  }`}
                >
                  <p>{msg.text}</p>
                </div>
                <div className="flex items-center gap-1 mt-1 text-[10px] text-[#78866B] dark:text-[#A3B19F] px-1">
                  <span>{msg.timestamp}</span>
                  {isMe && <CheckIcon className="w-3 h-3 text-[#0891B2] dark:text-[#22D3EE]" />}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompt Chips */}
      <div className="px-3 py-2 bg-[#F5F2EB] dark:bg-[#231F1D] border-t border-[#78866B]/15 dark:border-[#78866B]/30 overflow-x-auto flex items-center gap-2 scrollbar-none">
        {quickPrompts.map((prompt) => (
          <button
            key={prompt}
            onClick={() => onSendMessage(prompt)}
            className="text-[11px] px-2.5 py-1 rounded-lg bg-[#FBF9F5] dark:bg-[#1C1816] hover:bg-white dark:hover:bg-[#2B2522] text-[#5A4E4D] dark:text-[#C4BDB5] hover:text-[#3B2F2F] dark:hover:text-[#F5F2EB] border border-[#78866B]/30 dark:border-[#78866B]/40 whitespace-nowrap transition-colors"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Box Footer */}
      <form onSubmit={handleSend} className="p-3 bg-[#F5F2EB] dark:bg-[#231F1D] border-t border-[#78866B]/20 dark:border-[#78866B]/30 flex items-center gap-2">
        <input
          type="text"
          placeholder={`Message ${targetArtisan.name.split(' ')[0]}...`}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="flex-1 bg-[#FBF9F5] dark:bg-[#1C1816] border border-[#78866B]/30 dark:border-[#78866B]/40 rounded-xl px-3 py-2 text-xs text-[#3B2F2F] dark:text-[#F5F2EB] placeholder-[#5A4E4D]/60 dark:placeholder-[#C4BDB5]/50 focus:outline-none focus:border-[#D97736]"
        />
        <button
          type="submit"
          disabled={!inputText.trim()}
          className="p-2.5 rounded-xl bg-[#D97736] hover:bg-[#C86D3B] disabled:opacity-40 text-[#FBF9F5] transition-colors shrink-0"
          aria-label="Send message"
        >
          <SendIcon className="w-4 h-4" />
        </button>
      </form>

    </div>
  );
};
