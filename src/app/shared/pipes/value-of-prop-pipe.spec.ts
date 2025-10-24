import { ValueOfPropPipe } from './value-of-prop-pipe';

describe('HasNamePropPipe', () => {
  it('create an instance', () => {
    const pipe = new ValueOfPropPipe();
    expect(pipe).toBeTruthy();
  });
});
