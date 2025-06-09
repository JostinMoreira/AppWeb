"use client"

import { useEffect, useState } from "react"
import type { User } from "firebase/auth"
import { onAuthStateChanged, signOut } from "firebase/auth"
import { collection, query, orderBy, onSnapshot, where, getDocs, limit } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import type { UserData, Post } from "@/lib/types"
import { Header } from "@/components/header"
import { AuthPage } from "@/components/auth-page"
import { Dashboard } from "@/components/dashboard"
import { ProfilePage } from "@/components/profile-page"

export default function App() {
  const [user, setUser] = useState<User | null>(null)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loadingUserData, setLoadingUserData] = useState(false)
  const [posts, setPosts] = useState<Post[]>([])
  const [showAuth, setShowAuth] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)

  // Detectar estado usuario
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser)
      setUserData(null)
      if (firebaseUser) {
        setLoadingUserData(true)
        try {
          const q = query(collection(db, "users"), where("uid", "==", firebaseUser.uid), limit(1))
          const snap = await getDocs(q)
          if (!snap.empty) {
            setUserData(snap.docs[0].data() as UserData)
          }
        } catch (e) {
          console.error(e)
        }
        setLoadingUserData(false)
      }
    })
    return () => unsubscribe()
  }, [])

  // Escuchar publicaciones
  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list: Post[] = []
      snapshot.forEach((doc) => {
        list.push({ id: doc.id, ...(doc.data() as Omit<Post, "id">) })
      })
      setPosts(list)
    })
    return () => unsubscribe()
  }, [])

  if (showProfile && user && userData) {
    return (
      <ProfilePage
        user={user}
        userData={userData}
        onBack={() => setShowProfile(false)}
        onLogout={() => signOut(auth)}
      />
    )
  }

  if (!user) {
    return showAuth ? (
      <AuthPage onBack={() => setShowAuth(false)} error={authError} setAuthError={setAuthError} />
    ) : (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8 text-center">
            <div className="mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">VU</span>
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Voz Uleam
              </h1>
              <p className="text-gray-600 mb-2">Conecta con la comunidad universitaria</p>
              <p className="text-sm text-gray-500">
                Comparte ideas, vota iniciativas y participa en el diálogo académico
              </p>
            </div>
            <button
              onClick={() => setShowAuth(true)}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-4 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Comenzar ahora
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        user={user}
        userData={userData}
        onProfileClick={() => setShowProfile(true)}
        onLogout={() => signOut(auth)}
      />
      <Dashboard user={user} userData={userData} posts={posts} loadingUserData={loadingUserData} />
    </div>
  )
}
