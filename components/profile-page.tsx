"use client"

import { useState } from "react"
import type { User } from "firebase/auth"
import type { UserData } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Save, UserIcon, Mail, Phone, MapPin, GraduationCap } from "lucide-react"

interface ProfilePageProps {
  user: User
  userData: UserData
  onBack: () => void
  onLogout: () => void
}

export function ProfilePage({ user, userData, onBack, onLogout }: ProfilePageProps) {
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

  const handleSave = () => {
    // Aquí implementarías la lógica para guardar los datos
    console.log("Guardando datos:", formData)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" onClick={onBack}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h1 className="text-xl font-semibold text-gray-900">Mi Perfil</h1>
            </div>
            <Button variant="outline" onClick={onLogout}>
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Información básica */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="text-center">
                <Avatar className="w-24 h-24 mx-auto mb-4">
                  <AvatarImage src="/placeholder-user.jpg" alt={userData.nombres || user.email || ""} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-2xl">
                    {userData.nombres?.charAt(0) || user.email?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="text-xl">{userData.nombres || "Usuario"}</CardTitle>
                <p className="text-gray-600">{user.email}</p>
                <div className="mt-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {userData.role === "student" && "Estudiante"}
                    {userData.role === "professor" && "Profesor"}
                    {userData.role === "authority" && "Autoridad"}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3 text-sm text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span>{user.email}</span>
                </div>
                {formData.celular && (
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>{formData.celular}</span>
                  </div>
                )}
                {formData.ciudad && (
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{formData.ciudad}</span>
                  </div>
                )}
                {formData.facultad && (
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <GraduationCap className="w-4 h-4" />
                    <span>{formData.facultad}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Formulario de edición */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <UserIcon className="w-5 h-5" />
                  <span>Información Personal</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nombres">Nombres Completos</Label>
                    <Input
                      id="nombres"
                      value={formData.nombres}
                      onChange={(e) => handleInputChange("nombres", e.target.value)}
                      placeholder="Ingresa tus nombres completos"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="celular">Número de Celular</Label>
                    <Input
                      id="celular"
                      value={formData.celular}
                      onChange={(e) => handleInputChange("celular", e.target.value)}
                      placeholder="Ej: +593 99 123 4567"
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
                      placeholder="Ej: Manta"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nacionalidad">Nacionalidad</Label>
                    <Input
                      id="nacionalidad"
                      value={formData.nacionalidad}
                      onChange={(e) => handleInputChange("nacionalidad", e.target.value)}
                      placeholder="Ej: Ecuatoriana"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="facultad">Facultad</Label>
                    <Select value={formData.facultad} onValueChange={(value) => handleInputChange("facultad", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona tu facultad" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="FACI">FACI - Arquitectura, Construcción e Ingeniería</SelectItem>
                        <SelectItem value="Medicina">Facultad de Medicina</SelectItem>
                        <SelectItem value="Administración">Facultad de Ciencias Administrativas</SelectItem>
                        <SelectItem value="Educación">Facultad de Ciencias de la Educación</SelectItem>
                        <SelectItem value="Agropecuaria">Facultad de Ciencias Agropecuarias</SelectItem>
                        <SelectItem value="Informática">Facultad de Ciencias Informáticas</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="carrera">Carrera</Label>
                    <Input
                      id="carrera"
                      value={formData.carrera}
                      onChange={(e) => handleInputChange("carrera", e.target.value)}
                      placeholder="Ej: Ingeniería en Sistemas"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nivel">Nivel Académico</Label>
                    <Select value={formData.nivel} onValueChange={(value) => handleInputChange("nivel", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona tu nivel" />
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
                      id="edad"
                      type="number"
                      value={formData.edad}
                      onChange={(e) => handleInputChange("edad", Number.parseInt(e.target.value) || 0)}
                      placeholder="Ej: 22"
                      min="16"
                      max="100"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-6">
                  <Button variant="outline" onClick={onBack}>
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleSave}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Guardar Cambios
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
