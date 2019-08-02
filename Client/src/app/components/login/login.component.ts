import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { NotificatorService } from 'src/app/core/services/notificator.service';
import { Router } from '@angular/router';
import {
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly auth: AuthService,
    private readonly notificator: NotificatorService,
    private readonly router: Router,
  ) { }

  public ngOnInit() {
    this.loginForm = this.formBuilder.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20),
        ]
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,20}$/
          ),
        ]
      ],
    });
  }

  triggerLogin(username: string, password: string, email: string) {
    this.auth.login(username, password).subscribe(
      (res: any) => {
        const payload: any = this.auth.tokenPeyloadReader(res.token);
        this.notificator.success(`Wellcome ${payload.username}`);
        this.router.navigate(['home']);
      },
      error => this.notificator.error('Oops... Something is wrong!'),
    );
  }
}
