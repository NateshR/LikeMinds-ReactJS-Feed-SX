import {
  LMFeedClient,
  InitiateUserRequest,
  GetFeedRequest,
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
  GetPostRequest,
  GetCommentRequest,
  AddCommentRequest,
  ReplyCommentRequest,
  LikeCommentRequest,
  DeleteCommentRequest,
  GetNotificationFeedRequest,
  MarkReadNotificationRequest,
  EditPostRequest,
  GetAllMembersRequest,
  GetPostLikesRequest,
  GetCommentLikesRequest,
  GetTopicsRequest,
  EditCommentRequest
} from '@likeminds.community/feed-js-beta';
import { HelperFunctionsClass } from './helper';
import { FileModel, UploadMediaModel } from './models';

interface LMFeedClientInterface {
  initiateUser(userUniqueId: string, isGuestMember: boolean, username?: string): Promise<any>;
}

export class LMClient extends HelperFunctionsClass implements LMFeedClientInterface {
  client: LMFeedClient;
  public constructor() {
    super();
    this.client = LMFeedClient.Builder()
      // .setApiKey(process.env.REACT_APP_API_KEY!)
      .setApiKey('69edd43f-4a5e-4077-9c50-2b7aa740acce')
      // .setPlatformCode(process.env.REACT_APP_PLATFORM_CODE!)
      .setPlatformCode('rt')
      // .setVersionCode(parseInt(process.env.REACT_APP_VERSION_CODE!))
      .setVersionCode(1)
      .build();
  }

  async initiateUser(userUniqueId: string, isGuestMember: boolean, username?: string) {
    try {
      const apiCallResponse = await this.client.initiateUser(
        InitiateUserRequest.builder()
          .setUUID('testUser1')
          .setIsGuest(isGuestMember)
          .setUserName('testUser1')
          .build()
      );
      return this.parseDataLayerResponse(apiCallResponse);
    } catch (error) {
      console.log(error);
    }
  }

  async addPost(
    text: string,
    topicIds: string[] | null,
    attachmentArr?: Attachment[] | null,
    tempId?: string
  ) {
    try {
      const apiCallResponse = await this.client.addPost(
        AddPostRequest.builder()
          .setText(text)
          .setAttachments(attachmentArr ? attachmentArr : [])
          .setTempId(tempId!)
          .setTopicIds(topicIds)
          .build()
      );
      return this.parseDataLayerResponse(apiCallResponse);
    } catch (error) {
      console.log(error);
    }
  }
  async addPostWithOGTags(
    text: string,
    topicIds: string[] | null,
    ogTags: unknown,
    tempId?: string
  ) {
    try {
      const attachmentArr: Attachment[] = [];
      attachmentArr.push(
        Attachment.builder()
          .setAttachmentType(4)
          .setAttachmentMeta(AttachmentMeta.builder().setogTags(ogTags).build())
          .build()
      );

      const apiCallResponse = await this.client.addPost(
        AddPostRequest.builder()
          .setText(text)
          .setAttachments(attachmentArr)
          .setTempId(tempId!)
          .setTopicIds(topicIds)
          .build()
      );
      return this.parseDataLayerResponse(apiCallResponse);
    } catch (error) {
      console.log(error);
    }
  }

  read(file: any) {
    const reader = new FileReader();
    let duration: number | string = 0;
    reader.onload = function (event: any) {
      const blob = new Blob([event?.target?.result]);
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = function () {
        URL.revokeObjectURL(video.src); // Clean up the object URL
        duration = video.duration.toFixed(2);
      };
      video.src = URL.createObjectURL(blob);
      return duration;
    };
    reader.readAsArrayBuffer(file as unknown as File);
  }

