import { Component, OnInit, OnDestroy } from '@angular/core';
import { NotificatorService } from './core/services/notificator.service';
import { AuthService } from './core/services/auth.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  public username = '';
  public isLogged = false;
  private subscribtion: Subscription;


  constructor(
    private readonly notificator: NotificatorService,
    private readonly auth: AuthService,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    this.subscribtion = this.auth.user$.subscribe(
      (username) => {
        if (username === null) {
          this.username = '';
          this.isLogged = false;
          // this.notificator.success('You are logged out!');
        } else {
          this.username = username;
          this.isLogged = true;
         // this.notificator.success(`Wellcome ${username}!`);
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.subscribtion.unsubscribe();
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['home']);
    this.notificator.success('You have logged out!');
  }

}
