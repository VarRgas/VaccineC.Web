import { NgModule } from "@angular/core";
import { HomeDashboardComponent } from "./home-dashboard/home-dashboard.component";
import { HomeSideMenuComponent } from "./home-side-menu/home-side-menu.component";
import { HomeToolbarComponent } from "./home-toolbar/home-toolbar.component";
import { HomeComponent } from "./home.component";

@NgModule({
    imports: [],
    declarations: [
        HomeDashboardComponent,
        HomeSideMenuComponent,
        HomeComponent,
        HomeToolbarComponent
    ],
    exports: [
        HomeComponent
    ],
    entryComponents: [
        HomeComponent
    ]
})

export class HomeModule { }
