import { Component } from '@angular/core';
import { TranslatePipe } from '../core/translate.pipe';
import { RevealDirective } from '../shared/reveal.directive';
import { PROFILE_PHOTO_SRC } from '../config';

@Component({
  selector: 'app-profile-card',
  imports: [TranslatePipe, RevealDirective],
  host: { style: 'display:contents' },
  template: `
    <aside class="profile" id="profile" appReveal>
      <div class="profile-card">
        <div class="tile-corner"><span>Ph.D.</span><b>Ap</b></div>
        <div class="avatar"><img [src]="photo" alt="Dr. Ashokan P, Chemistry Guru" width="150" height="180"></div>
        <h2>Dr. Ashokan P</h2>
        <div class="role">{{ 'profile.role' | t }}</div>
        <ul class="creds">
          <li><span>{{ 'profile.degrees' | t }}</span><b>M.Sc., B.Ed., M.Phil., Ph.D.</b></li>
          <li><span>{{ 'profile.position' | t }}</span><div>Postgraduate Assistant in Chemistry</div></li>
          <li><span>{{ 'profile.school' | t }}</span><div>Government (ADW) Higher Secondary School, Athipallam, Krishnagiri District.</div></li>
        </ul>
        <div class="profile-meta"><span class="chip">Class XI &amp; XII Chemistry</span><span class="chip alt">One-Mark Practice</span></div>
      </div>
    </aside>
  `,
})
export class ProfileCard {
  protected readonly photo = PROFILE_PHOTO_SRC;
}
