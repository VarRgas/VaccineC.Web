import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DateAdapter, MatNativeDateModule, MAT_DATE_FORMATS } from '@angular/material/core';
import { HttpClientModule } from '@angular/common/http';
import { MaterialExampleModule } from './material.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { FormasPagamentoComponent, ConfirmPaymentFormRemoveDialog } from './pages/formas-pagamento/formas-pagamento.component';
import { NotFoundComponent } from './pages/error/not-found/not-found.component';
import { InternalServerErrorComponent } from './pages/error/internal-server-error/internal-server-error.component';
import { UnauthorizedComponent } from './pages/error/unauthorized/unauthorized.component';
import { PessoasComponent, DialogContentPhoneDialog, DialogContentAddressDialog, ConfirmPersonRemoveDialog, ConfirmPersonPhoneRemoveDialog, UpdatePersonPhoneDialog, ConfirmAddressPhoneRemoveDialog, UpdatePersonAddressDialog } from './pages/pessoas/pessoas.component';
import { EmpresasComponent, DialogContentScheduleDialog, ConfirmCompanyRemoveDialog, ConfirmCompanyScheduleRemoveDialog, UpdateCompanyScheduleDialog } from './pages/empresa/empresas.component';
import { ProdutoComponent, DialogContentDose, ConfirmProductRemoveDialog, ConfirmProductDosesRemoveDialog, UpdateDialogContentDose } from './pages/produto/produto.component';
import { AgendamentoComponent, AddBorrowerBottomSheet, AddAuthorizationDialog, UpdateAuthorizationDialog, ConfirmCancelAuthorizationDialog, SearchAuthorizationDialog, AuthorizationNotificationDialog } from './pages/agendamento/agendamento.component';
import { AplicacaoComponent, SipniIntegrationErrorBottomSheet, SipniIntegrationSuccessBottomSheet, AplicationDialog, BatchBottomSheet, SelectBatchBottomSheet, AddressBottomSheet } from './pages/aplicacao/aplicacao.component';
import { AddBudgetProductDialog, OrcamentosComponent, ConfirmBudgetProductRemoveDialog, UpdateBudgetProductDialog, ConfirmBudgetCancelationDialog, RepeatBudgetProductDialog } from './pages/orcamentos/orcamentos.component';
import { MovimentarEstoqueComponent, ConfirmDiscardDialog, AddMovementProductEntryDialog, AddMovementProductExitDialog, ConfirmCancelMovementDialog, ConfirmCancelMovementProductDialog, UpdateMovementProductEntryDialog, UpdateMovementProductExitDialog } from './pages/movimentar-estoque/movimentar-estoque.component';
import { SituacaoEstoqueComponent, BatchInformationDialog, ProductBatchsInformationDialog } from './pages/situacao-estoque/situacao-estoque.component';
import { GerenciarUsuariosComponent, UserResourceAddDialog, ResetPasswordDialog, ConfirmUserResourceRemoveDialog } from './pages/gerenciar-usuarios/gerenciar-usuarios.component';
import { RecursosComponent, ConfirmResourceRemoveDialog } from './pages/recursos/recursos.component';
import { SnackBarComponent } from './pages/snackbar/snack-bar.component';
import { MinhaContaComponent, PasswordDialog } from './pages/minha-conta/minha-conta.component';
import { VisaoFaturamentoComponent } from './pages/visao-faturamento/visao-faturamento.component';
import { VisaoFaturamentoPesquisaComponent } from './pages/visao-faturamento/visao-faturamento-pesquisa/visao-faturamento-pesquisa.component';
import { NgChartsModule } from 'ng2-charts';
import { NgxMaskModule } from 'ngx-mask'
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { GlobalErrorDialog } from './shared/components/global-error-dialog/global-error-dialog.component';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { getPortuguesePaginatorIntl } from './utils/custom-mat-paginator-intl';
import { NgxLoadingButtonsModule } from 'ngx-loading-buttons';
import { NgxViacepModule } from "@brunoc/ngx-viacep"; // Importando o módulo
import { UploadFileComponent } from './pages/pessoas/upload-file/upload-file.component';
import { LOCALE_ID, DEFAULT_CURRENCY_CODE } from '@angular/core';
import localePt from '@angular/common/locales/pt';
import { registerLocaleData } from '@angular/common';
import { MatSortModule } from '@angular/material/sort';
import { ConectionErrorComponent } from './pages/error/conection-error/conection-error.component';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MatSidenavModule } from '@angular/material/sidenav';

