import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';

import { BasicRoutingModule } from './basic-routing.module';

import { RoleComponent } from './role/role.component';
import { RoleEditComponent } from './role/edit/edit.component';
import { RoleMenuComponent } from './role/menu/menu.component';
import { UserComponent } from './user/user.component';
import { UserEditComponent } from './user/edit/edit.component';


@NgModule({
  declarations: [
    RoleComponent,
    RoleEditComponent,
    RoleMenuComponent,
    UserComponent,
    UserEditComponent
  ],
  imports: [
    SharedModule,
    BasicRoutingModule
  ]
})
export class BasicModule { }
