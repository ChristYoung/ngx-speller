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

  exportJSONFile<T>(dataSource: T, filename: string): void {
    const jsonString = JSON.stringify(dataSource, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }
}
