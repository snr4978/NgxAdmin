import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { AuthComponent } from './auth/auth.component';
import { LoginComponent } from './auth/login/login.component';
import { ExpireComponent } from './auth/expire/expire.component';
import { InitialComponent } from './auth/initial/initial.component';
import { AdminComponent } from './admin/admin.component';
import { ProfileComponent } from './admin/profile/profile.component';
import { PasswordComponent } from './admin/password/password.component';
import { MessageComponent } from './admin/message/message.component';

@NgModule({
  declarations: [
    AuthComponent,
    LoginComponent,
    ExpireComponent,
    InitialComponent,
    AdminComponent,
    ProfileComponent,
    PasswordComponent,
    MessageComponent
  ],
  imports: [
    SharedModule
  ]
})
export class LayoutsModule { }
