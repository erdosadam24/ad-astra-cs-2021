import { Injectable, OnDestroy } from "@angular/core";
import { Observable, ReplaySubject, Subscriber } from "rxjs";

@Injectable()
export class AutoDestroy extends Observable<void> implements OnDestroy {
    private readonly destroySubject$ = new ReplaySubject<void>(1);

    constructor(){
        super(subscriber => this.destroySubject$.subscribe(subscriber));
    }

    ngOnDestroy(): void {
        this.destroySubject$.next();
        this.destroySubject$.complete();
    }

}