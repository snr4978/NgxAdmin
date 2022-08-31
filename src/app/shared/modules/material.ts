import { NgModule } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { A11yModule } from '@angular/cdk/a11y';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { CdkTableModule } from '@angular/cdk/table';
import { CdkTreeModule } from '@angular/cdk/tree';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBadgeModule } from '@angular/material/badge';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule, MAT_CHECKBOX_DEFAULT_OPTIONS } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { DateAdapter, MatNativeDateModule, MatRippleModule, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule, MatPaginatorIntl, MAT_PAGINATOR_DEFAULT_OPTIONS } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule, MAT_RADIO_DEFAULT_OPTIONS } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTreeModule } from '@angular/material/tree';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { NgxMatMomentAdapter, NGX_MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular-material-components/moment-adapter';
import { NgxMatDateAdapter, NgxMatDatetimePickerModule, NgxMatNativeDateModule, NgxMatTimepickerModule, NGX_MAT_DATE_FORMATS } from '@angular-material-components/datetime-picker';
import { MatFileUploadModule } from 'angular-material-fileupload';

@NgModule({
  providers: [{
    provide: MAT_DATE_FORMATS,
    useValue: {
      parse: {
        dateInput: 'YYYY-MM-DD',
      },
      display: {
        dateInput: 'YYYY-MM-DD',
        monthYearLabel: 'YYYY-MM',
        dateA11yLabel: 'YYYY-MM-DD',
        monthYearA11yLabel: 'YYYY-MM',
      }
    }
  }, {
    provide: NGX_MAT_DATE_FORMATS,
    useValue: {
      parse: {
        dateInput: "YYYY-MM-DD HH:mm"
      },
      display: {
        dateInput: "YYYY-MM-DD HH:mm",
        monthYearLabel: 'YYYY-MM',
        dateA11yLabel: 'YYYY-MM-DD',
        monthYearA11yLabel: 'YYYY-MM',
      }
    }
  }, {
    provide: MAT_CHECKBOX_DEFAULT_OPTIONS,
    useValue: { color: 'primary' },
  }, {
    provide: MAT_RADIO_DEFAULT_OPTIONS,
    useValue: { color: 'primary' },
  }, {
    provide: MAT_PAGINATOR_DEFAULT_OPTIONS,
    useValue: {
      pageSize: 30,
      pageSizeOptions: [10, 30, 50, 100]
    }
  }, {
    provide: MatPaginatorIntl,
    deps: [TranslateService],
    useFactory: (translateService: TranslateService) => {
      const matPaginatorIntl = new MatPaginatorIntl();
      const translate = function () {
        matPaginatorIntl.firstPageLabel = translateService.instant('shared.data.page.first');
        matPaginatorIntl.previousPageLabel = translateService.instant('shared.data.page.previous');
        matPaginatorIntl.nextPageLabel = translateService.instant('shared.data.page.next');
        matPaginatorIntl.lastPageLabel = translateService.instant('shared.data.page.last');
        matPaginatorIntl.itemsPerPageLabel = translateService.instant('shared.data.page.size');
        matPaginatorIntl.getRangeLabel = (index, size, total) => {
          const params = {
            from: 0,
            to: 0,
            total: total
          };
          if (total > 0) {
            params.from = size * index + 1;
            params.to = Math.min(total, size * (index + 1));
          }
          return translateService.instant('shared.data.page.range', params);
        };
      };
      translate();
      translateService.onLangChange.subscribe(() => {
        translate();
        matPaginatorIntl.changes.next();
      });
      return matPaginatorIntl;
    }
  }, {
    provide: DateAdapter,
    useClass: MomentDateAdapter,
    deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
  }, {
    provide: NgxMatDateAdapter,
    useClass: NgxMatMomentAdapter,
    deps: [MAT_DATE_LOCALE, NGX_MAT_MOMENT_DATE_ADAPTER_OPTIONS]
  }],
  exports: [
    A11yModule,
    DragDropModule,
    OverlayModule,
    PortalModule,
    ScrollingModule,
    CdkStepperModule,
    CdkTableModule,
    CdkTreeModule,
    MatAutocompleteModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatStepperModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatFileUploadModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTreeModule,
    NgxMatDatetimePickerModule,
    NgxMatNativeDateModule,
    NgxMatTimepickerModule
  ],
})
export class MaterialModule { }
