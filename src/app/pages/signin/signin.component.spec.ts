import { Location } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { Subject } from 'rxjs';
import { BlankComponent } from 'src/app/mocks/blank/blank.component';
import { AuthenticationService } from './services/authentication.service';
import { SigninComponent } from './signin.component';

describe('SigninComponent', () => {
  let component: SigninComponent;
  let fixture: ComponentFixture<SigninComponent>;
  let page: any;
  let location: Location;
  let authenticationServiceMock: AuthenticationServiceMock;
  let snackBarMock: SnackBarMock;

  beforeEach(async () => {
    authenticationServiceMock = new AuthenticationServiceMock();
    snackBarMock = new SnackBarMock();

    TestBed.configureTestingModule({
      declarations: [SigninComponent],
      imports: [
        ReactiveFormsModule,
        MatInputModule,
        BrowserAnimationsModule,
        MatProgressSpinnerModule,
        MatSnackBarModule,
        RouterTestingModule.withRoutes([
          { path: 'home', component: BlankComponent },
        ]),
      ],
    })
    .overrideProvider(AuthenticationService, {useValue: authenticationServiceMock}) // Substituindo o serviço original por um mock
    .overrideProvider(MatSnackBar, {useValue: snackBarMock}) // Substituindo o serviço original por um mock
    .compileComponents();

    fixture = TestBed.createComponent(SigninComponent);
    location = TestBed.inject(Location);

    component = fixture.componentInstance;
    page = fixture.debugElement.nativeElement; // get all signin elements from html

    fixture.detectChanges();
  });

  describe('Redefinir senha', () => {
    it('quando o email estiver vazio, então o botão de recuperar senha deve ser desabilitado', () => {
      setEmail('');
      setPassword('anyPassword');
      expect(getRecoverPasswordButton().disabled).toBeTruthy();
    });

    it('quando o email estiver inválido, então o botão de recuperar senha deve ser desabilitado', () => {
      setEmail('invalidEmail');
      setPassword('anyPassword');
      expect(getRecoverPasswordButton().disabled).toBeTruthy();
    });

    it('quando o email estiver válido, então o botão de recuperar senha deve ser habilitado', () => {
      setEmail('valid@email.com');
      setPassword('anyPassword');
      expect(getRecoverPasswordButton().disabled).toBeFalsy();
    });
  });

  describe('Login', () => {
    it('quando o email estiver vazio, então o botão de login deve ser desabilitado', () => {
      setEmail(''), setPassword('anyPassword');
      expect(getLoginButton().disabled).toBeTruthy();
    });

    it('quando o email estiver inválido, então o botão de login deve ser desabilitado', () => {
      setEmail('invalidEmail'), setPassword('anyPassword');

      expect(getLoginButton().disabled).toBeTruthy();
    });

    it('quando a senha estiver vazia, então o botão de login deve ser desabilitado', () => {
      setEmail('valid@email.com');
      setPassword('');

      expect(getLoginButton().disabled).toBeTruthy();
    });

    it('quando o formulário for válido, então o botão de login deve ser habilitado', () => {
      setEmail('valid@email.com');
      setPassword('qwerty123');

      expect(getLoginButton().disabled).toBeFalsy();
    });

    describe('Botão de login for clicado', () => {
      beforeEach(() => {
        setEmail('valid@email.com');
        setPassword('qwerty123');
        getLoginButton().click();
        fixture.detectChanges();
      });

      it('então vamos mostrar o login progress spinner', () => {
        expect(getLoginSpinner()).not.toBeNull();
      });

      it('então vamos esconder o botão de login', () => {
        expect(getLoginButton()).toBeNull();
      });

      describe('Login realizado com sucesso', () => {

        beforeEach(() => {
          authenticationServiceMock._signInResponse.next({id: "anyUserId"});
          fixture.detectChanges();
        })

        it('Então iremos para a página home', (done) => {
          setTimeout(() => {
            expect(location.path()).toEqual('/home');
            done();
          }, 100);
        });

      });

      describe('Login realizado com falha', () => {

        beforeEach(() => {
          authenticationServiceMock._signInResponse.error({message: "anyErrorMessage"});
          fixture.detectChanges();
        })

        it('Então não iremos para a página home', (done) => {
          setTimeout(() => {
            expect(location.path()).not.toEqual('/home');
            done();
          }, 100);
        });

        it('então vamos esconder o login progress spinner', () => {
          expect(getLoginSpinner()).toBeNull();
        });

        it('então vamos mostrar o botão de login', () => {
          expect(getLoginButton()).not.toBeNull();
        });

        it('então vamos mostrar uma mensagem de erro', () => {
          expect(snackBarMock._isOpened).toBeTruthy();
        });

      });
    });
  });

  // Set Fields
  function setEmail(value: string) {
    component.form.get('email')?.setValue(value);
    fixture.detectChanges();
  }

  function setPassword(value: string) {
    component.form.get('password')?.setValue(value);
    fixture.detectChanges();
  }

  // Query Selectors
  function getRecoverPasswordButton() {
    return page.querySelector('[test-id="recover-password-button"]');
  }

  function getLoginButton() {
    return page.querySelector('[test-id="login-button"]');
  }

  function getLoginSpinner() {
    return page.querySelector('[test-id="login-spinner"]');
  }
});

// Classes for Mock
class AuthenticationServiceMock {
  _signInResponse = new Subject();
  signIn() {
    return this._signInResponse.asObservable();
  }
}

class SnackBarMock {
  _isOpened = false;
  open() {
    this._isOpened = true;
  }
}
