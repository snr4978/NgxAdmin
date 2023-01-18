import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { LayoutsModule } from '@app/layouts/layouts.module';

import { AdminRoutingModule } from './admin-routing.module';

import { RoleComponent } from './role/role.component';
import { RoleMenuComponent } from './role/menu/menu.component';
import { UserComponent } from './user/user.component';


@NgModule({
  declarations: [
    RoleComponent,
    RoleMenuComponent,
    UserComponent
  ],
  imports: [
    SharedModule,
    LayoutsModule,
    AdminRoutingModule
  ]
})
export class AdminModule { }
