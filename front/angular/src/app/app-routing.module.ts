// Angular Import
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// project import
import { AdminComponent } from './theme/layout/admin/admin.component';
import { GuestComponent } from './theme/layout/guest/guest.component';

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
        loadComponent: () => import('./demo/dashboard/dash-analytics.component')
      },
      {
        path: 'component',
        loadChildren: () => import('./demo/ui-element/ui-basic.module').then((m) => m.UiBasicModule)
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
        loadComponent: () => import('./demo/empleados/registros/registros.component'),
      },
      {
        path: 'empleado',
        loadComponent: () => import('./demo/empleados/empleado/empleado.component').then((m) => m.EmpleadoComponent)
      },
      {
        path: 'posicion',
        loadComponent: () => import('./demo/empleados/posicion/posicion.component').then((m) => m.PosicionComponent)
      },
      {
        path: 'plan-salarial',
        loadComponent: () => import('./demo/empleados/plan-salarial/plan-salarial.component').then((m) => m.PlanSalarialComponent)
      },
      {
        path: 'departamentos',
        loadComponent: () => import('./demo/empleados/departamentos/departamentos.component').then(m => m.DepartamentoComponent)
      },
      {
        path: 'dependientes',
        loadComponent: () => import('./demo/empleados/dependientes/dependientes.component').then(m => m.DependienteComponent)
      },
      {
        path: 'vacaciones',
        loadComponent: () => import('./demo/empleados/vacaciones/vacaciones.component')
      }
    ]
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
export class AppRoutingModule {}
