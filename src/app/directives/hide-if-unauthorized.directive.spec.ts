import { HideIfUnauthorizedDirective } from './hide-if-unauthorized.directive';

describe('HideIfUnauthorizedDirective', () => {
  it('should create an instance', () => {
    const directive = new HideIfUnauthorizedDirective(null,null);
    expect(directive).toBeTruthy();
  });
});