registerLocaleData(localePt, 'pt');

export const MY_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY'
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  }
};

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    ForgotPasswordComponent,
    FormasPagamentoComponent,
    NotFoundComponent,
    InternalServerErrorComponent,
    UnauthorizedComponent,
    PessoasComponent,
    EmpresasComponent,
    ProdutoComponent,
    AgendamentoComponent,
    AplicacaoComponent,
    OrcamentosComponent,
    MovimentarEstoqueComponent,
    SituacaoEstoqueComponent,
    GerenciarUsuariosComponent,
    RecursosComponent,
    MinhaContaComponent,
    VisaoFaturamentoPesquisaComponent,
    VisaoFaturamentoComponent,
    DialogContentPhoneDialog,
    DialogContentAddressDialog,
    DialogContentScheduleDialog,
    ConfirmCompanyRemoveDialog,
    ConfirmPersonRemoveDialog,
    DialogContentDose,
    UserResourceAddDialog,
    PasswordDialog,
    ResetPasswordDialog,
    AddBudgetProductDialog,
    UploadFileComponent,
    GlobalErrorDialog,
    ConfirmPaymentFormRemoveDialog,
    ConfirmResourceRemoveDialog,
    ConfirmUserResourceRemoveDialog,
    ConfirmCompanyScheduleRemoveDialog,
    UpdateCompanyScheduleDialog,
    ConfirmPersonPhoneRemoveDialog,
    UpdatePersonPhoneDialog,
    ConfirmAddressPhoneRemoveDialog,
    UpdatePersonAddressDialog,
    ConfirmProductRemoveDialog,
    AddMovementProductEntryDialog,
    AddMovementProductExitDialog,
    ConfirmCancelMovementDialog,
    ConfirmCancelMovementProductDialog,
    UpdateMovementProductEntryDialog,
    UpdateMovementProductExitDialog,
    ConfirmProductDosesRemoveDialog,
    UpdateDialogContentDose,
    BatchInformationDialog,
    ProductBatchsInformationDialog,
    ConectionErrorComponent,
    ConfirmBudgetProductRemoveDialog,
    UpdateBudgetProductDialog,
    ConfirmBudgetCancelationDialog,
    SnackBarComponent,
    RepeatBudgetProductDialog,
    ConfirmDiscardDialog,
    AddAuthorizationDialog,
    UpdateAuthorizationDialog,
    ConfirmCancelAuthorizationDialog,
    SearchAuthorizationDialog,
    AuthorizationNotificationDialog,
    AddBorrowerBottomSheet,
    AplicationDialog,
    BatchBottomSheet,
    SelectBatchBottomSheet,
    AddressBottomSheet,
    SipniIntegrationErrorBottomSheet,
    SipniIntegrationSuccessBottomSheet
  ],
  imports: [
    BrowserModule,
    RouterModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule,
    FormsModule,
    HttpClientModule,
    MatNativeDateModule,
    MaterialExampleModule,
    ReactiveFormsModule,
    NgChartsModule,
    NgxMaskModule.forRoot(),
    NgxLoadingButtonsModule,
    NgxViacepModule,
    MatSortModule,
    MatSidenavModule
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
    { provide: MatPaginatorIntl, useValue: getPortuguesePaginatorIntl() },
    {
      provide: LOCALE_ID,
      useValue: 'pt'
    }, {
      provide: DEFAULT_CURRENCY_CODE,
      useValue: 'BRL'
    },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }

  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
