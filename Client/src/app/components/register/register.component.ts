import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { NotificatorService } from 'src/app/core/services/notificator.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  constructor(
    private readonly auth: AuthService,
    private readonly notificator: NotificatorService,
    private readonly router: Router,
  ) { }

  triggerRegister(username: string, password: string, email: string, firstName: string, lastName: string) {
    this.auth.register(username, password, email, firstName, lastName).subscribe(
      result => {
        this.notificator.success('You have registered successfully!');
        this.auth.login(username, password).subscribe(
          res => {
            this.notificator.success(`Wellcome ${username}`);
            this.router.navigate(['home']);
          },
        );
      },
      error => this.notificator.error('Failed to register! Your email or username already exist.'),
    );
  }

}
