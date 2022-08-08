import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss']
})
export class SideMenuComponent implements OnInit {

  is_toggled = "toggled";
  isCollapsedRegistration = true;
  isCollapsedOperational = true;
  isCollapsedInventory = true;
  isCollapsedManagement = true;

  constructor() { }

  ngOnInit(): void {

  }

  collapses(): void {
    document.getElementsByClassName('nav-link-menu')[0].classList.remove('collapsed');
    document.getElementsByClassName('nav-link-menu')[0].classList.add('collapsed');
  }

  expands(): void {
    document.getElementsByClassName('nav-link-menu')[0].classList.add('collapsed');
    document.getElementsByClassName('nav-link-menu')[0].classList.remove('collapsed');
  }

  toggleSideNav() {
    if (this.is_toggled) {
      this.is_toggled = "";
      document.body.classList.remove('sidebar-toggled')
      document.getElementById('sidebarToggle')?.classList.remove('withdrawn')
      document.getElementById('home-topbar')?.classList.remove('home-topbar-grow')
      document.getElementById('is-content')?.classList.remove('is-content-grow')
      document.getElementById('is-footer')?.classList.remove('is-footer-grow')

      if (!!document.getElementById('center')) {
        document.getElementById('center')?.classList.remove('container-expand');
        document.getElementById('center')?.classList.add('container-retract');
      }
    }else {
      this.is_toggled = "toggled";
      document.body.classList.add('sidebar-toggled')
      document.getElementById('sidebarToggle')?.classList.add('withdrawn')
      document.getElementById('home-topbar')?.classList.add('home-topbar-grow')
      document.getElementById('is-content')?.classList.add('is-content-grow')
      document.getElementById('is-footer')?.classList.add('is-footer-grow')

      if (!!document.getElementById('center')) {
        document.getElementById('center')?.classList.add('container-expand');
        document.getElementById('center')?.classList.remove('container-retract');
      }

    }
  }

}
