"use client"

import type { User } from "firebase/auth"
import type { UserData, Post } from "@/lib/types"
import { NewPostForm } from "@/components/new-post-form"
import { PostCard } from "@/components/post-card"
import { WeatherWidget } from "@/components/weather-widget"
import { TrendingTopics } from "@/components/trending-topics"
import { SuggestedUsers } from "@/components/suggested-users"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, MessageSquare, TrendingUp } from "lucide-react"

interface DashboardProps {
  user: User
  userData: UserData | null
  posts: Post[]
  loadingUserData: boolean
}

export function Dashboard({ user, userData, posts, loadingUserData }: DashboardProps) {
  if (loadingUserData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar izquierdo */}
        <aside className="lg:col-span-1 space-y-6">
          <WeatherWidget city="Manta" />
          <TrendingTopics />
          <SuggestedUsers />
        </aside>

        {/* Contenido principal */}
        <main className="lg:col-span-2 space-y-6">
          {/* Header de bienvenida */}
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-1">
                    ¡Hola, {userData?.nombres || userData?.email}!
                  </h2>
                  <p className="text-gray-600">
                    {userData?.role === "student" && "Estudiante"}
                    {userData?.role === "professor" && "Profesor"}
                    {userData?.role === "authority" && "Autoridad"}
                    {userData?.facultad && ` • ${userData.facultad}`}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">Publicaciones</div>
                  <div className="text-2xl font-bold text-gray-700">{posts.length}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Formulario de nueva publicación */}
          <NewPostForm user={user} />

          {/* Lista de publicaciones */}
          <div className="space-y-6">
            {posts.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">No hay publicaciones aún</h3>
                  <p className="text-gray-500">Sé el primero en compartir algo con la comunidad</p>
                </CardContent>
              </Card>
            ) : (
              posts.map((post) => <PostCard key={post.id} post={post} currentUser={user} userData={userData} />)
            )}
          </div>
        </main>

        {/* Sidebar derecho */}
        <aside className="lg:col-span-1 space-y-6">
          {/* Estadísticas rápidas */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Estadísticas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <Users className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-500">Usuarios activos</p>
                  <p className="font-semibold">1,234</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <MessageSquare className="w-5 h-5 text-green-500" />
                <div>
                  <p className="text-sm text-gray-500">Publicaciones hoy</p>
                  <p className="font-semibold">56</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <TrendingUp className="w-5 h-5 text-purple-500" />
                <div>
                  <p className="text-sm text-gray-500">Interacciones</p>
                  <p className="font-semibold">892</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Eventos próximos */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Próximos Eventos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="border-l-4 border-blue-500 pl-3">
                <p className="font-medium text-sm">Conferencia de Tecnología</p>
                <p className="text-xs text-gray-500">15 de Enero, 2024</p>
              </div>
              <div className="border-l-4 border-green-500 pl-3">
                <p className="font-medium text-sm">Feria de Empleo</p>
                <p className="text-xs text-gray-500">22 de Enero, 2024</p>
              </div>
              <div className="border-l-4 border-purple-500 pl-3">
                <p className="font-medium text-sm">Semana Cultural</p>
                <p className="text-xs text-gray-500">1 de Febrero, 2024</p>
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  )
}
