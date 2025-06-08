import React, { useEffect, useState } from "react";
import type {User} from "firebase/auth";
import {
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  doc,
  where,
  getDocs,
  limit,
  arrayUnion,
} from "firebase/firestore";
import { auth, db } from "./firebase";
import type { UserData, Role, Post } from "./types";
import Header from "./components/Header";
import NewPostForm from "./components/NewPostForm";
import PostCard from "./components/PostCard";
import AuthPage from "./components/AuthPage";
import PerfilUsuario from "./components/PerfilUsuario";
import ClimaWidget from "./components/ClimaWidget";

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loadingUserData, setLoadingUserData] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [showAuth, setShowAuth] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Detectar estado usuario
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      setUserData(null);
      if (firebaseUser) {
        setLoadingUserData(true);
        try {
          const q = query(
            collection(db, "users"),
            where("uid", "==", firebaseUser.uid),
            limit(1)
          );
          const snap = await getDocs(q);
          if (!snap.empty) {
            setUserData(snap.docs[0].data() as UserData);
          }
        } catch (e) {
          console.error(e);
        }
        setLoadingUserData(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // Escuchar publicaciones
  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list: Post[] = [];
      snapshot.forEach((doc) => {
        list.push({ id: doc.id, ...(doc.data() as Omit<Post, "id">) });
      });
      setPosts(list);
    });
    return () => unsubscribe();
  }, []);

  // Funciones para manejar posts
  async function handleNewPost(title: string, type: string, content: string) {
    if (!user) return;
    try {
      await addDoc(collection(db, "posts"), {
        uid: user.uid,
        authorEmail: user.email,
        title,
        type,
        content,
        createdAt: Date.now(),
        votes: [],
        comments: [],
      });
    } catch (e) {
      alert("Error al publicar: " + e);
    }
  }

  async function toggleVote(postId: string) {
    if (!user) {
      alert("Debes iniciar sesión para votar.");
      return;
    }
    const post = posts.find((p) => p.id === postId);
    if (!post) return;
    const postRef = doc(db, "posts", postId);
    const hasVoted = post.votes.includes(user.uid);
    try {
      if (hasVoted) {
        await updateDoc(postRef, {
          votes: post.votes.filter((uid) => uid !== user.uid),
        });
      } else {
        await updateDoc(postRef, { votes: arrayUnion(user.uid) });
      }
    } catch (e) {
      alert("Error al votar: " + e);
    }
  }

  async function addComment(postId: string, commentText: string) {
    if (!user) {
      alert("Debes iniciar sesión para comentar.");
      return;
    }
    const postRef = doc(db, "posts", postId);
    const newComment = {
      id: Math.random().toString(36).substr(2, 9),
      uid: user.uid,
      authorEmail: user.email || "Anónimo",
      comment: commentText,
      createdAt: Date.now(),
    };
    try {
      await updateDoc(postRef, {
        comments: arrayUnion(newComment),
      });
    } catch (e) {
      alert("Error al comentar: " + e);
    }
  }

  async function addInstitutionalResponse(postId: string, responseText: string) {
    if (!user || userData?.role !== "authority") {
      alert("Solo autoridades pueden responder.");
      return;
    }
    const postRef = doc(db, "posts", postId);
    try {
      await updateDoc(postRef, {
        institutionalResponse: responseText,
      });
    } catch (e) {
      alert("Error al responder: " + e);
    }
  }

  // Métodos de autenticación
  async function handleLogin(email: string, password: string) {
    setAuthError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setShowAuth(false);
    } catch (e: any) {
      setAuthError(e.message);
    }
  }

  async function handleRegister(email: string, password: string, role: Role) {
    setAuthError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await addDoc(collection(db, "users"), {
        uid: userCredential.user.uid,
        email,
        role,
        createdAt: Date.now(),
      });
      setShowAuth(false);
    } catch (e: any) {
      setAuthError(e.message);
    }
  }

  const [showProfile, setShowProfile] = useState(false);

  // Datos iniciales para el perfil
  const initialProfileData = {
    nombres: userData?.nombres || "",
    celular: userData?.celular || "",
    ciudad: userData?.ciudad || "",
    nacionalidad: userData?.nacionalidad || "",
    facultad: userData?.facultad || "",
    carrera: userData?.carrera || "",
    nivel: userData?.nivel || "",
    edad: userData?.edad || 0,
  };

  async function handleSaveProfile(data: any) {
    if (!user) return;
    try {
      const q = query(collection(db, "users"), where("uid", "==", user.uid), limit(1));
      const snap = await getDocs(q);
      if (!snap.empty) {
        const userDoc = snap.docs[0];
        await updateDoc(doc(db, "users", userDoc.id), data);
        setUserData((prev) => ({ ...prev, ...data }));
      } else {
        await addDoc(collection(db, "users"), {
          uid: user.uid,
          email: user.email,
          ...data,
          createdAt: Date.now(),
        });
        setUserData((prev) => ({ ...prev, ...data }));
      }
      alert("Datos guardados correctamente");
    } catch (e) {
      alert("Error al guardar los datos: " + e);
    }
    setShowProfile(false);
  }

  return (
    <>
      <Header
        user={user}
        userEmail={user?.email || null}
        onLoginClick={() => setShowAuth(true)}
        onLogoutClick={() => signOut(auth)}
        onProfileClick={() => setShowProfile(true)}
        isProfile={showProfile}
        onBackProfile={() => setShowProfile(false)}
      />

      {showProfile ? (
        <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
          <div className="max-w-2xl mx-auto px-4">
            {loadingUserData || !userData ? (
              <div className="text-center text-slate-700 font-semibold text-xl">Cargando perfil...</div>
            ) : (
              <PerfilUsuario
                initialData={initialProfileData}
                onBack={() => setShowProfile(false)}
                onSave={handleSaveProfile}
              />
            )}
          </div>
        </main>
      ) : (
        <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
          {user && userData ? (
            <div className="max-w-7xl mx-auto px-4 py-8">
              <div className="flex gap-8">
                {/* Sidebar izquierdo con widget del clima */}
                <aside className="hidden lg:block w-64 flex-shrink-0">
                  <div className="sticky top-24">
                    <ClimaWidget city="Manta" />
                  </div>
                </aside>

                {/* Contenido principal */}
                <div className="flex-1 min-w-0">
                  {/* Widget del clima para móvil */}
                  <div className="lg:hidden mb-6">
                    <ClimaWidget city="Manta" />
                  </div>

                  {/* Header de bienvenida */}
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-800 mb-1">
                        Bienvenido, {userData.nombres || userData.email}
                      </h2>
                      <p className="text-slate-600">
                        {userData.role === "student" && "Estudiante"}
                        {userData.role === "professor" && "Profesor"}
                        {userData.role === "authority" && "Autoridad"}
                        {userData.facultad && ` • ${userData.facultad}`}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-slate-500">Total de publicaciones</div>
                      <div className="text-2xl font-bold text-slate-700">{posts.length}</div>
                    </div>
                  </div>
                </div>

                {/* Formulario de nueva publicación */}
                <div className="mb-8">
                  <NewPostForm onSubmit={handleNewPost} />
                </div>

                {/* Lista de publicaciones */}
                <div className="space-y-6">
                  {posts.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
                      <div className="text-slate-400 mb-4">
                        <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-slate-700 mb-2">No hay publicaciones aún</h3>
                      <p className="text-slate-500">Sé el primero en compartir algo con la comunidad</p>
                    </div>
                  ) : (
                    posts.map((post) => (
                      <PostCard
                        key={post.id}
                        post={post}
                        currentUserId={user?.uid || null}
                        onVote={toggleVote}
                        onCommentSubmit={addComment}
                        onResponseSubmit={addInstitutionalResponse}
                        isAuthority={userData?.role === "authority"}
                      />
                    ))
                  )}
                </div>
                </div>
              </div>
            </div>
          ) : showAuth ? (
            <AuthPage 
              onLogin={handleLogin}
              onRegister={handleRegister}
              error={authError}
              onBack={() => setShowAuth(false)}
            />
          ) : (
            <div className="min-h-screen flex items-center justify-center px-4">
              <div className="max-w-lg w-full">
                <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-10 text-center">
                  {/* Logo/Icono */}
                  <div className="mb-6">
                    <h1 className="text-4xl font-bold text-slate-800 mb-2">Voz Uleam</h1>
                    <p className="text-lg text-slate-600 mb-2">
                      Conecta con la comunidad universitaria
                    </p>
                    <p className="text-sm text-slate-500">
                      Comparte ideas, vota iniciativas y participa en el diálogo académico
                    </p>
                  </div>
                  <button
                    onClick={() => setShowAuth(true)}
                    className="w-full bg-gradient-to-r from-slate-700 to-slate-800 text-white font-semibold py-4 px-6 rounded-xl hover:from-slate-800 hover:to-slate-900 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    Comenzar ahora
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      )}
    </>
  );
}