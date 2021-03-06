import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

import { User } from '../../interface/user';
import { AuthenticationService } from '../../service/authentication.service';
import { ApiService } from '../../service/api.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})

export class NavComponent implements OnInit, OnDestroy {
  currentUser: User;
  currentUserSubscription: Subscription;
  appTitle = 'GitHubTrending';

  constructor(
    private auth: AuthenticationService,
    private router: Router,
    private api: ApiService
  ) {
    this.currentUserSubscription = this.auth.currentUser.subscribe(user => {
      this.currentUser = user;
    });
  }

  ngOnDestroy(): void {
    this.currentUserSubscription.unsubscribe();
  }

  ngOnInit(): void {
  }

  logout(): void {
    this.api.delete('/sessions').subscribe(() => {
      this.auth.logout();
      this.router.navigate(['/login']);
    });
  }
}
