// classes-responsive-hider.ts
export type HiderOptions = {
  /** Имена классов без точки: ['header', 'promo', 'footer'] */
  classNames: string[];
  /** Брэйкпоинт (px), по умолчанию 375 */
  breakpoint?: number;
  /** Класс скрытия, по умолчанию 'visually-hidden' */
  hiddenClass?: string;
};

export class ClassesResponsiveHider {
  private classMap = new Map<string, HTMLElement[]>();
  private mq: MediaQueryList | null = null;
  private hiddenClass: string;
  private breakpoint: number;
  private boundHandler?: (e: MediaQueryListEvent | MediaQueryList) => void;

  constructor(options: HiderOptions) {
    const { classNames, breakpoint = 768, hiddenClass = 'visually-hidden' } = options;

    if (!classNames || classNames.length === 0) {
      throw new Error('Передай хотя бы одно имя класса в "classNames".');
    }

    this.breakpoint = breakpoint;
    this.hiddenClass = hiddenClass;

    // первичный сбор элементов по каждому классу
    classNames.forEach((name) => {
      const els = Array.from(document.querySelectorAll<HTMLElement>(`.${name}`));
      this.classMap.set(name, els);
    });
  }

  /** Запустить логику: подписка на изменения и моментальное применение */
  public init(): void {
    if (typeof window === 'undefined' || typeof window.matchMedia === 'undefined') return;

    this.mq = window.matchMedia(`(max-width: ${this.breakpoint}px)`);
    this.boundHandler = (e) => {
      const matches = 'matches' in e ? e.matches : (e as MediaQueryList).matches;
      this.apply(matches);
    };

    // подписка (современный / старый API)
    if ('addEventListener' in this.mq) {
      this.mq.addEventListener('change', this.boundHandler);
    } else {
      // @ts-ignore — для старых браузеров
      this.mq.addListener(this.boundHandler);
    }

    // применяем текущее состояние сразу
    this.apply(this.mq.matches);
  }

  /** Пересканировать DOM (если появились/исчезли элементы нужных классов) */
  public update(): void {
    this.classMap.forEach((_els, name) => {
      const fresh = Array.from(document.querySelectorAll<HTMLElement>(`.${name}`));
      this.classMap.set(name, fresh);
    });
    if (this.mq) this.apply(this.mq.matches);
  }

  /** Отписаться от слушателей */
  public destroy(): void {
    if (!this.mq || !this.boundHandler) return;
    if ('removeEventListener' in this.mq) {
      this.mq.removeEventListener('change', this.boundHandler);
    } else {
      // @ts-ignore — для старых браузеров
      this.mq.removeListener(this.boundHandler);
    }
    this.boundHandler = undefined;
  }

  /** Применить/снять класс скрытия ко всем найденным элементам */
  private apply(shouldHide: boolean): void {
    this.classMap.forEach((elements) => {
      elements.forEach((el) => {
        el.classList.toggle(this.hiddenClass, shouldHide);
      });
    });
  }
}
