import { Component, inject } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faSun, faMoon, faCircleHalfStroke } from '@fortawesome/free-solid-svg-icons';
import { ThemeService } from '../../services/theme/theme.service';

@Component({
  selector: 'app-theme-toggle',
  imports: [FaIconComponent],
  templateUrl: './theme-toggle.component.html',
  styleUrl: './theme-toggle.component.less',
})
export class ThemeToggleComponent {
  protected themeService = inject(ThemeService);
  protected faSun = faSun;
  protected faMoon = faMoon;
  protected faCircleHalfStroke = faCircleHalfStroke;

  protected get icon() {
    switch (this.themeService.mode()) {
      case 'light':
        return this.faSun;
      case 'dark':
        return this.faMoon;
      default:
        return this.faCircleHalfStroke;
    }
  }

  protected get label(): string {
    switch (this.themeService.mode()) {
      case 'light':
        return 'Claro';
      case 'dark':
        return 'Escuro';
      default:
        return 'Sistema';
    }
  }
}
