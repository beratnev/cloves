"use client"

import { useState } from "react"
import { Sparkles, Send, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { motion, AnimatePresence } from "framer-motion"

const examplePrompts = [
  "I need a gaming laptop under $1500",
  "Best headphones for music production",
  "Gift ideas for my father's birthday",
  "Lightweight laptop for travel",
  "Monitor for programming",
  "Tablet for digital art",
]

export function AISearch() {
  const [query, setQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])

  const handleSearch = async () => {
    if (!query.trim()) return
    setIsLoading(true)
    // Simulate AI search
    setTimeout(() => {
      setIsLoading(false)
      setSuggestions(["Product 1", "Product 2", "Product 3"])
    }, 2000)
  }

  const handleExampleClick = (prompt: string) => {
    setQuery(prompt)
    handleSearch()
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      <Card className="border-2 border-primary/20 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-semibold">AI Shopping Assistant</h3>
              <p className="text-xs text-muted-foreground">
                Describe what you need in natural language
              </p>
            </div>
          </div>

          <div className="relative">
            <Input
              placeholder="I'm looking for a laptop for software engineering with a budget of $1400..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="pr-12 h-12 text-base"
            />
            <Button
              size="icon"
              className="absolute right-1 top-1 h-10 w-10"
              onClick={handleSearch}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>

          <AnimatePresence>
            {!query && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4"
              >
                <p className="text-sm text-muted-foreground mb-3">Try asking:</p>
                <div className="flex flex-wrap gap-2">
                  {examplePrompts.map((prompt) => (
                    <Button
                      key={prompt}
                      variant="outline"
                      size="sm"
                      onClick={() => handleExampleClick(prompt)}
                      className="text-xs"
                    >
                      {prompt}
                    </Button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  )
}
