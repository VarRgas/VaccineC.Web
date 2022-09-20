import { Component, OnInit } from '@angular/core';
import { NotificationModel } from 'src/app/models/notification-model';
import { NotificationsDispatcherService } from 'src/app/services/notification-dispatcher.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

  public userId = "";
  public userPersonName = "";
  public userPersonProfilePic = "";

  public notifications: any;

  public isShowNotificationUser = false;
  public newNotifications!: number;
  public isNewNotification = true;
  public displayNone = "";

  constructor(
    private notificationDispatcherService: NotificationsDispatcherService
  ) { }

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
      },
      error => {
        console.log(error);
      });
  }

  remove(id: string) {
    this.notificationDispatcherService.delete(id).subscribe(
      notifications => {
        this.notifications = notifications;
        if (notifications.length != 0) {

          this.displayNone = "none !important";
        } else {
          this.displayNone = "";
        }
      },
      error => {
        console.log(error);
      });
  }

  hideBadge() {
    this.isNewNotification = true;
  }

}
