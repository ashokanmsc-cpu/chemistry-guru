import { isPlatformBrowser } from '@angular/common';
import { Component, ElementRef, OnDestroy, PLATFORM_ID, ViewChild, afterNextRender, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '../core/translate.pipe';

type Geo = 'oct' | 'tet' | 'sq';
type V3 = [number, number, number];

const P = 1;
const COEF: Record<Geo, number[]> = {
  oct: [-.4, -.4, -.4, .6, .6],
  tet: [.178, .178, .178, -.267, -.267],
  sq: [.228, -.514, -.514, -.428, 1.228],
};
const NAMES = ['dxy', 'dxz', 'dyz', 'dz²', 'dx²−y²'];
const GROUPS: Record<Geo, { n: string; i: number[] }[]> = {
  oct: [{ n: 't₂g', i: [0, 1, 2] }, { n: 'e_g', i: [3, 4] }],
  tet: [{ n: 'e', i: [3, 4] }, { n: 't₂', i: [0, 1, 2] }],
  sq: [{ n: 'dxz, dyz', i: [1, 2] }, { n: 'dz²', i: [3] }, { n: 'dxy', i: [0] }, { n: 'dx²−y²', i: [4] }],
};
const t3 = 1 / Math.sqrt(3);
const LIGANDS: Record<Geo, V3[]> = {
  oct: [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]],
  tet: ([[1, 1, 1], [1, -1, -1], [-1, 1, -1], [-1, -1, 1]] as V3[]).map(v => v.map(x => x * t3) as V3),
  sq: [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0]],
};
const s = Math.SQRT1_2;
const LOBES: Record<number, [number, number, number, number][]> = {
  0: [[s, s, 0, 1], [-s, -s, 0, 1], [s, -s, 0, -1], [-s, s, 0, -1]],
  1: [[s, 0, s, 1], [-s, 0, -s, 1], [s, 0, -s, -1], [-s, 0, s, -1]],
  2: [[0, s, s, 1], [0, -s, -s, 1], [0, s, -s, -1], [0, -s, s, -1]],
  3: [[0, 0, 1, 1], [0, 0, -1, 1]],
  4: [[1, 0, 0, 1], [-1, 0, 0, 1], [0, 1, 0, -1], [0, -1, 0, -1]],
};
const NOTES: Record<Geo, string> = {
  oct: 'Octahedral: six ligands on the axes. Orbitals pointing at ligands (e_g) rise by 0.6 Δₒ; t₂g drop by 0.4 Δₒ.',
  tet: 'Tetrahedral: four ligands on alternate cube corners. Splitting is inverted and small (Δₜ ≈ 4/9 Δₒ), so complexes are almost always high spin.',
  sq: 'Square planar: ligands only in the xy plane, so dx²−y² is pushed far up. A large gap favours the low-spin d⁸ configuration (e.g. [Ni(CN)₄]²⁻, Pt²⁺, Pd²⁺).',
};
const LIGAND_PRESETS = [{ n: 'I⁻', v: .4 }, { n: 'H₂O', v: .8 }, { n: 'NH₃', v: 1.3 }, { n: 'CN⁻', v: 2.2 }];
const sup = (k: number) => (k > 1 ? `<sup>${k}</sup>` : '');

