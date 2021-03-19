import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-loading',
    templateUrl: './loading.component.html',
    styleUrls: ['./loading.component.less']
})
export default class LoadingComponent implements OnInit {

    @Input() show = false;

    constructor() { }

    ngOnInit(): void { }

}
