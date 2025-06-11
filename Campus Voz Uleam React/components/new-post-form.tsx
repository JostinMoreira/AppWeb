"use client"

import type React from "react"

import { useState } from "react"
import type { User } from "firebase/auth"
import { collection, addDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ImageIcon, VideoIcon, FileTextIcon, SendIcon } from "lucide-react"

interface NewPostFormProps {
  user: User
}

export function NewPostForm({ user }: NewPostFormProps) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [type, setType] = useState("general")
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim() || !content.trim()) return

    setIsSubmitting(true)
    try {
      await addDoc(collection(db, "posts"), {
        uid: user.uid,
        authorEmail: user.email,
        title: title.trim(),
        type,
        content: content.trim(),
        createdAt: Date.now(),
        votes: [],
        comments: [],
      })
      setTitle("")
      setContent("")
      setType("general")
    } catch (e) {
      console.error("Error al publicar:", e)
    }
    setIsSubmitting(false)
  }

  return (
    <Card className="shadow-sm border-gray-200">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-start space-x-4">
            <Avatar className="w-10 h-10">
              <AvatarImage src="/placeholder-user.jpg" alt={user.email || ""} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                {user.email?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="Título de tu publicación..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="border-gray-200 focus:ring-2 focus:ring-blue-500"
                />
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger className="border-gray-200">
                    <SelectValue placeholder="Tipo de publicación" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="academic">Académico</SelectItem>
                    <SelectItem value="event">Evento</SelectItem>
                    <SelectItem value="question">Pregunta</SelectItem>
                    <SelectItem value="announcement">Anuncio</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Textarea
                placeholder="¿Qué quieres compartir con la comunidad?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[100px] border-gray-200 focus:ring-2 focus:ring-blue-500 resize-none"
              />
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Button type="button" variant="ghost" size="sm" className="text-gray-500 hover:text-blue-600">
                    <ImageIcon className="w-4 h-4 mr-1" />
                    Imagen
                  </Button>
                  <Button type="button" variant="ghost" size="sm" className="text-gray-500 hover:text-blue-600">
                    <VideoIcon className="w-4 h-4 mr-1" />
                    Video
                  </Button>
                  <Button type="button" variant="ghost" size="sm" className="text-gray-500 hover:text-blue-600">
                    <FileTextIcon className="w-4 h-4 mr-1" />
                    Archivo
                  </Button>
                </div>
                <Button
                  type="submit"
                  disabled={!title.trim() || !content.trim() || isSubmitting}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  {isSubmitting ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  ) : (
                    <SendIcon className="w-4 h-4 mr-2" />
                  )}
                  Publicar
                </Button>
              </div>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
