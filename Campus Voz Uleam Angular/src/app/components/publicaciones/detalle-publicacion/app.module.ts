import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from '../environments/environment';

// Componentes
import { HomeComponent } from './components/home/home.component';
import { ListaPublicacionesComponent } from './components/publicaciones/lista-publicaciones/lista-publicaciones.component';
import { DetallePublicacionComponent } from './components/publicaciones/detalle-publicacion/detalle-publicacion.component';
import { FormularioPublicacionComponent } from './components/publicaciones/formulario-publicacion/formulario-publicacion.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { NavbarComponent } from './components/shared/navbar/navbar.component';
import { ComentariosComponent } from './components/comentarios/comentarios.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ListaPublicacionesComponent,
    DetallePublicacionComponent,
    FormularioPublicacionComponent,
    LoginComponent,
    RegisterComponent,
    NavbarComponent,
    ComentariosComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore())
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }