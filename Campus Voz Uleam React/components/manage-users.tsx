"use client"

import { useEffect, useState } from "react"
import { collection, onSnapshot } from "firebase/firestore"
import { db, auth } from "@/lib/firebase"
import type { UserData } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Star } from "lucide-react"

export function ManageUsers() {
  const [users, setUsers] = useState<UserData[]>([])
  const [minRep, setMinRep] = useState<number>(0)

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "users"), (snapshot) => {
      const list: UserData[] = []
      snapshot.forEach((docSnap) => list.push(docSnap.data() as UserData))
      setUsers(list)
    })
    return () => unsub()
  }, [])

  const isConnected = (uid: string) => auth.currentUser?.uid === uid

  const filteredUsers = users
    .filter(u => (u.reputation ?? 0) >= minRep)
    .sort((a, b) => (b.reputation ?? 0) - (a.reputation ?? 0))

  const calcLevel = (rep?: number) => Math.min(5, 1 + Math.floor((rep ?? 0) / 10))

  return (
    <Card className="my-6">
      <CardHeader>
        <CardTitle>Gestión de Usuarios</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex items-center space-x-2">
          <label className="text-sm">Reputación mínima:</label>
          <input
            type="number"
            value={minRep}
            onChange={e => setMinRep(Number(e.target.value))}
            className="border px-2 py-1 rounded w-20 text-sm"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="px-4 py-2 border-b">Email</th>
                <th className="px-4 py-2 border-b">Rol</th>
                <th className="px-4 py-2 border-b">Conectado</th>
                <th className="px-4 py-2 border-b">Valoración</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => {
                const level = calcLevel(u.reputation)
                return (
                  <tr key={u.uid}>
                    <td className="px-4 py-2 border-b">{u.email}</td>
                    <td className="px-4 py-2 border-b capitalize">{u.role}</td>
                    <td className="px-4 py-2 border-b">{isConnected(u.uid) ? "Sí" : "No"}</td>
                    <td className="px-4 py-2 border-b flex space-x-1">
                      {Array.from({ length: level }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-500" />
                      ))}
                      {Array.from({ length: 5 - level }).map((_, i) => (
                        <Star key={i + level} className="w-4 h-4 text-gray-300" />
                      ))}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}