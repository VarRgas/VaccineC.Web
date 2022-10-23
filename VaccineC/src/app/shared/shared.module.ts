import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SideMenuComponent } from './components/side-menu/side-menu.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { EditPersonDialog } from './edit-person-modal/edit-person-dialog';
import { ContainerComponent } from './components/container/container.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ConfirmModalComponent } from './confirm-modal/confirm-modal.component';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { MaterialExampleModule } from '../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    SideMenuComponent,
    ToolbarComponent,
    FooterComponent,
    ContainerComponent,
    ConfirmModalComponent,
    EditPersonDialog
  ],
  imports: [
    CommonModule,
    MatIconModule,
    BsDropdownModule.forRoot(),
    CollapseModule.forRoot(),
    ModalModule.forRoot(),
    MatCardModule,
    MatProgressBarModule,
    MatProgressBarModule,
    MatFormFieldModule,
    MatChipsModule,
    MaterialExampleModule,
    FormsModule,
    ReactiveFormsModule
    ],
  exports: [
    SideMenuComponent,
    ToolbarComponent,
    FooterComponent,
    ContainerComponent,
    ConfirmModalComponent,
    EditPersonDialog
  ],
  bootstrap: [ConfirmModalComponent]
})
export class SharedModule { }
