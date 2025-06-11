"use client"

import React, { useState } from "react"
import type { User } from "firebase/auth"
import type { UserData } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Save, LogOut, Star } from "lucide-react"
import {
  collection,
  query,
  where,
  limit,
  getDocs,
  updateDoc,
} from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useToast } from "@/hooks/use-toast"

interface ProfilePageProps {
  user: User
  userData: UserData
  publicationCount?: number
  onBack: () => void
  onLogout: () => void
}

export function ProfilePage({
  user,
  userData,
  publicationCount,
  onBack,
  onLogout,
}: ProfilePageProps) {
  const isOwn = user.uid === userData.uid
  const repPoints = userData.reputation ?? 0
  const repLevel = Math.min(
    5,
    1 + Math.floor(repPoints / 10) + Math.floor((publicationCount ?? 0) / 2)
  )
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    nombres: userData.nombres || "",
    celular: userData.celular || "",
    ciudad: userData.ciudad || "",
    nacionalidad: userData.nacionalidad || "",
    facultad: userData.facultad || "",
    carrera: userData.carrera || "",
    nivel: userData.nivel || "",
    edad: userData.edad || 0,
  })

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    try {
      const q = query(
        collection(db, "users"),
        where("uid", "==", user.uid),
        limit(1)
      )
      const snap = await getDocs(q)
      if (!snap.empty) {
        const userDoc = snap.docs[0]
        await updateDoc(userDoc.ref, formData)
        toast({
          title: "Perfil actualizado",
          description: "Tus cambios se han guardado correctamente.",
        })
      }
    } catch (e) {
      console.error(e)
      toast({
        title: "Error",
        description: "No se pudieron guardar los cambios.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between bg-white border-b p-4 sticky top-0 z-10">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-xl font-semibold">
          {isOwn ? "Mi Perfil" : "Perfil de Usuario"}
        </h1>
        <Button variant="ghost" size="icon" onClick={onLogout}>
          <LogOut className="w-5 h-5" />
        </Button>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Profile Summary */}
        <Card>
          <CardHeader className="text-center">
            <Avatar className="w-24 h-24 mx-auto mb-4">
              <AvatarImage
                src="/placeholder-user.jpg"
                alt={userData.nombres || userData.email}
              />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-2xl">
                {userData.nombres?.charAt(0) || userData.email.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <CardTitle className="text-lg font-semibold">
              {userData.nombres || "Usuario"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div>
              <strong>Email:</strong> {userData.email}
            </div>
            {userData.role && (
              <div>
                <strong>Rol:</strong> {userData.role}
              </div>
            )}
            {publicationCount !== undefined && (
              <div>
                <strong>Publicaciones:</strong> {publicationCount}
              </div>
            )}
            {userData.reputation !== undefined && (
              <div>
                <strong>Reputación:</strong> {userData.reputation}
              </div>
            )}
            <div className="flex items-center space-x-1">
              <strong>Valoración:</strong>
              {Array.from({ length: repLevel }).map((_, i) => (
                <Star key={i} className="w-4 h-4 text-yellow-500" />
              ))}
              {Array.from({ length: 5 - repLevel }).map((_, i) => (
                <Star key={i + repLevel} className="w-4 h-4 text-gray-300" />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Details or Edit Form */}
        {isOwn ? (
          <Card>
            <CardHeader>
              <CardTitle>Editar Información</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nombres">Nombres Completos</Label>
                  <Input
                    id="nombres"
                    value={formData.nombres}
                    onChange={(e) => handleInputChange("nombres", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="celular">Celular</Label>
                  <Input
                    id="celular"
                    value={formData.celular}
                    onChange={(e) => handleInputChange("celular", e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ciudad">Ciudad</Label>
                  <Input
                    id="ciudad"
                    value={formData.ciudad}
                    onChange={(e) => handleInputChange("ciudad", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nacionalidad">Nacionalidad</Label>
                  <Input
                    id="nacionalidad"
                    value={formData.nacionalidad}
                    onChange={(e) => handleInputChange("nacionalidad", e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="facultad">Facultad</Label>
                  <Select
                    value={formData.facultad}
                    onValueChange={(val) => handleInputChange("facultad", val)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Facultad" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FACI">FACI</SelectItem>
                      <SelectItem value="Medicina">Medicina</SelectItem>
                      <SelectItem value="Administración">Administración</SelectItem>
                      <SelectItem value="Educación">Educación</SelectItem>
                      <SelectItem value="Agropecuaria">Agropecuaria</SelectItem>
                      <SelectItem value="Informática">Informática</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="carrera">Carrera</Label>
                  <Input
                    id="carrera"
                    value={formData.carrera}
                    onChange={(e) => handleInputChange("carrera", e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nivel">Nivel Académico</Label>
                  <Select
                    value={formData.nivel}
                    onValueChange={(val) => handleInputChange("nivel", val)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Nivel" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1er Semestre">1er Semestre</SelectItem>
                      <SelectItem value="2do Semestre">2do Semestre</SelectItem>
                      <SelectItem value="3er Semestre">3er Semestre</SelectItem>
                      <SelectItem value="4to Semestre">4to Semestre</SelectItem>
                      <SelectItem value="5to Semestre">5to Semestre</SelectItem>
                      <SelectItem value="6to Semestre">6to Semestre</SelectItem>
                      <SelectItem value="7mo Semestre">7mo Semestre</SelectItem>
                      <SelectItem value="8vo Semestre">8vo Semestre</SelectItem>
                      <SelectItem value="9no Semestre">9no Semestre</SelectItem>
                      <SelectItem value="10mo Semestre">10mo Semestre</SelectItem>
                      <SelectItem value="Graduado">Graduado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edad">Edad</Label>
                  <Input
                    type="number"
                    id="edad"
                    value={formData.edad}
                    onChange={(e) => handleInputChange("edad", Number(e.target.value))}
                  />
                </div>
              </div>
              <div className="flex justify-end pt-6 space-x-4">
                <Button variant="outline" onClick={onBack}>
                  Cancelar
                </Button>
                <Button
                  onClick={handleSave}
                  className="bg-blue-600 text-white hover:bg-blue-700"
                >
                  <Save className="w-4 h-4 mr-2" />Guardar Cambios
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Datos Personales</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              {userData.celular && (
                <div>
                  <strong>Celular:</strong> {userData.celular}
                </div>
              )}
              {userData.ciudad && (
                <div>
                  <strong>Ciudad:</strong> {userData.ciudad}
                </div>
              )}
              {userData.nacionalidad && (
                <div>
                  <strong>Nacionalidad:</strong> {userData.nacionalidad}
                </div>
              )}
              {userData.facultad && (
                <div>
                  <strong>Facultad:</strong> {userData.facultad}
                </div>
              )}
              {userData.carrera && (
                <div>
                  <strong>Carrera:</strong> {userData.carrera}
                </div>
              )}
              {userData.nivel && (
                <div>
                  <strong>Nivel:</strong> {userData.nivel}
                </div>
              )}
              {userData.edad !== undefined && (
                <div>
                  <strong>Edad:</strong> {userData.edad}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}