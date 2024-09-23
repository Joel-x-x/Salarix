import { RestringidoComponent } from './demo/restringido/restringido.component';
// Angular Import
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// project import
import { AdminComponent } from './theme/layout/admin/admin.component';
import { GuestComponent } from './theme/layout/guest/guest.component';
import { Role } from './demo/usuario/Roles/roles';
import { UsuarioGuard } from './demo/guard/usuario.guard';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: '',
        redirectTo: '/analytics',
        pathMatch: 'full'
      },
      {
        path: 'analytics',
        loadComponent: () => import('./demo/dashboard/dash-analytics.component'),
        canActivate: [UsuarioGuard],
        data: { roles: [Role.Administrador, Role.SUPERADMINISTRADOR] }
      },
      {
        path: 'component',
        loadChildren: () => import('./demo/ui-element/ui-basic.module').then((m) => m.UiBasicModule),
        canActivate: [UsuarioGuard],
        data: { roles: [Role.Administrador, Role.SUPERADMINISTRADOR, Role.Empleado, Role.Contador] }
      },
      {
        path: 'chart',
        loadComponent: () => import('./demo/chart & map/core-apex.component')
      },
      {
        path: 'forms',
        loadComponent: () => import('./demo/forms & tables/form-elements/form-elements.component')
      },
      {
        path: 'tables',
        loadComponent: () => import('./demo/forms & tables/tbl-bootstrap/tbl-bootstrap.component')
      },
      {
        path: 'sample-page',
        loadComponent: () => import('./demo/sample-page/sample-page.component')
      },
      {
        path: 'registros',
        loadComponent: () => import('./demo/empleados/registros/registros.component').then(m => m.RegistroComponent),
        canActivate: [UsuarioGuard],
        data: { roles: [Role.Administrador, Role.SUPERADMINISTRADOR] }
      },
      {
        path: 'empleado',
        loadComponent: () => import('./demo/empleados/empleado/empleado.component').then((m) => m.EmpleadoComponent),
        canActivate: [UsuarioGuard],
        data: { roles: [Role.Administrador, Role.SUPERADMINISTRADOR] }
      },
      {
        path: 'usuario',
        loadComponent: () => import('./demo/usuario/usuario.component').then((m) => m.UsuarioComponent),
        canActivate: [UsuarioGuard],
        data: { roles: [Role.Administrador, Role.SUPERADMINISTRADOR] }
      },
      {
        path: 'posicion',
        loadComponent: () => import('./demo/empleados/posicion/posicion.component').then((m) => m.PosicionComponent),
        canActivate: [UsuarioGuard],
        data: { roles: [Role.Administrador, Role.SUPERADMINISTRADOR] }
      },
      {
        path: 'plan-salarial',
        loadComponent: () => import('./demo/empleados/plan-salarial/plan-salarial.component').then((m) => m.PlanSalarialComponent),
        canActivate: [UsuarioGuard],
        data: { roles: [Role.Administrador, Role.SUPERADMINISTRADOR] }
      },
      {
        path: 'departamentos',
        loadComponent: () => import('./demo/empleados/departamentos/departamentos.component').then(m => m.DepartamentoComponent),
        canActivate: [UsuarioGuard],
        data: { roles: [Role.Administrador, Role.SUPERADMINISTRADOR] }
      },
      {
        path: 'dependientes',
        loadComponent: () => import('./demo/empleados/dependientes/dependientes.component').then(m => m.DependienteComponent),
        canActivate: [UsuarioGuard],
        data: { roles: [Role.Administrador, Role.SUPERADMINISTRADOR] }
      },
      {
        path: 'vacaciones',
        loadComponent: () => import('./demo/empleados/vacaciones/vacaciones.component'),
        canActivate: [UsuarioGuard],
        data: { roles: [Role.Administrador, Role.SUPERADMINISTRADOR] }
      },
      {
        path: 'nomina',
        loadComponent: () => import('./demo/nomina/nomina/nomina.component').then(m => m.NominaComponent),
        canActivate: [UsuarioGuard],
        data: { roles: [Role.Administrador, Role.SUPERADMINISTRADOR, Role.Contador] }
      },
      {
        path: 'reportes',
        loadComponent: () => import('./demo/reportes/reportes.component').then(m => m.ReportesComponent),
        canActivate: [UsuarioGuard],
        data: { roles: [Role.Administrador, Role.SUPERADMINISTRADOR, Role.Contador] }
      }
    ]
  },
  {
    path: 'restringido',
    loadComponent: () => import('./demo/restringido/restringido.component').then(m => m.RestringidoComponent)
  },
  {
    path: '',
    component: GuestComponent,
    children: [
      {
        path: 'auth/signup',
        loadComponent: () => import('./demo/authentication/sign-up/sign-up.component')
      },
      {
        path: 'auth/signin',
        loadComponent: () => import('./demo/authentication/sign-in/sign-in.component')
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
