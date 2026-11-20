import { AfterViewInit, Component, ElementRef, OnDestroy, PLATFORM_ID, ViewChild, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { TranslatePipe } from '../core/translate.pipe';
import { CHAPTERS } from '../data/chapters';
import { PROFILE_PHOTO_SRC } from '../config';

@Component({
  selector: 'app-hero',
  imports: [TranslatePipe],
  host: { style: 'display:contents' },
  template: `
    <section class="hero" id="home">
      <div class="wrap hero-grid">
        <div class="hero-main">
          <div class="hero-left">
            <div class="hero-visual" aria-label="Rotating three-dimensional fullerene C60 model">
              <canvas #fullerene class="fullerene-background" width="960" height="640" aria-hidden="true"></canvas>
              <div class="fullerene-label"><span class="fullerene-live"></span><span>CARBON ALLOTROPE</span><b>C<sub>60</sub></b></div>
              <div class="fullerene-caption"><span>ROTATING STRUCTURE</span><i></i><span>60 ATOMS · 90 BONDS</span></div>
            </div>
            <div class="hero-note">
              <div><strong>{{ chapterCount }}</strong><small>{{ 'hero.stat1' | t }}</small></div>
              <div><strong>{{ 'hero.stat2v' | t }}</strong><small>{{ 'hero.stat2' | t }}</small></div>
              <div><strong>{{ 'hero.stat3v' | t }}</strong><small>{{ 'hero.stat3' | t }}</small></div>
            </div>
          </div>
          <div class="hero-copy">
             <div class="hero-profile-card" id="profile">
              <div class="hero-profile-avatar"><img [src]="profilePhoto" alt="Dr. Ashokan P, Chemistry Guru" width="150" height="180"></div>
              <div class="hero-profile-info">
                <span class="hero-profile-eyebrow"><i></i>{{ 'hero.eyebrow' | t }}</span>
                <h2>Dr. Ashokan P</h2>
                <p>{{ 'profile.role' | t }}</p>
                <div class="hero-profile-chips"><span>Class XI &amp; XII Chemistry</span><span>One-Mark Practice</span></div>
              </div>
              <div class="hero-profile-mark"><small>Ph.D.</small><b>Ap</b></div>
              <div class="hero-profile-details" aria-label="Teacher credentials">
                <span class="hero-profile-details-title">TEACHING DETAILS</span>
                <div class="hero-profile-detail"><span>{{ 'profile.degrees' | t }}</span><b>M.Sc., B.Ed., M.Phil., Ph.D.</b></div>
                <div class="hero-profile-detail"><span>{{ 'profile.position' | t }}</span><b>Postgraduate Assistant in Chemistry</b></div>
                <div class="hero-profile-detail"><span>{{ 'profile.school' | t }}</span><b>Government (ADW) Higher Secondary School, Athipallam, Krishnagiri District.</b></div>
              </div>
            </div>
            <h1>{{ 'hero.title1' | t }}<br><span>{{ 'hero.title2' | t }}</span></h1>
            <p>{{ 'hero.text' | t }}</p>
            <div class="hero-actions">
              <a class="btn" href="#quizzes">{{ 'hero.start' | t }}</a>
              <a class="btn ghost" href="#contact">{{ 'hero.meet' | t }}</a>
            </div>
           
          </div>
        </div>
      </div>
    </section>
  `,
})
export class Hero implements AfterViewInit, OnDestroy {
  @ViewChild('fullerene', { static: true }) private fullerene?: ElementRef<HTMLCanvasElement>;
  protected readonly chapterCount = CHAPTERS.length;
  protected readonly profilePhoto = PROFILE_PHOTO_SRC;
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private frame = 0;
  private angle = 0;
  private lastTime = 0;
  private visible = true;
  private observer?: IntersectionObserver;
  private readonly reducedMotion = this.isBrowser && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  private readonly vertices: [number, number, number][] = [];
  private readonly bonds: [number, number][] = [];

  constructor() { this.createFullerene(); }

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;
    this.observer = new IntersectionObserver(([entry]) => { this.visible = entry.isIntersecting; this.syncLoop(); }, { rootMargin: '80px' });
    this.observer.observe(this.fullerene!.nativeElement);
    document.addEventListener('visibilitychange', this.syncLoop);
    this.syncLoop();
  }

  ngOnDestroy(): void {
    if (!this.isBrowser) return;
    cancelAnimationFrame(this.frame);
    this.observer?.disconnect();
    document.removeEventListener('visibilitychange', this.syncLoop);
  }

  /** Run the animation loop only while the hero is on screen and the tab is visible. */
  private readonly syncLoop = (): void => {
    const shouldRun = this.visible && !document.hidden;
    if (shouldRun && !this.frame) { this.lastTime = 0; this.frame = requestAnimationFrame(this.render); }
    else if (!shouldRun && this.frame) { cancelAnimationFrame(this.frame); this.frame = 0; }
  };

  private createFullerene(): void {
    const phi = (1 + Math.sqrt(5)) / 2;
    const base: [number, number, number][] = [
      [-1,phi,0],[1,phi,0],[-1,-phi,0],[1,-phi,0], [0,-1,phi],[0,1,phi],
      [0,-1,-phi],[0,1,-phi], [phi,0,-1],[phi,0,1],[-phi,0,-1],[-phi,0,1],
    ].map(([x,y,z]) => { const length = Math.hypot(x,y,z); return [x/length,y/length,z/length]; });
    let edgeLength = Infinity;
    for (let a = 0; a < base.length; a++) for (let b = a + 1; b < base.length; b++) edgeLength = Math.min(edgeLength, this.distance(base[a], base[b]));
    for (let a = 0; a < base.length; a++) for (let b = a + 1; b < base.length; b++) {
      if (Math.abs(this.distance(base[a], base[b]) - edgeLength) > .001) continue;
      for (const [from, to] of [[a,b],[b,a]]) {
        const point: [number,number,number] = [0,1,2].map(i => base[from][i] * 2/3 + base[to][i] / 3) as [number,number,number];
        const length = Math.hypot(...point); this.vertices.push(point.map(value => value / length) as [number,number,number]);
      }
    }
    let sideLength = Infinity;
    for (let a = 0; a < this.vertices.length; a++) for (let b = a + 1; b < this.vertices.length; b++) sideLength = Math.min(sideLength, this.distance(this.vertices[a], this.vertices[b]));
    for (let a = 0; a < this.vertices.length; a++) for (let b = a + 1; b < this.vertices.length; b++) {
      if (Math.abs(this.distance(this.vertices[a], this.vertices[b]) - sideLength) < .002) this.bonds.push([a,b]);
    }
  }

  private distance(a: [number,number,number], b: [number,number,number]): number {
    return Math.hypot(a[0]-b[0], a[1]-b[1], a[2]-b[2]);
  }

  private readonly render = (time: number): void => {
    this.frame = requestAnimationFrame(this.render);
    const dt = this.lastTime ? Math.min(time - this.lastTime, 50) : 16.7;
    this.lastTime = time;
    const canvas = this.fullerene?.nativeElement;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const width = Math.round(rect.width * dpr); const height = Math.round(rect.height * dpr);
    if (canvas.width !== width || canvas.height !== height) { canvas.width = width; canvas.height = height; }
    const ctx = canvas.getContext('2d'); if (!ctx) return;
    ctx.setTransform(dpr,0,0,dpr,0,0); ctx.clearRect(0,0,rect.width,rect.height);
    if (!this.reducedMotion) this.angle += dt * .00021;
    const cx = rect.width * .5; const cy = rect.height * .5;
    const radius = Math.min(rect.width * .4, rect.height * .4);
    const aura = ctx.createRadialGradient(cx,cy,radius*.2,cx,cy,radius*1.7);
    aura.addColorStop(0,'#0874d9c9'); aura.addColorStop(.48,'#07519b80'); aura.addColorStop(1,'#03152b00');
    ctx.fillStyle = aura; ctx.fillRect(0,0,rect.width,rect.height);
    ctx.save(); ctx.translate(cx,cy+radius*.94); ctx.scale(1,.17);
    const shadow = ctx.createRadialGradient(0,0,0,0,0,radius*.88);
    shadow.addColorStop(0,'#020916a8'); shadow.addColorStop(.55,'#06254a66'); shadow.addColorStop(1,'#082b4b00');
    ctx.fillStyle = shadow; ctx.beginPath(); ctx.arc(0,0,radius*.88,0,Math.PI*2); ctx.fill(); ctx.restore();
    const cosY = Math.cos(this.angle); const sinY = Math.sin(this.angle);
    const tilt = .34; const cosX = Math.cos(tilt); const sinX = Math.sin(tilt);
    const points = this.vertices.map(([x,y,z]) => {
      const rx = x * cosY + z * sinY; const rz = -x * sinY + z * cosY;
      const ry = y * cosX - rz * sinX; const depth = y * sinX + rz * cosX;
      const perspective = 3.2 / (3.2 - depth * .72);
      return { x: cx + rx * radius * perspective, y: cy + ry * radius * perspective, depth, perspective };
    });
    const bonds = this.bonds.map(([a,b],index) => ({ p: points[a], q: points[b], index }))
      .sort((a,b) => (a.p.depth+a.q.depth) - (b.p.depth+b.q.depth));
    for (const {p,q,index} of bonds) {
      const depth = (p.depth + q.depth) / 2;
      const scale = (p.perspective + q.perspective) / 2;
      const style = (index * 11 + 5) % 19;
      const colors = style < 3
        ? ['#9b6308','#ffd34d','#fff6c8','#ffb90c','#8c5600']
        : style < 6
          ? ['#064591','#278cff','#d9f5ff','#0878ff','#073c91']
          : ['#566275','#dce8f8','#ffffff','#c6d8ef','#596b85'];
      const gradient = ctx.createLinearGradient(p.x,p.y,q.x,q.y);
      colors.forEach((color, i) => gradient.addColorStop(i/(colors.length-1),color));
      ctx.globalAlpha = .7 + Math.max(0,depth+1)*.26;
      ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      ctx.beginPath(); ctx.moveTo(p.x,p.y); ctx.lineTo(q.x,q.y);
      ctx.strokeStyle = '#020814'; ctx.lineWidth = radius*.037*scale; ctx.stroke();
      ctx.shadowColor = style < 3 ? '#ffc336' : style < 6 ? '#168bff' : '#b9d9ff';
      ctx.shadowBlur = radius*.035*scale; ctx.strokeStyle = gradient; ctx.lineWidth = radius*.025*scale; ctx.stroke();
      ctx.shadowBlur = 0; ctx.strokeStyle = '#ffffffa8'; ctx.lineWidth = Math.max(1,radius*.0035*scale); ctx.stroke();
    }
    ctx.globalAlpha = 1;
    for (const point of [...points].sort((a,b) => a.depth - b.depth)) {
      const r = radius*.078*point.perspective;
      ctx.globalAlpha = .58 + Math.max(0,point.depth+1)*.3;
      ctx.shadowColor = '#56bfff'; ctx.shadowBlur = r*.95;
      const atom = ctx.createRadialGradient(point.x-r*.42,point.y-r*.48,r*.04,point.x+r*.16,point.y+r*.18,r*1.3);
      atom.addColorStop(0,'#f8fcff'); atom.addColorStop(.12,'#a9bfd7'); atom.addColorStop(.3,'#56677d'); atom.addColorStop(.64,'#202a3a'); atom.addColorStop(.88,'#090e17'); atom.addColorStop(1,'#02050b');
      ctx.fillStyle = atom; ctx.beginPath(); ctx.arc(point.x,point.y,r,0,Math.PI*2); ctx.fill();
      ctx.shadowBlur = 0; ctx.strokeStyle = '#c9e9ffb0'; ctx.lineWidth = Math.max(.8,r*.08); ctx.stroke();
      const specular = ctx.createRadialGradient(point.x-r*.36,point.y-r*.42,0,point.x-r*.36,point.y-r*.42,r*.42);
      specular.addColorStop(0,'#ffffffd9'); specular.addColorStop(1,'#ffffff00');
      ctx.fillStyle = specular; ctx.beginPath(); ctx.arc(point.x-r*.36,point.y-r*.42,r*.42,0,Math.PI*2); ctx.fill();
    }
    ctx.globalAlpha = 1; ctx.shadowBlur = 0;
  };
}
