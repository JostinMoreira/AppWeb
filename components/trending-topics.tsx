"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Hash } from "lucide-react"

const trendingTopics = [
  { tag: "ExamenesFinales", posts: 45 },
  { tag: "NuevoSemestre", posts: 32 },
  { tag: "BecasEstudio", posts: 28 },
  { tag: "EventosCulturales", posts: 24 },
  { tag: "InvestigacionUleam", posts: 19 },
]

export function TrendingTopics() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-green-500" />
          <span>Tendencias</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {trendingTopics.map((topic, index) => (
          <div key={topic.tag} className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
              <div className="flex items-center space-x-1">
                <Hash className="w-3 h-3 text-gray-400" />
                <span className="text-sm font-medium text-gray-900">{topic.tag}</span>
              </div>
            </div>
            <Badge variant="secondary" className="text-xs">
              {topic.posts} posts
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
