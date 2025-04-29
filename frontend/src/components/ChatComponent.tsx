// src/components/ChatComponent.jsx
import React, { useState, useEffect, useRef } from "react";
import { Terminal, Send, ChevronRight, Loader, Moon, Sun, Trash } from "lucide-react";
import { sendChatMessage } from "../api/chatService";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

const getMessagesFromLocalStorage = () => {
    const storedMessages = localStorage.getItem('chatMessages');
    try {
        return storedMessages ? JSON.parse(storedMessages) : [
            { role: "system", content: "Terminal initialized. Gemini AI assistant ready." }
        ];
    } catch (error) {
        console.error("Error parsing messages from localStorage:", error);
        return [{ role: "system", content: "Terminal initialized. Gemini AI assistant ready." }];
    }
};

const getThemeFromLocalStorage = () => {
    const storedTheme = localStorage.getItem('theme');
    return (storedTheme === 'dark' || storedTheme === 'light') ? storedTheme : 'light';
};

function ChatComponent() {
    const [messages, setMessages] = useState(getMessagesFromLocalStorage());
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const [theme, setTheme] = useState(getThemeFromLocalStorage());

    const messagesEndRef = useRef(null);
    const messageContainerRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        localStorage.setItem('chatMessages', JSON.stringify(messages));
    }, [messages]);

    useEffect(() => {
        localStorage.setItem('theme', theme);
        document.body.className = theme;
    }, [theme]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = async () => {
        if (input.trim() === "" || isLoading) return;

        const userMessage = input.trim();
        setInput("");

        setMessages(prev => [
            ...prev,
            { role: "user", content: userMessage }
        ]);

        setIsLoading(true);

        try {
            const assistantMessageIndex = messages.length + 1;
            setMessages(prev => [
                ...prev,
                { role: "assistant", content: "" }
            ]);

            await sendChatMessage(
                userMessage,
                (chunk) => {
                    setMessages(prev => {
                        const updated = [...prev];
                        const targetIndex = updated.findIndex(msg => msg.role === "assistant" && msg.content === "");
                        if (targetIndex !== -1) {
                            updated[targetIndex] = {
                                ...updated[targetIndex],
                                content: updated[targetIndex].content + chunk
                            };
                        } else {
                            updated[updated.length - 1] = {
                                ...updated[updated.length - 1],
                                content: updated[updated.length - 1].content + chunk
                            };
                        }
                        return updated;
                    });
                },
                () => {
                    setIsLoading(false);
                    inputRef.current?.focus();
                }
            );
        } catch (error) {
            console.error("Error sending message:", error);
            setMessages(prev => [
                ...prev,
                { role: "system", content: `Error: ${error.message || "Failed to connect to AI service"}` }
            ]);
            setIsLoading(false);
            inputRef.current?.focus();
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleClearChat = () => {
        setMessages([
            { role: "system", content: "Terminal cleared." }
        ]);
        localStorage.removeItem('chatMessages');
        inputRef.current?.focus();
    };

    const handleThemeToggle = (checked) => {
        setTheme(checked ? 'dark' : 'light');
    };

    return (
        <div className={`flex flex-col flex-grow h-full overflow-hidden ${theme}`}>
            <Card className="flex flex-col flex-grow w-full overflow-hidden border-none rounded-none">
                <CardHeader className="bg-card border-b">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <Terminal size={18} className="mr-2" />
                            <CardTitle className="text-base">Konsol</CardTitle>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="flex items-center space-x-2">
                                <Sun size={14} />
                                <Switch
                                    id="theme-toggle"
                                    checked={theme === 'dark'}
                                    onCheckedChange={handleThemeToggle}
                                />
                                <Moon size={14} />
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleClearChat}
                                className="flex items-center h-7 px-1.5 text-xs"
                            >
                                <Trash size={12} className="mr-1" />
                                Clear Chat
                            </Button>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="flex-grow overflow-y-auto p-4 space-y-3">
                    {messages.map((message, index) => (
                        <div key={index} className="mb-2">
                            <div className="flex items-start">
                                {message.role === "user" ? (
                                    <span className="text-blue-500 font-bold mr-2 whitespace-nowrap">User:~$</span>
                                ) : message.role === "system" ? (
                                    <span className="text-green-500 font-bold mr-2 whitespace-nowrap">System:~$</span>
                                ) : (
                                    <span className="text-green-500 font-bold mr-2 whitespace-nowrap">Assistant:~$</span>
                                )}
                                <span className="break-words whitespace-pre-wrap">{message.content}</span>
                            </div>
                        </div>
                    ))}
                    {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
                        <div className="flex items-center">
                            <span className="text-green-500 font-bold mr-2">gemini@terminal:~$</span>
                            <Loader size={16} className="animate-spin" />
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </CardContent>

                <CardFooter className="border-t">
                    <div className="flex items-center w-full gap-2">
                        <ChevronRight size={16} className="text-green-500" />
                        <Input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={isLoading ? "Waiting for response..." : "Enter message..."}
                            className="flex-1"
                            disabled={isLoading}
                        />
                        <Button
                            onClick={handleSend}
                            disabled={isLoading || input.trim() === ""}
                            size="icon"
                        >
                            {isLoading ? (
                                <Loader size={16} className="animate-spin" />
                            ) : (
                                <Send size={16} />
                            )}
                        </Button>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}

export default ChatComponent;