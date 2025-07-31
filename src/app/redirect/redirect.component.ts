import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-redirect',
  standalone: true,
  imports: [],
  template: '',
})
export class RedirectComponent implements OnInit {
  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const externalUrl = this.route.snapshot.data['externalUrl'];
    window.location.href = externalUrl;
  }
}
