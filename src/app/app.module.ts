import { NgModule, APP_INITIALIZER } from '@angular/core';
import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule, TranslateLoader,TranslateCompiler } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { CoreModule } from '@app/core/core.module';
import { SharedModule } from '@app/shared/shared.module';
import { RoutesModule } from '@app/routes/routes.module';
import { SettingService } from '@app/core/services/setting.service';
import { ErrorInterceptor } from '@app/core/interceptors/error.interceptor';
import { TokenInterceptor } from '@app/core/interceptors/token.interceptor';
import { TranslateMessageFormatCompiler } from 'ngx-translate-messageformat-compiler';
import { AppComponent } from './app.component';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CoreModule,
    SharedModule,
    RoutesModule,
    TranslateModule.forRoot({
      // 语言包
      loader: {
        provide: TranslateLoader,
        useFactory: (http: HttpClient) => new TranslateHttpLoader(http, './assets/i18n/', '.json?'),
        deps: [HttpClient]
      },
      compiler: {
        provide: TranslateCompiler,
        useClass: TranslateMessageFormatCompiler
      }
    })
  ],
  providers: [
    {
      // 配置文件
      provide: APP_INITIALIZER,
      useFactory: (settingService: SettingService) => () => settingService.startup(),
      deps: [SettingService],
      multi: true,
    }, {
      // 拦截器：向 HTTP 请求头中加 Token
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }, {
      // 拦截器：HTTP > 2xx 时的统一处理
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    }
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
