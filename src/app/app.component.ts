import { Component } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.less']
})
export default class AppComponent {

    public headerMenuCollapsed = true;

    onActivate() {
        window.scroll(0, 0);
    }
}
