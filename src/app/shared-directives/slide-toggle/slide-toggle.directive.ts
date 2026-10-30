import {
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  Renderer2,
  inject,
} from '@angular/core';

@Directive({ selector: '[appSlideToggle]', standalone: true })
export class SlideToggleDirective {
  private elemRef = inject(ElementRef);
  private renderer2 = inject(Renderer2);

  @Input('appSlideToggle') set setState(state: string | boolean | null | undefined) {
    if (state === true || state === 'show') {
      this.state = 'down';
    } else if (state === false || state === 'hide') {
      this.state = 'up';
    } else {
      this.state = state || '';
    }

    this.animate();
  }

  @Output() appSlideState = new EventEmitter<string>();

  private state = '';

  private animation: Animation | undefined;

  animate(): void {
    const elem: HTMLElement = this.elemRef.nativeElement;

    if (this.state !== 'down' && this.state !== 'up') {
      return;
    }

    this.animation?.cancel();

    if (this.state === 'down') {
      this.appSlideState.emit('showing');
      this.renderer2.setStyle(elem, 'display', 'block');
    }

    const height = `${elem.offsetHeight}px`;
    const [from, to] = this.state === 'down' ? ['0', height] : [height, '0'];
    const frames = [
      { height: from, overflow: 'hidden' },
      { height: to, overflow: 'hidden' },
    ];
    // fill: 'forwards' segura a altura 0 até o display: none entrar, sem piscar o conteúdo
    const animation = elem.animate(frames, { duration: 400, fill: 'forwards' });
    this.animation = animation;

    animation.onfinish = () => {
      if (this.state === 'up') {
        this.renderer2.setStyle(elem, 'display', 'none');

        this.appSlideState.emit('hidden');
      }

      if (this.state === 'down') {
        // Solta a altura fixa para o conteúdo voltar a crescer/encolher sozinho
        animation.cancel();
        this.appSlideState.emit('showed');
      }
    };
  }
}
