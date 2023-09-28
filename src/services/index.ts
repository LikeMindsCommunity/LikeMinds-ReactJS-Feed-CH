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
  GetCommentLikesRequest
} from '@likeminds.community/feed-js';
import { HelperFunctionsClass, getPdfPageCount, getVideoDuration } from './helper';
import { FileModel, UploadMediaModel } from './models';
import { OgTag } from './models/resourceResponses/articleResponse';

interface LMFeedClientInterface {
  initiateUser(userUniqueId: string, isGuestMember: boolean, username?: string): Promise<any>;
}

export class LMClient extends HelperFunctionsClass implements LMFeedClientInterface {
  client: LMFeedClient;
  public constructor() {
    super();
    this.client = LMFeedClient.Builder()
      .setApiKey('0aec710c-21b3-4e49-99f3-7060bf6c6f5b')
      .setPlatformCode(process.env.REACT_APP_PLATFORM_CODE!)
      .setVersionCode(parseInt(process.env.REACT_APP_VERSION_CODE!))
      .build();
  }

  async initiateUser(userUniqueId: string, isGuestMember: boolean, username?: string) {
    try {
      const apiCallResponse = await this.client.initiateUser(
        InitiateUserRequest.builder()
          // .setUUID(userUniqueId).
          .setUUID('68b38b5d-ae72-4f7c-8956-48fd150ac068')
          .setIsGuest(isGuestMember)
          .setUserName(username!)
          .build()
      );
      return this.parseDataLayerResponse(apiCallResponse);
    } catch (error) {
      console.log(error);
    }
  }

  async addPost(text: string, attachmentArr?: any) {
    try {
      const apiCallResponse = await this.client.addPost(
        AddPostRequest.builder()
          .setText(text)
          .setAttachments(attachmentArr ? attachmentArr : [])
          .build()
      );
      return this.parseDataLayerResponse(apiCallResponse);
    } catch (error) {
      console.log(error);
    }
  }
  async addPostWithOGTags(title: string, body: string, ogTags: OgTag) {
    try {
      let attachmentArr: Attachment[] = [];
      attachmentArr.push(
        Attachment.builder()
          .setAttachmentType(4)
          .setAttachmentMeta(AttachmentMeta.builder().setogTags(ogTags).build())
          .build()
      );

      const apiCallResponse = await this.client.addPost(
        AddPostRequest.builder()
          .setHeading(title)
          .setText(body)
          .setAttachments(attachmentArr)
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

  async addArticlePost(title: string, body: string, media: File, uniqueUserId: any) {
    try {
      const uploadResponse: UploadMediaModel = await this.uploadMedia(media, uniqueUserId);
      const attachmentResponseArray: Attachment[] = [];
      attachmentResponseArray.push(
        Attachment.builder()
          .setAttachmentType(7)
          .setAttachmentMeta(
            AttachmentMeta.builder()
              .setTitle(title)
              .setBody(body)
              .setCoverImageUrl(uploadResponse.Location)
              .build()
          )
          .build()
      );
      const apiCallResponse: UploadMediaModel = await this.client.addPost(
        AddPostRequest.builder().setText('').setAttachments(attachmentResponseArray).build()
      );
      return apiCallResponse;
    } catch (error) {
      console.log(error);
    }
  }

  async addVideoResourcePost(title: string, body: string, media: File, uniqueUserId: any) {
    try {
      const uploadResponse: UploadMediaModel = await this.uploadMedia(media, uniqueUserId);
      const attachmentResponseArray: Attachment[] = [];
      attachmentResponseArray.push(
        Attachment.builder()
          .setAttachmentType(2)
          .setAttachmentMeta(
            AttachmentMeta.builder()
              .setformat(media?.name?.split('.').slice(-1).toString())
              .seturl(uploadResponse.Location)
              .setsize(media.size)
              .setname(media.name)
              .setduration(await getVideoDuration(media))
              .build()
          )
          .build()
      );
      const apiCallResponse: UploadMediaModel = await this.client.addPost(
        AddPostRequest.builder()
          .setText(body)
          .setAttachments(attachmentResponseArray)
          .setHeading(title)
          .build()
      );
      return apiCallResponse;
    } catch (error) {
      console.log(error);
    }
  }

  async addPDFResourcePost(title: string, body: string, media: File, uniqueUserId: any) {
    try {
      const uploadResponse: UploadMediaModel = await this.uploadMedia(media, uniqueUserId);
      const attachmentResponseArray: Attachment[] = [];
      attachmentResponseArray.push(
        Attachment.builder()
          .setAttachmentType(3)
          .setAttachmentMeta(
            AttachmentMeta.builder()
              .seturl(uploadResponse.Location)
              .setformat(media?.name?.split('.').slice(-1).toString())
              .setsize(media.size)
              .setname(media.name)
              // .setpageCount(await getPdfPageCount(media))
              .build()
          )
          .build()
      );
      const apiCallResponse: UploadMediaModel = await this.client.addPost(
        AddPostRequest.builder()
          .setText(body)
          .setAttachments(attachmentResponseArray)
          .setHeading(title)
          .build()
      );
      return apiCallResponse;
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
                  .setduration(10)
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
        AddPostRequest.builder().setText(text).setAttachments(attachmentResponseArray).build()
      );
      return apiCallResponse;
    } catch (error) {
      console.log(error);
    }
  }
  async addPostWithDocumentAttachments(text: any, mediaArray: any[], uniqueUserId: any) {
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
      AddPostRequest.builder().setText(text).setAttachments(attachmentResponseArray).build()
    );
    return apiCallResponse;
  }
  async fetchFeed(pageNo: number) {
    try {
      let apiCallResponse = await this.client.getFeed(
        GetFeedRequest.builder().setpage(pageNo).setpageSize(10).build()
      );
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
  async addComment(postId: string, text: string) {
    try {
      const apiCallResponse = await this.client.addComment(
        AddCommentRequest.builder().setpostId(postId).settext(text).build()
      );
      return apiCallResponse;
    } catch (error) {
      console.log(error);
      return error;
    }
  }
  async replyComment(postId: string, commentId: string, text: string) {
    try {
      const apiCallResponse = await this.client.replyComment(
        ReplyCommentRequest.builder()
          .setPostId(postId)
          .setCommentId(commentId)
          .setText(text)
          .build()
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

  async editPost(postId: string, text: string, attachments: Attachment[]) {
    try {
      const apiCallResponse = await this.client.editPost(
        EditPostRequest.builder()
          .setpostId(postId)
          .settext(text)
          .setattachments(attachments)
          .build()
      );
      return apiCallResponse;
    } catch (error) {
      console.log(error);
      return error;
    }
  }
  async editPostWithOGTags(postId: string, text: string, ogTags: any) {
    try {
      let attachmentArr: Attachment[] = [];
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
}
