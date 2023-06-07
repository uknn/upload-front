import { SafeUrl } from '@angular/platform-browser';

export interface ImageInfo {
  url: SafeUrl,
  id: string | undefined;
  name: string;
  desc: string;
}

export interface ImageResponse {
  data: ImageResponseContent[];
}

export interface ImageResponseContent {
  name: string,
  desc: string,
  _id?: string,
  img: {
    data: {
      data: number[],
      type: string
    },
    contentType: string
  }
}
