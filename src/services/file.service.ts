import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  constructor(private http: HttpClient) {}

  readJSONFile<T>(file: File): Observable<T> {
    return new Observable((observer: Observer<T>) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result;
        if (result) {
          try {
            const json = JSON.parse(result.toString());
            observer.next(json);
            observer.complete();
          } catch (error) {
            observer.error('Invalid JSON file');
          }
        } else {
          observer.error('Failed to read file');
        }
      };
      reader.onerror = (error) => {
        observer.error(error);
      };
      reader.readAsText(file);
    });
  }
}
