import { Component } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.less']
})
export class AppComponent {

    public headerMenuCollapsed = true;

    onActivate() {
        const routerTags = document.getElementsByTagName('router-outlet') as HTMLCollectionOf<HTMLElement>;
        if (routerTags.length) {
            window.scroll(
                0,
                Math.max(routerTags[0].offsetTop - 65, 0)
            );
        }
        else {
            window.scroll(0, 0);
        }
    }
}
