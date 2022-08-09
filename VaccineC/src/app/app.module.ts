import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { RouterModule } from '@angular/router';

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
import { PessoasComponent } from './pages/pessoas/pessoas.component';
import { EmpresasComponent } from './pages/empresa/empresas.component';
import { ProdutoComponent } from './pages/produto/produto.component';
import { AgendamentoComponent } from './pages/agendamento/agendamento.component';
import { AplicacaoComponent } from './pages/aplicacao/aplicacao.component';
import { OrcamentosComponent } from './pages/orcamentos/orcamentos.component';
import { MovimentarEstoqueComponent } from './pages/movimentar-estoque/movimentar-estoque.component';
import { SituacaoEstoqueComponent } from './pages/situacao-estoque/situacao-estoque.component';
import { GerenciarUsuariosComponent } from './pages/gerenciar-usuarios/gerenciar-usuarios.component';
import { RecursosComponent } from './pages/recursos/recursos.component';
import { MinhaContaComponent } from './pages/minha-conta/minha-conta.component';

import { MaterialExampleModule } from './material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { HttpClientModule } from '@angular/common/http';
import { VisaoFaturamentoComponent } from './pages/visao-faturamento/visao-faturamento.component';
import { PessoasPesquisaComponent } from './pages/pessoas/pessoas-pesquisa/pessoas-pesquisa.component';
import { PessoasCadastroComponent } from './pages/pessoas/pessoas-cadastro/pessoas-cadastro.component';
import { PessoasComplementoComponent } from './pages/pessoas/pessoas-complemento/pessoas-complemento.component';
import { PessoasTelefonesComponent,  DialogContentPhoneDialog} from './pages/pessoas/pessoas-telefones/pessoas-telefones.component';
import { PessoasEnderecosComponent, DialogContentAddressDialog } from './pages/pessoas/pessoas-enderecos/pessoas-enderecos.component';
import { FormasPagamentoPesquisaComponent } from './pages/formas-pagamento/formas-pagamento-pesquisa/formas-pagamento-pesquisa.component';
import { FormasPagamentoCadastroComponent } from './pages/formas-pagamento/formas-pagamento-cadastro/formas-pagamento-cadastro.component';
import { RecursosPesquisaComponent } from './pages/recursos/recursos-pesquisa/recursos-pesquisa.component';
import { RecursosCadastroComponent } from './pages/recursos/recursos-cadastro/recursos-cadastro.component';
import { EmpresaCadastroComponent } from './pages/empresa/empresa-cadastro/empresa-cadastro.component';
import { EmpresaPesquisaComponent } from './pages/empresa/empresa-pesquisa/empresa-pesquisa.component';
import { EmpresaParametrosComponent } from './pages/empresa/empresa-parametros/empresa-parametros.component';
import { EmpresaAgendaComponent } from './pages/empresa/empresa-agenda/empresa-agenda.component';

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
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
