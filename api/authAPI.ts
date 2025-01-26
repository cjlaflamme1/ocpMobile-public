import api from './api';
import { AxiosPromise } from 'axios';
import { SignupObject } from '../models/SignupObject';

export interface ResetDTO {
  email: string;
  token: number;
  password: string;
}

export function signUp(newUser: SignupObject) {
  return new Promise<AxiosPromise>((resolve, reject) => {
    try {
      api
        .post('/auth/signup', newUser)
        .then((response: any) => {
          resolve(response);
        })
        .catch((e: Error) => {
          reject(e);
        });
    } catch (e) {
      reject(e);
    }
  });
};

export function login(signInObject: {email: string, password: string}) {
  return new Promise<AxiosPromise>((resolve, reject) => {
    try {
      api
        .post('/auth/login', signInObject)
        .then((response: any) => {
          resolve(response);
        })
        .catch((e: Error) => {
          reject(e);
        });
    } catch (e) {
      reject(e)
    }
  });
};

export function requestReset(email: string) {
  return new Promise<AxiosPromise>((resolve, reject) => {
    try {
      api
        .get(`/auth/reset/${email}`, {
          headers: {
            'x-request-reset': 'bYU6PDqR7vczdLPYemUBAEzoT'
          }
        })
        .then((response: any) => {
          resolve(response);
        })
        .catch((e: Error) => {
          reject(e);
        });
    } catch (e) {
      reject(e);
    }
  });
}

export function postReset(body: ResetDTO) {
  return new Promise<AxiosPromise>((resolve, reject) => {
    try {
      api
        .post('/auth/reset', body, {
          headers: {
            'x-request-reset': 'bYU6PDqR7vczdLPYemUBAEzoT'
          }
        })
        .then((response: any) => {
          resolve(response);
        })
        .catch((e: Error) => {
          reject(e);
        });
    } catch (e) {
      reject(e);
    }
  });
}
