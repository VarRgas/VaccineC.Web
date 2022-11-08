import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as $ from 'jquery';
import { UserResourceService } from 'src/app/services/user-resource.service';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss']
})
export class SideMenuComponent implements OnInit {

  public listRegistration = new Array();
  public listOperational = new Array();
  public listInventory = new Array();
  public listManagement = new Array();

  public isRegistrationVisible = false;
  public isOperationalVisible = false;
  public isInventoryVisible = false;
  public isManagementVisible = false;

  is_toggled = "toggled";
  isCollapsedRegistration = true;
  isCollapsedOperational = true;
  isCollapsedInventory = true;
  isCollapsedManagement = true;

  constructor(
    private router: Router,
    private userResourceService: UserResourceService
  ) { }

  ngOnInit(): void {
    this.getUserResourceMenu();
  }

  public getUserResourceMenu() {
    this.userResourceService.getResourcesMenuByUser(localStorage.getItem('userId')!).subscribe(
      response => {
        console.log(response);
        if (response.listRegistration.length > 0) {
          this.isRegistrationVisible = true;
          this.listRegistration = response.listRegistration;
        } else {
          this.isRegistrationVisible = false;
        }

        if (response.listOperational.length > 0) {
          this.isOperationalVisible = true;
          this.listOperational = response.listOperational;
        } else {
          this.isOperationalVisible = false;
        }

        if (response.listInventory.length > 0) {
          this.isInventoryVisible = true;
          this.listInventory = response.listInventory;
        } else {
          this.isInventoryVisible = false;
        }

        if (response.listManagement.length > 0) {
          this.isManagementVisible = true;
          this.listManagement = response.listManagement;
        } else {
          this.isManagementVisible = false;
        }
      }, error => {
        console.log(error);
      });
  }

  logout() {
    localStorage.clear();
    this.router.navigateByUrl('/login');
  }

  collapses(): void {
    document.getElementsByClassName('nav-link-menu')[0].classList.remove('collapsed');
    document.getElementsByClassName('nav-link-menu')[0].classList.add('collapsed');
  }

  expands(): void {
    document.getElementsByClassName('nav-link-menu')[0].classList.add('collapsed');
    document.getElementsByClassName('nav-link-menu')[0].classList.remove('collapsed');
  }

  collapses2(): void {
    document.getElementsByClassName('nav-link-menu')[1].classList.remove('collapsed');
    document.getElementsByClassName('nav-link-menu')[1].classList.add('collapsed');
  }

  expands2(): void {
    document.getElementsByClassName('nav-link-menu')[1].classList.add('collapsed');
    document.getElementsByClassName('nav-link-menu')[1].classList.remove('collapsed');
  }

  collapses3(): void {
    document.getElementsByClassName('nav-link-menu')[2].classList.remove('collapsed');
    document.getElementsByClassName('nav-link-menu')[2].classList.add('collapsed');
  }

  expands3(): void {
    document.getElementsByClassName('nav-link-menu')[2].classList.add('collapsed');
    document.getElementsByClassName('nav-link-menu')[2].classList.remove('collapsed');
  }

  collapses4(): void {
    document.getElementsByClassName('nav-link-menu')[3].classList.remove('collapsed');
    document.getElementsByClassName('nav-link-menu')[3].classList.add('collapsed');
  }

  expands4(): void {
    document.getElementsByClassName('nav-link-menu')[3].classList.add('collapsed');
    document.getElementsByClassName('nav-link-menu')[3].classList.remove('collapsed');
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
    } else {
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
