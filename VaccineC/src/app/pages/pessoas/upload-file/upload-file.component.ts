import { HttpClient, HttpEventType } from "@angular/common/http";
import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { MessageHandlerService } from "src/app/services/message-handler.service";

@Component({
  selector: 'app-upload-file',
  templateUrl: 'upload-file.component.html',
  styleUrls: ['upload-file.component.scss']
})
export class UploadFileComponent implements OnInit {

  public message!: string;
  public progress!: number;
  @Output() public onUploadFinished = new EventEmitter();

  constructor(private http: HttpClient, private messageHandler: MessageHandlerService) { }

  ngOnInit(): void {

  }

  public uploadFile = (files: any) => {

    if (files.length === 0)
      return;

    let fileType = files[0].type.split("/")[1];
    
    if (fileType == "jpg" || fileType == "jpeg" || fileType == "png") {

      let fileToUpload = <File>files[0];
      const formData = new FormData();
      formData.append('file', fileToUpload, fileToUpload.name);

      this.http.post('http://localhost:5000/api/Files', formData, { reportProgress: true, observe: 'events' })
        .subscribe(event => {
          if (event.type === HttpEventType.UploadProgress) {
            this.progress = Math.round(100 * event.loaded / event.total!);
          }
          else if (event.type === HttpEventType.Response) {
            this.message = 'Upload feito com sucesso!';
            this.messageHandler.showMessage(this.message, "success-snackbar")
            this.onUploadFinished.emit(event.body);
          }
        });
        
    } else {
      this.messageHandler.showMessage("Imagem deve ser no formato .jpg, .jpeg ou .png!", "warning-snackbar")
      return;
    }
  }
}
