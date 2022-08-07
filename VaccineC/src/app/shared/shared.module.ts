import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SideMenuComponent } from './components/side-menu/side-menu.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { ContainerComponent } from './components/container/container.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ConfirmModalComponent } from './confirm-modal/confirm-modal.component';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [
    SideMenuComponent,
    ToolbarComponent,
    FooterComponent,
    ContainerComponent,
    ConfirmModalComponent
  ],
  imports: [
    CommonModule,
    MatIconModule,
    BsDropdownModule.forRoot(),
    CollapseModule.forRoot(),
    ModalModule.forRoot()
  ],
  exports: [
    SideMenuComponent,
    ToolbarComponent,
    FooterComponent,
    ContainerComponent,
    ConfirmModalComponent
  ],
  bootstrap: [ConfirmModalComponent]
})
export class SharedModule { }