@Component({
  selector: 'app-crystal-field',
  imports: [TranslatePipe, RouterLink],
  host: { style: 'display:contents' },
  template: `
    <section class="section cfs-section cfs-page" id="crystal-field" aria-labelledby="cfs-title">
      <div class="wrap">
        <div class="section-head">
          <div>
            <div class="kicker">{{ 'cfs.kicker' | t }}</div>
            <h2 id="cfs-title">{{ 'cfs.title' | t }}</h2>
            <p>{{ 'cfs.text' | t }}</p>
          </div>
        </div>

        <a class="cfs-back" routerLink="/">← Back to home</a>
        <div class="cfs-tabs" role="tablist" aria-label="Geometry">
          @for (g of geos; track g.id) {
            <button type="button" role="tab" [attr.aria-selected]="geo() === g.id" [class.on]="geo() === g.id" (click)="setGeo(g.id)">{{ g.label }}</button>
          }
        </div>

        <div class="cfs-grid">
          <div class="cfs-card">
            <canvas #c3 aria-label="3D model of ligands around a metal ion. Drag to rotate."></canvas>
            <div class="cfs-hint">Drag to rotate. Click an orbital level to show its lobes (red +, blue −).</div>
          </div>
          <div class="cfs-card"><canvas #cd aria-label="d-orbital energy level diagram"></canvas></div>
        </div>

        <div class="cfs-controls cfs-card">
          <div>
            <label for="cfs-t">Ligand field turn-on <b>{{ pct() }}%</b></label>
            <input id="cfs-t" type="range" min="0" max="1" step="0.01" [value]="t" (input)="onT($event)">
            <div class="cfs-row">
              <button type="button" class="cfs-btn" (click)="togglePlay()">{{ playing() ? 'Pause' : 'Play approach' }}</button>
              <button type="button" class="cfs-btn" [class.on]="rotating()" (click)="toggleRot()">Auto-rotate</button>
            </div>
          </div>
          <div>
            <label for="cfs-n">d electrons <b>{{ n() }}</b></label>
            <input id="cfs-n" type="range" min="1" max="10" step="1" [value]="n()" (input)="n.set(+$any($event.target).value)">
            <label for="cfs-d" style="margin-top:10px">Field strength Δₒ (units of P) <b>{{ delta().toFixed(2) }}</b></label>
            <input id="cfs-d" type="range" min="0.1" max="3" step="0.05" [value]="delta()" (input)="delta.set(+$any($event.target).value)">
            <div class="cfs-row">
              @for (l of presets; track l.n) { <button type="button" class="cfs-btn sm" (click)="delta.set(l.v)">{{ l.n }}</button> }
            </div>
          </div>
        </div>

        <div class="cfs-out" aria-live="polite">
          <div>Configuration<strong [innerHTML]="info().cfg"></strong></div>
          <div>Unpaired e⁻<strong>{{ info().unpaired }}{{ info().tag }}</strong></div>
          <div>Spin-only μ<strong>{{ info().mu }} BM</strong></div>
          <div>CFSE (Σ, units of Δₒ)<strong>{{ info().cfse }} Δₒ</strong></div>
          <div>Δ{{ geo() === 'tet' ? 'ₜ' : 'ₒ' }} vs P<strong>{{ info().dp }}</strong></div>
          <div>Paired orbitals<strong>{{ info().pairs }}</strong></div>
        </div>
        <p class="cfs-note">{{ notes[geo()] }} Electrons fill whichever is cheaper: an empty higher orbital (cost Δ) or pairing in a lower one (cost P).</p>
      </div>
    </section>
  `,
})
export class CrystalField implements OnDestroy {
  protected readonly geos: { id: Geo; label: string }[] = [
    { id: 'oct', label: 'Octahedral' }, { id: 'tet', label: 'Tetrahedral' }, { id: 'sq', label: 'Square planar' },
  ];
  protected readonly presets = LIGAND_PRESETS;
  protected readonly notes = NOTES;
  protected readonly geo = signal<Geo>('oct');
  protected readonly n = signal(4);
  protected readonly delta = signal(.8);
  protected readonly playing = signal(false);
  protected readonly rotating = signal(true);
  protected readonly pct = signal(100);
  protected readonly info = signal({ cfg: '', unpaired: 0, tag: '', mu: '0.00', cfse: '0.00', dp: '', pairs: 0 });

  @ViewChild('c3') private c3!: ElementRef<HTMLCanvasElement>;
  @ViewChild('cd') private cd!: ElementRef<HTMLCanvasElement>;

  protected t = 1;
  private sel = 3;
  private ang = .6;
  private tilt = .45;
  private ph = 0;
  private drag: [number, number] | null = null;
  private hits: { i: number; x: number; y: number }[] = [];
  private frame = 0;
  private last = 0;
  private visible = true;
  private io?: IntersectionObserver;
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  constructor() {
    afterNextRender(() => {
      const c3 = this.c3.nativeElement, cd = this.cd.nativeElement;
      c3.addEventListener('pointerdown', e => { this.drag = [e.clientX, e.clientY]; c3.setPointerCapture(e.pointerId); this.rotating.set(false); });
      c3.addEventListener('pointermove', e => {
        if (!this.drag) return;
        this.ang += (e.clientX - this.drag[0]) * .01;
        this.tilt = Math.max(-1.3, Math.min(1.3, this.tilt + (e.clientY - this.drag[1]) * .01));
        this.drag = [e.clientX, e.clientY];
      });
      const end = () => (this.drag = null);
      c3.addEventListener('pointerup', end); c3.addEventListener('pointercancel', end);
      cd.addEventListener('click', e => {
        const r = cd.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
        let best: { i: number } | null = null, bd = 900;
        for (const k of this.hits) { const d = (k.x - x) ** 2 + (k.y - y) ** 2; if (d < bd) { bd = d; best = k; } }
        if (best) this.sel = best.i;
      });
      this.io = new IntersectionObserver(([en]) => (this.visible = en.isIntersecting), { rootMargin: '100px' });
      this.io.observe(c3);
      this.frame = requestAnimationFrame(this.loop);
    });
  }

