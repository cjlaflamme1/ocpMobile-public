import api from './api';
import { AxiosPromise } from 'axios';
import { CreateGroupEventDto } from '../store/groupEventSlice';
import { QueryObject } from '../models/QueryObject';

export function createGroupEvent(body: CreateGroupEventDto) {
  return new Promise<AxiosPromise>((resolve, reject) => {
    try {
      api.post(`/group-event`, body)
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

export function getAllGroupEvents(query: QueryObject) {
  return new Promise<AxiosPromise>((resolve, reject) => {
    try {
      api.get(`/group-event`, {
        params: {
          dataSource: JSON.stringify(query),
        }
      })
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

export function getOneGroupEvent(id: string) {
  return new Promise<AxiosPromise>((resolve, reject) => {
    try {
      api.get(`/group-event/${id}`)
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

export function updateGroupEvent(id: string, body: any) {
  return new Promise<AxiosPromise>((resolve, reject) => {
    try {
      api.patch(`/group-event/${id}`, body)
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