export interface UploadMediaModel {
  ETag: string;
  Location: string;
  key?: string;
  Key: string;
  Bucket: string;
}
export interface AddPostUploadModel {
  text: string; // Text of the Post
  attachments: Attachment[]; // JSON array | Attachments on the Post
}

export interface Attachment {
  attachment_type: 1 | 2 | 3 | 4; // Attachment type (1: Image, 2: Video, 3: Document, 4: Link)
  attachment_meta: AttachmentMeta; // JSON Object | metadata of attachment
}

export interface AttachmentMeta {
  url?: string; // URL of attachment | nullable
  format?: string; // Format of attachment (pdf, etc.) | nullable
  size?: number; // Size of attachment | nullable
  duration?: number; // Duration of video | nullable
  page_count?: number; // Page count of file | nullable
  og_tags?: OgTags; // JSON Object | og tags of link
}

export interface OgTags {
  title?: string; // Link Title | nullable
  image?: string; // Link Image URL | nullable
  description?: string; // Link description | nullable
  url?: string; // Link URL | nullable
}

export interface FileModel {
  name: string;
  lastModified: number;
  lastModifiedDate: string;
  size: number;
  type: string;
  webkitRelativePath: string;
}

export interface DecodeUrlModelSX {
  description: string;
  image: string;
  title: string;
  url: string;
}
