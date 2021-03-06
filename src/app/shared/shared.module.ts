import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NgProgressModule } from 'ngx-progressbar';
import { NgProgressRouterModule } from 'ngx-progressbar/router';
import { MaterialModule } from './modules/material';
import { DialogAlertComponent } from './components/dialog-alert/dialog-alert.component';
import { DialogConfirmComponent } from './components/dialog-confirm/dialog-confirm.component';
import { DialogPromptComponent } from './components/dialog-prompt/dialog-prompt.component';
import { CleaveDirective } from './directives/cleave.directive';
import { FocusDirective } from './directives/focus.directive';
import { KeyboardlessDirective } from './directives/keyboardless.directive';
import { LoadingDirective } from './directives/loading.directive';
import { UploadDirective } from './directives/upload.directive';
import { FieldPipe } from './pipes/field.pipe';
import { FindPipe } from './pipes/find.pipe';
import { JoinPipe } from './pipes/join.pipe';
import { UrlPipe } from './pipes/url.pipe';

const MODULES = [
  MaterialModule,
  NgProgressModule,
  NgProgressRouterModule,
  TranslateModule
];
const COMPONENTS = [
  DialogAlertComponent,
  DialogConfirmComponent,
  DialogPromptComponent
];
const DIRECTIVES = [
  CleaveDirective,
  FocusDirective,
  KeyboardlessDirective,
  LoadingDirective,
  UploadDirective
];
const PIPES = [
  FieldPipe,
  FindPipe,
  JoinPipe,
  UrlPipe
];

@NgModule({
  declarations: [
    ...COMPONENTS,
    ...DIRECTIVES,
    ...PIPES
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MODULES
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    ...MODULES,
    ...COMPONENTS,
    ...DIRECTIVES,
    ...PIPES,
  ],
})
export class SharedModule { }
