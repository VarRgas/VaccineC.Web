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
import { FormasPagamentoComponent } from './pages/formas-pagamento/formas-pagamento.component';
import { NotFoundComponent } from './pages/error/not-found/not-found.component';
import { InternalServerErrorComponent } from './pages/error/internal-server-error/internal-server-error.component';
import { UnauthorizedComponent } from './pages/error/unauthorized/unauthorized.component';
import { PessoasComponent, DialogContentPhoneDialog, DialogContentAddressDialog } from './pages/pessoas/pessoas.component';
import { EmpresasComponent, DialogContentScheduleDialog } from './pages/empresa/empresas.component';
import { ProdutoComponent, DialogContentDose } from './pages/produto/produto.component';
import { AgendamentoComponent } from './pages/agendamento/agendamento.component';
import { AplicacaoComponent } from './pages/aplicacao/aplicacao.component';
import { OrcamentosComponent } from './pages/orcamentos/orcamentos.component';
import { MovimentarEstoqueComponent } from './pages/movimentar-estoque/movimentar-estoque.component';
import { SituacaoEstoqueComponent } from './pages/situacao-estoque/situacao-estoque.component';
import { GerenciarUsuariosComponent, ScreensDialog } from './pages/gerenciar-usuarios/gerenciar-usuarios.component';
import { RecursosComponent } from './pages/recursos/recursos.component';
import { MinhaContaComponent, PasswordDialog } from './pages/minha-conta/minha-conta.component';
import { VisaoFaturamentoComponent } from './pages/visao-faturamento/visao-faturamento.component';
import { PessoasPesquisaComponent } from './pages/pessoas/pessoas-pesquisa/pessoas-pesquisa.component';
import { PessoasCadastroComponent } from './pages/pessoas/pessoas-cadastro/pessoas-cadastro.component';
import { PessoasComplementoComponent } from './pages/pessoas/pessoas-complemento/pessoas-complemento.component';
import { PessoasTelefonesComponent } from './pages/pessoas/pessoas-telefones/pessoas-telefones.component';
import { PessoasEnderecosComponent } from './pages/pessoas/pessoas-enderecos/pessoas-enderecos.component';
import { FormasPagamentoPesquisaComponent } from './pages/formas-pagamento/formas-pagamento-pesquisa/formas-pagamento-pesquisa.component';
import FormasPagamentoCadastroComponent, { ConfirmPaymentFormRemoveDialog } from './pages/formas-pagamento/formas-pagamento-cadastro/formas-pagamento-cadastro.component';
import { RecursosPesquisaComponent } from './pages/recursos/recursos-pesquisa/recursos-pesquisa.component';
import { RecursosCadastroComponent, ConfirmResourceRemoveDialog } from './pages/recursos/recursos-cadastro/recursos-cadastro.component';
import { EmpresaCadastroComponent } from './pages/empresa/empresa-cadastro/empresa-cadastro.component';
import { EmpresaPesquisaComponent } from './pages/empresa/empresa-pesquisa/empresa-pesquisa.component';
import { EmpresaParametrosComponent } from './pages/empresa/empresa-parametros/empresa-parametros.component';
import { EmpresaAgendaComponent } from './pages/empresa/empresa-agenda/empresa-agenda.component';
import { VisaoFaturamentoPesquisaComponent } from './pages/visao-faturamento/visao-faturamento-pesquisa/visao-faturamento-pesquisa.component';
import { UsuariosPesquisaComponent } from './pages/gerenciar-usuarios/usuarios-pesquisa/usuarios-pesquisa.component';
import { UsuariosCadastroComponent } from './pages/gerenciar-usuarios/usuarios-cadastro/usuarios-cadastro.component';
import { UsuariosRecursosComponent } from './pages/gerenciar-usuarios/usuarios-recursos/usuarios-recursos.component';
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
    UsuariosPesquisaComponent,
    UsuariosCadastroComponent,
    UsuariosRecursosComponent,
    RecursosComponent,
    MinhaContaComponent,
    VisaoFaturamentoPesquisaComponent,
    VisaoFaturamentoComponent,
    PessoasPesquisaComponent,
    PessoasCadastroComponent,
    PessoasComplementoComponent,
    PessoasTelefonesComponent,
    PessoasEnderecosComponent,
    DialogContentPhoneDialog,
    DialogContentAddressDialog,
    FormasPagamentoPesquisaComponent,
    FormasPagamentoCadastroComponent,
    RecursosPesquisaComponent,
    RecursosCadastroComponent,
    EmpresaCadastroComponent,
    EmpresaPesquisaComponent,
    EmpresaParametrosComponent,
    EmpresaAgendaComponent,
    DialogContentScheduleDialog,
    ProdutoPesquisaComponent,
    ProdutoCadastroComponent,
    ProdutoAprazamentoComponent,
    ProdutoResumoComponent,
    DialogContentDose,
    ScreensDialog,
    PasswordDialog,
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
    AplicationDialog,
    BatchDialog,
    GlobalErrorDialog,
    ConfirmPaymentFormRemoveDialog,
    ConfirmResourceRemoveDialog
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
    NgxLoadingButtonsModule
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
    { provide: MatPaginatorIntl, useValue: getPortuguesePaginatorIntl() }
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
