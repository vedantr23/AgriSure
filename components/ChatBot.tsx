

import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Bot, User, ExternalLink } from 'lucide-react';
import { getChatResponse, ChatResponse } from '../services/geminiService';

interface Message {
    role: 'user' | 'model';
    content: string;
    sources?: { title: string; uri: string }[];
}

const quickResponses = [
    "Latest Soybean forecast?",
    "What is hedging?",
    "Explain HOI-X",
    "How to place a trade?",
];

const renderMessageContent = (content: string) => {
    const html = content
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n/g, '<br />');
    return { __html: html };
}

// UPDATE: Added isOpen and setIsOpen props to control visibility from parent.
interface ChatBotProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}


export const ChatBot: React.FC<ChatBotProps> = ({ isOpen, setIsOpen }) => {
    const [messages, setMessages] = useState<Message[]>([
        { role: 'model', content: "Hello! I'm AgriSure Assistant (AgriBot). How can I help you with oilseed hedging or market trends today?" }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showQuickResponses, setShowQuickResponses] = useState(true);
    const messagesEndRef = useRef<null | HTMLDivElement>(null);
    const inputRef = useRef<null | HTMLInputElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
            setTimeout(() => inputRef.current?.focus(), 300); 
        }
    }, [messages, isOpen]);

    const handleSendMessage = async (e: React.FormEvent, messageText?: string) => {
        e.preventDefault();
        const currentMessage = messageText || inputValue;
        if (!currentMessage.trim() || isLoading) return;

        if (showQuickResponses) {
            setShowQuickResponses(false);
        }

        const userMessage: Message = { role: 'user', content: currentMessage };
        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true);

        try {
            const { text, sources } = await getChatResponse(currentMessage);
            const modelMessage: Message = { role: 'model', content: text, sources };
            setMessages(prev => [...prev, modelMessage]);
        } catch (error) {
            const errorMessage: Message = { role: 'model', content: "Sorry, something went wrong. Please try again." };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleQuickResponseClick = (text: string) => {
        const dummyEvent = { preventDefault: () => {} } as React.FormEvent;
        handleSendMessage(dummyEvent, text);
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-20 right-4 bg-primary text-white rounded-full p-4 shadow-lg hover:bg-primary-dark transition-transform transform hover:scale-110 z-20"
                aria-label="Open chat"
            >
                {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
            </button>

            {isOpen && (
                <div className="fixed bottom-4 right-4 md:bottom-20 md:right-10 w-[calc(100%-2rem)] max-w-md h-[70vh] max-h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col z-30 transition-all duration-300 ease-in-out animate-fade-in-up">
                    <style>{`
                        @keyframes fade-in-up {
                            0% { opacity: 0; transform: translateY(20px); }
                            100% { opacity: 1; transform: translateY(0); }
                        }
                        .animate-fade-in-up { animation: fade-in-up 0.3s ease-out; }
                    `}</style>
                    <header className="bg-primary text-white p-4 rounded-t-2xl flex justify-between items-center">
                        <div className="flex items-center">
                            <Bot size={20} className="mr-2" />
                            <h3 className="font-bold text-lg">AgriBot</h3>
                        </div>
                        <button onClick={() => setIsOpen(false)} aria-label="Close chat">
                            <X size={24} />
                        </button>
                    </header>

                    <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                        <div className="space-y-6">
                            {messages.map((msg, index) => (
                                <div key={index} className={`flex items-end gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    {msg.role === 'model' && <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center"><Bot size={20} className="text-gray-600"/></div>}
                                    <div className={`max-w-[80%] p-3 rounded-xl shadow-sm ${msg.role === 'user' ? 'bg-primary text-white rounded-br-none' : 'bg-gray-200 text-text-primary rounded-bl-none'}`}>
                                        <p className="text-sm" dangerouslySetInnerHTML={renderMessageContent(msg.content)} />
                                        {msg.sources && msg.sources.length > 0 && (
                                            <div className="mt-3 pt-2 border-t border-gray-300">
                                                <h4 className="text-xs font-bold mb-1">Sources:</h4>
                                                <div className="space-y-1">
                                                    {msg.sources.map((source, i) => (
                                                        <a key={i} href={source.uri} target="_blank" rel="noopener noreferrer" className="flex items-center text-xs text-blue-600 hover:underline">
                                                            <ExternalLink size={12} className="mr-1.5 flex-shrink-0" />
                                                            <span className="truncate">{source.title}</span>
                                                        </a>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    {msg.role === 'user' && <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center"><User size={20} className="text-blue-600"/></div>}
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex items-end gap-2 justify-start">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center"><Bot size={20} className="text-gray-600"/></div>
                                    <div className="max-w-[80%] p-3 rounded-xl bg-gray-200 text-text-primary rounded-bl-none shadow-sm">
                                        <div className="flex items-center space-x-1">
                                            <span className="h-2 w-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                            <span className="h-2 w-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                            <span className="h-2 w-2 bg-gray-500 rounded-full animate-bounce"></span>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                    </div>
                     {showQuickResponses && (
                        <div className="p-2 border-t bg-white">
                            <div className="flex flex-wrap gap-2 justify-center">
                                {quickResponses.map(text => (
                                    <button
                                        key={text}
                                        onClick={() => handleQuickResponseClick(text)}
                                        className="px-3 py-1.5 bg-primary-dark/10 text-primary-dark text-sm rounded-full hover:bg-primary-dark/20 transition-colors"
                                    >
                                        {text}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                    <form onSubmit={handleSendMessage} className="p-4 border-t bg-white rounded-b-2xl">
                        <div className="flex items-center space-x-2">
                            <input
                                ref={inputRef}
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="Ask a question..."
                                className="flex-1 w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
                                disabled={isLoading}
                                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage(e)}
                            />
                            <button
                                type="submit"
                                className="bg-primary text-white rounded-full p-3 hover:bg-primary-dark disabled:bg-gray-400"
                                disabled={isLoading || !inputValue.trim()}
                                aria-label="Send message"
                            >
                                <Send size={20} />
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </>
    );
};