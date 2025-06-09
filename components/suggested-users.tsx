"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { UserPlus, Users } from "lucide-react"

const suggestedUsers = [
  { name: "Dr. María González", role: "Profesora de Ingeniería", faculty: "FACI" },
  { name: "Carlos Mendoza", role: "Estudiante de Medicina", faculty: "Medicina" },
  { name: "Ana Rodríguez", role: "Coordinadora Académica", faculty: "Administración" },
]

export function SuggestedUsers() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center space-x-2">
          <Users className="w-5 h-5 text-purple-500" />
          <span>Usuarios Sugeridos</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {suggestedUsers.map((user, index) => (
          <div key={index} className="flex items-center space-x-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src="/placeholder-user.jpg" alt={user.name} />
              <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-sm">
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
              <p className="text-xs text-gray-500 truncate">{user.role}</p>
              <p className="text-xs text-gray-400">{user.faculty}</p>
            </div>
            <Button size="sm" variant="outline" className="shrink-0">
              <UserPlus className="w-3 h-3 mr-1" />
              Seguir
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
