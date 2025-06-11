import { NgModule } from "@angular/core"
import { RouterModule, type Routes } from "@angular/router"
import { HomeComponent } from "./components/home/home.component"
import { LoginComponent } from "./components/auth/login/login.component"
import { RegisterComponent } from "./components/auth/register/register.component"
import { ListaPublicacionesComponent } from "./components/publicaciones/lista-publicaciones/lista-publicaciones.component"
import { FormularioPublicacionComponent } from "./components/publicaciones/formulario-publicacion/formulario-publicacion.component"
import { DetallePublicacionComponent } from "./components/publicaciones/detalle-publicacion/detalle-publicacion.component"
import { PerfilComponent } from "./components/perfil/perfil.component"
import { AuthGuard } from "./guards/auth.guard"

const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "login", component: LoginComponent },
  { path: "register", component: RegisterComponent },
  { path: "publicaciones", component: ListaPublicacionesComponent },
  { path: "nueva-publicacion", component: FormularioPublicacionComponent, canActivate: [AuthGuard] },
  { path: "editar-publicacion/:id", component: FormularioPublicacionComponent, canActivate: [AuthGuard] },
  { path: "publicacion/:id", component: DetallePublicacionComponent },
  { path: "perfil", component: PerfilComponent, canActivate: [AuthGuard] },
  { path: "**", redirectTo: "" },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
