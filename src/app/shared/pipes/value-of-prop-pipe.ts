import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'valueOf'
})
export class ValueOfPropPipe implements PipeTransform {

  transform<T>(value: T | null | undefined, arg: string): string {
    if( typeof value == 'undefined' || value == null ) return "";

    const hasName = value.hasOwnProperty(arg)
    
    if(hasName){
      const r = value as T & { [arg: string]: string };

      return r[arg];
    }
    
    return "";
  }
}
