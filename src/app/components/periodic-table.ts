import { isPlatformBrowser } from '@angular/common';
import { Component, ElementRef, HostListener, OnDestroy, PLATFORM_ID, ViewChild, inject, signal } from '@angular/core';

interface ElementInfo {
  number: number;
  symbol: string;
  name: string;
  mass: number;
  category: string;
  row: number;
  column: number;
}

const RAW_ELEMENTS: [string, string, number][] = [
  ['H','Hydrogen',1.008],['He','Helium',4.003],['Li','Lithium',6.94],['Be','Beryllium',9.012],['B','Boron',10.81],['C','Carbon',12.011],['N','Nitrogen',14.007],['O','Oxygen',15.999],['F','Fluorine',18.998],['Ne','Neon',20.18],['Na','Sodium',22.99],['Mg','Magnesium',24.305],['Al','Aluminum',26.982],['Si','Silicon',28.085],['P','Phosphorus',30.974],['S','Sulfur',32.06],['Cl','Chlorine',35.45],['Ar','Argon',39.95],['K','Potassium',39.098],['Ca','Calcium',40.078],['Sc','Scandium',44.956],['Ti','Titanium',47.867],['V','Vanadium',50.941],['Cr','Chromium',51.996],['Mn','Manganese',54.938],['Fe','Iron',55.845],['Co','Cobalt',58.933],['Ni','Nickel',58.693],['Cu','Copper',63.546],['Zn','Zinc',65.38],['Ga','Gallium',69.723],['Ge','Germanium',72.63],['As','Arsenic',74.922],['Se','Selenium',78.971],['Br','Bromine',79.904],['Kr','Krypton',83.798],['Rb','Rubidium',85.468],['Sr','Strontium',87.62],['Y','Yttrium',88.906],['Zr','Zirconium',91.224],['Nb','Niobium',92.906],['Mo','Molybdenum',95.95],['Tc','Technetium',98],['Ru','Ruthenium',101.07],['Rh','Rhodium',102.905],['Pd','Palladium',106.42],['Ag','Silver',107.868],['Cd','Cadmium',112.414],['In','Indium',114.818],['Sn','Tin',118.71],['Sb','Antimony',121.76],['Te','Tellurium',127.6],['I','Iodine',126.904],['Xe','Xenon',131.293],['Cs','Cesium',132.905],['Ba','Barium',137.327],['La','Lanthanum',138.905],['Ce','Cerium',140.116],['Pr','Praseodymium',140.908],['Nd','Neodymium',144.242],['Pm','Promethium',145],['Sm','Samarium',150.36],['Eu','Europium',151.964],['Gd','Gadolinium',157.25],['Tb','Terbium',158.925],['Dy','Dysprosium',162.5],['Ho','Holmium',164.93],['Er','Erbium',167.259],['Tm','Thulium',168.934],['Yb','Ytterbium',173.045],['Lu','Lutetium',174.967],['Hf','Hafnium',178.486],['Ta','Tantalum',180.948],['W','Tungsten',183.84],['Re','Rhenium',186.207],['Os','Osmium',190.23],['Ir','Iridium',192.217],['Pt','Platinum',195.084],['Au','Gold',196.967],['Hg','Mercury',200.592],['Tl','Thallium',204.38],['Pb','Lead',207.2],['Bi','Bismuth',208.98],['Po','Polonium',209],['At','Astatine',210],['Rn','Radon',222],['Fr','Francium',223],['Ra','Radium',226],['Ac','Actinium',227],['Th','Thorium',232.038],['Pa','Protactinium',231.036],['U','Uranium',238.029],['Np','Neptunium',237],['Pu','Plutonium',244],['Am','Americium',243],['Cm','Curium',247],['Bk','Berkelium',247],['Cf','Californium',251],['Es','Einsteinium',252],['Fm','Fermium',257],['Md','Mendelevium',258],['No','Nobelium',259],['Lr','Lawrencium',262],['Rf','Rutherfordium',261],['Db','Dubnium',262],['Sg','Seaborgium',266],['Bh','Bohrium',264],['Hs','Hassium',277],['Mt','Meitnerium',268],['Ds','Darmstadtium',281],['Rg','Roentgenium',272],['Cn','Copernicium',285],['Nh','Nihonium',286],['Fl','Flerovium',289],['Mc','Moscovium',289],['Lv','Livermorium',293],['Ts','Tennessine',294],['Og','Oganesson',294],
];

