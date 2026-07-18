"use client"

import { Sparkles, TrendingUp, TrendingDown, Check, X } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {Progress} from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

interface AIReviewSummaryProps {
  averageRating: number
  totalReviews: number
  ratingDistribution: {
    5: number
    4: number
    3: number
    2: number
    1: number
  }
  pros: string[]
  cons: string[]
  summary: string
}

export function AIReviewSummary({
  averageRating,
  totalReviews,
  ratingDistribution,
  pros,
  cons,
  summary,
}: AIReviewSummaryProps) {
  const percentage = (rating: number) => {
    return (rating / totalReviews) * 100
  }

  return (
    <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-background">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          AI Review Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Rating */}
        <div className="flex items-center gap-6">
          <div className="text-center">
            <div className="text-4xl font-bold">{averageRating.toFixed(1)}</div>
            <div className="text-sm text-muted-foreground">out of 5</div>
          </div>
          <div className="flex-1 space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center gap-2">
                <span className="text-sm w-3">{rating}</span>
                <Progress
                  value={percentage(ratingDistribution[rating as keyof typeof ratingDistribution])}
                  className="flex-1 h-2"
                />
                <span className="text-xs text-muted-foreground w-8">
                  {ratingDistribution[rating as keyof typeof ratingDistribution]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Summary */}
        <div>
          <h4 className="font-semibold mb-2">Summary</h4>
          <p className="text-sm text-muted-foreground">{summary}</p>
        </div>

        {/* Pros and Cons */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold mb-2 text-green-600">Pros</h4>
            <ul className="space-y-1">
              {pros.map((pro, index) => (
                <li key={index} className="text-sm flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>{pro}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2 text-destructive">Cons</h4>
            <ul className="space-y-1">
              {cons.map((con, index) => (
                <li key={index} className="text-sm flex items-start gap-2">
                  <X className="h-4 w-4 text-destructive flex-shrink-0 mt-0.5" />
                  <span>{con}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Trend */}
        <div className="flex items-center gap-2 pt-4 border-t">
          <TrendingUp className="h-4 w-4 text-green-600" />
          <span className="text-sm text-muted-foreground">
            Based on {totalReviews} reviews
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
