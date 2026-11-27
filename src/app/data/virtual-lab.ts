export interface LabItem {
  path: string;
  title: string;
  desc: string;
  icon: string;
  ready: boolean;
}

/** Virtual Lab mega-menu entries. Set `ready: true` once a page has real content. */
export const LAB_ITEMS: LabItem[] = [
  { path: 'virtual-lab/class-11-practical', title: '11 Chem Prac - 26 (H)', desc: 'Class 11 chemistry practical', icon: '⚗️', ready: false },
  { path: 'virtual-lab/class-12-volumetric', title: '12 Chem. Prac (Vol. Analysis)', desc: 'Class 12 volumetric analysis', icon: '🧪', ready: false },
  { path: 'virtual-lab/vsepr-theory', title: 'VSEPR Theory Simulator', desc: 'Molecular shapes in 3D', icon: '🔬', ready: true },
  { path: 'virtual-lab/crystal-field-splitting', title: 'Crystal Field Splitting', desc: 'd-orbital splitting simulator', icon: '💎', ready: true },
];
