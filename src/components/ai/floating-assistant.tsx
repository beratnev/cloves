"use client"

import { useState, useRef, useEffect, useMemo } from "react"
import { Sparkles, X, MessageCircle, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { motion, AnimatePresence } from "framer-motion"
import { useTranslation } from "@/lib/i18n"

interface Message {
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export function FloatingAssistant() {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Initialize welcome message once
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          role: "assistant",
          content: t("aiWelcome" as any, "Hi! I'm your AI fashion assistant. How can I help you today?"),
          timestamp: new Date(),
        }
      ])
    }
  }, [t, messages.length])

  // Auto-scroll to bottom
  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, isOpen, isLoading])

  const suggestions = useMemo(() => [
    t("showSimilarQuery" as any, "Recommend a moisturizer for dry skin"),
    t("styleAdviceQuery" as any, "How to layer fragrances?"),
    t("aiSuggestWishlist" as any, "Build a skincare routine"),
    t("sizeHelpQuery" as any, "What does retinol do?"),
  ], [t])

  const formatMessage = (content: string) => {
    return content.split('\n').map((line, i) => {
      const parts = line.split('**')
      return (
        <span key={i} className="block mb-1 last:mb-0">
          {parts.map((part, j) => 
            j % 2 === 1 ? <strong key={j} className="font-semibold">{part}</strong> : part
          )}
        </span>
      )
    })
  }

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.details || errorData.error || "Failed to get response")
      }

      const data = await response.json()

      const aiMessage: Message = {
        role: "assistant",
        content: data.response,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiMessage])
    } catch (error) {
      console.error("AI API error:", error)
      const errorMessage: Message = {
        role: "assistant",
        content: `I'm having trouble connecting right now. Error: ${error instanceof Error ? error.message : 'Unknown error'}. Please check the server console for more details.`,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* Floating Button */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          size="lg"
          className={`rounded-full h-14 shadow-luxury border-2 border-primary/10 bg-background hover:bg-muted transition-all duration-300 ${isOpen ? 'w-14 px-0 text-foreground' : 'px-6'}`}
        >
          {isOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-indigo-500" />
              <span className="font-bold text-base bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">{t("askAIAssistant" as any, "Ask AI Assistant")}</span>
            </div>
          )}
        </Button>
      </motion.div>

      {/* Chat Widget */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50 w-[350px] sm:w-[400px]"
          >
            <Card className="border-2 border-primary/20 shadow-2xl bg-background/95 backdrop-blur-sm overflow-hidden flex flex-col h-[550px] max-h-[70vh]">
              {/* Header */}
              <div className="p-4 border-b bg-gradient-to-r from-primary/10 to-primary/5 flex-shrink-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                      <Sparkles className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{t("aiTitle" as any, "AI Assistant")}</h3>
                      <p className="text-xs text-muted-foreground">{t("aiSubtitle" as any, "Your personal stylist")}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-8 w-8 text-muted-foreground hover:text-foreground">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Messages Area */}
              <CardContent className="p-4 flex-1 overflow-y-auto space-y-4">
                <div className="flex flex-col space-y-4 min-h-full justify-end">
                  {messages.map((msg, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                          msg.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        <div className="text-sm leading-relaxed">{formatMessage(msg.content)}</div>
                        <p className="text-[10px] opacity-70 mt-1 text-right">
                          {msg.timestamp.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                  
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex justify-start"
                    >
                      <div className="bg-muted rounded-2xl px-4 py-3">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-100" />
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-200" />
                        </div>
                      </div>
                    </motion.div>
                  )}
                  
                  {messages.length === 1 && (
                    <div className="pt-4 space-y-2 border-t mt-4">
                      <p className="text-xs text-muted-foreground font-medium text-center">{t("tryAsking" as any, "Try asking:")}</p>
                      <div className="grid grid-cols-2 gap-2">
                        {suggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            onClick={() => {
                              setInput(suggestion)
                            }}
                            className="text-xs bg-primary/10 hover:bg-primary/20 text-primary px-3 py-1.5 rounded-full transition-colors text-left"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </CardContent>

              {/* Input Area */}
              <div className="p-4 border-t bg-background flex-shrink-0">
                <div className="flex gap-2">
                  <Input
                    placeholder={t("askAnything" as any, "Ask me anything...")}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    className="flex-1 focus-visible:ring-primary/50"
                  />
                  <Button onClick={handleSend} disabled={isLoading || !input.trim()} size="icon">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
