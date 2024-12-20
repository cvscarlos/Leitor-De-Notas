import {
  AnimationBuilder,
  AnimationFactory,
  AnimationPlayer,
  animate,
  style,
} from '@angular/animations';
import { Directive, ElementRef, EventEmitter, Input, Output, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appSlideToggle]',
  standalone: false,
})
export class SlideToggleDirective {
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

  private player: AnimationPlayer | undefined;

  constructor(
    private animBuilder: AnimationBuilder,
    private elemRef: ElementRef,
    private renderer2: Renderer2,
  ) {}

  animate(): void {
    let factory: AnimationFactory;
    const elem = this.elemRef.nativeElement;

    if (this.state === 'down') {
      this.appSlideState.emit('showing');
      this.renderer2.setStyle(elem, 'display', 'block');
      factory = this.animBuilder.build([
        style({ height: '0', overflow: 'hidden' }),
        animate(400, style({ height: '*' })),
      ]);
    } else if (this.state === 'up') {
      factory = this.animBuilder.build([
        style({ height: '*', overflow: 'hidden' }),
        animate(400, style({ height: '0' })),
      ]);
    } else {
      return;
    }

    if (this.player) {
      this.player.destroy();
    }
    this.player = factory.create(elem);

    this.player.onDone(() => {
      if (this.state === 'up') {
        this.renderer2.setStyle(elem, 'display', 'none');

        this.appSlideState.emit('hidden');
      }

      if (this.state === 'down' && this.player) {
        this.player.reset();
        this.appSlideState.emit('showed');
      }
    });

    this.player.play();
  }
}
