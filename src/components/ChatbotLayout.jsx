import React, { useState, useRef, useEffect } from 'react';
import Logo from "../assets/logo.jpg"

const ChatMessage = ({
  sender,
  text,
  showOptions,
  label,
  href,
  timestamp,
  onOption,
  isTyping
}) => {
  const isBot = sender === 'bot';

  return (
    <div className={`flex items-start mb-4 ${sender === 'user' ? 'justify-end' : 'justify-start'}`}>
      {/* {isBot && (
        <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center mr-3 flex-shrink-0">
          <div className="w-6 h-6 bg-white rounded-full"></div>
        </div>
      )} */}
      {isBot && (
  <div className="w-8 h-8 mr-3 flex-shrink-0">
    <img
      src={Logo} 
      alt="Bot Logo"
      className="w-8 h-8 rounded-full object-cover"
    />
  </div>
)}

      <div className="max-w-md bg-white border border-gray-200 rounded-2xl p-3 shadow-sm">
        {isTyping && isBot ? (
          <div className="text-gray-500">Typing...</div>
        ) : (
          <>
            {text && <div className="text-sm text-gray-800">{text}</div>}

            {showOptions && isBot && (
              <div className="flex gap-2 mt-2">
                <div
                  onClick={() => onOption('Yes')}
                  className="px-3 py-1 border border-gray-300 rounded text-sm cursor-pointer hover:bg-gray-50 text-gray-700"
                >
                  Yes
                </div>
                <div
                  onClick={() => onOption('No')}
                  className="px-3 py-1 border border-gray-300 rounded text-sm cursor-pointer hover:bg-gray-50 text-gray-700"
                >
                  No
                </div>
              </div>
            )}

            {href && label && isBot && (
              <div className="mt-2">
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                >
                  {label}
                </a>
              </div>
            )}

            {timestamp && (
              <div className="text-xs text-gray-400 mt-1 text-right">{timestamp}</div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default function ChatbotLayout() {
  const [messages, setMessages] = useState([]);
  const [step, setStep] = useState('start');
  const [isTyping, setIsTyping] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    if (step === 'start') {
      const time = getTime();
      setMessages([
        { sender: 'bot', text: 'Hi, How can I help you today?', timestamp: time },
        { sender: 'bot', text: 'Are you a Karma group member?', timestamp: time, options: true }
      ]);
      setStep('awaitingMember');
    }
  }, [step]);

  const handleOption = (choice) => {
    const time = getTime();
    appendMessage('user', choice, { timestamp: time });

    setIsTyping(true);

    setTimeout(() => {
      const botTime = getTime();
      if (choice === 'Yes') {
        appendMessage('bot', "That's great! To continue, please log in to your member account:", {
          href: 'https://karmagroup.com/member-login/',
          label: 'Member Login',
          timestamp: botTime
        });
      } else {
        appendMessage('bot', 'No problem! Tap the button below, complete the form, and our team will contact you:', {
          href: 'https://www.karmaexperience.com/RrQF1oUFy48oXtgFYR9ua/',
          label: 'Get Started',
          timestamp: botTime
        });
      }
      setIsTyping(false);
      setStep('completed');
    }, 1000);
  };

  const appendMessage = (sender, text, opts = {}) => {
    setMessages(prev => [
      ...prev,
      {
        sender,
        text,
        timestamp: opts.timestamp || '',
        href: opts.href || '',
        label: opts.label || '',
        options: !!opts.options
      }
    ]);
  };

  const getTime = () => {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const resetChat = () => {
    setMessages([]);
    setStep('start');
    setIsTyping(false);
  };

    return (
  <div className="flex items-center justify-center min-h-screen bg-gray-100">
    <div className="w-[471px] h-[897px] bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col">
      <header className="flex items-center justify-between px-4 py-3 bg-white border-b">
        <h1 className="text-lg font-semibold text-gray-900">Karma Group</h1>
        <div
          onClick={resetChat}
          className="text-sm text-blue-500 cursor-pointer hover:text-blue-600"
        >
          New Chat
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-4">
        {messages.map((msg, idx) => (
          <ChatMessage
            key={idx}
            sender={msg.sender}
            text={msg.text}
            showOptions={msg.options && step === 'awaitingMember'}
            href={msg.href}
            label={msg.label}
            timestamp={msg.timestamp}
            onOption={handleOption}
          />
        ))}

        {isTyping && <ChatMessage sender="bot" isTyping />}
        <div ref={endRef} />
      </main>

      {/* <footer className="px-4 py-2 text-xs text-center text-gray-400 border-t">
        Powered by Voicefl
      </footer> */}
    </div>
  </div>
);

  
}
