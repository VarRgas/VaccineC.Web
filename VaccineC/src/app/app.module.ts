import { NgModule } from '@angular/core';
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
import { AddScreensDialog, GerenciarUsuariosComponent } from './pages/gerenciar-usuarios/gerenciar-usuarios.component';
import { RecursosComponent } from './pages/recursos/recursos.component';
import { MinhaContaComponent } from './pages/minha-conta/minha-conta.component';
import { VisaoFaturamentoComponent } from './pages/visao-faturamento/visao-faturamento.component';
import { PessoasPesquisaComponent } from './pages/pessoas/pessoas-pesquisa/pessoas-pesquisa.component';
import { PessoasCadastroComponent } from './pages/pessoas/pessoas-cadastro/pessoas-cadastro.component';
import { PessoasComplementoComponent } from './pages/pessoas/pessoas-complemento/pessoas-complemento.component';
import { PessoasTelefonesComponent} from './pages/pessoas/pessoas-telefones/pessoas-telefones.component';
import { PessoasEnderecosComponent } from './pages/pessoas/pessoas-enderecos/pessoas-enderecos.component';
import { FormasPagamentoPesquisaComponent } from './pages/formas-pagamento/formas-pagamento-pesquisa/formas-pagamento-pesquisa.component';
import { FormasPagamentoCadastroComponent } from './pages/formas-pagamento/formas-pagamento-cadastro/formas-pagamento-cadastro.component';
import { RecursosPesquisaComponent } from './pages/recursos/recursos-pesquisa/recursos-pesquisa.component';
import { RecursosCadastroComponent } from './pages/recursos/recursos-cadastro/recursos-cadastro.component';
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
    AddScreensDialog
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
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
