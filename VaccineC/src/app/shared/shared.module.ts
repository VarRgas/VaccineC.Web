import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SideMenuComponent } from './components/side-menu/side-menu.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { ContainerComponent } from './components/container/container.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CollapseModule } from 'ngx-bootstrap/collapse';

@NgModule({
  declarations: [
    SideMenuComponent,
    ToolbarComponent,
    FooterComponent,
    ContainerComponent
  ],
  imports: [
    CommonModule,

    BsDropdownModule.forRoot(),
    CollapseModule.forRoot(),
  ],
  exports: [
    SideMenuComponent,
    ToolbarComponent,
    FooterComponent,
    ContainerComponent
  ]
})
export class SharedModule { }
