import { Component, computed, input } from '@angular/core';
import { GenericBadge } from '../../../shared/ui/badges/generic-badge';
import { UserBadge } from '../../../shared/ui/badges/user-badge';
import { User } from '../../../shared/data-access/models/user-model';

@Component({
  selector: 'user-list',
  template: `
    @for(user of displayedUsers(); track $index) {
      <user-badge [user]="user" />
    }

    @if(remainingUserCount()){
      <generic-badge>
        {{ remainingUserCount() }}
      </generic-badge>
    }
  `,
  imports: [UserBadge, GenericBadge],
  host: {
    'class': 'flex -space-x-2'
  }
})
export class UserList {
  readonly users = input.required<User[]>();
  readonly max = input<number>(5);

  readonly remainingUserCount = computed(() => {
    if(this.users().length > this.max()){
      const remaining = this.users().length - this.max();
      return `+${remaining}`;
    }

    return '';
  });

  readonly displayedUsers = computed(() => this.users().slice(0, this.max()));
}
