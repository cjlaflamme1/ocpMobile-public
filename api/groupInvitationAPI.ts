import api from './api';
import { AxiosPromise } from 'axios';
import { GroupInvitation } from '../store/groupSlice';

export function getAllInvitations() {
  return new Promise<AxiosPromise>((resolve, reject) => {
    try {
      api.get('/group-invitation')
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

export function updateGroupInvite(id: string, body: Partial<GroupInvitation>) {
  return new Promise<AxiosPromise>((resolve, reject) => {
    try {
      api.patch(`/group-invitation/${id}`, body)
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

export function createGroupInvites(body: { groupid: string, userIds: string[] }) {
  return new Promise<AxiosPromise>((resolve, reject) => {
    try {
      api.post('/group-invitation', body)
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
