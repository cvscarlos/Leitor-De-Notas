import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-redirect',
  standalone: true,
  imports: [],
  template: `<p class="text-center my-5 mx-2">
    <a href="{{ externalUrl }}">redirecionando...</a>
  </p>`,
})
export class RedirectComponent implements OnInit {
  externalUrl!: string;
  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.externalUrl = this.route.snapshot.data['externalUrl'];
    window.location.href = this.externalUrl;
  }
}
