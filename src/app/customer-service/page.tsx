"use client";

import { useEffect, useRef, useState } from "react";
import AppShell from "@/components/AppShell";
import Icon from "@/components/ui/Icon";
import { sendSupportMessage, initialSupportMessages } from "@/lib/api";
import type { ChatMessage } from "@/lib/types";

const QUICK_REPLIES = [
  "Cek status reward",
  "Masalah transaksi",
  "Hubungi CS langsung",
];

export default function CustomerServicePage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages(initialSupportMessages());
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;
    const userMsg: ChatMessage = {
      id: `u_${Date.now()}`,
      sender: "user",
      senderName: "Anda",
      text: trimmed,
      timeLabel: new Date().toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setTyping(true);
    const reply = await sendSupportMessage(trimmed, [...messages, userMsg]);
    setTyping(false);
    setMessages((m) => [...m, reply]);
  }

  return (
    <AppShell>
      <div className="max-w-[1000px] mx-auto w-full flex flex-col h-[calc(100vh-200px)] md:h-[calc(100vh-220px)] my-stack-lg px-container-padding-mobile md:px-0">
        {/* Header */}
        <div className="px-stack-md pt-stack-md pb-4">
          <h1 className="font-headline-md text-headline-md font-bold text-on-surface">
            Customer Service
          </h1>
        </div>
        <div className="h-20 border-b border-outline-variant/30 flex items-center justify-between px-stack-md glass-panel rounded-t-xl">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container border-2 border-primary-container">
                <Icon name="support_agent" fill />
              </div>
              <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-primary-container border-2 border-surface-bright rounded-full" />
            </div>
            <div>
              <h3 className="font-headline-md text-body-lg font-bold leading-tight">
                Sarah
              </h3>
              <p className="text-sm text-primary flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                Online · Admin Smart Eco Bank
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="p-2 rounded-full hover:bg-surface-container-low text-on-surface-variant transition-colors">
              <Icon name="phone" />
            </button>
            <button className="p-2 rounded-full hover:bg-surface-container-low text-on-surface-variant transition-colors">
              <Icon name="videocam" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-grow overflow-y-auto p-stack-md flex flex-col gap-stack-md bg-surface-bright custom-scrollbar">
          {messages.map((m) => (
            <MessageBubble key={m.id} msg={m} />
          ))}
          {typing && (
            <div className="flex gap-3 max-w-[85%]">
              <Avatar sender="agent" />
              <div className="bg-surface-container-low border border-outline-variant px-4 py-3 rounded-2xl flex gap-1 items-center">
                {[0, 0.2, 0.4].map((d) => (
                  <span
                    key={d}
                    className="w-1.5 h-1.5 bg-outline rounded-full animate-bounce"
                    style={{ animationDelay: `${d}s` }}
                  />
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="p-stack-md border-t border-outline-variant/30 bg-white rounded-b-xl">
          <div className="flex gap-2 mb-4 overflow-x-auto pb-2 hide-scrollbar">
            {QUICK_REPLIES.map((q) => (
              <button
                key={q}
                onClick={() => send(q)}
                className="whitespace-nowrap px-4 py-2 bg-surface-container-low hover:bg-primary-container/20 border border-outline-variant rounded-full text-sm font-medium text-on-surface-variant transition-all active:scale-95"
              >
                {q}
              </button>
            ))}
          </div>
          <div className="relative flex items-end gap-2 bg-surface-container-low border border-outline-variant p-2 rounded-2xl focus-within:border-primary transition-all">
            <button className="p-2 text-outline hover:text-primary transition-colors">
              <Icon name="add_circle" />
            </button>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send(input);
                }
              }}
              rows={1}
              placeholder="Tulis pesan Anda..."
              className="flex-grow bg-transparent border-none focus:ring-0 resize-none py-2 font-body-md text-on-surface placeholder:text-outline max-h-32 outline-none"
            />
            <button
              onClick={() => send(input)}
              className="bg-primary text-on-primary p-2.5 rounded-xl hover:brightness-95 transition-all flex items-center justify-center active:scale-90"
            >
              <Icon name="send" fill />
            </button>
          </div>
          <p className="text-[10px] text-outline mt-2 px-1">
            Smart Eco Bank menggunakan enkripsi end-to-end.
          </p>
        </div>
      </div>
    </AppShell>
  );
}

function MessageBubble({ msg }: { msg: ChatMessage }) {
  const isUser = msg.sender === "user";
  return (
    <div
      className={`flex gap-3 max-w-[85%] ${isUser ? "self-end flex-row-reverse" : ""}`}
    >
      <Avatar sender={msg.sender} />
      <div className={`flex flex-col gap-1 ${isUser ? "items-end" : ""}`}>
        <div
          className={
            isUser
              ? "bg-primary text-on-primary p-4 rounded-tl-2xl rounded-bl-2xl rounded-br-2xl shadow-sm"
              : "bg-surface-container-low border border-outline-variant p-4 rounded-tr-2xl rounded-br-2xl rounded-bl-2xl"
          }
        >
          <p className="font-body-md text-on-surface-variant whitespace-pre-wrap">
            <span className={isUser ? "text-on-primary" : ""}>{msg.text}</span>
          </p>
        </div>
        <span
          className={`text-[10px] text-outline ${isUser ? "mr-1" : "ml-1"}`}
        >
          {msg.senderName} · {msg.timeLabel}
        </span>
      </div>
    </div>
  );
}

function Avatar({ sender }: { sender: ChatMessage["sender"] }) {
  if (sender === "user")
    return (
      <div className="w-8 h-8 rounded-full shrink-0 bg-secondary-container flex items-center justify-center text-on-secondary-container">
        <Icon name="person" />
      </div>
    );
  if (sender === "bot")
    return (
      <div className="w-8 h-8 rounded-lg bg-primary-container flex items-center justify-center shrink-0 text-on-primary-container">
        <Icon name="auto_awesome" fill className="text-xl" />
      </div>
    );
  return (
    <div className="w-8 h-8 rounded-full shrink-0 bg-secondary flex items-center justify-center text-white">
      <Icon name="support_agent" fill className="text-lg" />
    </div>
  );
}
