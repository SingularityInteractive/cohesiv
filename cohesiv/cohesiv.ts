import { Observable } from 'rxjs';

/**
 * Namespace cohesiv.
 * @exports cohesiv
 * @namespace
 */
export namespace cohesiv {

    /**
     * Contains all the RPC service clients.
     * @exports cohesiv.ClientFactory
     * @interface
     */
     export interface ClientFactory {

        /**
         * Returns the Access service client.
         * @returns {cohesiv.Access}
         */
        getAccess(): cohesiv.Access;

        /**
         * Returns the TagDirectory service client.
         * @returns {cohesiv.TagDirectory}
         */
        getTagDirectory(): cohesiv.TagDirectory;

        /**
         * Returns the FrameworkManager service client.
         * @returns {cohesiv.FrameworkManager}
         */
        getFrameworkManager(): cohesiv.FrameworkManager;
    }

    /**
     * Builder for an RPC service server.
     * @exports cohesiv.ServerBuilder
     * @interface
     */
     export interface ServerBuilder {

        /**
         * Adds a Access service implementation.
         * @param {cohesiv.Access} impl Access service implementation
         * @returns {cohesiv.ServerBuilder}
         */
        addAccess(impl: cohesiv.Access): cohesiv.ServerBuilder;

        /**
         * Adds a TagDirectory service implementation.
         * @param {cohesiv.TagDirectory} impl TagDirectory service implementation
         * @returns {cohesiv.ServerBuilder}
         */
        addTagDirectory(impl: cohesiv.TagDirectory): cohesiv.ServerBuilder;

        /**
         * Adds a FrameworkManager service implementation.
         * @param {cohesiv.FrameworkManager} impl FrameworkManager service implementation
         * @returns {cohesiv.ServerBuilder}
         */
        addFrameworkManager(impl: cohesiv.FrameworkManager): cohesiv.ServerBuilder;
    }

    /**
     * Constructs a new Namespace.
     * @exports cohesiv.Namespace
     * @interface
     */
     export interface Namespace {

        /**
         * Namespace name.
         * @type {string|undefined}
         */
        name?: string;
    }

    /**
     * Constructs a new Resource.
     * @exports cohesiv.Resource
     * @interface
     */
     export interface Resource {

        /**
         * Resource id.
         * @type {string|undefined}
         */
        id?: string;

        /**
         * Resource namespace.
         * @type {string|undefined}
         */
        namespace?: string;
    }

    /**
     * Constructs a new Resources.
     * @exports cohesiv.Resources
     * @interface
     */
     export interface Resources {

        /**
         * Resources results.
         * @type {Array.<cohesiv.Resource>|undefined}
         */
        results?: cohesiv.Resource[];
    }

    /**
     * Constructs a new Access service.
     * @exports cohesiv.Access
     * @interface
     */
     export interface Access {

        /**
         * Calls Evaluate.
         * @param {cohesiv.AccessRequest} request AccessRequest message or plain object
         * @returns {Observable<cohesiv.AccessResponse>}
         */
        evaluate(request: cohesiv.AccessRequest): Observable<cohesiv.AccessResponse>;

        /**
         * Calls EvaluateMany.
         * @param {cohesiv.ManyAccessRequest} request ManyAccessRequest message or plain object
         * @returns {Observable<cohesiv.AccessResponse>}
         */
        evaluateMany(request: cohesiv.ManyAccessRequest): Observable<cohesiv.AccessResponse>;
    }

    /**
     * Constructs a new AccessRequest.
     * @exports cohesiv.AccessRequest
     * @interface
     */
     export interface AccessRequest {

        /**
         * AccessRequest namespace.
         * @type {string|undefined}
         */
        namespace?: string;

        /**
         * AccessRequest user_id.
         * @type {string|undefined}
         */
        user_id?: string;

        /**
         * AccessRequest action.
         * @type {cohesiv.ResourceAction|undefined}
         */
        action?: cohesiv.ResourceAction;
    }

    /**
     * Constructs a new ManyAccessRequest.
     * @exports cohesiv.ManyAccessRequest
     * @interface
     */
     export interface ManyAccessRequest {

        /**
         * ManyAccessRequest namespace.
         * @type {string|undefined}
         */
        namespace?: string;

        /**
         * ManyAccessRequest user_id.
         * @type {string|undefined}
         */
        user_id?: string;

        /**
         * ManyAccessRequest actions.
         * @type {Array.<cohesiv.ResourceAction>|undefined}
         */
        actions?: cohesiv.ResourceAction[];
    }

    /**
     * Constructs a new ResourceAction.
     * @exports cohesiv.ResourceAction
     * @interface
     */
     export interface ResourceAction {

        /**
         * ResourceAction action.
         * @type {string|undefined}
         */
        action?: string;

        /**
         * ResourceAction resource.
         * @type {string|undefined}
         */
        resource?: string;
    }

    /**
     * Constructs a new AccessResponse.
     * @exports cohesiv.AccessResponse
     * @interface
     */
     export interface AccessResponse {