  ngOnDestroy(): void {
    if (this.isBrowser) cancelAnimationFrame(this.frame);
    this.io?.disconnect();
  }

  protected setGeo(g: Geo): void { this.geo.set(g); }
  protected onT(e: Event): void { this.t = +(e.target as HTMLInputElement).value; this.playing.set(false); }
  protected togglePlay(): void { this.playing.update(v => !v); this.ph = 0; if (this.playing()) this.t = 0; }
  protected toggleRot(): void { this.rotating.update(v => !v); }

  private readonly loop = (ts: number): void => {
    this.frame = requestAnimationFrame(this.loop);
    const dt = Math.min(.05, (ts - this.last) / 1000 || 0); this.last = ts;
    if (!this.visible) return;
    if (this.rotating()) this.ang += dt * .5;
    if (this.playing()) {
      this.ph += dt / 3.2;
      const q = Math.min(1, this.ph);
      this.t = q < .5 ? 2 * q * q : 1 - Math.pow(-2 * q + 2, 2) / 2;
      if (this.ph > 1.35) this.ph = 0;
    }
    const pct = Math.round(this.t * 100);
    if (pct !== this.pct()) this.pct.set(pct);
    const occ = this.fill();
    const pal = this.palette();
    this.draw3(pal);
    this.drawD(occ, pal);
    this.updateInfo(occ);
  };

  private palette() {
    const dark = document.documentElement.getAttribute('data-theme') === 'dark';
    return dark
      ? { fg: '#e8edf8', mut: '#8e9bb5', gold: '#f8c94f', pos: '#ff7a63', neg: '#6f9bff', up: '#fb923c', dn: '#7aa2ff' }
      : { fg: '#101b34', mut: '#6a7690', gold: '#b07c09', pos: '#e0573f', neg: '#3568d4', up: '#c2410c', dn: '#1d4ed8' };
  }

  private fill(): number[] {
    const g = this.geo(), D = this.delta(), E = COEF[g].map(c => c * D), o = [0, 0, 0, 0, 0];
    for (let k = 0; k < this.n(); k++) {
      let b = -1, bc = 1e9;
      for (let i = 0; i < 5; i++) {
        if (o[i] >= 2) continue;
        const c = E[i] + (o[i] === 1 ? P : 0);
        if (c < bc - 1e-9) { bc = c; b = i; }
      }
      o[b]++;
    }
    return o;
  }

  private setup(c: HTMLCanvasElement, ratio: number): [number, number, CanvasRenderingContext2D] {
    const r = devicePixelRatio || 1, w = c.clientWidth, h = Math.round(w * ratio);
    if (c.width !== Math.round(w * r) || c.height !== Math.round(h * r)) { c.width = Math.round(w * r); c.height = Math.round(h * r); c.style.height = h + 'px'; }
    const x = c.getContext('2d')!; x.setTransform(r, 0, 0, r, 0, 0);
    return [w, h, x];
  }

  private proj(p: V3, w: number, h: number) {
    const [x, y, z] = p, c = Math.cos(this.ang), sn = Math.sin(this.ang), px = x * c - y * sn, d0 = x * sn + y * c;
    const ct = Math.cos(this.tilt), st = Math.sin(this.tilt), sy = z * ct - d0 * st, dp = d0 * ct + z * st;
    const k = 1 / (1 - dp * .12), U = Math.min(w, h) * .15;
    return { x: w / 2 + px * k * U, y: h / 2 - sy * k * U, z: dp, k, U };
  }

