import { Notifications } from '../store/notificationSlice';
import api from './api';
import { AxiosPromise } from 'axios';

export function getNotifications() {
  return new Promise<AxiosPromise>((resolve, reject) => {
    try {
      api.get(`/notifications`)
        .then((response: any) => {
          resolve(response);
        }).catch((e: Error) => {
          reject(e);
        })
    } catch (e) {
      reject(e);
    }
  })
};

export function updateNotification(id: string, body: Partial<Notifications>) {
  return new Promise<AxiosPromise>((resolve, reject) => {
    try {
      api.patch(`/notifications/${id}`, body)
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
