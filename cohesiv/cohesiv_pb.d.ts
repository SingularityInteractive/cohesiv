// package: 
// file: cohesiv.proto

import * as jspb from "google-protobuf";

export class Resource extends jspb.Message {
  getId(): string;
  setId(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Resource.AsObject;
  static toObject(includeInstance: boolean, msg: Resource): Resource.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Resource, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Resource;
  static deserializeBinaryFromReader(message: Resource, reader: jspb.BinaryReader): Resource;
}

export namespace Resource {
  export type AsObject = {
    id: string,
  }
}

export class Resources extends jspb.Message {
  clearResultsList(): void;
  getResultsList(): Array<Resource>;
  setResultsList(value: Array<Resource>): void;
  addResults(value?: Resource, index?: number): Resource;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Resources.AsObject;
  static toObject(includeInstance: boolean, msg: Resources): Resources.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Resources, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Resources;
  static deserializeBinaryFromReader(message: Resources, reader: jspb.BinaryReader): Resources;
}

export namespace Resources {
  export type AsObject = {
    resultsList: Array<Resource.AsObject>,
  }
}

export class Tag extends jspb.Message {
  getName(): string;
  setName(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Tag.AsObject;
  static toObject(includeInstance: boolean, msg: Tag): Tag.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Tag, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Tag;
  static deserializeBinaryFromReader(message: Tag, reader: jspb.BinaryReader): Tag;
}

export namespace Tag {
  export type AsObject = {
    name: string,
  }
}

export class Tags extends jspb.Message {
  clearResultsList(): void;
  getResultsList(): Array<Tag>;
  setResultsList(value: Array<Tag>): void;
  addResults(value?: Tag, index?: number): Tag;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Tags.AsObject;
  static toObject(includeInstance: boolean, msg: Tags): Tags.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Tags, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Tags;
  static deserializeBinaryFromReader(message: Tags, reader: jspb.BinaryReader): Tags;
}

export namespace Tags {
  export type AsObject = {
    resultsList: Array<Tag.AsObject>,
  }
}

export class GetTagsRequest extends jspb.Message {
  getResourceid(): string;
  setResourceid(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetTagsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetTagsRequest): GetTagsRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetTagsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetTagsRequest;
  static deserializeBinaryFromReader(message: GetTagsRequest, reader: jspb.BinaryReader): GetTagsRequest;
}

export namespace GetTagsRequest {
  export type AsObject = {
    resourceid: string,
  }
}

export class GetResourcesByTagNameRequest extends jspb.Message {
  getName(): string;
  setName(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetResourcesByTagNameRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetResourcesByTagNameRequest): GetResourcesByTagNameRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetResourcesByTagNameRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetResourcesByTagNameRequest;
  static deserializeBinaryFromReader(message: GetResourcesByTagNameRequest, reader: jspb.BinaryReader): GetResourcesByTagNameRequest;
}

export namespace GetResourcesByTagNameRequest {
  export type AsObject = {
    name: string,
  }
}

export class CreateTagRequest extends jspb.Message {
  getResourceid(): string;
  setResourceid(value: string): void;

  getName(): string;
  setName(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateTagRequest.AsObject;
  static toObject(includeInstance: boolean, msg: CreateTagRequest): CreateTagRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CreateTagRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateTagRequest;
  static deserializeBinaryFromReader(message: CreateTagRequest, reader: jspb.BinaryReader): CreateTagRequest;
}

export namespace CreateTagRequest {
  export type AsObject = {
    resourceid: string,
    name: string,
  }
}

export class CreateTagsRequest extends jspb.Message {
  clearTagsList(): void;
  getTagsList(): Array<CreateTagRequest>;
  setTagsList(value: Array<CreateTagRequest>): void;
  addTags(value?: CreateTagRequest, index?: number): CreateTagRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateTagsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: CreateTagsRequest): CreateTagsRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CreateTagsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateTagsRequest;
  static deserializeBinaryFromReader(message: CreateTagsRequest, reader: jspb.BinaryReader): CreateTagsRequest;
}

export namespace CreateTagsRequest {
  export type AsObject = {
    tagsList: Array<CreateTagRequest.AsObject>,
  }
}

