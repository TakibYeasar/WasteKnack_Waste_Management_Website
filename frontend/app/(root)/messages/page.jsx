'use client';
import { useState, useEffect, useRef } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Send, Loader2 } from 'lucide-react';

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

export default function MessagesPage() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const messagesEndRef = useRef(null);

    useEffect(() => {
        console.log('API Key:', API_KEY ? 'Present' : 'Missing');
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        setIsLoading(true);
        setError('');

        const newMessage = { role: 'user', content: input.trim() };
        setMessages((prev) => [...prev, newMessage]);
        setInput('');

        try {
            if (!API_KEY) throw new Error('API key is missing');

            const genAI = new GoogleGenerativeAI(API_KEY);
            const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

            console.log('Sending message:', newMessage.content);
            const result = await model.generateContent(newMessage.content);
            const responseText = result.response.text();
            console.log('Received response:', responseText);

            setMessages((prev) => [...prev, { role: 'assistant', content: responseText }]);
        } catch (err) {
            console.error('Error:', err);
            setError(err.message || 'An unknown error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-gray-100">
            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-lg rounded-lg p-3 shadow-md ${msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-white text-gray-800'}`}>
                            <p>{msg.content}</p>
                        </div>
                    </div>
                ))}
                {error && <p className="text-red-500 text-center font-medium">{error}</p>}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Field */}
            <form onSubmit={handleSubmit} className="p-4 bg-white border-t shadow-md">
                <div className="flex items-center space-x-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                        disabled={isLoading}
                    >
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                    </button>
                </div>
            </form>
        </div>
    );
}
