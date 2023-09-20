interface AttachmentMeta {
  entityId: string;
  ogTags?: Record<string, any>; // You can define a more specific type if needed
}

interface Attachment {
  attachmentMeta: AttachmentMeta;
  attachmentType: number;
}

interface MenuItem {
  id: number;
  title: string;
}

interface User {
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

interface Widget {
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

export interface ArticlePost {
  post: {
    id: string;
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
  };
  topics: Record<string, any>; // Define a more specific type if needed
  users: Record<string, User>;
  widgets: Record<string, Widget>;
}
