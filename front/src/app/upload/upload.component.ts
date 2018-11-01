import {Component, OnInit} from '@angular/core';
import {FileSystemDirectoryEntry, FileSystemFileEntry, UploadEvent, UploadFile} from 'ngx-file-drop';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {SnotifyService} from 'ng-snotify';
import {Account} from '../model/Account';

@Component({
    selector: 'app-upload',
    templateUrl: './upload.component.html',
    styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {

    public files: UploadFile[] = [];
    public file: File;
    public recipient: Account;

    constructor(private http: HttpClient, private snotifyService: SnotifyService) {}

    ngOnInit() {
        this.recipient = new Account();
    }

    getRecipient(): void {
        if (this.recipient.name && this.recipient.name.length === 42) {
            this.http.get<Account>(environment.api + 'address', {
                headers: new HttpHeaders().append('content-type', 'application/json'),
                params: new HttpParams().set('address', this.recipient.name)
            }).subscribe(acc => this.recipient = acc)
        }
    }

    public dropped(event: UploadEvent) {
        this.files = event.files;
        for (const droppedFile of event.files) {

            // Is it a file?
            if (droppedFile.fileEntry.isFile) {
                const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
                fileEntry.file((file: File) => {

                    // Here you can access the real file
                    console.log(droppedFile.relativePath);
                    console.log(file);
                    this.file = file;

                    const formData = new FormData();
                    formData.append('file', this.file, this.file.name);
                    formData.append('recipient', this.recipient.address);
                    this.http.post(environment.api + 'file/upload', formData, {responseType: 'text'})
                        .subscribe(data => {
                            this.snotifyService.success('File uploaded successfully', 'Success', {
                                timeout: 2000,
                                showProgressBar: false,
                                closeOnClick: false,
                                pauseOnHover: true
                            });
                        }, error => {
                            this.snotifyService.error('Error during upload', 'Failed', {
                                timeout: 2000,
                                showProgressBar: false,
                                closeOnClick: false,
                                pauseOnHover: true
                                });
                            }
                        );
                });
            } else {
                // It was a directory (empty directories are added, otherwise only files)
                const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
                // console.log(droppedFile.relativePath, fileEntry);
            }
        }
    }

    public fileOver(event) {
        console.log(event);
    }

    public fileLeave(event) {
        console.log(event);
    }

}
