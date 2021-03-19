import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import ApiService from '../shared/api/api.service';
import GenericObject from '../shared/generic-object.interface';
import SessionService from '../shared/session/session.service';

@Component({
    selector: 'app-user',
    template: '<b>User Component</b>',
})
export default class UserComponent implements OnInit {

    public user: GenericObject = {};
    public loading = false;

    constructor(
        protected apiService: ApiService,
        public sessionService: SessionService,
        protected router: Router,
    ) { }

    ngOnInit(): void {
        this.loading = true;

        this.apiService.userMe().then((data: GenericObject) => {
            this.user = data;
            this.loading = false;

            if (this.sessionService.isAuthenticated && !data.termsAccepted) {
                this.router.navigate(['privacidade-termos']);
            }
        });
    }
}
