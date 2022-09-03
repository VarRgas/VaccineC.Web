import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.scss']
})
export class ContainerComponent implements OnInit, OnChanges {

  isInformationHidden = true;

  @Input()
  containerTitle!: string;

  @Input()
  containerPath!: string;

  @Input()
  information!: string;

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.information.currentValue == "") {
      this.isInformationHidden = true;
    } else {
      this.isInformationHidden = false;
    }
  }

  ngOnInit(): void {
    this.isInformationHidden = true;
  }

}
