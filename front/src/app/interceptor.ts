import {Injectable} from '@angular/core';
import {HttpInterceptor, HttpHandler, HttpRequest, HttpEvent, HttpResponse, HttpClient}
    from '@angular/common/http';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import {NgxSpinnerService} from 'ngx-spinner';

@Injectable()
export class SpinnerInterceptor implements HttpInterceptor {

    constructor(private spinner: NgxSpinnerService) {
    }

    intercept(
        req: HttpRequest<any>,
        next: HttpHandler,
    ): Observable<HttpEvent<any>> {
        return next.handle(req).do(evt => {
            if (evt instanceof HttpResponse ) {
                setTimeout(() => this.spinner.hide(), 1000);
            } else {
                this.spinner.show();
            }
        }, error => {
            this.spinner.hide();
        });

    }
}
