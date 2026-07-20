"use client"

import { useState, useEffect, useRef } from "react"
import { Search, Sparkles, X, ArrowRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { motion, AnimatePresence } from "framer-motion"
import { debounce } from "@/lib/performance"

interface Suggestion {
  id: string
  text: string
  type: 'query' | 'product' | 'category'
  icon?: React.ReactNode
}

const mockSuggestions: Suggestion[] = []

export function AISearch() {
  const [query, setQuery] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Debounced search function
  const debouncedSearch = debounce(async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setSuggestions([])
      return
    }

    setIsSearching(true)
    
    // Simulate AI-powered search
    await new Promise(resolve => setTimeout(resolve, 300))
    
    // Filter suggestions based on query
    const filtered = mockSuggestions.filter(s => 
      s.text.toLowerCase().includes(searchQuery.toLowerCase())
    )
    
    setSuggestions(filtered)
    setIsSearching(false)
  }, 300)

  useEffect(() => {
    debouncedSearch(query)
  }, [query])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearch = (searchQuery?: string) => {
    const finalQuery = searchQuery || query
    if (finalQuery.trim()) {
      // Navigate to search results page
      window.location.href = `/search?q=${encodeURIComponent(finalQuery)}`
    }
  }

  const handleSuggestionClick = (suggestion: Suggestion) => {
    setQuery(suggestion.text)
    handleSearch(suggestion.text)
    setIsOpen(false)
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search for products, styles, or ask for outfit ideas..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          className="pl-10 pr-12 h-12 text-base border-2 focus:border-primary/50 transition-all"
        />
        {query && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setQuery("")
              setSuggestions([])
              inputRef.current?.focus()
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
        <Button
          onClick={() => handleSearch()}
          className="absolute right-1 top-1/2 -translate-y-1/2 h-10 px-4 bg-primary hover:bg-primary/90"
        >
          <Sparkles className="h-4 w-4 mr-2" />
          AI Search
        </Button>
      </div>

      <AnimatePresence>
        {isOpen && (query.length > 0 || suggestions.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 z-50"
          >
            <Card className="border-2 border-primary/20 shadow-2xl bg-background/95 backdrop-blur-sm">
              <CardContent className="p-0">
                {isSearching ? (
                  <div className="p-4 text-center text-muted-foreground">
                    <Sparkles className="h-5 w-5 animate-spin mx-auto mb-2" />
                    <p className="text-sm">Searching...</p>
                  </div>
                ) : suggestions.length > 0 ? (
                  <div className="py-2">
                    <div className="px-4 py-2">
                      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                        AI Suggestions
                      </p>
                    </div>
                    {suggestions.map((suggestion) => (
                      <button
                        key={suggestion.id}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="w-full px-4 py-3 flex items-center gap-3 hover:bg-muted/50 transition-colors text-left"
                      >
                        <Sparkles className="h-4 w-4 text-primary flex-shrink-0" />
                        <span className="flex-1 text-sm">{suggestion.text}</span>
                        <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      </button>
                    ))}
                  </div>
                ) : query.length > 0 ? (
                  <div className="p-4 text-center text-muted-foreground">
                    <p className="text-sm">No suggestions found</p>
                  </div>
                ) : (
                  <div className="py-2">
                    <div className="px-4 py-2">
                      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                        Popular Searches
                      </p>
                    </div>
                    {mockSuggestions.slice(0, 4).map((suggestion) => (
                      <button
                        key={suggestion.id}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="w-full px-4 py-3 flex items-center gap-3 hover:bg-muted/50 transition-colors text-left"
                      >
                        <Sparkles className="h-4 w-4 text-primary flex-shrink-0" />
                        <span className="flex-1 text-sm">{suggestion.text}</span>
                        <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      </button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
