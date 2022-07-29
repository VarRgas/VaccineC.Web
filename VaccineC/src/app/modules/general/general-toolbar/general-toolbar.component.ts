import { Component } from "@angular/core";

@Component({
  selector: 'general-toolbar-component',
  templateUrl: 'general-toolbar.component.html',
  styleUrls: ['general-toolbar.component.scss']
})

export class GeneralToolbarComponent {
  public sideButtonIsOpened: boolean = false;


  public openSideNav(): void {

  }
}
