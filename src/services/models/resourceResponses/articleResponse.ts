export interface AttachmentMeta {
  entityId: string;
  ogTags?: OgTag; // You can define a more specific type if needed
  duration: number;
  format: string;
  name: string;
  size: number;
  url: string;
}

export interface Attachment {
  attachmentMeta: AttachmentMeta;
  attachmentType: number;
}

export interface MenuItem {
  id: number;
  title: string;
}

export interface User {
  id: number;
  name: string;
  imageUrl: string;
  userUniqueId: string;
  sdkClientInfo: {
    community: number;
    user: number;
    userUniqueId: string;
    uuid: string;
  };
  uuid: string;
  isGuest: boolean;
  isDeleted: boolean;
  customTitle: string;
  questionAnswers: any; // Define a specific type if needed
}

export interface Widget {
  id: string;
  createdAt: number;
  metadata: {
    body: string;
    coverImageUrl: string;
    ogTags: Record<string, any>; // You can define a more specific type if needed
    title: string;
  };
  parentEntityId: string;
  parentEntityType: string;
  updatedAt: number;
}

export interface AllPost {
  post: Post;
  topics: Record<string, any>; // Define a more specific type if needed
  users: Record<string, User>;
  widgets: Record<string, Widget>;
}

export interface OgTag {
  description: string;
  image: string;
  title: string;
  url: string;
}

export interface Post {
  Id: string;
  attachments: Attachment[];
  commentsCount: number;
  communityId: number;
  createdAt: number;
  heading: string;
  isEdited: boolean;
  isLiked: boolean;
  isPinned: boolean;
  isSaved: boolean;
  likesCount: number;
  menuItems: MenuItem[];
  replies: any[]; // Define a specific type if needed
  tempId: null | string;
  text: string;
  topics: any[]; // Define a specific type if needed
  updatedAt: number;
  userId: string;
  uuid: string;
}
