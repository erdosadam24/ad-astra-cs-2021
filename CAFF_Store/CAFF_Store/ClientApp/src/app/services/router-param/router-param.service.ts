import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RouterParamService {

  params: any;

  constructor(public router: Router, private activatedRoute: ActivatedRoute) {
    this.activatedRoute.queryParams.subscribe(routerParams => {
      this.params = routerParams;
    });
  }


  paginationQueryParams(page: number, size: number, sort: string, asc?: string) {
    const params = {
      page: page,
      size: size,
      sort: sort,
      asc: asc
    };

    this.params = params;
    this.router.navigate(
        [],
        {
            queryParams: params,
            queryParamsHandling: 'merge',
        }
    );
  }

  onParamChange() {
    return this.activatedRoute.queryParams;
  }
}
