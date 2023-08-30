import * as AWS from 'aws-sdk';
import { UploadMediaModel } from './models';

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
