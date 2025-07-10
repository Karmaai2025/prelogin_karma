import React, { useState, useRef, useEffect } from 'react';
import Logo from '../assets/logo.png';

const ChatMessage = ({
  sender,
  text,
  showOptions,
  label,
  href,
  timestamp,
  onOption,
  isTyping,
  optionDisabled
}) => {
  const isBot = sender === 'bot';

  const handleClick = (value) => {
    if (!optionDisabled) {
      onOption(value);
    }
  };

  return (
    <div className={`flex items-start mb-4 ${sender === 'user' ? 'justify-end' : 'justify-start'}`}>
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
                  onClick={() => handleClick('Yes')}
                  className={`px-3 py-1 border rounded text-sm cursor-pointer ${
                    optionDisabled
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'hover:bg-gray-50 text-gray-700 border-gray-300'
                  }`}
                >
                  Yes
                </div>
                <div
                  onClick={() => handleClick('No')}
                  className={`px-3 py-1 border rounded text-sm cursor-pointer ${
                    optionDisabled
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'hover:bg-gray-50 text-gray-700 border-gray-300'
                  }`}
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
  const [optionSelected, setOptionSelected] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    if (step === 'start') {
      const time = getTime();
      setMessages([
        { sender: 'bot', text: 'Hi, How can I help you today?', timestamp: time },
        { sender: 'bot', text: 'Are you a Karma Group member?', timestamp: time, options: true }
      ]);
      setStep('awaitingMember');
    }
  }, [step]);

  const handleOption = (choice) => {
    if (optionSelected) return; 

    setOptionSelected(true);
    const time = getTime();
    appendMessage('user', choice, { timestamp: time });
    setIsTyping(true);

    setTimeout(() => {
      const botTime = getTime();
      if (choice === 'Yes') {
        appendMessage('bot', "That's great! Please log in to your Members Lounge to continue:", {
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
    setOptionSelected(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-[471px] h-[500px] bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col">
       <header className="flex items-center justify-between px-4 py-3 bg-[#8b6f3d] border-b">
  <h1 className="text-lg font-semibold text-white">Karma Group</h1>
  <button
    onClick={resetChat}
    className="text-sm text-gray bg-white hover:bg-white px-1 py-1 rounded mr-10"
  >
    New Chat
  </button>
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
              optionDisabled={optionSelected}
            />
          ))}

          {isTyping && <ChatMessage sender="bot" isTyping />}
          <div ref={endRef} />
        </main>
      </div>
    </div>
  );
}
