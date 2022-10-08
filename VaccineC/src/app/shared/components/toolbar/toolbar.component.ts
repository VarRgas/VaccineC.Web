import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, map, Observable, startWith, switchMap } from 'rxjs';
import { NotificationModel } from 'src/app/models/notification-model';
import { NotificationsDispatcherService } from 'src/app/services/notification-dispatcher.service';
import { ResourceAutocompleteService } from 'src/app/services/resource-autocomplete.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

  public userId = "";
  public userPersonName = "";
  public userPersonProfilePic = "";
  public ResourcesId!: string;


  public notifications: any;

  public isShowNotificationUser = false;
  public newNotifications!: number;
  public isNewNotification = true;
  public displayNone = "";

  myControl = new FormControl();
  options: string[] = [];
  filteredOptions: Observable<any[]> | undefined;

  constructor(
    private notificationDispatcherService: NotificationsDispatcherService,
    private router: Router,
    private resourceAutocompleteService: ResourceAutocompleteService
  ) {

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(val => {
        return this.filter(val || '')
      })
    )
  }

  ngOnInit(): void {
    this.setUserInformations();
  }

  setUserInformations(): void {

    const imagePathUrl = 'http://localhost:5000/';
    const imagePathUrlDefault = "../../../../assets/img/default-profile-pic.png";

    this.userId = localStorage.getItem('userId')!;

    let userPersonName = localStorage.getItem('name')!;
    let userPersonNameArray = userPersonName.split(" ");

    if (userPersonNameArray.length == 1) {
      this.userPersonName = userPersonName;
    } else {
      this.userPersonName = userPersonNameArray[0] + " " + userPersonNameArray[userPersonNameArray.length - 1];
    }

    if (localStorage.getItem('profilePic') == "null") {
      this.userPersonProfilePic = `${imagePathUrlDefault}`;
    } else {
      let profilePic = localStorage.getItem('profilePic')!;
      this.userPersonProfilePic = `${imagePathUrl}${profilePic}`
    }

    if (localStorage.getItem('showNotification') == "S") {
      this.isShowNotificationUser = false;
      this.getUserNotifications();
    } else {
      this.isShowNotificationUser = true;
    }
  }

  getUserNotifications(): void {

    this.notificationDispatcherService.getAllNotificationsByUserId(this.userId).subscribe(
      notifications => {
        this.notifications = notifications;
        this.treatNotifications(notifications);
      },
      error => {
        console.log(error);
      });

  }

  markAsRead(id: string, userId: string, message: string, messageType: string) {

    let notification = new NotificationModel();
    notification.id = id;
    notification.userId = userId;
    notification.message = message;
    notification.messageType = messageType;
    notification.situation = "L";

    this.notificationDispatcherService.update(id, notification).subscribe(
      notifications => {
        this.notifications = notifications;
        this.treatNotifications(notifications);
      },
      error => {
        console.log(error);
      });
  }

  remove(id: string) {
    this.notificationDispatcherService.delete(id).subscribe(
      notifications => {
        this.notifications = notifications;
        this.treatNotifications(notifications);
      },
      error => {
        console.log(error);
      });
  }

  treatNotifications(notifications: any) {

    if (notifications.length != 0) {

      this.displayNone = "none !important";
      let count = 0;

      notifications.forEach((notification: any) => {
        if (notification.Situation == "X") {
          count++;
        }
      });

      if (count != 0) {
        this.isNewNotification = false;
      } else {
        this.isNewNotification = true;
      }
      this.newNotifications = count;

    } else {
      this.displayNone = "";
    }
  }

  logout() {
    localStorage.clear();
    console.log(localStorage);
    this.router.navigateByUrl('/login');
  }


  searchResourceByAutoComplete() {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(val => {
        return this.filter(val || '')
      })
    )
  }

  filter(val: string): Observable<any[]> {
    // call the service which makes the http-request
    return this.resourceAutocompleteService.getResourceData()
      .pipe(
        map(response => response.filter((option: { Name: string; ID: string }) => {
          return option.Name.toLowerCase().indexOf(val.toString().toLowerCase()) === 0
        }))
      )
  }

  displayState(state: any) {
    return state && state.Name ? state.Name : '';
  }


  onSelectionChanged(event: MatAutocompleteSelectedEvent) {
    let url = event.option.value.UrlName.split("/")[1];
    this.router.navigateByUrl(url);
  }

}
