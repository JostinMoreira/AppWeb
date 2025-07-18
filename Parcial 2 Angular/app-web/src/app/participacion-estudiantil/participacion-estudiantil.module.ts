import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { CrearPublicacionComponent } from './components/publicaciones/crear-publicacion.component';
import { EditarPublicacionComponent } from './components/publicaciones/editar-publicacion.component';
import { ListaPublicacionesComponent } from './components/publicaciones/lista-publicaciones.component';
import { PublicarPublicacionComponent } from './components/publicaciones/publicar-publicacion.component';

import { CrearComentarioComponent } from './components/comentarios/crear-comentario.component';
import { EditarComentarioComponent } from './components/comentarios/editar-comentario.component';
import { ListaComentariosComponent } from './components/comentarios/lista-comentarios.component';

import { LikeComponent } from './components/valoracion/like.component';
import { DislikeComponent } from './components/valoracion/dislike.component';

import { NotificacionesComponent } from './components/notificaciones/notificaciones.component';

import { PublicacionesService } from './services/publicaciones.service';
import { ComentariosService } from './services/comentarios.service';
import { ValoracionService } from './services/valoracion.service';
import { NotificacionesService } from './services/notificaciones.service';

const routes: Routes = [
  { path: 'publicaciones', component: ListaPublicacionesComponent },
  { path: 'publicaciones/nueva', component: CrearPublicacionComponent },
  { path: 'publicaciones/editar/:id', component: EditarPublicacionComponent },
  { path: 'publicaciones/publicar/:id', component: PublicarPublicacionComponent },
  { path: 'comentarios/nuevo', component: CrearComentarioComponent },
  { path: 'comentarios/editar/:id', component: EditarComentarioComponent },
  { path: 'comentarios/lista/:publicacionId', component: ListaComentariosComponent },
  { path: 'notificaciones', component: NotificacionesComponent }
];

@NgModule({
  declarations: [
    CrearPublicacionComponent,
    EditarPublicacionComponent,
    ListaPublicacionesComponent,
    PublicarPublicacionComponent,
    CrearComentarioComponent,
    EditarComentarioComponent,
    ListaComentariosComponent,
    LikeComponent,
    DislikeComponent,
    NotificacionesComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes)
  ],
  providers: [
    PublicacionesService,
    ComentariosService,
    ValoracionService,
    NotificacionesService
  ]
})
export class ParticipacionEstudiantilModule { }