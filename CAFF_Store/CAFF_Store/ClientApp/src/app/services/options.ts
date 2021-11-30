import { HttpHeaders } from "@angular/common/http";

export const options = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
};

export const optionsForTextResponse = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    }),
    responseType: 'text' as 'json'
};

export const optionsForFileResponse = {
    responseType: 'blob' as 'blob'
  };

export const optionsForIconSave = {
  responseType: 'text' as 'json'
};

export const optionsJSON = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  }),
  observe: 'body',
  responseType: 'json'
};