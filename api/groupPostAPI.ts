import api from './api';
import { AxiosPromise } from 'axios';
import { CreateGroupPostDto, CreatePostResponsDto } from '../store/groupPostSlice';
import { QueryObject } from '../models/QueryObject';

export function createGroupPost(body: CreateGroupPostDto) {
  return new Promise<AxiosPromise>((resolve, reject) => {
    try {
      api.post(`/group-post`, body)
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

export function getAllGroupPosts(query: QueryObject) {
  return new Promise<AxiosPromise>((resolve, reject) => {
    try {
      api.get(`/group-post`, {
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

export function getOneGroupPost(postId: string) {
  return new Promise<AxiosPromise>((resolve, reject) => {
    try {
      api.get(`/group-post/${postId}`)
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

export function createPostResponse(body: CreatePostResponsDto) {
  return new Promise<AxiosPromise>((resolve, reject) => {
    try {
      api.post('/response', body)
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
