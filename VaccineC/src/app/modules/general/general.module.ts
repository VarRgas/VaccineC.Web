import { NgModule } from "@angular/core";
import { GeneralContainerComponent } from "./general-container/general-container.component";
import { GeneralSideMenuComponent } from "./general-side-menu/general-side-menu.component";
import { GeneralToolbarComponent } from "./general-toolbar/general-toolbar.component";
import { GeneralComponent } from "./general.component";
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from "@angular/common";

@NgModule({
    imports: [
        MatToolbarModule,
        MatIconModule,
        CommonModule
    ],
    declarations: [
        GeneralContainerComponent,
        GeneralSideMenuComponent,
        GeneralComponent,
        GeneralToolbarComponent,
    ],
    exports: [
        GeneralComponent
    ],
    entryComponents: [
        GeneralComponent
    ]
})

export class GeneralModule { }
