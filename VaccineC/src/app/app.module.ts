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
import { ProdutoComponent, DialogContentDose } from './pages/produto/produto.component';
import { AgendamentoComponent } from './pages/agendamento/agendamento.component';
import { AplicacaoComponent } from './pages/aplicacao/aplicacao.component';
import { OrcamentosComponent } from './pages/orcamentos/orcamentos.component';
import { MovimentarEstoqueComponent } from './pages/movimentar-estoque/movimentar-estoque.component';
import { SituacaoEstoqueComponent } from './pages/situacao-estoque/situacao-estoque.component';
import { GerenciarUsuariosComponent, UserResourceAddDialog, ResetPasswordDialog, ConfirmUserResourceRemoveDialog } from './pages/gerenciar-usuarios/gerenciar-usuarios.component';
import { RecursosComponent, ConfirmResourceRemoveDialog } from './pages/recursos/recursos.component';
import { MinhaContaComponent, PasswordDialog } from './pages/minha-conta/minha-conta.component';
import { VisaoFaturamentoComponent } from './pages/visao-faturamento/visao-faturamento.component';
import { VisaoFaturamentoPesquisaComponent } from './pages/visao-faturamento/visao-faturamento-pesquisa/visao-faturamento-pesquisa.component';
import { ProdutoPesquisaComponent } from './pages/produto/produto-pesquisa/produto-pesquisa.component';
import { ProdutoCadastroComponent } from './pages/produto/produto-cadastro/produto-cadastro.component';
import { ProdutoAprazamentoComponent } from './pages/produto/produto-aprazamento/produto-aprazamento.component';
import { ProdutoResumoComponent } from './pages/produto/produto-resumo/produto-resumo.component';
import { NgChartsModule } from 'ng2-charts';
import { MovimentarEstoquePesquisaComponent } from './pages/movimentar-estoque/movimentar-estoque-pesquisa/movimentar-estoque-pesquisa.component';
import { MovimentarEstoqueCadastroComponent, ProductDialog } from './pages/movimentar-estoque/movimentar-estoque-cadastro/movimentar-estoque-cadastro.component';
import { SituacaoEstoqueLotesComponent } from './pages/situacao-estoque/situacao-estoque-lotes/situacao-estoque-lotes.component';
import { SituacaoEstoqueMinimoComponent } from './pages/situacao-estoque/situacao-estoque-minimo/situacao-estoque-minimo.component';
import { SituacaoEstoqueProjecaoComponent } from './pages/situacao-estoque/situacao-estoque-projecao/situacao-estoque-projecao.component';
import { OrcamentoPesquisaComponent } from './pages/orcamentos/orcamento-pesquisa/orcamento-pesquisa.component';
import { OrcamentoCadastroComponent, BudgetProductDialog } from './pages/orcamentos/orcamento-cadastro/orcamento-cadastro.component';
import { NgxMaskModule, IConfig } from 'ngx-mask'
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { AplicacaoCadastroComponent, AplicationDialog, BatchDialog } from './pages/aplicacao/aplicacao-cadastro/aplicacao-cadastro.component';
import { AplicacaoPesquisaComponent } from './pages/aplicacao/aplicacao-pesquisa/aplicacao-pesquisa.component';
import { GlobalErrorDialog } from './shared/components/global-error-dialog/global-error-dialog.component';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { getPortuguesePaginatorIntl } from './utils/custom-mat-paginator-intl';
import { NgxLoadingButtonsModule } from 'ngx-loading-buttons';
import { NgxViacepModule } from "@brunoc/ngx-viacep"; // Importando o módulo
import { UploadFileComponent } from './pages/pessoas/upload-file/upload-file.component';

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
    ProdutoPesquisaComponent,
    ProdutoCadastroComponent,
    ProdutoAprazamentoComponent,
    ProdutoResumoComponent,
    DialogContentDose,
    UserResourceAddDialog,
    PasswordDialog,
    ResetPasswordDialog,
    MovimentarEstoquePesquisaComponent,
    MovimentarEstoqueCadastroComponent,
    ProductDialog,
    SituacaoEstoqueLotesComponent,
    SituacaoEstoqueMinimoComponent,
    SituacaoEstoqueProjecaoComponent,
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
    UpdatePersonAddressDialog
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
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
    { provide: MatPaginatorIntl, useValue: getPortuguesePaginatorIntl() }
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
