import { NgModule } from "@angular/core"
import { BrowserModule } from "@angular/platform-browser"
import { FormsModule } from "@angular/forms"
import { AppRoutingModule } from "./app-routing.module"
import { AppComponent } from "./app.component"

// Firebase
import { provideFirebaseApp, initializeApp } from "@angular/fire/app"
import { provideAuth, getAuth } from "@angular/fire/auth"
import { provideFirestore, getFirestore } from "@angular/fire/firestore"
import { environment } from "../environments/environment"

// Componentes
import { HomeComponent } from "./components/home/home.component"
import { LoginComponent } from "./components/auth/login/login.component"
import { RegisterComponent } from "./components/auth/register/register.component"
import { NavbarComponent } from "./components/shared/navbar/navbar.component"
import { ListaPublicacionesComponent } from "./components/publicaciones/lista-publicaciones/lista-publicaciones.component"
import { FormularioPublicacionComponent } from "./components/publicaciones/formulario-publicacion/formulario-publicacion.component"
import { DetallePublicacionComponent } from "./components/publicaciones/detalle-publicacion/detalle-publicacion.component"
import { ComentariosComponent } from "./components/comentarios/comentarios.component"
import { VotosComponent } from "./components/votos/votos.component"
import { PerfilComponent } from "./components/perfil/perfil.component"

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    NavbarComponent,
    ListaPublicacionesComponent,
    FormularioPublicacionComponent,
    DetallePublicacionComponent,
    ComentariosComponent,
    VotosComponent,
    PerfilComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, FormsModule],
  providers: [
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
