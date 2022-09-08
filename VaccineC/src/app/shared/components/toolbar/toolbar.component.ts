import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

  public userId = "";
  public userPersonName = "";
  public userPersonProfilePic = "";

  public imagePathUrl = 'http://localhost:5000/';
  public imagePathUrlDefault = "../../../../assets/img/default-profile-pic.png";

  constructor() { }

  ngOnInit(): void {
    
    this.userId = localStorage.getItem('userId')!;
    this.userPersonName = localStorage.getItem('name')!;

    if(localStorage.getItem('profilePic') == "null"){
      this.userPersonProfilePic = `${this.imagePathUrlDefault}`;
    }else{
      let profilePic = localStorage.getItem('profilePic')!;
      this.userPersonProfilePic = `${this.imagePathUrl}${profilePic}`
    }
  }

  onHidden(): void {

  }

  onShown(): void {

  }

  isOpenChange(): void {
   
  }

}
