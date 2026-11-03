/* =====================================================================
   FILE: src/app/services/saved.service.ts
   WHAT: Holds the list of saved student ids for the whole app.
   WHY:  One root service means the card hearts and the header count
         read the same signal, so they always agree.
   ===================================================================== */
import { Injectable, computed, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SavedService {
  // Only this service can change the list.
  private readonly _ids = signal<number[]>([]);

  // Everybody else gets a read-only view.
  readonly ids = this._ids.asReadonly();

  // Derived state: calculated from the list, never stored.
  readonly count = computed(() => this._ids().length);

  isSaved(id: number): boolean {
    return this._ids().includes(id);
  }

  toggle(id: number): void {
    // New array each time: signals notice a new value, not a mutated array.
    this._ids.update((ids) =>
      ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id],
    );
  }
}