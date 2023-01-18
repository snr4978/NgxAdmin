import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { AuthComponent } from './auth/auth.component';
import { LoginComponent } from './auth/login/login.component';
import { ExpireComponent } from './auth/expire/expire.component';
import { InitialComponent } from './auth/initial/initial.component';
import { RootComponent } from './root/root.component';
import { ProfileComponent } from './root/profile/profile.component';
import { PasswordComponent } from './root/password/password.component';
import { MessageComponent } from './root/message/message.component';
import { MessageListComponent } from './root/message/list/list.component';
import { MessageContentComponent } from './root/message/content/content.component';
import { CrudComponent } from './crud/crud.component';
import { CrudEditComponent } from './crud/edit/edit.component';
import { CrudFilterComponent } from './crud/filter/filter.component';

@NgModule({
  declarations: [
    AuthComponent,
    LoginComponent,
    ExpireComponent,
    InitialComponent,
    RootComponent,
    ProfileComponent,
    PasswordComponent,
    MessageComponent,
    MessageListComponent,
    MessageContentComponent,
    CrudComponent,
    CrudEditComponent,
    CrudFilterComponent
  ],
  imports: [
    SharedModule
  ],
  exports: [
    CrudComponent
  ]
})
export class LayoutsModule { }