const positions = (z: number): [number, number] => {
  if (z === 1) return [1, 1]; if (z === 2) return [1, 18];
  if (z <= 4) return [2, z - 2]; if (z <= 10) return [2, z + 8];
  if (z <= 12) return [3, z - 10]; if (z <= 18) return [3, z];
  if (z <= 36) return [4, z - 18]; if (z <= 54) return [5, z - 36];
  if (z <= 57) return [6, z - 54]; if (z <= 71) return [9, z - 54];
  if (z <= 86) return [6, z - 68]; if (z <= 89) return [7, z - 86];
  if (z <= 103) return [10, z - 86]; return [7, z - 100];
};

function category(z: number): string {
  if ([3,11,19,37,55,87].includes(z)) return 'Alkali metal';
  if ([4,12,20,38,56,88].includes(z)) return 'Alkaline earth';
  if ((z >= 58 && z <= 71)) return 'Lanthanoid'; if (z >= 90 && z <= 103) return 'Actinoid';
  if ([5,14,32,33,51,52].includes(z)) return 'Metalloid';
  if ([9,17,35,53,85,117].includes(z)) return 'Halogen';
  if ([2,10,18,36,54,86,118].includes(z)) return 'Noble gas';
  if ([1,6,7,8,15,16,34].includes(z)) return 'Nonmetal';
  if ([13,31,49,50,81,82,83,84,113,114,115,116].includes(z)) return 'Post-transition';
  return 'Transition metal';
}

const ELEMENTS: ElementInfo[] = RAW_ELEMENTS.map(([symbol, name, mass], i) => {
  const number = i + 1; const [row, column] = positions(number);
  return { number, symbol, name, mass, category: category(number), row, column };
});

