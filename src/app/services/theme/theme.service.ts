import { Injectable, signal, effect, OnDestroy } from '@angular/core';

export type ThemeMode = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService implements OnDestroy {
  private readonly STORAGE_KEY = 'theme-preference';
  private mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  private mediaListener = (e: MediaQueryListEvent) => this.onSystemChange(e);

  readonly mode = signal<ThemeMode>(this.getStoredMode());
  readonly resolvedTheme = signal<ResolvedTheme>(this.resolve(this.getStoredMode()));

  constructor() {
    this.mediaQuery.addEventListener('change', this.mediaListener);
    effect(() => {
      const m = this.mode();
      localStorage.setItem(this.STORAGE_KEY, m);
      this.resolvedTheme.set(this.resolve(m));
      this.apply(this.resolve(m));
    });
  }

  ngOnDestroy(): void {
    this.mediaQuery.removeEventListener('change', this.mediaListener);
  }

  toggle(): void {
    const order: ThemeMode[] = ['system', 'light', 'dark'];
    const next = order[(order.indexOf(this.mode()) + 1) % order.length];
    this.mode.set(next);
  }

  private getStoredMode(): ThemeMode {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored === 'light' || stored === 'dark' || stored === 'system') return stored;
    return 'system';
  }

  private resolve(mode: ThemeMode): ResolvedTheme {
    if (mode === 'system') return this.mediaQuery.matches ? 'dark' : 'light';
    return mode;
  }

  private apply(theme: ResolvedTheme): void {
    const html = document.documentElement;
    html.setAttribute('data-bs-theme', theme);
    html.classList.toggle('dark-theme', theme === 'dark');
  }

  private onSystemChange(e: MediaQueryListEvent): void {
    if (this.mode() === 'system') {
      const resolved = e.matches ? 'dark' : 'light';
      this.resolvedTheme.set(resolved);
      this.apply(resolved);
    }
  }
}
