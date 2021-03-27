import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../shared/api/api.service';
import { SessionService } from '../shared/session/session.service';
import { UserComponent } from '../user/user.component';

@Component({
    selector: 'app-user-bar',
    templateUrl: './user-bar.component.html',
    styleUrls: ['./user-bar.component.less']
})
export class UserBarComponent extends UserComponent implements OnInit {

    constructor(
        protected apiService: ApiService,
        public sessionService: SessionService,
        protected router: Router,
    ) {
        super(apiService, sessionService, router);
    }

    ngOnInit() {
        super.ngOnInit();
    }

    public logout(): void {
        this.sessionService.logout();
        window.location.href = '/';
    }
}
