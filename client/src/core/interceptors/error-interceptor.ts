import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core/primitives/di';
import { ToastService } from '../services/toast-service';
import { NavigationExtras, Router } from '@angular/router';
import { catchError } from 'rxjs/internal/operators/catchError';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toast = inject(ToastService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error) => {
      if (error) {
        switch (error.status) {
          case 400:
            const errors = error.error.errors;
            if (errors) {
              const modelStateErrors = [];
              for (const key in errors) {
                if (errors[key]) {
                  modelStateErrors.push(errors[key]);
                }
              }
              throw modelStateErrors.flat();
            } else {
              toast.error(error.error);
            }
            break;
          case 401:
            toast.error('Unauthorized');
            break;
          case 404:
            router.navigate(['/not-found']);
            break;
          case 500:
            const navigationExtras: NavigationExtras = { state: { error: error.error } };
            router.navigateByUrl('/server-error', navigationExtras);
            break;
          default:
            toast.error('Oops! something went wrong');
            console.error(error);
        }
      }
      throw error;
    }),
  );
};