@Component({
  selector: 'app-periodic-table',
  host: { style: 'display:contents' },
  template: `
    <section class="section periodic-section" id="periodic-table" aria-labelledby="periodic-title">
      <div class="wrap">
        <div class="section-head periodic-heading">
          <div><div class="kicker">CHEMISTRY, IN MOTION</div><h2 id="periodic-title">The Periodic Table</h2><p>Choose an element to explore its atomic structure in 3D.</p></div>
          <span class="periodic-count"><b>118</b> elements</span>
        </div>
        <div class="periodic-legend" aria-label="Element categories">
          @for (item of categories; track item) { <span><i [class]="categoryClass(item)"></i>{{ item }}</span> }
        </div>
        <div class="periodic-scroll" tabindex="0" aria-label="Scrollable periodic table">
          <div class="periodic-grid">
            @for (element of elements; track element.number) {
              <button type="button" [class]="'periodic-element ' + categoryClass(element.category)"
                [style.grid-row]="element.row" [style.grid-column]="element.column" (click)="openElement(element)"
                [attr.aria-label]="element.number + ' ' + element.name" [attr.title]="element.name">
                <small>{{ element.number }}</small><strong>{{ element.symbol }}</strong><span>{{ element.mass }}</span>
              </button>
            }
          </div>
        </div>
        <p class="periodic-hint">Lanthanides and actinides are shown beneath the main table. Select any tile for the animated atom.</p>
      </div>

      @if (selected(); as element) {
        <dialog class="atom-dialog" open role="dialog" aria-modal="true" (click)="backdrop($event)" (keydown.escape)="close()" [attr.aria-label]="'Element details: ' + element.name">
          <div class="atom-dialog-shell">
            <div class="atom-dialog-top"><div class="atom-dialog-title"><span class="atom-kicker"><i></i> ELEMENT EXPLORER <b>·</b> {{ element.category }}</span><h3>{{ element.symbol }} <span>{{ element.name }}</span></h3></div>
              <button type="button" class="atom-close" (click)="close()" aria-label="Close element details">×</button>
            </div>
            <div class="atom-layout">
              <div class="atom-stage" [class.is-paused]="paused()">
                <canvas #atomCanvas class="atom-canvas" aria-label="Animated 3D atom model. Drag to rotate."></canvas>
                <div class="atom-corner"><small>ATOMIC NO.</small><b>{{ element.number }}</b><strong>{{ element.symbol }}</strong><span>{{ element.name }}</span></div>
                <div class="atom-stage-label"><i></i> LIVE ATOM MODEL</div>
                <div class="atom-stage-caption"><span><i class="proton-dot"></i> PROTON</span><span><i class="neutron-dot"></i> NEUTRON</span><span>DRAG TO ROTATE</span></div>
              </div>
              <div class="atom-details">
                <div class="atom-number">{{ element.number }} <span>ATOMIC NUMBER</span></div>
                <h4>{{ element.symbol }} <span>{{ element.name }}</span></h4>
                <p class="atom-category"><span>{{ element.category }}</span><i></i>{{ period(element.number) }}{{ ordinal(period(element.number)) }} period</p>
                <div class="atom-facts"><div><small>ATOMIC MASS</small><b>{{ element.mass }} <em>u</em></b></div><div><small>PROTONS</small><b>{{ element.number }}</b></div><div><small>ELECTRONS</small><b>{{ element.number }}</b></div><div><small>NEUTRONS · APPROX.</small><b>{{ neutrons(element) }}</b></div></div>
                <div class="atom-shells"><div class="atom-shells-heading"><span>ELECTRON SHELLS</span><small>{{ element.number }} electrons</small></div><div class="atom-shell-list">@for (count of shellBreakdown(element); track $index; let i = $index) { <span><b>{{ shellLetter(i) }}</b>{{ count }}</span> }</div></div>
                <div class="atom-controls"><button type="button" class="atom-nav" (click)="step(-1)" aria-label="Previous element"><span>←</span><small>PREV</small></button><button type="button" class="atom-play" (click)="paused.set(!paused())">{{ paused() ? '▶ Resume' : 'Ⅱ Pause' }}</button><button type="button" class="atom-speed" (click)="cycleSpeed()">{{ speedLabel() }}</button><button type="button" class="atom-nav" (click)="step(1)" aria-label="Next element"><small>NEXT</small><span>→</span></button></div>
                <p class="atom-tip">Illustrative atomic model · electron paths are not to scale.</p>
              </div>
            </div>
          </div>
        </dialog>
      }
    </section>
  `,
})
export class PeriodicTable implements OnDestroy {
  private canvasElement?: HTMLCanvasElement;
  @ViewChild('atomCanvas') set canvasRef(ref: ElementRef<HTMLCanvasElement> | undefined) {
    const next = ref?.nativeElement;
    if (this.canvasElement === next) return;
    this.detachCanvas();
    this.canvasElement = next;
    if (!next || !this.isBrowser) return;
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    next.addEventListener('pointerdown', this.onPointerDown);
    next.addEventListener('pointermove', this.onPointerMove);
    next.addEventListener('pointerup', this.onPointerEnd);
    next.addEventListener('pointercancel', this.onPointerEnd);
    this.frame = requestAnimationFrame(this.render);
  }
  protected readonly elements = ELEMENTS;
  protected readonly categories = ['Alkali metal','Alkaline earth','Transition metal','Post-transition','Metalloid','Nonmetal','Halogen','Noble gas','Lanthanoid','Actinoid'];
  protected readonly selected = signal<ElementInfo | null>(null);
  protected readonly paused = signal(false);
  protected readonly speedLabel = signal('1×');
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private frame = 0;
  private time = 0;
  private speed = 1;
  private reducedMotion = false;
  private rotationX = 1;
  private rotationZ = 0.4;
  private dragAt: [number, number] | null = null;
  private shells: number[] = [];
  private nucleons: { p: [number, number, number]; proton: boolean }[] = [];
  private readonly shellColors = ['#ff6b6b','#ffa94d','#ffe066','#69db7c','#4dabf7','#b197fc','#f783ac'];
  private readonly shellTiltX = [70,-50,40,-70,20,60,-30];
  private readonly shellTiltY = [0,40,-40,70,-70,20,-20];
  ngOnDestroy(): void {
    if (this.isBrowser) cancelAnimationFrame(this.frame);
    this.detachCanvas();
  }
  private detachCanvas(): void {
    const canvas = this.canvasElement;
    if (!canvas) return;
    canvas?.removeEventListener('pointerdown', this.onPointerDown);
    canvas?.removeEventListener('pointermove', this.onPointerMove);
    canvas?.removeEventListener('pointerup', this.onPointerEnd);
    canvas?.removeEventListener('pointercancel', this.onPointerEnd);
    if (this.isBrowser) cancelAnimationFrame(this.frame);
    this.frame = 0;
  }
  protected openElement(element: ElementInfo): void {
    this.selected.set(element); this.paused.set(false); this.time = 0; this.rotationX = 1; this.rotationZ = .4; this.speed = 1; this.speedLabel.set('1×');
    this.configureAtom(element);
  }
  protected close(): void { this.selected.set(null); }
  protected step(direction: number): void {
    const current = this.selected(); if (!current) return;
    const next = ELEMENTS[(current.number - 1 + direction + ELEMENTS.length) % ELEMENTS.length];
    this.selected.set(next); this.paused.set(false); this.time = 0; this.configureAtom(next);
  }
  protected cycleSpeed(): void { this.speed = this.speed === 1 ? 2.2 : this.speed === 2.2 ? .45 : 1; this.speedLabel.set(this.speed === 1 ? '1×' : this.speed > 1 ? '2.2×' : '0.45×'); }
  protected categoryClass(value: string): string { return 'cat-' + value.toLowerCase().replaceAll(' ', '-'); }
  protected period(z: number): number { return z <= 2 ? 1 : z <= 10 ? 2 : z <= 18 ? 3 : z <= 36 ? 4 : z <= 54 ? 5 : z <= 86 ? 6 : 7; }
  protected ordinal(n: number): string { return n === 1 ? 'st' : n === 2 ? 'nd' : n === 3 ? 'rd' : 'th'; }
  protected neutrons(element: ElementInfo): number { return Math.max(0, Math.round(element.mass) - element.number); }
  protected shellLetter(index: number): string { return 'KLMNOPQ'[index] || ''; }
  protected shellBreakdown(element: ElementInfo): number[] {
    const orbitals: [number, number][] = [[1,2],[2,2],[2,6],[3,2],[3,6],[4,2],[3,10],[4,6],[5,2],[4,10],[5,6],[6,2],[4,14],[5,10],[6,6],[7,2],[5,14],[6,10],[7,6]];
    const count = Array(7).fill(0) as number[]; let left = element.number;
    for (const [shell, capacity] of orbitals) { const fill = Math.min(left, capacity); count[shell - 1] += fill; left -= fill; if (!left) break; }
    return count.filter(Boolean);
  }
  protected backdrop(event: MouseEvent): void { if (event.target === event.currentTarget) this.close(); }
  private configureAtom(element: ElementInfo): void {
    const orbitals: [number, number][] = [[1,2],[2,2],[2,6],[3,2],[3,6],[4,2],[3,10],[4,6],[5,2],[4,10],[5,6],[6,2],[4,14],[5,10],[6,6],[7,2],[5,14],[6,10],[7,6]];
    const count = Array(7).fill(0) as number[];
    let left = element.number;
    for (const [shell, capacity] of orbitals) { const fill = Math.min(left, capacity); count[shell - 1] += fill; left -= fill; if (!left) break; }
    this.shells = count.filter(Boolean);
    const neutrons = Math.max(Math.round(element.mass) - element.number, 0);
    const total = element.number + neutrons;
    const particles = Math.min(total, 36);
    const protonCount = Math.min(particles, Math.max(1, Math.round(particles * element.number / total)));
    const types = Array.from({ length: particles }, (_, index) => index < protonCount);
    let seed = element.number * 9301 + 49297;
    for (let i = types.length - 1; i > 0; i--) { seed = (seed * 9301 + 49297) % 233280; const j = Math.floor(seed / 233280 * (i + 1)); [types[i], types[j]] = [types[j], types[i]]; }
    this.nucleons = types.map((proton, i) => {
      const radius = Math.cbrt((i + .5) / particles); const y = 1 - 2 * (i + .5) / particles;
      const ring = Math.sqrt(1 - y * y); const theta = 2.39996 * i;
      return { p: [ring * Math.cos(theta) * radius, y * radius, ring * Math.sin(theta) * radius], proton };
    });
  }
  private readonly onPointerDown = (event: PointerEvent): void => { this.dragAt = [event.clientX, event.clientY]; this.canvasElement?.setPointerCapture(event.pointerId); };
  private readonly onPointerMove = (event: PointerEvent): void => {
    if (!this.dragAt) return;
    this.rotationZ += (event.clientX - this.dragAt[0]) * .01;
    this.rotationX = Math.min(1.9, Math.max(-.2, this.rotationX - (event.clientY - this.dragAt[1]) * .01));
    this.dragAt = [event.clientX, event.clientY];
  };
  private readonly onPointerEnd = (): void => { this.dragAt = null; };
  private readonly render = (): void => {
    this.frame = requestAnimationFrame(this.render);
    const canvas = this.canvasElement;
    const element = this.selected();
    if (!canvas || !element) return;
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = Math.round(rect.width * dpr); const height = Math.round(rect.height * dpr);
    if (canvas.width !== width || canvas.height !== height) { canvas.width = width; canvas.height = height; }
    const ctx = canvas.getContext('2d'); if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, rect.width, rect.height);
    if (!this.paused() && !this.reducedMotion) { this.time += .016 * this.speed; if (!this.dragAt) this.rotationZ += .0035 * this.speed; }
    const cx = rect.width / 2; const cy = rect.height / 2; const radius = Math.min(rect.width, rect.height) * .45; const scale = radius / 150;
    const project = (point: [number, number, number]): [number, number, number, number] => {
      let [x, y, z] = this.rotateZ(this.rotateX(point, this.rotationX), this.rotationZ);
      const factor = 900 * scale / (900 * scale - z);
      return [cx + x * factor, cy - y * factor, z, factor];
    };
    const items: { depth: number; kind: number; p: number[]; q?: number[]; color: string; radius?: number }[] = [];
    this.shells.forEach((electrons, index) => {
      const orbitRadius = this.shells.length > 1 ? radius * (.4 + .6 * index / (this.shells.length - 1)) : radius * .6;
      const angleX = this.shellTiltX[index] * Math.PI / 180; const angleY = this.shellTiltY[index] * Math.PI / 180;
      const ringPoint = (angle: number): [number, number, number] => this.rotateY(this.rotateX([orbitRadius * Math.cos(angle), orbitRadius * Math.sin(angle), 0], angleX), angleY);
      const segments = 56;
      for (let segment = 0; segment < segments; segment++) {
        const a = project(ringPoint(2 * Math.PI * segment / segments)); const b = project(ringPoint(2 * Math.PI * (segment + 1) / segments));
        items.push({ depth: (a[2] + b[2]) / 2, kind: 0, p: a, q: b, color: this.shellColors[index] });
      }
      const speed = 1.9 / (index + 1) * (index % 2 ? -1 : 1);
      for (let electron = 0; electron < electrons; electron++) {
        const angle = 2 * Math.PI * electron / electrons + this.time * speed * 1.6 + index * .6;
        items.push({ depth: project(ringPoint(angle))[2], kind: 1, p: project(ringPoint(angle)), color: this.shellColors[index] });
      }
    });
    const particleRadius = Math.max(3, 9.5 - Math.sqrt(this.nucleons.length) * 1.05) * scale * 1.1;
    const nucleusRadius = particleRadius * Math.cbrt(this.nucleons.length);
    for (const particle of this.nucleons) {
      const p = project(particle.p.map((value) => value * nucleusRadius) as [number, number, number]);
      items.push({ depth: p[2], kind: 2, p, color: particle.proton ? '#e03131' : '#5c7cfa', radius: particleRadius });
    }
    items.sort((a, b) => a.depth - b.depth);
    for (const item of items) {
      if (item.kind === 0) {
        const alpha = .2 + .65 * Math.min(1, Math.max(0, (item.depth + radius) / (2 * radius)));
        ctx.globalAlpha = alpha; ctx.strokeStyle = item.color; ctx.lineWidth = 1 + alpha * 1.6;
        ctx.beginPath(); ctx.moveTo(item.p[0], item.p[1]); ctx.lineTo(item.q![0], item.q![1]); ctx.stroke(); ctx.globalAlpha = 1;
      } else {
        const ballRadius = item.kind === 1 ? 5.6 * scale * item.p[3] * 1.15 : (item.radius || 3) * item.p[3];
        this.drawBall(ctx, item.p[0], item.p[1], ballRadius, item.color);
      }
    }
  };
  private rotateX(v: [number, number, number], a: number): [number, number, number] { return [v[0], v[1] * Math.cos(a) - v[2] * Math.sin(a), v[1] * Math.sin(a) + v[2] * Math.cos(a)]; }
  private rotateY(v: [number, number, number], a: number): [number, number, number] { return [v[0] * Math.cos(a) + v[2] * Math.sin(a), v[1], -v[0] * Math.sin(a) + v[2] * Math.cos(a)]; }
  private rotateZ(v: [number, number, number], a: number): [number, number, number] { return [v[0] * Math.cos(a) - v[1] * Math.sin(a), v[0] * Math.sin(a) + v[1] * Math.cos(a), v[2]]; }
  private drawBall(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, color: string): void {
    const gradient = ctx.createRadialGradient(x - radius * .35, y - radius * .35, radius * .1, x, y, radius);
    gradient.addColorStop(0, '#fff'); gradient.addColorStop(.35, color); gradient.addColorStop(1, '#000a');
    ctx.fillStyle = gradient; ctx.beginPath(); ctx.arc(x, y, radius, 0, Math.PI * 2); ctx.fill();
  }
  @HostListener('document:keydown.escape') onEscape(): void { this.close(); }
}
