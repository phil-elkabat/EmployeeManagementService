import { CanActivateFn } from '@angular/router';

export const authFooGuard: CanActivateFn = (route, state) => {
  return true;
};
