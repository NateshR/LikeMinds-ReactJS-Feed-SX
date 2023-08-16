import LMFeedClient, {
  InitiateUserRequest,
  GetFeedRequest,
  GetFeedResponse,
  GetTaggingListRequest,
  Attachment,
  AddPostRequest,
  AttachmentMeta,
  PinPostRequest,
  DeletePostRequest,
  GetReportTagsRequest,
  PostReportRequest,
  LikePostRequest,
  SavePostRequest,
  GetPostRequest
} from 'likeminds-sdk';
import { HelperFunctionsClass } from './helper';
import { FileModel, UploadMediaModel } from './models';

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
      // .setApiKey(process.env.REACT_APP_API_KEY!)
      .setApiKey('69edd43f-4a5e-4077-9c50-2b7aa740acce')
      .setPlatformCode(process.env.REACT_APP_PLATFORM_CODE!)
      .setVersionCode(parseInt(process.env.REACT_APP_VERSION_CODE!))
      .build();
  }

  async initiateUser(userUniqueId: string, isGuestMember: boolean, username?: string) {
    try {
      const apiCallResponse = await this.client.initiateUser(
        InitiateUserRequest.builder()
          // .setUUID('1e9bc941-8817-4328-aa90-f1c90259b12c')
          .setUUID('siddharth-1')
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

  async addPost(text: string) {
    try {
      const apiCallResponse = await this.client.addPost(
        AddPostRequest.builder().setText(text).setAttachments([]).build()
      );
      return this.parseDataLayerResponse(apiCallResponse);
    } catch (error) {
      console.log(error);
    }
  }
  async addPostWithOGTags(text: string, ogTags: any) {
    try {
      let attachmentArr: Attachment[] = [];
      attachmentArr.push(
        Attachment.builder()
          .setAttachmentType(4)
          .setAttachmentMeta(AttachmentMeta.builder().setogTags(ogTags).build())
          .build()
      );
      // const apiCallResponse = await this.client.addPost({
      //   text: text,
      //   attachments: attachmentArr
      // });
      const apiCallResponse = await this.client.addPost(
        AddPostRequest.builder().setText(text).setAttachments(attachmentArr).build()
      );
      return this.parseDataLayerResponse(apiCallResponse);
    } catch (error) {
      console.log(error);
    }
  }
  async addPostWithImageAttachments(text: any, mediaArray: any[], uniqueUserId: any) {
    try {
      const attachmentResponseArray: Attachment[] = [];
      for (let index = 0; index < mediaArray.length; index++) {
        const file: FileModel = mediaArray[index];
        const resp: UploadMediaModel = await this.uploadMedia(file, uniqueUserId);
        attachmentResponseArray.push(
          Attachment.builder()
            .setAttachmentType(1)
            .setAttachmentMeta(
              AttachmentMeta.builder()
                .seturl(resp.Location)
                .setformat(file?.name?.split('.').slice(-1).toString())
                .setsize(file.size)
                .setname(file.name)
                .build()
            )
            .build()
        );
      }

      const apiCallResponse: UploadMediaModel = await this.client.addPost(
        AddPostRequest.builder().setText(text).setAttachments(attachmentResponseArray).build()
      );
      console.log(apiCallResponse);
    } catch (error) {
      console.log(error);
    }
  }
  async addPostWithDocumentAttachments(text: any, mediaArray: any[], uniqueUserId: any) {
    const attachmentResponseArray: Attachment[] = [];
    for (let index = 0; index < mediaArray.length; index++) {
      const file: FileModel = mediaArray[index];
      const resp: UploadMediaModel = await this.uploadMedia(file, uniqueUserId);
      console.log(resp);
      attachmentResponseArray.push(
        Attachment.builder()
          .setAttachmentType(3)
          .setAttachmentMeta(
            AttachmentMeta.builder()
              .seturl(resp.Location)
              .setformat(file?.name?.split('.').slice(-1).toString())
              .setsize(file.size)
              .setname(file.name)
              .build()
          )
          .build()
      );
    }
    console.log(attachmentResponseArray);
    const apiCallResponse: UploadMediaModel = await this.client.addPost(
      AddPostRequest.builder().setText(text).setAttachments(attachmentResponseArray).build()
    );
  }
  async fetchFeed(pageNo: number) {
    try {
      let apiCallResponse = await this.client.getFeed(
        GetFeedRequest.builder().setpage(pageNo).setpageSize(10).build()
      );
      const data: GetFeedResponse | null = apiCallResponse.getData();
      // console.log(data);
      return data;
    } catch (error) {
      console.log(error);
    }
  }

  async decodeUrl(url: string) {
    try {
      const apiCallResponse = await this.client.decodeURL({
        url: url
      });
      // change this in the data layer
      return apiCallResponse?.data?.og_tags;
    } catch (error: any) {
      console.log(error);
      return error;
    }
  }

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

  async pinPost(postId: string) {
    try {
      const apiCallResponse = await this.client.pinPost(
        PinPostRequest.builder().setpostId(postId).build()
      );
      return apiCallResponse;
    } catch (error) {
      console.log(error);
      return error;
    }
  }
  async unpinPost(postId: string) {
    try {
      const apiCallResponse = await this.client.pinPost(
        PinPostRequest.builder().setpostId(postId).build()
      );
      return apiCallResponse;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async deletePost(postId: string) {
    try {
      const apiCallResponse = await this.client.deletePost(
        DeletePostRequest.builder().setpostId(postId).build()
      );
      return apiCallResponse;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async reportPost(
    entityId: string,
    uuid: string,
    entityType: number,
    tagId: number,
    reason: string
  ) {
    try {
      const apiCallResponse = await this.client.postReport(
        PostReportRequest.builder()
          .setEntityId(entityId)
          .setEntityType(entityType)
          .setReason(reason)
          .setTagId(tagId)
          .setUuid(uuid)
          .build()
      );
      return apiCallResponse;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async getReportTags() {
    try {
      const apiCallResponse = await this.client.getReportTags(
        GetReportTagsRequest.builder().settype(0).build()
      );
      return apiCallResponse;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async likePost(postId: string) {
    try {
      const apiCallResponse = await this.client.likePost(
        LikePostRequest.builder().setpostId(postId).build()
      );
      return apiCallResponse;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async savePost(postId: string) {
    try {
      const apiCallResponse = await this.client.savePost(
        SavePostRequest.builder().setpostId(postId).build()
      );
      return apiCallResponse;
    } catch (error) {
      console.log(error);
      return error;
    }
  }
  async getPostDetails(postId: string) {
    try {
      const apiCallResponse = await this.client.getPost(
        GetPostRequest.builder().setpostId(postId).setpage(1).setpageSize(10).build()
      );
      return apiCallResponse;
    } catch (error) {
      console.log(error);
      return error;
    }
  }
}
