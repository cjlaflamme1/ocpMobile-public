import api from './api';
import { AxiosPromise } from 'axios';
import { CreateUserActivityDTO, UserActivity } from '../store/userSlice';

export function createUserActivity(body: CreateUserActivityDTO) {
  return new Promise<AxiosPromise>((resolve, reject) => {
    try {
      api.post('/users-activity', body)
        .then((response: any) => {
          resolve(response);
        })
        .catch((e: Error) => {
          reject(e);
        })
    } catch (e) {
      reject(e);
    }
  }) 
}

export function updateUserActivity(id: string, body: Partial<UserActivity>) {
  return new Promise<AxiosPromise>((resolve, reject) => {
    try {
      api.patch(`/users-activity/${id}`, body)
        .then((response: any) => {
          resolve(response);
        })
        .catch((e: Error) => {
          reject(e);
        })
    } catch (e) {
      reject(e);
    }
  })
}

export function getUserActivities() {
  return new Promise<AxiosPromise>((resolve, reject) => {
    try {
      api.get('/users-activity')
        .then((response: any) => {
          resolve(response);
        })
        .catch((e: Error) => {
          reject(e);
        })
    } catch (e) {
      reject(e);
    }
  }) 
}

export function getOneUserActivity(id: string) {
  return new Promise<AxiosPromise>((resolve, reject) => {
    try {
      api.get(`/users-activity/${id}`)
        .then((response: any) => {
          resolve(response);
        })
        .catch((e: Error) => {
          reject(e);
        })
    } catch (e) {
      reject(e);
    }
  }) 
}

export function deleteUserActivity(id: string) {
  return new Promise<AxiosPromise>((resolve, reject) => {
    try {
      api.delete(`/users-activity/${id}`)
        .then((response: any) => {
          resolve(response);
        })
        .catch((e: Error) => {
          reject(e);
        })
    } catch (e) {
      reject(e);
    }
  }) 
}
