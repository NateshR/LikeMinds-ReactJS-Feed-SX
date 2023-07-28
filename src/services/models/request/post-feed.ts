export interface PostFeedRequestModelUI {
  text: string; // Text of the Post
  attachments: AttachmentRequestModelUI[]; // Attachments on the Post
}

export interface AttachmentRequestModelUI {
  attachmentType: number; // Attachment type (1 - Image, 2 - Video, 3 - Document, 4 - Link)
  attachmentMeta: AttachmentMetadataRequestModelUI; // Metadata of attachment
}

export interface AttachmentMetadataRequestModelUI {
  url?: string; // URL of attachment (nullable)
  format?: string; // Format of attachment (pdf, etc.) (nullable)
  size?: number; // Size of attachment (nullable)
  duration?: number; // Duration of video (nullable)
  pageCount?: number; // Page count of file (nullable)
  ogTags?: OpenGraphTagsRequestModelUI; // OG tags of link
}

export interface OpenGraphTagsRequestModelUI {
  title?: string; // Link Title (nullable)
  image?: string; // Link Image URL (nullable)
  description?: string; // Link description (nullable)
  url?: string; // Link URL (nullable)
}
