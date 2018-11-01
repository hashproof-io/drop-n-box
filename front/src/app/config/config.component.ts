import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Account} from '../model/Account';
import {SnotifyService} from 'ng-snotify';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss']
})
export class ConfigComponent implements OnInit {

    public accounts: Account[];
    public sender: Account = new Account();
    public password: string;

    constructor(private http: HttpClient, private snotifyService: SnotifyService) {}

    ngOnInit(): void {
        this.getAccounts();
        this.getSender();
    }

    getAccounts(): void {
        this.http.get<Account[]>(environment.api + 'address/all')
            .subscribe(accs => this.accounts = accs)
    }

    getSender(): void {
        this.http.get<Account>(environment.api + 'address/sender')
            .subscribe(sender => this.sender = sender )
    }

    setSender(): void {
        const formData = new FormData();
        formData.append('address', this.sender.address);
        formData.append('password', this.password);
        this.http.post<Account>(environment.api + 'address/sender', formData, {})
            .subscribe(data => this.snotifyService.success('Changed to ' + data.address.substr(0, 6) + '...', 'Success', {
                timeout: 2000,
                showProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true
            }), error => this.snotifyService.error('Error during change', 'Failed', {
                timeout: 2000,
                showProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true
            }));
    }
}
