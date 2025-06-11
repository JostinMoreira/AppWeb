"use client"

import React, { useState, useEffect } from "react"
import type { User } from "firebase/auth"
import type { UserData } from "@/lib/types"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Bell,
  Search,
  Settings,
  UserIcon,
  LogOut,
  MessageSquare
} from "lucide-react"
import {
  collection,
  query as fbQuery,
  where,
  orderBy,
  onSnapshot,
  updateDoc,
  doc,
  getDocs,
  limit
} from "firebase/firestore"
import { formatDistanceToNow } from "date-fns"
import { auth, db } from "@/lib/firebase"

// Types
export type Notification = {
  id: string
  userId: string
  message: string
  link?: string
  createdAt: number
  read: boolean
}

interface HeaderProps {
  user: User
  userData: UserData | null
  onProfileClick: () => void
  onUserSelect: (profile: UserData) => void
  onLogout: () => void
}

export function Header({ user, userData, onProfileClick, onUserSelect, onLogout }: HeaderProps) {
  // Notifications
  const [notifications, setNotifications] = useState<Notification[]>([])
  useEffect(() => {
    if (!userData) return
    const notifQuery = fbQuery(
      collection(db, "notifications"),
      where("userId", "==", userData.uid),
      orderBy("createdAt", "desc")
    )
    const unsub = onSnapshot(notifQuery, snap => {
      const list: Notification[] = []
      snap.forEach(docSnap => list.push({ id: docSnap.id, ...(docSnap.data() as Omit<Notification, 'id'>) }))
      setNotifications(list)
    })
    return () => unsub()
  }, [userData])
  const unreadCount = notifications.filter(n => !n.read).length

  // Search profiles
  const [searchTerm, setSearchTerm] = useState("")
  const [results, setResults] = useState<UserData[]>([])
  async function handleSearch() {
    const term = searchTerm.trim()
    if (!term) { setResults([]); return }
    const usersQuery = fbQuery(
      collection(db, "users"),
      where("email", "==", term),
      limit(10)
    )
    const snap = await getDocs(usersQuery)
    const list: UserData[] = []
    snap.forEach(docSnap => list.push(docSnap.data() as UserData))
    setResults(list)
  }

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-lg font-bold text-white">VU</span>
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Voz Uleam
            </h1>
          </div>

          {/* Search input */}
          <div className="relative flex-1 max-w-lg mx-8">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 cursor-pointer" onClick={handleSearch} />
            <Input
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              placeholder="Buscar usuarios por email..."
              className="pl-10 pr-4 py-2 w-full bg-gray-50 border-gray-200 rounded-full focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {results.length > 0 && (
              <div className="absolute mt-1 bg-white shadow-lg rounded w-full z-10 max-h-60 overflow-auto">
                {results.map(u => (
                  <div
                    key={u.uid}
                    onClick={() => onUserSelect(u)}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {u.email}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center bg-red-500 text-white text-xs rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 max-h-64 overflow-auto" align="end" forceMount>
                {notifications.length === 0 && <div className="p-2 text-gray-500">Sin notificaciones</div>}
                {notifications.map(note => (
                  <DropdownMenuItem
                    key={note.id}
                    onSelect={async () => {
                      if (!note.read) await updateDoc(doc(db, "notifications", note.id), { read: true })
                    }}
                    className={!note.read ? "bg-gray-100" : ""}
                  >
                    <div className="flex flex-col">
                      <span className={!note.read ? "font-semibold" : ""}>{note.message}</span>
                      <time className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(note.createdAt), { addSuffix: true })}
                      </time>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Messages */}
            <Button variant="ghost" size="icon">
              <MessageSquare className="w-5 h-5" />
            </Button>

            {/* User menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="/placeholder-user.jpg" alt={userData?.nombres || user.email || ""} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                      {userData?.nombres?.charAt(0) || user.email?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{userData?.nombres || "Usuario"}</p>
                    <p className="w-[200px] truncate text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onProfileClick}>
                  <UserIcon className="mr-2 h-4 w-4" />
                  <span>Perfil</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Configuración</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Cerrar sesión</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}
