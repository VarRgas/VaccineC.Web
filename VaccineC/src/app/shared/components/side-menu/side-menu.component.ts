import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss']
})
export class SideMenuComponent implements OnInit {

  is_toggled = "";
  isCollapsedRegistration = true;
  isCollapsedOperational = true;
  isCollapsedInventory = true;
  isCollapsedUser = true;

  constructor() { }

  ngOnInit(): void {

  }

  toggleSideNav() {
    if (this.is_toggled) {
      this.is_toggled = "";
      document.body.classList.remove('sidebar-toggled')
      document.getElementById('sidebarToggle')?.classList.remove('withdrawn')
      document.getElementById('home-topbar')?.classList.remove('home-topbar-grow')
    }
    else {
      this.is_toggled = "toggled";
      document.body.classList.add('sidebar-toggled')
      document.getElementById('sidebarToggle')?.classList.add('withdrawn')
      document.getElementById('home-topbar')?.classList.add('home-topbar-grow')
    }
  }

}
