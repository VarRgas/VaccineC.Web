import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';

import { FormasPagamentoComponent } from './pages/formas-pagamento/formas-pagamento.component';
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
import { VisaoFaturamentoComponent } from './pages/visao-faturamento/visao-faturamento.component';

import { NotFoundComponent } from './pages/error/not-found/not-found.component';
import { InternalServerErrorComponent } from './pages/error/internal-server-error/internal-server-error.component';
import { UnauthorizedComponent } from './pages/error/unauthorized/unauthorized.component';
import { MinhaContaComponent } from './pages/minha-conta/minha-conta.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },

  { path: 'formas-pagamento', component: FormasPagamentoComponent },
  { path: 'pessoas', component: PessoasComponent },
  { path: 'empresas', component: EmpresasComponent },
  { path: 'produto', component: ProdutoComponent },

  { path: 'agendamento', component: AgendamentoComponent },
  { path: 'aplicacao', component: AplicacaoComponent },
  { path: 'orcamentos', component: OrcamentosComponent },

  { path: 'movimentar-estoque', component: MovimentarEstoqueComponent },
  { path: 'situacao-estoque', component: SituacaoEstoqueComponent },

  { path: 'gerenciar-usuarios', component: GerenciarUsuariosComponent },
  { path: 'recursos', component: RecursosComponent },
  { path: 'visao-faturamento', component: VisaoFaturamentoComponent },

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
