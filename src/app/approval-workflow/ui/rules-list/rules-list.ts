import { Component, computed, input, signal } from '@angular/core';
import { Rule } from '../../data-access/models/rule-model';

@Component({
  selector: 'rules-list',
  template: `
    @for(rule of displayedRules(); track $index){
      <div class="flex flex-row gap-2 items-center text-gray-600">
        <div class="text-green-500 inline-flex h-[1em]">
          <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" viewBox="0 0 512 512"><path fill="currentColor" d="M256 512a256 256 0 1 0 0-512 256 256 0 1 0 0 512zm113-303L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/></svg>
        </div>
        <span>{{ rule.description }}</span>
      </div>
    }

    @if(rules().length > max()){
      <button 
        class="text-xs text-blue-600 hover:text-blue-700 font-medium mt-2 flex gap-1 items-center cursor-pointer" 
        type="button"
        (click)="showAllRules.set(!showAllRules())"
      >
        <span class="inline-flex h-[1em]" [class.rotate-x-180]="showAllRules()">
          <svg aria-hidden="true" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"></path></svg>
        </span>
        {{ toggleBtnText() }}
      </button>
    }
  `,
  host: {
    'class': 'flex flex-col gap-1'
  }
})
export class RulesList {
  readonly rules = input.required<Rule[]>();
  readonly max = input<number>(5);
  readonly showAllRules = signal<boolean>(false)

  readonly displayedRules = computed(() => {
    if(!this.showAllRules()){
      return this.rules().slice(0, this.max());
    }

    return this.rules();
  });

  readonly toggleBtnText = computed(() => {
    if(this.showAllRules()){
      return 'Hide Rules';
    }

    return `View All Rules (${this.rules().length - 1 })`;
  });
}
