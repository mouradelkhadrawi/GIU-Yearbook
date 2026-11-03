/* =====================================================================
   FILE: src/app/components/student-card/student-card.ts
   WHAT: The student card: shows one student's portrait, name, faculty
         and quote, and links to their story page.
   WHY:  A separate component makes the card reusable. The parent page
         passes the data in through an input.
   ===================================================================== */
import { Component, computed, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Student } from '../../models/student.model';

@Component({
  selector: 'app-student-card',
  imports: [RouterLink],
  templateUrl: './student-card.html',
  styleUrl: './student-card.css',
})
export class StudentCard {
  // The parent page gives us one student through this input.
  readonly student = input.required<Student>();

  // Did the portrait fail to load?
  private readonly imageFailed = signal(false);

  // The path actually shown: placeholder if the real image failed.
  protected readonly photoSrc = computed(() =>
    this.imageFailed() ? 'images/placeholder-portrait.svg' : this.student().photo,
  );

  // Called by the template when the image cannot be loaded.
  protected onImageError(): void {
    this.imageFailed.set(true);
  }
}