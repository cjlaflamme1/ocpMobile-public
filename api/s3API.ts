import api from './api';
import axios, { AxiosPromise } from 'axios';
const s3Api = axios.create();
export function getPresignedUrl(fileName: string, fileDirectory: string) {
  return new Promise<AxiosPromise>((resolve, reject) => {
    try {
      api.get(`/image/${encodeURI(fileName)}`)
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

export function postPresignedUrl(imageData: { fileName: string; fileType: string; fileDirectory: string }) {
  return new Promise<AxiosPromise>((resolve, reject) => {
    try {
      api.post('/image', imageData)
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

export function putImageOnS3(preAuthURL: any, image: File | Buffer, fileType: string) {
  return new Promise<AxiosPromise>((resolve, reject) => {
    try {
      s3Api.defaults.headers.common['Content-Type'] = fileType;
      s3Api.defaults.headers.put['Content-Type'] = fileType;
      s3Api.put(preAuthURL, image, {
        headers: {
          'accept': fileType,
          'content-type': fileType,
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