import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from './modules/material';
import { DialogAlertComponent } from './components/dialog-alert/dialog-alert.component';
import { DialogConfirmComponent } from './components/dialog-confirm/dialog-confirm.component';
import { DialogPromptComponent } from './components/dialog-prompt/dialog-prompt.component';
import { TableColumnPatternComponent } from './components/table-column-pattern/table-column-pattern.component';
import { TableRowSelectionComponent } from './components/table-row-selection/table-row-selection.component';
import { FocusDirective } from './directives/focus.directive';
import { KeyboardlessDirective } from './directives/keyboardless.directive';
import { LoadingDirective } from './directives/loading.directive';
import { FieldPipe } from './pipes/field.pipe';
import { JoinPipe } from './pipes/join.pipe';
import { SortPipe } from './pipes/sort.pipe';
import { TrustPipe } from './pipes/trust.pipe';

const MODULES = [
  MaterialModule,
  TranslateModule
];
const COMPONENTS = [
  DialogAlertComponent,
  DialogConfirmComponent,
  DialogPromptComponent,
  TableColumnPatternComponent,
  TableRowSelectionComponent
];
const DIRECTIVES = [
  FocusDirective,
  KeyboardlessDirective,
  LoadingDirective
];
const PIPES = [
  FieldPipe,
  JoinPipe,
  SortPipe,
  TrustPipe
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
    ...MODULES
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
  ]
})
export class SharedModule { }
