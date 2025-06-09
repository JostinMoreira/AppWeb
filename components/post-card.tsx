"use client"

import { useState } from "react"
import type { User } from "firebase/auth"
import { doc, updateDoc, arrayUnion } from "firebase/firestore"
import { db } from "@/lib/firebase"
import type { Post, UserData } from "@/lib/types"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Heart, MessageCircle, Share2, MoreHorizontal, Send } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"

interface PostCardProps {
  post: Post
  currentUser: User
  userData: UserData | null
}

export function PostCard({ post, currentUser, userData }: PostCardProps) {
  const [showComments, setShowComments] = useState(false)
  const [newComment, setNewComment] = useState("")
  const [isLiked, setIsLiked] = useState(post.votes.includes(currentUser.uid))
  const [likesCount, setLikesCount] = useState(post.votes.length)

  async function handleLike() {
    const postRef = doc(db, "posts", post.id)
    try {
      if (isLiked) {
        await updateDoc(postRef, {
          votes: post.votes.filter((uid) => uid !== currentUser.uid),
        })
        setLikesCount((prev) => prev - 1)
      } else {
        await updateDoc(postRef, {
          votes: arrayUnion(currentUser.uid),
        })
        setLikesCount((prev) => prev + 1)
      }
      setIsLiked(!isLiked)
    } catch (e) {
      console.error("Error al dar like:", e)
    }
  }

  async function handleComment() {
    if (!newComment.trim()) return

    const postRef = doc(db, "posts", post.id)
    const comment = {
      id: Math.random().toString(36).substr(2, 9),
      uid: currentUser.uid,
      authorEmail: currentUser.email || "Anónimo",
      comment: newComment.trim(),
      createdAt: Date.now(),
    }

    try {
      await updateDoc(postRef, {
        comments: arrayUnion(comment),
      })
      setNewComment("")
    } catch (e) {
      console.error("Error al comentar:", e)
    }
  }

  const getTypeColor = (type: string) => {
    const colors = {
      general: "bg-gray-100 text-gray-800",
      academic: "bg-blue-100 text-blue-800",
      event: "bg-green-100 text-green-800",
      question: "bg-yellow-100 text-yellow-800",
      announcement: "bg-purple-100 text-purple-800",
    }
    return colors[type as keyof typeof colors] || colors.general
  }

  return (
    <Card className="shadow-sm border-gray-200 hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src="/placeholder-user.jpg" alt={post.authorEmail} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                {post.authorEmail.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-gray-900">{post.authorEmail}</p>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <span>
                  {formatDistanceToNow(new Date(post.createdAt), {
                    addSuffix: true,
                    locale: es,
                  })}
                </span>
                <Badge className={getTypeColor(post.type)} variant="secondary">
                  {post.type}
                </Badge>
              </div>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-600">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold text-lg text-gray-900 mb-2">{post.title}</h3>
          <p className="text-gray-700 leading-relaxed">{post.content}</p>
        </div>

        {/* Respuesta institucional */}
        {post.institutionalResponse && (
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Badge className="bg-blue-100 text-blue-800">Respuesta Oficial</Badge>
            </div>
            <p className="text-gray-700">{post.institutionalResponse}</p>
          </div>
        )}

        {/* Acciones */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={`${isLiked ? "text-red-600 hover:text-red-700" : "text-gray-500 hover:text-red-600"}`}
            >
              <Heart className={`w-4 h-4 mr-1 ${isLiked ? "fill-current" : ""}`} />
              {likesCount}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowComments(!showComments)}
              className="text-gray-500 hover:text-blue-600"
            >
              <MessageCircle className="w-4 h-4 mr-1" />
              {post.comments.length}
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-500 hover:text-green-600">
              <Share2 className="w-4 h-4 mr-1" />
              Compartir
            </Button>
          </div>
        </div>

        {/* Comentarios */}
        {showComments && (
          <div className="space-y-4 pt-4 border-t border-gray-100">
            {post.comments.map((comment) => (
              <div key={comment.id} className="flex items-start space-x-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage src="/placeholder-user.jpg" alt={comment.authorEmail} />
                  <AvatarFallback className="bg-gray-200 text-gray-600 text-xs">
                    {comment.authorEmail.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium text-sm text-gray-900">{comment.authorEmail}</span>
                    <span className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(comment.createdAt), {
                        addSuffix: true,
                        locale: es,
                      })}
                    </span>
                  </div>
                  <p className="text-gray-700 text-sm">{comment.comment}</p>
                </div>
              </div>
            ))}

            {/* Nuevo comentario */}
            <div className="flex items-start space-x-3">
              <Avatar className="w-8 h-8">
                <AvatarImage src="/placeholder-user.jpg" alt={currentUser.email || ""} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs">
                  {currentUser.email?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 flex space-x-2">
                <Textarea
                  placeholder="Escribe un comentario..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="min-h-[60px] resize-none border-gray-200 focus:ring-2 focus:ring-blue-500"
                />
                <Button
                  onClick={handleComment}
                  disabled={!newComment.trim()}
                  size="icon"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
