import { Component, computed, input } from '@angular/core';
import { User } from '../../data-access/models/user-model';

@Component({
  selector: 'user-badge',
  template: `
    <div class="inline-flex justify-center items-center bg-blue-600 text-white w-10 h-10 rounded-full border-2 border-inherit">
      {{ initials() }}
    </div>
  `,
  imports: [],
})
export class UserBadge {
  readonly user = input.required<User>();
  readonly initials = computed(() => this.formatShortName(this.user()));

  private formatShortName(user: User): string {
    const s = user.name.split(' ');
    const firstInitial = s[0][0];
    const lastInitial = s[s.length - 1][0];

    return `${firstInitial.toUpperCase()}${lastInitial.toUpperCase()}`;
  }
}
