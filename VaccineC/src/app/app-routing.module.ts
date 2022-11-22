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
import { ConectionErrorComponent } from './pages/error/conection-error/conection-error.component';
import { AuthorizeGuard } from './services/authorize-guard';

const routes: Routes = [
  //canActivate: [AuthorizeGuard]: É oq vai dizer se o usuário logado vai ter acesso ou não;
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthorizeGuard] },
  { path: 'forgot-password', component: ForgotPasswordComponent },

  { path: 'formas-pagamento', component: FormasPagamentoComponent, canActivate: [AuthorizeGuard] },
  { path: 'pessoas', component: PessoasComponent, canActivate: [AuthorizeGuard] },
  { path: 'empresas', component: EmpresasComponent, canActivate: [AuthorizeGuard] },
  { path: 'produto', component: ProdutoComponent, canActivate: [AuthorizeGuard] },

  { path: 'agendamento', component: AgendamentoComponent, canActivate: [AuthorizeGuard] },
  { path: 'aplicacao', component: AplicacaoComponent, canActivate: [AuthorizeGuard] },
  { path: 'orcamentos', component: OrcamentosComponent, canActivate: [AuthorizeGuard] },

  { path: 'movimentar-estoque', component: MovimentarEstoqueComponent, canActivate: [AuthorizeGuard] },
  { path: 'situacao-estoque', component: SituacaoEstoqueComponent, canActivate: [AuthorizeGuard] },

  { path: 'gerenciar-usuarios', component: GerenciarUsuariosComponent, canActivate: [AuthorizeGuard] },
  { path: 'recursos', component: RecursosComponent, canActivate: [AuthorizeGuard]  },
  { path: 'visao-faturamento', component: VisaoFaturamentoComponent, canActivate: [AuthorizeGuard] },

  { path: 'minha-conta', component: MinhaContaComponent, canActivate: [AuthorizeGuard] },

  { path: 'not-found-404', component: NotFoundComponent, canActivate: [AuthorizeGuard] },
  { path: 'internal-server-error-500', component: InternalServerErrorComponent, canActivate: [AuthorizeGuard] },
  { path: 'unauthorized-error-401', component: UnauthorizedComponent, canActivate: [AuthorizeGuard] },
  { path: 'conection-error', component: ConectionErrorComponent, canActivate: [AuthorizeGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
