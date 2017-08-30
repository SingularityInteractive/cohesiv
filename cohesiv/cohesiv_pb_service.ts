// package: 
// file: cohesiv.proto

import * as cohesiv_pb from "./cohesiv_pb";
export class TagDirectory {
  static serviceName = "TagDirectory";
}
export namespace TagDirectory {
  export class GetTags {
    static readonly methodName = "GetTags";
    static readonly service = TagDirectory;
    static readonly requestStream = false;
    static readonly responseStream = false;
    static readonly requestType = cohesiv_pb.GetTagsRequest;
    static readonly responseType = cohesiv_pb.Tags;
  }
  export class CreateTags {
    static readonly methodName = "CreateTags";
    static readonly service = TagDirectory;
    static readonly requestStream = false;
    static readonly responseStream = false;
    static readonly requestType = cohesiv_pb.CreateTagsRequest;
    static readonly responseType = cohesiv_pb.Tags;
  }
  export class GetResourcesByTagName {
    static readonly methodName = "GetResourcesByTagName";
    static readonly service = TagDirectory;
    static readonly requestStream = false;
    static readonly responseStream = false;
    static readonly requestType = cohesiv_pb.GetResourcesByTagNameRequest;
    static readonly responseType = cohesiv_pb.Resources;
  }
}