  private draw3(pal: ReturnType<CrystalField['palette']>): void {
    const [w, h, x] = this.setup(this.c3.nativeElement, 1);
    x.clearRect(0, 0, w, h);
    const g = this.geo(), items: { z: number; f: () => void }[] = [], o = this.proj([0, 0, 0], w, h), sel = this.sel;
    ([[2.6, 0, 0, 'x'], [0, 2.6, 0, 'y'], [0, 0, 2.6, 'z']] as [number, number, number, string][]).forEach(a => {
      const p = this.proj([a[0], a[1], a[2]], w, h);
      items.push({ z: -9, f: () => {
        x.strokeStyle = pal.mut; x.globalAlpha = .4; x.lineWidth = 1; x.beginPath(); x.moveTo(o.x, o.y); x.lineTo(p.x, p.y); x.stroke(); x.globalAlpha = 1;
        x.fillStyle = pal.mut; x.font = '12px sans-serif'; x.fillText(a[3], p.x + 4, p.y - 4);
      } });
    });
    const r = 2.2 * (1 + (1 - this.t) * .9);
    LIGANDS[g].forEach(v => {
      const p = this.proj(v.map(a => a * r) as V3, w, h);
      items.push({ z: p.z, f: () => {
        x.strokeStyle = pal.mut; x.globalAlpha = .5; x.lineWidth = 2; x.beginPath(); x.moveTo(o.x, o.y); x.lineTo(p.x, p.y); x.stroke(); x.globalAlpha = 1;
        const R = .34 * p.k * p.U, gr = x.createRadialGradient(p.x - R * .3, p.y - R * .3, R * .1, p.x, p.y, R);
        gr.addColorStop(0, '#ffe9a0'); gr.addColorStop(1, '#b07c09');
        x.fillStyle = gr; x.beginPath(); x.arc(p.x, p.y, R, 0, 7); x.fill();
        x.fillStyle = '#07142d'; x.font = 'bold ' + Math.max(9, R * .8) + 'px sans-serif'; x.textAlign = 'center'; x.fillText('L', p.x, p.y + R * .28); x.textAlign = 'left';
      } });
    });
    LOBES[sel].forEach(l => {
      const p = this.proj([l[0] * .95, l[1] * .95, l[2] * .95], w, h);
      items.push({ z: p.z, f: () => { x.fillStyle = l[3] > 0 ? pal.pos : pal.neg; x.globalAlpha = .55; x.beginPath(); x.arc(p.x, p.y, .55 * p.k * p.U, 0, 7); x.fill(); x.globalAlpha = 1; } });
    });
    if (sel === 3) for (let i = 0; i < 14; i++) {
      const a = i / 14 * 6.283, p = this.proj([.75 * Math.cos(a), .75 * Math.sin(a), 0], w, h);
      items.push({ z: p.z, f: () => { x.fillStyle = pal.neg; x.globalAlpha = .5; x.beginPath(); x.arc(p.x, p.y, .22 * p.k * p.U, 0, 7); x.fill(); x.globalAlpha = 1; } });
    }
    items.push({ z: o.z, f: () => {
      const R = .3 * o.U, gr = x.createRadialGradient(o.x - R * .3, o.y - R * .3, 2, o.x, o.y, R);
      gr.addColorStop(0, '#dfe6f3'); gr.addColorStop(1, '#4a5d82');
      x.fillStyle = gr; x.beginPath(); x.arc(o.x, o.y, R, 0, 7); x.fill();
      x.fillStyle = '#fff'; x.font = 'bold 11px sans-serif'; x.textAlign = 'center'; x.fillText('M', o.x, o.y + 4); x.textAlign = 'left';
    } });
    items.sort((a, b) => a.z - b.z).forEach(i => i.f());
    x.fillStyle = pal.fg; x.font = '600 13px sans-serif'; x.fillText(NAMES[sel] + ' orbital', 10, 20);
  }

  private arrow(x: CanvasRenderingContext2D, a: number, b: number, c: string, up: boolean): void {
    x.strokeStyle = c; x.fillStyle = c; x.lineWidth = 2;
    const d = up ? -1 : 1;
    x.beginPath(); x.moveTo(a, b - 8 * d); x.lineTo(a, b + 8 * d); x.stroke();
    x.beginPath(); x.moveTo(a, b + 8 * d); x.lineTo(a - 4, b + 2 * d); x.lineTo(a + 4, b + 2 * d); x.fill();
  }

