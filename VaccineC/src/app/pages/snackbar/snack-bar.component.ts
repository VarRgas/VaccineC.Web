import { Component, Inject } from "@angular/core";
import {
  MAT_SNACK_BAR_DATA,
  MatSnackBarRef
} from "@angular/material/snack-bar";

@Component({
  selector: "snack-bar-component",
  templateUrl: "./snack-bar.component.html",
  styleUrls: ["./snack-bar.component.scss"]
})
export class SnackBarComponent {
  progress = 100;
  private currentIntervalId: any;

  /** Data that was injected into the snack bar. */
  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: any,
    private snackBarRef: MatSnackBarRef<SnackBarComponent>
  ) {
    this.snackBarRef.afterOpened().subscribe(
      () => {
        const duration = this.snackBarRef.containerInstance.snackBarConfig.duration;
        this.runProgressBar(duration);
      },
      error => console.error(error)
    );
  }

  dismissWithAction() {
    this.cleanProgressBarInterval();
    this.snackBarRef.dismissWithAction();
  }

  /**
   * @param duration - in milliseconds
   */
  runProgressBar(duration: any) {
    this.progress = 100;
    const step = 0.005;
    this.cleanProgressBarInterval();
    this.currentIntervalId = setInterval(() => {
      this.progress -= 100 * step;
      if (this.progress < 0) {
        this.cleanProgressBarInterval();
      }
    }, duration * step);
  }

  cleanProgressBarInterval() {
    clearInterval(this.currentIntervalId);
    //console.log("progress bar interval(...) cleaned!");
  }
}
