import * as AWS from 'aws-sdk';
import { UploadMediaModel } from './models';
import { PostSchema } from '../components/resource-creation';
import { lmFeedClient } from '..';
import pdfjs from 'pdfjs-dist';
import { OgTag } from './models/resourceResponses/articleResponse';

interface HelperFunctionsInterface {
  detectLinks(text: string): any[];
  parseDataLayerResponse(response: any): any;
}

export class HelperFunctionsClass implements HelperFunctionsInterface {
  detectLinks(text: string) {
    const regex = /\b(?:https?:\/\/)?(?:[\w.]+\.\w+)(?:(?<=\\n)|\b)/g;
    const links = text.match(regex);
    return links ? links : [];
  }

  parseDataLayerResponse(response: any) {
    return {
      ...response
    };
  }

  logError(err: any) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`%c ${err}`, 'background: #222; color: "white";');
    }
  }

  getAWS() {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    (AWS.config.region = 'ap-south-1'),
      (AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: 'ap-south-1:181963ba-f2db-450b-8199-964a941b38c2'
      }));
    const s3 = new AWS.S3({
      apiVersion: '2006-03-01',
      params: { Bucket: 'beta-likeminds-media' }
    });
    return s3;
  }

  uploadMedia(media: any, userUniqueId: any) {
    let mediaObject = this.getAWS().upload({
      Key: `files/post/${userUniqueId}/${media.name}`,
      Bucket: 'beta-likeminds-media',
      Body: media,
      ACL: 'public-read-write',
      ContentType: media.type
    });
    return mediaObject.promise();
  }
}

export async function addPost(
  resourceType: number,
  postObject: PostSchema,
  userUniqueId: string,
  ogTag?: OgTag
) {
  console.log(ogTag);
  if (!validatePostSchema(resourceType, postObject, ogTag)) {
    return;
  }

  switch (resourceType) {
    case 0: {
      return await lmFeedClient.addArticlePost(
        postObject.title,
        postObject.description!,
        postObject.mediaFile!,
        userUniqueId
      );
    }
    case 1: {
      return await lmFeedClient.addVideoResourcePost(
        postObject.title,
        postObject.description!,
        postObject.mediaFile!,
        userUniqueId
      );
    }
    case 2: {
      return await lmFeedClient.addPDFResourcePost(
        postObject.title,
        postObject.description!,
        postObject.mediaFile!,
        userUniqueId
      );
    }
    case 3: {
      return lmFeedClient.addPostWithOGTags(
        postObject.title,
        postObject.description ? postObject.description : '',
        ogTag!
      );
    }
  }
}
function validatePostSchema(resourceType: number, postObject: PostSchema, ogTag?: OgTag) {
  const { title, description, mediaFile, linkResource } = postObject;
  switch (resourceType) {
    case 0:
    case 1:
    case 2: {
      return Boolean(title) && Boolean(mediaFile) && Boolean(description);
    }
    case 3: {
      console.log(ogTag);
      return Boolean(title) && Boolean(ogTag);
    }
  }
}

export function getVideoDuration(file: File): Promise<number> {
  return new Promise<number>((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'metadata';

    video.onloadedmetadata = function () {
      URL.revokeObjectURL(video.src);
      resolve(Math.floor(video.duration));
    };

    video.onerror = function () {
      console.log('error');
      reject('Error loading video');
    };
    video.src = URL.createObjectURL(file);
  });
}

export async function getPdfPageCount(file: File) {
  return new Promise<number>((resolve, reject) => {
    const reader = new FileReader();
    const url = `//cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
    pdfjs.GlobalWorkerOptions.workerSrc = url;
    reader.onload = async function (event: any) {
      try {
        const typedArray = new Uint8Array(event.target.result);
        const pdf = await pdfjs.getDocument({ data: typedArray }).promise;
        alert('the page sise is :' + pdf.numPages);
        resolve(pdf.numPages);
      } catch (error) {
        reject('Error reading PDF: ' + error);
      }
    };
    reader.onerror = function () {
      reject('Error loading PDF file.');
    };
    reader.readAsArrayBuffer(file);
  });
}
