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

  constructor() { }

  ngOnInit(): void {
    
    this.userId = localStorage.getItem('userId')!;
    console.log(this.userId)
    this.userPersonName = localStorage.getItem('name')!;

    if(localStorage.getItem('profilePic') == "null"){
      this.userPersonProfilePic = "../../../../assets/img/default-profile-pic.png";
    }else{
      this.userPersonProfilePic = localStorage.getItem('profilePic')!;
    }
  }

  onHidden(): void {

  }

  onShown(): void {

  }

  isOpenChange(): void {
   
  }

}
