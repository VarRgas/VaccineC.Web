import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
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
import { AgendamentoComponent } from './pages/agendamento/agendamento.component';
import { AplicacaoComponent } from './pages/aplicacao/aplicacao.component';
import { OrcamentosComponent } from './pages/orcamentos/orcamentos.component';
import { MovimentarEstoqueComponent, AddMovementProductEntryDialog, AddMovementProductExitDialog, ConfirmCancelMovementDialog, ConfirmCancelMovementProductDialog, UpdateMovementProductEntryDialog, UpdateMovementProductExitDialog } from './pages/movimentar-estoque/movimentar-estoque.component';
import { SituacaoEstoqueComponent, BatchInformationDialog } from './pages/situacao-estoque/situacao-estoque.component';
import { GerenciarUsuariosComponent, UserResourceAddDialog, ResetPasswordDialog, ConfirmUserResourceRemoveDialog } from './pages/gerenciar-usuarios/gerenciar-usuarios.component';
import { RecursosComponent, ConfirmResourceRemoveDialog } from './pages/recursos/recursos.component';
import { MinhaContaComponent, PasswordDialog } from './pages/minha-conta/minha-conta.component';
import { VisaoFaturamentoComponent } from './pages/visao-faturamento/visao-faturamento.component';
import { VisaoFaturamentoPesquisaComponent } from './pages/visao-faturamento/visao-faturamento-pesquisa/visao-faturamento-pesquisa.component';
import { NgChartsModule } from 'ng2-charts';
import { OrcamentoPesquisaComponent } from './pages/orcamentos/orcamento-pesquisa/orcamento-pesquisa.component';
import { OrcamentoCadastroComponent, BudgetProductDialog } from './pages/orcamentos/orcamento-cadastro/orcamento-cadastro.component';
import { NgxMaskModule } from 'ngx-mask'
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { AplicacaoCadastroComponent, AplicationDialog, BatchDialog } from './pages/aplicacao/aplicacao-cadastro/aplicacao-cadastro.component';
import { AplicacaoPesquisaComponent } from './pages/aplicacao/aplicacao-pesquisa/aplicacao-pesquisa.component';
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
registerLocaleData(localePt, 'pt');

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
    OrcamentoPesquisaComponent,
    OrcamentoCadastroComponent,
    BudgetProductDialog,
    AplicacaoCadastroComponent,
    AplicacaoPesquisaComponent,
    UploadFileComponent,
    AplicationDialog,
    BatchDialog,
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
    BatchInformationDialog
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
    MatSortModule
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
    }
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