        /**
         * AccessResponse valid.
         * @type {boolean|undefined}
         */
        valid?: boolean;
    }

    /**
     * Constructs a new AccessStatement.
     * @exports cohesiv.AccessStatement
     * @interface
     */
     export interface AccessStatement {

        /**
         * AccessStatement Sid.
         * @type {string|undefined}
         */
        Sid?: string;

        /**
         * AccessStatement Effect.
         * @type {string|undefined}
         */
        Effect?: string;

        /**
         * AccessStatement Action.
         * @type {Array.<string>|undefined}
         */
        Action?: string[];

        /**
         * AccessStatement Resource.
         * @type {Array.<string>|undefined}
         */
        Resource?: string[];
    }

    /**
     * Constructs a new TagDirectory service.
     * @exports cohesiv.TagDirectory
     * @interface
     */
     export interface TagDirectory {

        /**
         * Calls GetTags.
         * @param {cohesiv.GetTagsRequest} request GetTagsRequest message or plain object
         * @returns {Observable<cohesiv.Tags>}
         */
        getTags(request: cohesiv.GetTagsRequest): Observable<cohesiv.Tags>;

        /**
         * Calls CreateTags.
         * @param {cohesiv.CreateTagsRequest} request CreateTagsRequest message or plain object
         * @returns {Observable<cohesiv.Tags>}
         */
        createTags(request: cohesiv.CreateTagsRequest): Observable<cohesiv.Tags>;

        /**
         * Calls GetResourcesByTagName.
         * @param {cohesiv.GetResourcesByTagNameRequest} request GetResourcesByTagNameRequest message or plain object
         * @returns {Observable<cohesiv.Resources>}
         */
        getResourcesByTagName(request: cohesiv.GetResourcesByTagNameRequest): Observable<cohesiv.Resources>;
    }

    /**
     * Constructs a new Tag.
     * @exports cohesiv.Tag
     * @interface
     */
     export interface Tag {

        /**
         * Tag name.
         * @type {string|undefined}
         */
        name?: string;

        /**
         * Tag namespace.
         * @type {string|undefined}
         */
        namespace?: string;
    }

    /**
     * Constructs a new Tags.
     * @exports cohesiv.Tags
     * @interface
     */
     export interface Tags {

        /**
         * Tags results.
         * @type {Array.<cohesiv.Tag>|undefined}
         */
        results?: cohesiv.Tag[];
    }

    /**
     * Constructs a new GetTagsRequest.
     * @exports cohesiv.GetTagsRequest
     * @interface
     */
     export interface GetTagsRequest {

        /**
         * GetTagsRequest resource_id.
         * @type {string|undefined}
         */
        resource_id?: string;

        /**
         * GetTagsRequest namespace.
         * @type {string|undefined}
         */
        namespace?: string;
    }

    /**
     * Constructs a new GetResourcesByTagNameRequest.
     * @exports cohesiv.GetResourcesByTagNameRequest
     * @interface
     */
     export interface GetResourcesByTagNameRequest {

        /**
         * GetResourcesByTagNameRequest name.
         * @type {string|undefined}
         */
        name?: string;

        /**
         * GetResourcesByTagNameRequest namespace.
         * @type {string|undefined}
         */
        namespace?: string;
    }

    /**
     * Constructs a new CreateTagRequest.
     * @exports cohesiv.CreateTagRequest
     * @interface
     */
     export interface CreateTagRequest {

        /**
         * CreateTagRequest resource_id.
         * @type {string|undefined}
         */
        resource_id?: string;

        /**
         * CreateTagRequest name.
         * @type {string|undefined}
         */
        name?: string;

        /**
         * CreateTagRequest namespace.
         * @type {string|undefined}
         */
        namespace?: string;
    }

    /**
     * Constructs a new CreateTagsRequest.
     * @exports cohesiv.CreateTagsRequest
     * @interface
     */
     export interface CreateTagsRequest {

        /**
         * CreateTagsRequest tags.
         * @type {Array.<cohesiv.CreateTagRequest>|undefined}
         */
        tags?: cohesiv.CreateTagRequest[];
    }

    /**
     * Constructs a new FrameworkManager service.
     * @exports cohesiv.FrameworkManager
     * @interface
     */
     export interface FrameworkManager {

        /**
         * Calls CreateGraph.
         * @param {cohesiv.CreateGraphRequest} request CreateGraphRequest message or plain object
         * @returns {Observable<cohesiv.Graph>}
         */
        createGraph(request: cohesiv.CreateGraphRequest): Observable<cohesiv.Graph>;
    }

    /**
     * Constructs a new CreateGraphRequest.
     * @exports cohesiv.CreateGraphRequest
     * @interface
     */
     export interface CreateGraphRequest {

        /**
         * CreateGraphRequest namespace.
         * @type {string|undefined}
         */
        namespace?: string;
    }

    /**
     * Constructs a new Graph.
     * @exports cohesiv.Graph
     * @interface
     */
     export interface Graph {

        /**
         * Graph id.
         * @type {string|undefined}
         */
        id?: string;
    }
}