  private drawD(occ: number[], pal: ReturnType<CrystalField['palette']>): void {
    const [w, h, x] = this.setup(this.cd.nativeElement, 1.05), g = this.geo(), D = this.delta(), t = this.t;
    x.clearRect(0, 0, w, h); this.hits = [];
    const cy = h * .5, S = h * .105, ml = 38, mr = 46, gs = GROUPS[g];
    x.strokeStyle = pal.mut; x.lineWidth = 1.2; x.beginPath(); x.moveTo(20, h - 14); x.lineTo(20, 14); x.stroke();
    x.beginPath(); x.moveTo(20, 12); x.lineTo(16, 20); x.lineTo(24, 20); x.fillStyle = pal.mut; x.fill();
    x.font = '12px sans-serif'; x.fillText('E', 26, 18);
    x.setLineDash([5, 4]); x.beginPath(); x.moveTo(ml - 6, cy); x.lineTo(w - mr + 4, cy); x.stroke(); x.setLineDash([]);
    x.fillText('average (spherical field)', ml, cy - 5);
    const ys: number[] = [];
    gs.forEach((G, j) => {
      const cx = ml + (j + .5) / gs.length * (w - ml - mr), y = cy - COEF[g][G.i[0]] * D * t * S;
      ys.push(y);
      const lw = 34, gap = 6, tot = G.i.length * (lw + gap) - gap;
      G.i.forEach((i, k) => {
        const x0 = cx - tot / 2 + k * (lw + gap), on = i === this.sel;
        x.strokeStyle = on ? pal.gold : pal.fg; x.lineWidth = on ? 4 : 2.5;
        x.beginPath(); x.moveTo(x0, y); x.lineTo(x0 + lw, y); x.stroke();
        this.hits.push({ i, x: x0 + lw / 2, y });
        if (occ[i] >= 1) this.arrow(x, x0 + lw / 2 - (occ[i] > 1 ? 6 : 0), y, pal.up, true);
        if (occ[i] > 1) this.arrow(x, x0 + lw / 2 + 6, y, pal.dn, false);
        x.fillStyle = on ? pal.gold : pal.mut; x.font = '11px sans-serif'; x.textAlign = 'center';
        x.fillText(NAMES[i], x0 + lw / 2, y + (y < cy ? 20 : -12)); x.textAlign = 'left';
      });
      x.fillStyle = pal.fg; x.font = '600 13px sans-serif'; x.textAlign = 'center';
      x.fillText(G.n, cx, y + (y < cy ? 36 : -28)); x.textAlign = 'left';
    });
    if (g !== 'sq' && t > .05) {
      const xr = w - mr + 14, a = ys[0], b = ys[1];
      x.strokeStyle = pal.gold; x.lineWidth = 1.5; x.beginPath(); x.moveTo(xr, a); x.lineTo(xr, b); x.stroke();
      ([[a, 1], [b, -1]] as [number, number][]).forEach(([yy, d]) => {
        x.beginPath(); x.moveTo(xr, yy); x.lineTo(xr - 4, yy + 5 * d); x.lineTo(xr + 4, yy + 5 * d); x.fillStyle = pal.gold; x.fill();
      });
      x.fillStyle = pal.gold; x.font = '600 13px sans-serif'; x.fillText(g === 'oct' ? 'Δₒ' : 'Δₜ', xr + 6, (a + b) / 2 + 4);
    }
  }

  private updateInfo(occ: number[]): void {
    const g = this.geo(), n = this.n(), D = this.delta();
    const cfg = GROUPS[g].map(G => { const k = G.i.reduce((a, i) => a + occ[i], 0); return k ? G.n + sup(k) : ''; }).filter(Boolean).join(' ');
    const u = occ.filter(o => o === 1).length, mx = n <= 5 ? n : 10 - n;
    const cf = occ.reduce((a, o, i) => a + o * COEF[g][i], 0), mu = Math.sqrt(u * (u + 2));
    const tag = n >= 4 && n <= 7 && g !== 'sq' ? (u === mx ? ' (high spin)' : ' (low spin)') : '';
    const dd = g === 'tet' ? D * 4 / 9 : D;
    const next = { cfg, unpaired: u, tag, mu: mu.toFixed(2), cfse: cf.toFixed(2), dp: `${dd.toFixed(2)} ${dd > P ? '>' : '<'} 1.00`, pairs: occ.filter(o => o === 2).length };
    const cur = this.info();
    if (JSON.stringify(cur) !== JSON.stringify(next)) this.info.set(next);
  }
}
