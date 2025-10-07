import { Injectable, NgZone } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class IframeHeightService {
  private resizeObserver: ResizeObserver | null = null;
  private lastSentHeight = 0;
  private debounceTimer: ReturnType<typeof setTimeout> | null = null;
  private readonly DEBOUNCE_DELAY = 300;
  private readonly MIN_HEIGHT_CHANGE = 5;
  private isIframe = false;

  constructor(
    private router: Router,
    private ngZone: NgZone,
  ) {}

  initialize(): void {
    try {
      this.isIframe = window.self !== window.top;
    } catch {
      this.isIframe = true;
    }

    if (!this.isIframe) {
      return;
    }

    this.setupResizeObserver();
    this.setupRouteListener();
    this.sendInitialHeight();
  }

  private setupResizeObserver(): void {
    if (typeof ResizeObserver === 'undefined') {
      this.setupFallback();
      return;
    }

    this.ngZone.runOutsideAngular(() => {
      this.resizeObserver = new ResizeObserver(() => {
        this.handleHeightChange();
      });

      this.resizeObserver.observe(document.body);
    });
  }

  private setupFallback(): void {
    this.ngZone.runOutsideAngular(() => {
      const checkHeight = () => {
        this.handleHeightChange();
      };

      window.addEventListener('load', checkHeight);
      window.addEventListener('resize', checkHeight);

      const mutationObserver = new MutationObserver(() => {
        this.handleHeightChange();
      });

      mutationObserver.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style', 'class'],
      });
    });
  }

  private setupRouteListener(): void {
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      setTimeout(() => {
        this.handleHeightChange(true);
      }, 100);
    });
  }

  private handleHeightChange(immediate = false): void {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    const sendUpdate = () => {
      const height = this.getDocumentHeight();

      if (Math.abs(height - this.lastSentHeight) >= this.MIN_HEIGHT_CHANGE) {
        this.sendHeightUpdate(height);
        this.lastSentHeight = height;
      }
    };

    if (immediate) {
      sendUpdate();
    } else {
      this.debounceTimer = setTimeout(sendUpdate, this.DEBOUNCE_DELAY);
    }
  }

  private getDocumentHeight(): number {
    const body = document.body;
    const html = document.documentElement;

    return Math.max(
      body.scrollHeight,
      body.offsetHeight,
      html.clientHeight,
      html.scrollHeight,
      html.offsetHeight,
    );
  }

  private sendHeightUpdate(height: number): void {
    if (!this.isIframe) {
      return;
    }

    try {
      window.parent.postMessage(`height:${height + 20}`, '*');
    } catch (error) {
      console.error('Failed to send height update:', error);
    }
  }

  private sendInitialHeight(): void {
    setTimeout(() => {
      this.handleHeightChange(true);
    }, 0);
  }

  destroy(): void {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }

    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = null;
    }
  }
}
