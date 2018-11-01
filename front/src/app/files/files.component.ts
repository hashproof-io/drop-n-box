import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Box} from '../model/Box';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import {SnotifyService} from 'ng-snotify';

@Component({
    selector: 'app-files',
    templateUrl: './files.component.html',
    styleUrls: ['./files.component.scss']
})
export class FilesComponent implements OnInit {

    private sentBoxes: Box [];
    private receivedBoxes: Box [];

    constructor(private http: HttpClient, private snotifyService: SnotifyService) {
    }

    ngOnInit() {
        const sBoxes = this.http.get <Box[]>(environment.api + 'boxes', {params: {sender: 'false'}});
        const mBoxes = this.http.get <Box[]>(environment.api + 'boxes', {params: {sender: 'true'}});
        Observable.forkJoin([sBoxes, mBoxes])
            .subscribe(boxes => {
                this.sentBoxes = boxes[0];
                this.receivedBoxes = boxes[1];
            }, error => console.log(error) );
    }

    download(box: Box): void {
        console.log('Downloading the box: ' + box.address);
        this.http.get(environment.api + 'box', {params: {boxAddress: box.address}, responseType: 'arraybuffer'})
            .subscribe(response => this.downLoadFile(response, 'application/ms-excel'));
    }

    downLoadFile(data: any, type: string) {
        const blob = new Blob([data], { type: type});
        const url = window.URL.createObjectURL(blob);
        const pwa = window.open(url);
        if (!pwa || pwa.closed || typeof pwa.closed === 'undefined') {
            alert( 'Please disable your Pop-up blocker and try again.');
        }
    }

    openRequest(box: Box): void {
        this.http.get(environment.api + 'box/request', {params: {boxAddress: box.address}, responseType: 'text'})
            .subscribe(response => {
                this.snotifyService.success('Request sent', 'Success', {
                    timeout: 2000,
                    showProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true
                });
            }, e => {
                this.snotifyService.error('Error during request', 'Error', {
                    timeout: 2000,
                    showProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true
                });
            });
    }

    approve(box: Box): void {
        this.http.get(environment.api + 'box/approve', {params: {boxAddress: box.address}, responseType: 'text'})
            .subscribe(response => {
                alert(response);
            }, e => console.log(e));
    }

}
