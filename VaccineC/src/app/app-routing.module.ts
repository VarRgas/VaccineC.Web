import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';

import { FormasPagamentoComponent } from './pages/formas-pagamento/formas-pagamento.component';
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

import { NotFoundComponent } from './pages/error/not-found/not-found.component';
import { InternalServerErrorComponent } from './pages/error/internal-server-error/internal-server-error.component';
import { UnauthorizedComponent } from './pages/error/unauthorized/unauthorized.component';
import { MinhaContaComponent } from './pages/minha-conta/minha-conta.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },

  { path: 'formas-pagamento', component: FormasPagamentoComponent },
  { path: 'ocupacoes', component: OcupacoesComponent },
  { path: 'pessoas', component: PessoasComponent },
  { path: 'prestadores', component: PrestadoresComponent },
  { path: 'produto', component: ProdutoComponent },

  { path: 'agendamento', component: AgendamentoComponent },
  { path: 'aplicacao', component: AplicacaoComponent },
  { path: 'orcamentos', component: OrcamentosComponent },

  { path: 'comprar-vender', component: ComprarVenderComponent },
  { path: 'situacao-estoque', component: SituacaoEstoqueComponent },

  { path: 'gerenciar-usuarios', component: GerenciarUsuariosComponent },
  { path: 'perfis', component: PerfisComponent },

  { path: 'minha-conta', component: MinhaContaComponent },

  { path: 'not-found-404', component: NotFoundComponent },
  { path: 'internal-server-error-500', component: InternalServerErrorComponent },
  { path: 'unauthorized-error-401', component: UnauthorizedComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
