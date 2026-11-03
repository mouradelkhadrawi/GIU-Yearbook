/* =====================================================================
   FILE: src/app/components/student-card/student-card.ts
   WHAT: The student card: portrait, name, faculty, quote, a link to the
         story page and a heart button to save the student.
   WHY:  A separate component makes the card reusable. The saved list
         lives in SavedService, so the card only asks and toggles.
   ===================================================================== */
import { Component, computed, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Student } from '../../models/student.model';
import { SavedService } from '../../services/saved.service';

@Component({
  selector: 'app-student-card',
  imports: [RouterLink],
  templateUrl: './student-card.html',
  styleUrl: './student-card.css',
})
export class StudentCard {
  // The parent page gives us one student through this input.
  readonly student = input.required<Student>();

  // The shared service. The card does not own the saved list; it only asks.
  private readonly saved = inject(SavedService);

  // Is THIS student saved? Re-runs when the service's list changes.
  protected readonly isSaved = computed(() => this.saved.isSaved(this.student().id));

  // Did the portrait fail to load?
  private readonly imageFailed = signal(false);

  // The path actually shown: placeholder if the real image failed.
  protected readonly photoSrc = computed(() =>
    this.imageFailed() ? 'images/placeholder-portrait.svg' : this.student().photo,
  );

  protected onImageError(): void {
    this.imageFailed.set(true);
  }

  protected onToggleSaved(event: Event): void {
    // The whole card is a link: stop the click from opening the profile.
    event.preventDefault();
    event.stopPropagation();
    this.saved.toggle(this.student().id);
  }
}