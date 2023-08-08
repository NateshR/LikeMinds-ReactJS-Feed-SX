import LMFeedClient, { GetTaggingListRequest, InitiateUserRequest } from 'likeminds-sdk';
import { HelperFunctionsClass } from './helper';
import { Attachment, DecodeUrlModelSX, FileModel, UploadMediaModel } from './models';
interface LMFeedClientInterface {
  initiateUser(userUniqueId: string, isGuestMember: boolean, username?: string): Promise<any>;
  // logout(refreshToken: string): Promise<any>;
  // addPost(text: string, attachments: []): Promise<any>;
  // addPost(text: string): Promise<any>;
}

export class LMClient extends HelperFunctionsClass implements LMFeedClientInterface {
  client: LMFeedClient;
  public constructor() {
    super();
    this.client = LMFeedClient.Builder()
      .setApiKey(process.env.REACT_APP_API_KEY!)
      .setPlatformCode(process.env.REACT_APP_PLATFORM_CODE!)
      .setVersionCode(parseInt(process.env.REACT_APP_VERSION_CODE!))
      .build();
  }

  async initiateUser(userUniqueId: string, isGuestMember: boolean, username?: string) {
    try {
      const apiCallResponse = await this.client.initiateUser(
        InitiateUserRequest.builder()
          .setUUID(userUniqueId)
          .setIsGuest(isGuestMember)
          .setUserName(username!)
          .build()
      );
      return this.parseDataLayerResponse(apiCallResponse);
    } catch (error) {
      console.log(error);
    }
  }

  // async logout(refreshToken: string) {
  //   try {
  //     const apiCallResponse = await this.client.logout({
  //       refreshToken: refreshToken
  //     });
  //     return this.parseDataLayerResponse(apiCallResponse);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  // async addPost(text: string) {
  //   try {
  //     const apiCallResponse = await this.client.addPost({
  //       text: text,
  //       attachments: []
  //     });
  //     return this.parseDataLayerResponse(apiCallResponse);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }
  // async addPostWithOGTags(text: string, ogTags: any) {
  //   try {
  //     let attachmentArr: Attachment[] = [];
  //     attachmentArr.push({
  //       attachment_type: 4,
  //       attachment_meta: {
  //         og_tags: ogTags
  //       }
  //     });
  //     const apiCallResponse = await this.client.addPost({
  //       text: text,
  //       attachments: attachmentArr
  //     });
  //     return this.parseDataLayerResponse(apiCallResponse);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }
  // async addPostWithImageAttachments(text: any, mediaArray: any[], uniqueUserId: any) {
  //   try {
  //     const attachmentResponseArray: Attachment[] = [];
  //     for (let index = 0; index < mediaArray.length; index++) {
  //       const file: FileModel = mediaArray[index];
  //       const resp: UploadMediaModel = await this.uploadMedia(file, uniqueUserId);
  //       attachmentResponseArray.push({
  //         attachment_type: 1,
  //         attachment_meta: {
  //           url: resp.Location,
  //           format: file?.name?.split('.').slice(-1).toString(),
  //           size: file.size
  //         }
  //       });
  //     }

  //     const apiCallResponse: UploadMediaModel = await this.client.addPost({
  //       text: text,
  //       attachments: attachmentResponseArray
  //     });
  //     console.log(apiCallResponse);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }
  // async addPostWithDocumentAttachments(text: any, mediaArray: any[], uniqueUserId: any) {
  //   const attachmentResponseArray: Attachment[] = [];
  //   for (let index = 0; index < mediaArray.length; index++) {
  //     const file: FileModel = mediaArray[index];
  //     const resp: UploadMediaModel = await this.uploadMedia(file, uniqueUserId);
  //     attachmentResponseArray.push({
  //       attachment_type: 3,
  //       attachment_meta: {
  //         url: resp.Location,
  //         format: file?.name?.split('.').slice(-1).toString(),
  //         size: file.size
  //       }
  //     });
  //   }

  //   const apiCallResponse: UploadMediaModel = await this.client.addPost({
  //     text: text,
  //     attachments: attachmentResponseArray
  //   });
  // }
  // async fetchFeed() {
  //   try {
  //     let apiCallResponse = await this.client.getFeed({
  //       page: 1,
  //       pageSize: 10
  //     });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  // async decodeUrl(url: string) {
  //   try {
  //     const apiCallResponse = await this.client.decodeUrl({
  //       url: url
  //     });
  //     // change this in the data layer
  //     return apiCallResponse?.data?.og_tags;
  //   } catch (error: any) {
  //     console.log(error);
  //     return error;
  //   }
  // }

  async getTaggingList(tagSearchString: string) {
    try {
      const apiCallResponse = await this.client.getTaggingList(
        GetTaggingListRequest.builder()
          .setpage(1)
          .setpageSize(10)
          .setsearchName(tagSearchString)
          .build()
      );
      return apiCallResponse;
    } catch (error) {
      console.log(error);
      return error;
    }
  }
}
