import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-lab-placeholder',
  imports: [RouterLink],
  host: { style: 'display:contents' },
  template: `
    <section class="section cfs-section cfs-page">
      <div class="wrap">
        <a class="cfs-back" routerLink="/">← Back to home</a>
        <div class="section-head"><div>
          <div class="kicker">VIRTUAL LAB</div>
          <h2>{{ title }}</h2>
          <p>Update coming soon.</p>
        </div></div>
      </div>
    </section>
  `,
})
export class LabPlaceholder {
  protected readonly title: string = inject(ActivatedRoute).snapshot.data['title'] ?? 'Virtual Lab';
}
