import {
  HttpRequest,
  HttpClient,
  HttpEvent,
  HttpEventType,
  HttpHeaders,
} from "@angular/common/http";
import { catchError, map } from "rxjs/operators";
import { Observable, of } from "rxjs";
import {
  FilePickerAdapter,
  UploadResponse,
  UploadStatus,
  FilePreviewModel,
} from "ngx-awesome-uploader";
import { environment } from "src/environments/environment";
const BACKEND_URL = environment.apiUrl + "/case-history";

export class FilePicker extends FilePickerAdapter {
  constructor(private http: HttpClient) {
    super();
  }
  public uploadFile(
    fileItem: FilePreviewModel
  ): Observable<UploadResponse | undefined> {
    const form = new FormData();
    form.append("file", fileItem.file);

    let userdata: any = localStorage.getItem("userdata");
    userdata = JSON.parse(userdata);
    let authToken = userdata.token;
    const headers = authToken
      ? new HttpHeaders().set("x-access-token", authToken)
      : new HttpHeaders();

    const req = new HttpRequest("POST", `${BACKEND_URL}/upload`, form, {
      reportProgress: true,
      headers: headers,
    });

    return this.http.request(req).pipe(
      map((event: HttpEvent<any>) => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            if (event.total) {
              const progress = Math.round((100 * event.loaded) / event.total);
              return { status: UploadStatus.IN_PROGRESS, progress };
            }
            break;
          case HttpEventType.Response:
            const responseFromBackend = event.body;
            return { body: responseFromBackend, status: UploadStatus.UPLOADED };
          default:
            return undefined;
        }
      }),
      catchError((error) => {
        console.error("Upload error:", error);
        return of({ status: UploadStatus.ERROR, body: error });
      })
    );
  }
  public removeFile(fileItem: FilePreviewModel): Observable<any> {
    let userdata: any = localStorage.getItem("userdata");
    userdata = JSON.parse(userdata);
    let authToken = userdata.token;
    const headers = authToken
      ? new HttpHeaders().set("x-access-token", authToken)
      : new HttpHeaders();
    const fileName = fileItem.uploadResponse.data.files[0].fileName;

    const removeApi = `${BACKEND_URL}/delete-image/${fileName}`;
    return this.http.delete(removeApi, { headers: headers });
  }
}
