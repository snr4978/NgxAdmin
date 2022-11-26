import { NgModule } from '@angular/core';
import { Routes, RouterModule, RouteReuseStrategy } from '@angular/router';
import { DynamicReuseStrategy } from '@app/core/strategies/dynamic.strategy';
import { ActivateGuard } from '@app/core/guards/activate.guard';
import { LayoutsModule } from '@app/layouts/layouts.module';
import { AdminComponent } from '@app/layouts/admin/admin.component';
import { AuthComponent } from '@app/layouts/auth/auth.component';
import { MessageComponent } from '@app/layouts/admin/message/message.component'
import { LoginComponent } from '@app/layouts/auth/login/login.component';
import { ExpireComponent } from '@app/layouts/auth/expire/expire.component';
import { InitialComponent } from '@app/layouts/auth/initial/initial.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    canActivate: [ActivateGuard],
    canActivateChild: [ActivateGuard],
    children: [
      {
        path: 'message',
        component: MessageComponent,
        data: {
          anymouse: true
        }
      },
      {
        path: 'admin',
        loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
      }
    ]
  },
  {
    path: 'auth',
    component: AuthComponent,
    children: [
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'expire',
        component: ExpireComponent
      },
      {
        path: 'initial',
        component: InitialComponent
      }
    ]
  }
];

@NgModule({
  imports: [
    LayoutsModule,
    RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })
  ],
  exports: [
    RouterModule
  ],
  providers: [
    {
      provide: RouteReuseStrategy,
      useClass: DynamicReuseStrategy
    }
  ]
})
export class RoutesRoutingModule { }
