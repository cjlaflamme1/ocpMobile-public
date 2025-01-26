import api from './api';
import { AxiosPromise } from 'axios';
import { CreateUserActivityDTO, User } from '../store/userSlice';
import { QueryObject } from '../models/QueryObject';

export function getCurrentUser() {
  return new Promise<AxiosPromise>((resolve, reject) => {
    try {
      api.get('/user/current')
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

export function getAllUsers(query: QueryObject) {
  return new Promise<AxiosPromise>((resolve, reject) => {
    try {
      api.get('/user', {
        params: {
          dataSource: JSON.stringify(query),
        },
      }).then((response: any) => {
        resolve(response);
      }).catch((e: Error) => {
        reject(e);
      })
    } catch (e) {
      reject(e);
    }
  })
}

export function updateCurrentUser(id: string, updateBody: Partial<User>) {
  return new Promise<AxiosPromise>((resolve, reject) => {
    try {
      api.patch(`/user/${id}`, updateBody)
        .then((response: any) => {
          resolve(response);
        }).catch((e: Error) => {
          reject(e);
        })
    } catch (e) {
      reject(e);
    }
  })
}

export function createUserActivity(body: CreateUserActivityDTO) {
  return new Promise<AxiosPromise>((resolve, reject) => {
    try {
      api.post(`/users-activity`, body)
        .then((response: any) => {
          resolve(response);
        }).catch((e: Error) => {
          reject(e);
        })
    } catch (e) {
      reject(e);
    }
  })
}

export function getOneUser(id: string) {
  return new Promise<AxiosPromise>((resolve, reject) => {
    try {
      api.get(`/user/${id}`)
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

export function requestDeleteUser(id: string) {
  return new Promise<AxiosPromise>((resolve, reject) => {
    try {
      api.delete(`/user/${id}`)
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
