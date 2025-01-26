import api from './api';
import { AxiosPromise } from 'axios';

export function getAllActivityTypes() {
  return new Promise<AxiosPromise>((resolve, reject) => {
    try {
      api.get('/activity-types')
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
