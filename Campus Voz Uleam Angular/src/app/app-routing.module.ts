// app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { PerfilComponent } from './components/perfil/perfil.component';
// ... otras importaciones que sí uses

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'perfil', component: PerfilComponent },
  // ... otras rutas que sí uses
  { path: '', redirectTo: '/home', pathMatch: 'full' } // Redirige a una ruta que exista
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }