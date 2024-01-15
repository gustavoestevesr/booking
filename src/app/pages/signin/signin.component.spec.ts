import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SigninComponent } from './signin.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('SigninComponent', () => {
  let component: SigninComponent;
  let fixture: ComponentFixture<SigninComponent>;
  let page: any;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [SigninComponent],
      imports: [ReactiveFormsModule, MatInputModule, BrowserAnimationsModule],
    }).compileComponents();
    fixture = TestBed.createComponent(SigninComponent);
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

  })

  describe('Login', () => {

    it('quando o email estiver vazio, então o botão de login deve ser desabilitado', () => {
      setEmail(''),
      setPassword('anyPassword');
      expect(getLoginButton().disabled).toBeTruthy();
    });

    it('quando o email estiver inválido, então o botão de login deve ser desabilitado', () => {
      setEmail('invalidEmail'),
      setPassword('anyPassword');
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

  })

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
});
