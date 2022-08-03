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
import { OcupacoesComponent } from './pages/ocupacoes/ocupacoes.component';
import { PessoasComponent } from './pages/pessoas/pessoas.component';
import { PrestadoresComponent } from './pages/prestadores/prestadores.component';
import { ProdutoComponent } from './pages/produto/produto.component';
import { AgendamentoComponent } from './pages/agendamento/agendamento.component';
import { AplicacaoComponent } from './pages/aplicacao/aplicacao.component';
import { OrcamentosComponent } from './pages/orcamentos/orcamentos.component';
import { ComprarVenderComponent } from './pages/comprar-vender/comprar-vender.component';
import { SituacaoEstoqueComponent } from './pages/situacao-estoque/situacao-estoque.component';
import { GerenciarUsuariosComponent } from './pages/gerenciar-usuarios/gerenciar-usuarios.component';
import { PerfisComponent } from './pages/perfis/perfis.component';
import { MinhaContaComponent, DialogOverviewExampleDialog } from './pages/minha-conta/minha-conta.component';


import {MaterialExampleModule} from './material.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatNativeDateModule} from '@angular/material/core';
import {HttpClientModule} from '@angular/common/http';

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
    OcupacoesComponent,
    PessoasComponent,
    PrestadoresComponent,
    ProdutoComponent,
    AgendamentoComponent,
    AplicacaoComponent,
    OrcamentosComponent,
    ComprarVenderComponent,
    SituacaoEstoqueComponent,
    GerenciarUsuariosComponent,
    PerfisComponent,
    MinhaContaComponent,
    DialogOverviewExampleDialog
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