  async addPostWithImageAttachments(
    text: any,
    topicIds: string[] | null,
    mediaArray: any[],
    uniqueUserId: any,
    tempId?: string
  ) {
    try {
      const attachmentResponseArray: Attachment[] = [];
      for (let index = 0; index < mediaArray.length; index++) {
        const file: FileModel = mediaArray[index];
        const resp: UploadMediaModel = await this.uploadMedia(file, uniqueUserId);
        const type = file.type.split('/')[0] === 'image' ? 1 : 2;
        if (type === 1) {
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
        } else {
          attachmentResponseArray.push(
            Attachment.builder()
              .setAttachmentType(2)
              .setAttachmentMeta(
                AttachmentMeta.builder()
                  .seturl(resp.Location)
                  .setformat(file?.name?.split('.').slice(-1).toString())
                  .setsize(file.size)
                  .setname(file.name)
                  .setduration(10)
                  .build()
              )
              .build()
          );
        }
      }

      const apiCallResponse: UploadMediaModel = await this.client.addPost(
        AddPostRequest.builder()
          .setText(text)
          .setAttachments(attachmentResponseArray)
          .setTempId(tempId!)
          .setTopicIds(topicIds)
          .build()
      );
      return apiCallResponse;
    } catch (error) {
      console.log(error);
    }
  }
  async addPostWithDocumentAttachments(
    text: any,
    topicIds: string[] | null,
    mediaArray: any[],
    uniqueUserId: any,
    tempId?: string
  ) {
    const attachmentResponseArray: Attachment[] = [];
    for (let index = 0; index < mediaArray.length; index++) {
      const file: FileModel = mediaArray[index];
      const resp: UploadMediaModel = await this.uploadMedia(file, uniqueUserId);
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
    const apiCallResponse: UploadMediaModel = await this.client.addPost(
      AddPostRequest.builder()
        .setText(text)
        .setAttachments(attachmentResponseArray)
        .setTempId(tempId!)
        .setTopicIds(topicIds)
        .build()
    );
    return apiCallResponse;
  }
  async fetchFeed(pageNo: number, topicIds?: string[]) {
    try {
      let apiCallResponse;
      if (topicIds) {
        apiCallResponse = await this.client.getFeed(
          GetFeedRequest.builder().setpage(pageNo).setpageSize(10).setTopicIds(topicIds).build()
        );
      } else {
        apiCallResponse = await this.client.getFeed(
          GetFeedRequest.builder().setpage(pageNo).setpageSize(10).build()
        );
      }
      const data: any = apiCallResponse.getData();
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
      return apiCallResponse?.data?.og_tags;
    } catch (error: any) {
      console.log(error);
      return error;
    }
  }

  async getTaggingList(tagSearchString: string, pageNo?: number) {
    try {
      const apiCallResponse = await this.client.getTaggingList(
        GetTaggingListRequest.builder()
          .setpage(pageNo ? pageNo : 1)
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
      return false;
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
      return false;
    }
  }
  async getPostDetails(postId: string, pageNo: number) {
    try {
      const apiCallResponse = await this.client.getPost(
        GetPostRequest.builder().setpostId(postId).setpage(pageNo).setpageSize(10).build()
      );
      return apiCallResponse;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async getComments(postId: string, commentId: string, pageNo: number) {
    try {
      const apiCallResponse = await this.client.getComments(
        postId,
        GetCommentRequest.builder()
          .setcommentId(commentId)
          .setpage(pageNo)
          .setpageSize(10)
          .setpostId(postId)
          .build(),
        commentId,
        pageNo
      );
      return apiCallResponse;
    } catch (error) {
      console.log(error);
      return error;
    }
  }
  async addComment(postId: string, text: string, timeStamp: string) {
    try {
      const apiCallResponse = await this.client.addComment(
        AddCommentRequest.builder().setpostId(postId).settext(text).setTempId(timeStamp).build()
      );
      return apiCallResponse;
    } catch (error) {
      console.log(error);
      return error;
    }
  }
  async replyComment(postId: string, commentId: string, text: string, tempId: string) {
    try {
      const apiCallResponse: any = await this.client.replyComment(
        ReplyCommentRequest.builder()
          .setPostId(postId)
          .setCommentId(commentId)
          .setText(text)
          .setTempId(tempId)
          .build()
      );
      return {
        status: true,
        comment: apiCallResponse?.data?.comment
      };
    } catch (error) {
      console.log(error);
      return {
        status: false,
        comment: undefined
      };
    }
  }

  async editComment(postId: string, commentId: string, text: string) {
    try {
      const apiCallResponse = await this.client.editComment(
        EditCommentRequest.builder().setpostId(postId).setcommentId(commentId).settext(text).build()
      );
      return apiCallResponse;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async likeComment(postId: string, commentId: string) {
    try {
      const apiCallResponse = await this.client.likeComment(
        LikeCommentRequest.builder().setpostId(postId).setcommentId(commentId).build()
      );
      return apiCallResponse;
    } catch (error) {
      console.log(error);
      return error;
    }
  }
  async deleteComment(postId: string, commentId: string) {
    try {
      const apiCallResponse = await this.client.deleteComment(
        DeleteCommentRequest.builder()
          .setcommentId(commentId)
          .setpostId(postId)
          .setreason('')
          .build()
      );
      return apiCallResponse;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async getMemberState() {
    try {
      const apiCallResponse = await this.client.getMemberState();
      return apiCallResponse;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async getNotificationFeed(pageNo: number) {
    try {
      const apiCallResponse = await this.client.getNotificationFeed(
        GetNotificationFeedRequest.builder().setpage(pageNo).setpageSize(10).build()
      );
      return apiCallResponse;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async markReadNotification(activityId: string) {
    try {
      const apiCallResponse = await this.client.markReadNotification(
        MarkReadNotificationRequest.builder().setactivityId(activityId).build()
      );
      return apiCallResponse;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async getUnreadNotificationCount() {
    try {
      const apiCallResponse = await this.client.getUnreadNotificationCount();
      return apiCallResponse;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async editPost(
    postId: string,
    text: string,
    attachments: Attachment[],
    topicIds: string[] | null
  ) {
    try {
      const apiCallResponse = await this.client.editPost(
        EditPostRequest.builder()
          .setpostId(postId)
          .settext(text)
          .setattachments(attachments)
          .setTopicIds(topicIds)
          .build()
      );
      return apiCallResponse;
    } catch (error) {
      console.log(error);
      return error;
    }
  }
  async editPostWithOGTags(postId: string, text: string, ogTags: any, topicIds: string[] | null) {
    try {
      const attachmentArr: Attachment[] = [];
      attachmentArr.push(
        Attachment.builder()
          .setAttachmentType(4)
          .setAttachmentMeta(AttachmentMeta.builder().setogTags(ogTags).build())
          .build()
      );
      const apiCallResponse = await this.client.editPost(
        EditPostRequest.builder()
          .setpostId(postId)
          .settext(text)
          .setattachments(attachmentArr)
          .setTopicIds(topicIds)
          .build()
      );
      return apiCallResponse;
    } catch (error) {
      console.log(error);
    }
  }
  async getAllMembers(pageNo: number) {
    try {
      const apiCallResponse = await this.client.getAllMembers(
        GetAllMembersRequest.builder().setpage(pageNo).build()
      );
      return apiCallResponse;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async getPostLikes(entityId: string, pageCount: number) {
    try {
      const apiCallResponse = await this.client.getPostLikes(
        GetPostLikesRequest.builder().setpostId(entityId).setpage(pageCount).setpageSize(10).build()
      );
      return apiCallResponse;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async getCommentLikes(entityId: string, pageCount: number, commentId: string) {
    try {
      const apiCallResponse = await this.client.getCommentLikes(
        GetCommentLikesRequest.builder()
          .setpostId(entityId)
          .setpage(pageCount)
          .setpageSize(10)
          .setcommentId(commentId)
          .build()
      );
      return apiCallResponse;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async getTopics(
    search: string,
    searchType: string,
    page: number,
    pageSize: number,
    isEnabled: boolean | null
  ) {
    try {
      const apiCallResponse = await this.client.getTopics(
        GetTopicsRequest.builder()
          .setSearch(search)
          .setPage(page)
          .setPageSize(pageSize)
          .setSearchType(searchType)
          .setIsEnabled(isEnabled)
          .build()
      );
      return apiCallResponse;
    } catch (error) {
      console.log(error);
      return error;
    }
  }
}
