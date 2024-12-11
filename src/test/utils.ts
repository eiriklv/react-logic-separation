import { Action } from 'easy-peasy';
import { Middleware } from 'redux';

export const trackActionsMiddleware = <T extends object>(): Middleware & { actions: Action<T>[] } => {
  // @ts-expect-error ignore
  const middleware = () => (next) => (_action) => {
    if (_action != null && typeof _action === 'object') {
      middleware.actions.push(_action);
    }
    return next(_action);
  };
  // @ts-expect-error ignore
  middleware.actions = [];
  return middleware;
};