import { isPlatformBrowser } from '@angular/common';
import { Component, ElementRef, OnDestroy, PLATFORM_ID, ViewChild, afterNextRender, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

type V3 = [number, number, number];
type View = 'domains' | 'shape' | 'both';
interface Domain { p: V3; v: V3; lp: boolean; }
interface Shape { n: string; h: string; a: string; p: number; }
interface QOpt { t: string; state: '' | 'ok' | 'bad'; }

const DB: Record<string, Shape> = {
  '2,0': { n: 'Linear', h: 'BeCl<sub>2</sub>', a: '180°', p: 0 },
  '3,0': { n: 'Trigonal planar', h: 'BF<sub>3</sub>', a: '120°', p: 0 },
  '2,1': { n: 'Bent', h: 'SO<sub>2</sub>', a: 'about 119°', p: 1 },
  '4,0': { n: 'Tetrahedral', h: 'CH<sub>4</sub>', a: '109.5°', p: 0 },
  '3,1': { n: 'Trigonal pyramidal', h: 'NH<sub>3</sub>', a: 'about 107°', p: 1 },
  '2,2': { n: 'Bent', h: 'H<sub>2</sub>O', a: 'about 104.5°', p: 1 },
  '5,0': { n: 'Trigonal bipyramidal', h: 'PCl<sub>5</sub>', a: '90° and 120°', p: 0 },
  '4,1': { n: 'Seesaw', h: 'SF<sub>4</sub>', a: 'about 87° and 102°', p: 1 },
  '3,2': { n: 'T-shaped', h: 'ClF<sub>3</sub>', a: 'about 87.5°', p: 1 },
  '2,3': { n: 'Linear', h: 'XeF<sub>2</sub>', a: '180°', p: 0 },
  '6,0': { n: 'Octahedral', h: 'SF<sub>6</sub>', a: '90°', p: 0 },
  '5,1': { n: 'Square pyramidal', h: 'BrF<sub>5</sub>', a: 'about 85°', p: 1 },
  '4,2': { n: 'Square planar', h: 'XeF<sub>4</sub>', a: '90°', p: 0 },
};
const GEO = ['', '', 'Linear', 'Trigonal planar', 'Tetrahedral', 'Trigonal bipyramidal', 'Octahedral'];
const HYB = ['', '', 'sp', 'sp²', 'sp³', 'sp³d', 'sp³d²'];
const IDEAL = ['', '', '180°', '120°', '109.5°', '90° and 120°', '90°'];
const NC: Record<number, V3[]> = {
  2: [[20, 40, 95], [40, 100, 180]], 3: [[10, 60, 70], [20, 140, 120]], 4: [[45, 30, 100], [110, 60, 170]],
  5: [[80, 25, 70], [170, 60, 110]], 6: [[85, 55, 15], [170, 105, 30]],
};
const CHIPC: Record<number, string> = { 2: '#4cc9f0', 3: '#06d6a0', 4: '#b388ff', 5: '#ff8fa3', 6: '#ffd166' };
const W0 = 520, H0 = 380, CX = 260, CY = 190, R = 105;

const sb = (x: number, e: number) => 'AX<sub>' + x + '</sub>' + (e ? 'E' + (e > 1 ? '<sub>' + e + '</sub>' : '') : '');
const rnd = (): V3 => {
  const a: V3 = [Math.random() - .5, Math.random() - .5, Math.random() - .5];
  const l = Math.hypot(a[0], a[1], a[2]) || 1;
  return [a[0] / l, a[1] / l, a[2] / l];
};

@Component({
  selector: 'app-vsepr',
  imports: [RouterLink],
  host: { style: 'display:contents' },
  template: `
    <section class="section cfs-section cfs-page" id="vsepr" aria-labelledby="vs-title">
      <div class="wrap">
        <a class="cfs-back" routerLink="/">← Back to home</a>
        <div class="section-head">
          <div>
            <div class="kicker">INTERACTIVE SIMULATOR</div>
            <h2 id="vs-title">VSEPR theory: why molecules have their shapes</h2>
            <p>Electron pairs repel, so they spread out as far as they can. Pick a molecule, press Shake, and watch the repulsion simulation find the shape.</p>
          </div>
        </div>

        <div class="vs-layout">
        <div class="cfs-card vs-block vs-side">
          <h3>Choose a molecule</h3>
          <div class="vs-chips vs-chips-side">
            @for (c of chips; track c.key) {
              <button type="button" class="vs-chip" [class.on]="X() === c.x && E() === c.e" [style.background]="c.color" (click)="setMol(c.x, c.e)">
                <span [innerHTML]="c.label"></span><small>{{ c.name }}</small>
              </button>
            }
          </div>
        </div>
        <div class="cfs-card vs-main">
          <div class="vs-stage">
            <canvas #cv tabindex="0" aria-label="3D VSEPR molecule. Drag left or right to rotate."></canvas>
            <div class="vs-badge" [innerHTML]="badge()"></div>
            <div class="vs-toast" [style.opacity]="toastOn() ? 1 : 0" [innerHTML]="toastText()"></div>
            <div class="vs-hint">Drag to rotate</div>
          </div>
          <div class="vs-legend">
            <span><i style="background:#ffd166"></i>Central atom A</span>
            <span><i style="background:#4cc9f0"></i>Bonded atom X</span>
            <span><i style="background:#b388ff"></i>Lone pair E</span>
            <span><i style="background:#ffd166;border-radius:2px"></i>Bond angle</span>
          </div>
          <div class="vs-readout" [innerHTML]="readout()"></div>
        </div>
        </div>

        <div class="cfs-card cfs-controls vs-block">
          <div>
            <h3>Or build your own</h3>
            <div class="vs-stepper">Bonded atoms X
              <button type="button" class="cfs-btn sm" (click)="setMol(X() - 1, E())" aria-label="Fewer bonded atoms">−</button>
              <output>{{ X() }}</output>
              <button type="button" class="cfs-btn sm" (click)="setMol(X() + 1, E())" aria-label="More bonded atoms">+</button>
            </div>
            <div class="vs-stepper">Lone pairs E
              <button type="button" class="cfs-btn sm" (click)="setMol(X(), E() - 1)" aria-label="Fewer lone pairs">−</button>
              <output>{{ E() }}</output>
              <button type="button" class="cfs-btn sm" (click)="setMol(X(), E() + 1)" aria-label="More lone pairs">+</button>
            </div>
            <label for="vs-lp" style="margin-top:14px">Lone pair strength <b>{{ LP().toFixed(2) }}× a bonding pair</b></label>
            <input id="vs-lp" type="range" min="1" max="2" step="0.05" [value]="LP()" (input)="onLP($event)" aria-label="Lone pair repulsion strength">
            <div class="cfs-row"><button type="button" class="cfs-btn on" (click)="shake()">🎲 Shake</button></div>
          </div>
          <div>
            <h3>View</h3>
            <div class="cfs-tabs">
              <button type="button" [class.on]="view() === 'domains'" (click)="view.set('domains')">Domains</button>
              <button type="button" [class.on]="view() === 'shape'" (click)="view.set('shape')">Shape</button>
              <button type="button" [class.on]="view() === 'both'" (click)="view.set('both')">Both</button>
            </div>
            <div class="cfs-row">
              <button type="button" class="cfs-btn sm" [class.on]="auto()" (click)="auto.set(!auto())">Auto-rotate: {{ auto() ? 'on' : 'off' }}</button>
              <button type="button" class="cfs-btn sm" [class.on]="cage()" (click)="cage.set(!cage())">Cage: {{ cage() ? 'on' : 'off' }}</button>
              <button type="button" class="cfs-btn sm" [class.on]="showAng()" (click)="showAng.set(!showAng())">Angle: {{ showAng() ? 'on' : 'off' }}</button>
              <button type="button" class="cfs-btn sm" [class.on]="paused()" (click)="paused.set(!paused())">{{ paused() ? 'Resume' : 'Pause' }}</button>
            </div>
          </div>
        </div>

        <div class="cfs-out" aria-live="polite">
          @for (s of stats(); track s.k) {
            <div [style.border-left]="'4px solid ' + s.c">{{ s.k }}<strong [innerHTML]="s.v"></strong></div>
          }
        </div>

        <div class="cfs-card vs-block vs-steps" [innerHTML]="steps()"></div>

        <div class="cfs-card vs-block">
          <h3>Three rules to remember</h3>
          <div class="vs-rule"><b>Rule 1.</b> Count domains: each single, double or triple bond and each lone pair is one domain.</div>
          <div class="vs-rule"><b>Rule 2.</b> Domains spread out to the largest angles: 2 give 180°, 3 give 120°, 4 give 109.5°, 5 give 90° and 120°, 6 give 90°.</div>
          <div class="vs-rule"><b>Rule 3.</b> Repulsion order: lone pair–lone pair &gt; lone pair–bond pair &gt; bond pair–bond pair. Lone pairs take more room and squeeze bond angles.</div>
          <div class="vs-rule"><b>Note.</b> The simulation treats each domain as a charged point on a sphere. It is a simple model, so its angles can differ a few degrees from the measured textbook values shown beside them.</div>
        </div>

        <div class="cfs-card vs-block">
          <h3>Quiz: name the shape</h3>
          <p class="vs-q" [innerHTML]="qText()"></p>
          <div class="cfs-row">
            @for (o of qOpts(); track o.t) {
              <button type="button" class="cfs-btn" [class.vs-ok]="o.state === 'ok'" [class.vs-bad]="o.state === 'bad'" (click)="pick(o)">{{ o.t }}</button>
            }
          </div>
          <p class="vs-qr" [class.vs-ok-t]="qGood()" [innerHTML]="qResult()"></p>
          <div class="cfs-row">
            <button type="button" class="cfs-btn on" (click)="ask()">Next question</button>
            <span class="vs-score">{{ score() }}</span>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class Vsepr implements OnDestroy {
  @ViewChild('cv', { static: true }) private cvRef!: ElementRef<HTMLCanvasElement>;
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  protected readonly chips = Object.keys(DB)
    .sort((a, b) => {
      const p = a.split(',').map(Number), q = b.split(',').map(Number);
      return (p[0] + p[1]) - (q[0] + q[1]) || p[1] - q[1];
    })
    .map(key => {
      const [x, e] = key.split(',').map(Number);
      return { key, x, e, color: CHIPC[x + e], label: sb(x, e) + ' ' + DB[key].h, name: DB[key].n };
    });

  protected readonly X = signal(2);
  protected readonly E = signal(2);
  protected readonly LP = signal(1.3);
  protected readonly view = signal<View>('both');
  protected readonly auto = signal(true);
  protected readonly cage = signal(true);
  protected readonly showAng = signal(true);
  protected readonly paused = signal(false);
  protected readonly toastText = signal('');
  protected readonly toastOn = signal(false);
  protected readonly readout = signal('');
  protected readonly qText = signal('');
  protected readonly qOpts = signal<QOpt[]>([]);
  protected readonly qResult = signal('');
  protected readonly qGood = signal(false);
  protected readonly score = signal('');

  protected readonly badge = computed(() => {
    const d = DB[this.X() + ',' + this.E()];
    return sb(this.X(), this.E()) + (d ? ' · ' + d.n : '');
  });
  protected readonly stats = computed(() => {
    const x = this.X(), e = this.E(), n = x + e, d = DB[x + ',' + e];
    return [
      { c: '#ffd166', k: 'Notation', v: sb(x, e) },
      { c: '#4cc9f0', k: 'Electron domains', v: `${n} (${x} bonds + ${e} lone)` },
      { c: '#06d6a0', k: 'Electron geometry', v: GEO[n] },
      { c: '#b388ff', k: 'Molecular shape', v: d ? d.n : 'Uncommon shape' },
      { c: '#ff8fa3', k: 'Hybridisation of A', v: HYB[n] },
      { c: '#c6ff4d', k: 'Polarity', v: d ? (d.p ? 'Polar (identical X)' : 'Nonpolar (identical X)') : 'Depends on atoms' },
    ];
  });
  protected readonly steps = computed(() => {
    const x = this.X(), e = this.E(), n = x + e, d = DB[x + ',' + e], nm = d ? d.n : 'Uncommon shape';
    const s3 = d
      ? `Name the shape by the atoms only. Lone pairs are invisible in the name, so this is <b>${nm.toLowerCase()}</b>. A real example is ${d.h}.`
      : 'This X and E mix is rarely seen in real molecules, so the shape has no common name.';
    const s4 = e
      ? `Lone pairs take more room (try the strength slider). Bond angles shrink from the ideal ${IDEAL[n]}${d ? ' to ' + d.a : ''}.`
      : `No lone pairs, so every domain pushes equally and the angles match the ideal ${IDEAL[n]}.`;
    return `<h3>Step by step for ${sb(x, e)}${d ? ' (' + d.h + ')' : ''}</h3><ol>` +
      `<li><b>Count domains:</b> ${x} bonds + ${e} lone pairs = <b>${n}</b>.</li>` +
      `<li><b>Spread them out:</b> ${n} domains settle into a <b>${GEO[n].toLowerCase()}</b> arrangement (hybridisation ${HYB[n]}). Press Shake and watch the dots find it.</li>` +
      `<li><b>Name the shape:</b> ${s3}</li><li><b>Adjust for lone pairs:</b> ${s4}</li></ol>`;
  });

  private ctx!: CanvasRenderingContext2D;
  private pts: Domain[] = [];
  private yaw = .5; private pitch = .3;
  private last = 0; private frameN = 0; private raf = 0;
  private drag = false; private lx = 0;
  private settled = false; private energy = 0;
  private visible = true;
  private io?: IntersectionObserver;
  private toastT?: ReturnType<typeof setTimeout>;
  private curBg: V3[] = NC[4].map(a => [...a] as V3);
  private qa: { k: string; ans: string; h: string; done: boolean } | null = null;
  private sc = 0; private qt = 0;
  private bound: { type: string; fn: (e: any) => void }[] = [];

  constructor() {
    afterNextRender(() => {
      const cv = this.cvRef.nativeElement, dpr = Math.min(window.devicePixelRatio || 1, 2);
      cv.width = W0 * dpr; cv.height = H0 * dpr;
      this.ctx = cv.getContext('2d')!;
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const on = (type: string, fn: (e: any) => void) => { cv.addEventListener(type, fn); this.bound.push({ type, fn }); };
      on('pointerdown', (e: PointerEvent) => { this.drag = true; this.lx = e.clientX; cv.style.cursor = 'grabbing'; try { cv.setPointerCapture(e.pointerId); } catch { /* ignore */ } });
      on('pointermove', (e: PointerEvent) => { if (this.drag) { this.yaw += (e.clientX - this.lx) * .012; this.lx = e.clientX; } });
      const end = () => { this.drag = false; cv.style.cursor = 'grab'; };
      on('pointerup', end); on('pointercancel', end);
      on('keydown', (e: KeyboardEvent) => { if (e.key === 'ArrowLeft') this.yaw -= .15; if (e.key === 'ArrowRight') this.yaw += .15; });
      this.io = new IntersectionObserver(([en]) => (this.visible = en.isIntersecting), { rootMargin: '100px' });
      this.io.observe(cv);
      this.setMol(2, 2, true);
      this.ask();
      this.raf = requestAnimationFrame(this.loop);
    });
  }

  ngOnDestroy(): void {
    if (this.isBrowser) cancelAnimationFrame(this.raf);
    this.io?.disconnect();
    clearTimeout(this.toastT);
    const cv = this.cvRef?.nativeElement;
    this.bound.forEach(b => cv?.removeEventListener(b.type, b.fn));
  }

  // ---------- state changes ----------
  protected setMol(x: number, e: number, silent = false): void {
    x = Math.max(2, Math.min(6, x)); e = Math.max(0, Math.min(4, e));
    if (x + e > 6) e = 6 - x;
    this.X.set(x); this.E.set(e);
    this.pts = [];
    for (let i = 0; i < x + e; i++) this.pts.push({ p: rnd(), v: [0, 0, 0], lp: i >= x });
    this.settled = false;
    if (!silent) { const d = DB[x + ',' + e]; this.toast((d ? d.n : 'Uncommon shape') + ' (' + sb(x, e) + ')'); }
  }
  protected shake(): void {
    this.pts.forEach(o => { o.p = rnd(); o.v = [0, 0, 0]; });
    this.settled = false;
    this.toast('Shaken. Watch the pairs push apart');
  }
  protected onLP(ev: Event): void { this.LP.set(+(ev.target as HTMLInputElement).value); this.settled = false; }
  private toast(s: string): void {
    this.toastText.set(s); this.toastOn.set(true);
    clearTimeout(this.toastT);
    this.toastT = setTimeout(() => this.toastOn.set(false), 2600);
  }

  // ---------- physics ----------
  private wt(i: number): number { return this.pts[i].lp ? this.LP() : 1; }
  private energyOf(): number {
    const pts = this.pts; let s = 0;
    for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) {
      const a = pts[i].p, b = pts[j].p;
      s += this.wt(i) * this.wt(j) / Math.pow(Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]) + 1e-6, 3);
    }
    return s;
  }
  private sim(): void {
    const pts = this.pts, n = pts.length; let mv = 0;
    for (let i = 0; i < n; i++) {
      const p = pts[i].p, F: V3 = [0, 0, 0], wi = this.wt(i);
      for (let j = 0; j < n; j++) {
        if (j === i) continue;
        const q = pts[j].p, dx = p[0] - q[0], dy = p[1] - q[1], dz = p[2] - q[2];
        const r2 = dx * dx + dy * dy + dz * dz + 1e-4, f = wi * this.wt(j) / Math.pow(r2, 2.5);
        F[0] += dx * f; F[1] += dy * f; F[2] += dz * f;
      }
      const dt = F[0] * p[0] + F[1] * p[1] + F[2] * p[2];
      F[0] -= p[0] * dt; F[1] -= p[1] * dt; F[2] -= p[2] * dt;
      const v = pts[i].v;
      v[0] = v[0] * .88 + F[0] * .03; v[1] = v[1] * .88 + F[1] * .03; v[2] = v[2] * .88 + F[2] * .03;
    }
    for (let i = 0; i < n; i++) {
      const pp = pts[i].p, vv = pts[i].v;
      pp[0] += vv[0]; pp[1] += vv[1]; pp[2] += vv[2];
      const l = Math.hypot(pp[0], pp[1], pp[2]) || 1;
      pp[0] /= l; pp[1] /= l; pp[2] /= l;
      const d2 = vv[0] * pp[0] + vv[1] * pp[1] + vv[2] * pp[2];
      vv[0] -= pp[0] * d2; vv[1] -= pp[1] * d2; vv[2] -= pp[2] * d2;
      mv = Math.max(mv, Math.abs(vv[0]) + Math.abs(vv[1]) + Math.abs(vv[2]));
    }
    this.settled = mv < .002;
  }
  private swapLP(): void {
    const pts = this.pts;
    if (!this.E() || !this.X() || this.LP() <= 1.001) return;
    let best = this.energyOf(), bi = -1, bj = -1;
    for (let i = 0; i < pts.length; i++) {
      if (!pts[i].lp) continue;
      for (let j = 0; j < pts.length; j++) {
        if (pts[j].lp) continue;
        pts[i].lp = false; pts[j].lp = true;
        const e1 = this.energyOf();
        pts[i].lp = true; pts[j].lp = false;
        if (e1 < best - .003) { best = e1; bi = i; bj = j; }
      }
    }
    if (bi >= 0) { pts[bi].lp = false; pts[bj].lp = true; this.settled = false; }
  }
  private angles(): number[] {
    const b = this.pts.filter(o => !o.lp), a: number[] = [];
    for (let i = 0; i < b.length; i++) for (let j = i + 1; j < b.length; j++) {
      const p = b[i].p, q = b[j].p, d = Math.max(-1, Math.min(1, p[0] * q[0] + p[1] * q[1] + p[2] * q[2]));
      a.push(Math.acos(d) * 180 / Math.PI);
    }
    a.sort((x, y) => x - y);
    const cl: { m: number; s: number; c: number }[] = [];
    a.forEach(v => { const c = cl[cl.length - 1]; if (c && v - c.m < 3) { c.s += v; c.c++; c.m = c.s / c.c; } else cl.push({ m: v, s: v, c: 1 }); });
    return cl.map(c => c.m);
  }

  // ---------- drawing ----------
  private P(x: number, y: number, z: number) {
    const c = Math.cos(this.yaw), s = Math.sin(this.yaw), x1 = x * c + z * s, z1 = -x * s + z * c;
    const cp = Math.cos(this.pitch), sp = Math.sin(this.pitch), y2 = y * cp - z1 * sp, z2 = y * sp + z1 * cp;
    return { x: CX + x1, y: CY + y2, d: z2, k: 1 + z2 / 700 };
  }
  private PV(v: V3, s: number) { return this.P(v[0] * s, v[1] * s, v[2] * s); }

  private draw(): void {
    const ctx = this.ctx, pts = this.pts, n = pts.length, view = this.view();
    const tg = NC[n] || NC[4];
    for (let q = 0; q < 2; q++) for (let k = 0; k < 3; k++) this.curBg[q][k] += (tg[q][k] - this.curBg[q][k]) * .06;
    const g = ctx.createLinearGradient(0, 0, 0, H0);
    g.addColorStop(0, 'rgb(' + this.curBg[0].map(Math.round) + ')');
    g.addColorStop(1, 'rgb(' + this.curBg[1].map(Math.round) + ')');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W0, H0);
    const O = this.P(0, 0, 0), items: { d: number; f: () => void }[] = [];
    const add = (d: number, f: () => void) => items.push({ d, f });
    const ball = (p: any, r: number, c1: string, c2: string, lab?: string) => () => {
      const Rr = r * p.k, gr = ctx.createRadialGradient(p.x - Rr * .3, p.y - Rr * .3, 1, p.x, p.y, Rr);
      gr.addColorStop(0, c1); gr.addColorStop(1, c2);
      ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(p.x, p.y, Rr, 0, 6.283); ctx.fill();
      if (lab) { ctx.fillStyle = '#10113a'; ctx.font = 'bold ' + Math.round(14 * p.k) + 'px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(lab, p.x, p.y + 1); }
    };
    const stick = (b: any) => () => {
      const dx = b.x - O.x, dy = b.y - O.y, l = Math.hypot(dx, dy) || 1, s0 = Math.min(20, l * .4);
      ctx.lineCap = 'round'; ctx.strokeStyle = '#e6eeff'; ctx.lineWidth = 7;
      ctx.beginPath(); ctx.moveTo(O.x + dx / l * s0, O.y + dy / l * s0); ctx.lineTo(b.x, b.y); ctx.stroke();
    };
    const blob = (c: any, rot: number, rx: number, ry: number, col: string, dots: boolean) => () => {
      ctx.save(); ctx.translate(c.x, c.y); ctx.rotate(rot);
      ctx.globalAlpha = .5; ctx.fillStyle = col; ctx.beginPath(); ctx.ellipse(0, 0, rx * c.k, ry * c.k, 0, 0, 6.283); ctx.fill();
      ctx.globalAlpha = 1; ctx.setLineDash([3, 3]); ctx.strokeStyle = '#ffffffaa'; ctx.lineWidth = 1.2; ctx.stroke(); ctx.setLineDash([]);
      if (dots) { ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(-6 * c.k, 0, 3, 0, 6.283); ctx.arc(6 * c.k, 0, 3, 0, 6.283); ctx.fill(); }
      ctx.restore();
    };
    if (this.cage() && n > 2) {
      let mn = 9;
      for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) { const a = pts[i].p, b = pts[j].p; mn = Math.min(mn, Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2])); }
      const tp = pts.map(o => this.PV(o.p, R));
      add(-999, () => {
        ctx.save(); ctx.setLineDash([5, 5]); ctx.strokeStyle = '#ffffff77'; ctx.lineWidth = 1.4; ctx.beginPath();
        for (let a = 0; a < n; a++) for (let b = a + 1; b < n; b++) {
          const u = pts[a].p, w = pts[b].p;
          if (Math.hypot(u[0] - w[0], u[1] - w[1], u[2] - w[2]) < mn * 1.3) { ctx.moveTo(tp[a].x, tp[a].y); ctx.lineTo(tp[b].x, tp[b].y); }
        }
        ctx.stroke(); ctx.restore();
      });
    }
    pts.forEach(o => {
      const pr = this.PV(o.p, R), rot = Math.atan2(pr.y - O.y, pr.x - O.x);
      if (view === 'domains') { const pm = this.PV(o.p, R * .55); add(pm.d, blob(pm, rot, o.lp ? 46 : 42, o.lp ? 30 : 24, o.lp ? '#b388ff' : '#4cc9f0', o.lp)); }
      else if (o.lp) { if (view === 'both') { const pl = this.PV(o.p, R * .62); add(pl.d, blob(pl, rot, 34, 22, '#b388ff', true)); } }
      else { add(pr.d - .5, stick(pr)); add(pr.d, ball(pr, 18, '#c9f3ff', '#1da1c7', 'X')); }
    });
    add(O.d, ball(O, view === 'domains' ? 20 : 26, '#fff0b3', '#ff9f1c', 'A'));
    items.sort((a, b) => a.d - b.d).forEach(it => it.f());

    if (this.showAng() && view !== 'domains') {
      const bp = pts.filter(o => !o.lp);
      let bi = -1, bj = -1, ba = 9;
      for (let i = 0; i < bp.length; i++) for (let j = i + 1; j < bp.length; j++) {
        const u = bp[i].p, w = bp[j].p, th = Math.acos(Math.max(-1, Math.min(1, u[0] * w[0] + u[1] * w[1] + u[2] * w[2])));
        if (th < ba) { ba = th; bi = i; bj = j; }
      }
      if (bi >= 0 && ba > .3 && ba < 3.1) {
        const u = bp[bi].p, w = bp[bj].p, sn = Math.sin(ba);
        ctx.save(); ctx.strokeStyle = '#ffd166'; ctx.lineWidth = 3; ctx.shadowColor = '#ffd166'; ctx.shadowBlur = 8; ctx.beginPath();
        for (let i = 0; i <= 20; i++) {
          const t = i / 20, c1 = Math.sin((1 - t) * ba) / sn, c2 = Math.sin(t * ba) / sn;
          const pa = this.P((c1 * u[0] + c2 * w[0]) * 46, (c1 * u[1] + c2 * w[1]) * 46, (c1 * u[2] + c2 * w[2]) * 46);
          if (i) ctx.lineTo(pa.x, pa.y); else ctx.moveTo(pa.x, pa.y);
        }
        ctx.stroke(); ctx.restore();
        const c0 = Math.sin(.5 * ba) / sn, mx = (u[0] + w[0]) * c0 * .5, my = (u[1] + w[1]) * c0 * .5, mz = (u[2] + w[2]) * c0 * .5;
        const lb = this.P(mx * 78, my * 78, mz * 78), txt = (ba * 180 / Math.PI).toFixed(1) + '°';
        ctx.font = 'bold 14px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        const tw = ctx.measureText(txt).width + 14;
        ctx.fillStyle = '#ffd166'; ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(lb.x - tw / 2, lb.y - 11, tw, 22, 11); else ctx.rect(lb.x - tw / 2, lb.y - 11, tw, 22);
        ctx.fill(); ctx.fillStyle = '#2b1d00'; ctx.fillText(txt, lb.x, lb.y + 1);
      }
    }
  }

  private updateReadout(): void {
    const a = this.angles(), d = DB[this.X() + ',' + this.E()];
    this.readout.set(`<b>${this.settled ? 'Settled' : 'Settling…'}</b> · repulsion energy ${this.energy.toFixed(2)} · angles in simulation: <b>${a.length ? a.map(v => v.toFixed(1) + '°').join(', ') : 'none'}</b>${d ? ' · textbook: ' + d.a : ''}`);
  }

  private readonly loop = (ts: number): void => {
    this.raf = requestAnimationFrame(this.loop);
    const dt = Math.min(.05, (ts - this.last) / 1000 || .016); this.last = ts;
    if (!this.visible) return;
    if (!this.paused()) {
      if (this.auto() && !this.drag) this.yaw += dt * .5;
      for (let s = 0; s < 4; s++) this.sim();
      if (this.frameN % 20 === 0) this.swapLP();
      this.energy = this.energyOf();
    }
    this.draw();
    if (this.frameN++ % 6 === 0) this.updateReadout();
  };

  // ---------- quiz ----------
  protected ask(): void {
    const keys = Object.keys(DB), k = keys[Math.floor(Math.random() * keys.length)], d = DB[k];
    const names: string[] = [];
    keys.forEach(z => { if (!names.includes(DB[z].n)) names.push(DB[z].n); });
    const opts = [d.n];
    while (opts.length < 4) { const c = names[Math.floor(Math.random() * names.length)]; if (!opts.includes(c)) opts.push(c); }
    opts.sort(() => Math.random() - .5);
    this.qa = { k, ans: d.n, h: d.h, done: false };
    this.qText.set(`What is the molecular shape of <b>${d.h}</b>?`);
    this.qResult.set(''); this.qGood.set(false);
    this.qOpts.set(opts.map(t => ({ t, state: '' as const })));
  }
  protected pick(o: QOpt): void {
    const qa = this.qa; if (!qa || qa.done) return;
    qa.done = true; this.qt++;
    const ok = o.t === qa.ans; if (ok) this.sc++;
    this.qOpts.update(list => list.map(x => (x.t === o.t ? { ...x, state: ok ? 'ok' as const : 'bad' as const } : x)));
    const [x, e] = qa.k.split(',').map(Number);
    this.qGood.set(ok);
    this.qResult.set(`${ok ? 'Correct. ' : 'Not quite. '}${qa.h} is ${sb(x, e)}: ${x} bonds + ${e} lone pairs, so ${qa.ans.toLowerCase()}. It is now shown above.`);
    this.score.set(`Score: ${this.sc} / ${this.qt}`);
    this.setMol(x, e, true);
  }
}
