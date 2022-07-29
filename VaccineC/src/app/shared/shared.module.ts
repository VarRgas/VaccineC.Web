import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SideMenuComponent } from './components/side-menu/side-menu.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { ContainerComponent } from './components/container/container.component';

@NgModule({
  declarations: [
    SideMenuComponent,
    ToolbarComponent,
    FooterComponent,
    ContainerComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    SideMenuComponent,
    ToolbarComponent,
    FooterComponent,
    ContainerComponent
  ]
})
export class SharedModule { }
