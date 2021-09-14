
const Data_Maybe = PS["Data.Maybe"]; 
const E = PS["Incentknow.Data.Entities"] || {};
PS["Incentknow.Data.Entities"] = E;
const endpoint = "http://localhost:8080";

exports.apiEndpoint = endpoint;

async function requestApi(method, args) {
    console.log({ method: method, body: args });
    const session = localStorage.getItem("session");
    const headers = {};
    if (session) {
        headers['Session'] = session;
    }
    let body = null;
    if (method.startsWith("upload")) {
        if (Array.isArray(args)) {
            args = args[0];
        }
        body = new FormData();
        const json = {};
        Object.keys(args).forEach(key => { 
            if (key != 'blob') {
                json[key] = args[key];
            }
        });
        console.log("args.blob");
        console.log(args.blob);
        body.append('blob', args.blob);
        body.append('json', JSON.stringify(json));
    } else {
        body = JSON.stringify(args);
        headers['Content-Type'] = 'application/json';
    }
    const response = await fetch(endpoint + "/" + method, {
        method: 'POST',
        body,
        headers: headers,
        mode: 'cors'
    });
    return await response.json();
}

const psObjectLiteral = x => x;
const psInt = x => x;

function jsContentGenerator(obj) {
                if(E.ContentGeneratorNone && obj instanceof E.ContentGeneratorNone) {
                    return "none";
                }
            
                if(E.ContentGeneratorReactor && obj instanceof E.ContentGeneratorReactor) {
                    return "reactor";
                }
            
                if(E.ContentGeneratorCrawler && obj instanceof E.ContentGeneratorCrawler) {
                    return "crawler";
                }
            }

function psContentGenerator(str) {switch(str){
case "none":
return (E.ContentGeneratorNone || { value: null }).value;
case "reactor":
return (E.ContentGeneratorReactor || { value: null }).value;
case "crawler":
return (E.ContentGeneratorCrawler || { value: null }).value;
}}

const jsContainerSk = x => x;


const psContainerSk = x => x;


const jsContainerId = x => x;


const psContainerId = x => x;


const jsContentSk = x => x;


const psContentSk = x => x;


const jsContentId = x => x;


const psContentId = x => x;


const jsContentCommitSk = x => x;


const psContentCommitSk = x => x;


const jsContentCommitId = x => x;


const psContentCommitId = x => x;


function jsContentDraftState(obj) {
                if(E.ContentDraftStateEditing && obj instanceof E.ContentDraftStateEditing) {
                    return "editing";
                }
            
                if(E.ContentDraftStateCanceled && obj instanceof E.ContentDraftStateCanceled) {
                    return "canceled";
                }
            
                if(E.ContentDraftStateCommitted && obj instanceof E.ContentDraftStateCommitted) {
                    return "committed";
                }
            }

function psContentDraftState(str) {switch(str){
case "editing":
return (E.ContentDraftStateEditing || { value: null }).value;
case "canceled":
return (E.ContentDraftStateCanceled || { value: null }).value;
case "committed":
return (E.ContentDraftStateCommitted || { value: null }).value;
}}

const jsContentDraftSk = x => x;


const psContentDraftSk = x => x;


const jsContentDraftId = x => x;


const psContentDraftId = x => x;


function jsFormatUsage(obj) {
                if(E.Internal && obj instanceof E.Internal) {
                    return "internal";
                }
            
                if(E.External && obj instanceof E.External) {
                    return "external";
                }
            }

function psFormatUsage(str) {switch(str){
case "internal":
return (E.Internal || { value: null }).value;
case "external":
return (E.External || { value: null }).value;
}}

const jsFormatSk = x => x;


const psFormatSk = x => x;


const jsFormatId = x => x;


const psFormatId = x => x;


const jsFormatDisplayId = x => x;


const psFormatDisplayId = x => x;


const jsSemanticId = x => x;


const psSemanticId = x => x;


const jsMetaPropertySk = x => x;


const psMetaPropertySk = x => x;


const jsMetaPropertyId = x => x;


const psMetaPropertyId = x => x;


function jsMetaPropertyType(obj) {
                if(E.ValueRelatively && obj instanceof E.ValueRelatively) {
                    return "value_relatively";
                }
            
                if(E.MutualExclutively && obj instanceof E.MutualExclutively) {
                    return "mutual_exclutively";
                }
            
                if(E.SeriesDependency && obj instanceof E.SeriesDependency) {
                    return "series_dependency";
                }
            }

function psMetaPropertyType(str) {switch(str){
case "value_relatively":
return (E.ValueRelatively || { value: null }).value;
case "mutual_exclutively":
return (E.MutualExclutively || { value: null }).value;
case "series_dependency":
return (E.SeriesDependency || { value: null }).value;
}}

function jsTypeName(obj) {
                if(E.TypeNameInt && obj instanceof E.TypeNameInt) {
                    return "integer";
                }
            
                if(E.TypeNameBool && obj instanceof E.TypeNameBool) {
                    return "boolean";
                }
            
                if(E.TypeNameString && obj instanceof E.TypeNameString) {
                    return "string";
                }
            
                if(E.TypeNameContent && obj instanceof E.TypeNameContent) {
                    return "content";
                }
            
                if(E.TypeNameUrl && obj instanceof E.TypeNameUrl) {
                    return "url";
                }
            
                if(E.TypeNameObject && obj instanceof E.TypeNameObject) {
                    return "object";
                }
            
                if(E.TypeNameText && obj instanceof E.TypeNameText) {
                    return "text";
                }
            
                if(E.TypeNameArray && obj instanceof E.TypeNameArray) {
                    return "array";
                }
            
                if(E.TypeNameEnum && obj instanceof E.TypeNameEnum) {
                    return "enumerator";
                }
            
                if(E.TypeNameDocument && obj instanceof E.TypeNameDocument) {
                    return "document";
                }
            
                if(E.TypeNameImage && obj instanceof E.TypeNameImage) {
                    return "image";
                }
            
                if(E.TypeNameEntity && obj instanceof E.TypeNameEntity) {
                    return "entity";
                }
            }

function psTypeName(str) {switch(str){
case "integer":
return (E.TypeNameInt || { value: null }).value;
case "boolean":
return (E.TypeNameBool || { value: null }).value;
case "string":
return (E.TypeNameString || { value: null }).value;
case "content":
return (E.TypeNameContent || { value: null }).value;
case "url":
return (E.TypeNameUrl || { value: null }).value;
case "object":
return (E.TypeNameObject || { value: null }).value;
case "text":
return (E.TypeNameText || { value: null }).value;
case "array":
return (E.TypeNameArray || { value: null }).value;
case "enumerator":
return (E.TypeNameEnum || { value: null }).value;
case "document":
return (E.TypeNameDocument || { value: null }).value;
case "image":
return (E.TypeNameImage || { value: null }).value;
case "entity":
return (E.TypeNameEntity || { value: null }).value;
}}

function jsLanguage(obj) {
                if(E.Python && obj instanceof E.Python) {
                    return "python";
                }
            
                if(E.Javascript && obj instanceof E.Javascript) {
                    return "javascript";
                }
            }

function psLanguage(str) {switch(str){
case "python":
return (E.Python || { value: null }).value;
case "javascript":
return (E.Javascript || { value: null }).value;
}}

const jsPropertySk = x => x;


const psPropertySk = x => x;


const jsPropertyId = x => x;


const psPropertyId = x => x;


const jsStructureSk = x => x;


const psStructureSk = x => x;


const jsStructureId = x => x;


const psStructureId = x => x;


function jsMaterialType(obj) {
                if(E.MaterialTypePlaintext && obj instanceof E.MaterialTypePlaintext) {
                    return "plaintext";
                }
            
                if(E.MaterialTypeDocument && obj instanceof E.MaterialTypeDocument) {
                    return "document";
                }
            }

function psMaterialType(str) {switch(str){
case "plaintext":
return (E.MaterialTypePlaintext || { value: null }).value;
case "document":
return (E.MaterialTypeDocument || { value: null }).value;
}}

const jsMaterialSk = x => x;


const psMaterialSk = x => x;


const jsMaterialId = x => x;


const psMaterialId = x => x;


const jsMaterialCommitSk = x => x;


const psMaterialCommitSk = x => x;


const jsMaterialCommitId = x => x;


const psMaterialCommitId = x => x;


function jsMaterialChangeType(obj) {
                if(E.Initial && obj instanceof E.Initial) {
                    return "initial";
                }
            
                if(E.Write && obj instanceof E.Write) {
                    return "write";
                }
            
                if(E.Remove && obj instanceof E.Remove) {
                    return "remove";
                }
            }

function psMaterialChangeType(str) {switch(str){
case "initial":
return (E.Initial || { value: null }).value;
case "write":
return (E.Write || { value: null }).value;
case "remove":
return (E.Remove || { value: null }).value;
}}

function jsMaterialType2(obj) {
                if(E.MaterialType2Plaintext && obj instanceof E.MaterialType2Plaintext) {
                    return "plaintext";
                }
            
                if(E.MaterialType2Document && obj instanceof E.MaterialType2Document) {
                    return "document";
                }
            }

function psMaterialType2(str) {switch(str){
case "plaintext":
return (E.MaterialType2Plaintext || { value: null }).value;
case "document":
return (E.MaterialType2Document || { value: null }).value;
}}

const jsMaterialDraftSk = x => x;


const psMaterialDraftSk = x => x;


const jsMaterialDraftId = x => x;


const psMaterialDraftId = x => x;


function jsMaterialEditingState(obj) {
                if(E.MaterialEditingStateEditing && obj instanceof E.MaterialEditingStateEditing) {
                    return "editing";
                }
            
                if(E.MaterialEditingStateCommitted && obj instanceof E.MaterialEditingStateCommitted) {
                    return "committed";
                }
            
                if(E.MaterialEditingStateCanceld && obj instanceof E.MaterialEditingStateCanceld) {
                    return "canceled";
                }
            }

function psMaterialEditingState(str) {switch(str){
case "editing":
return (E.MaterialEditingStateEditing || { value: null }).value;
case "committed":
return (E.MaterialEditingStateCommitted || { value: null }).value;
case "canceled":
return (E.MaterialEditingStateCanceld || { value: null }).value;
}}

const jsMaterialEditingSk = x => x;


const psMaterialEditingSk = x => x;


const jsMaterialEditingId = x => x;


const psMaterialEditingId = x => x;


const jsMaterialSnapshotSk = x => x;


const psMaterialSnapshotSk = x => x;


const jsMaterialSnapshotId = x => x;


const psMaterialSnapshotId = x => x;


function jsActivityType(obj) {
                if(E.ActivityTypeContentCreated && obj instanceof E.ActivityTypeContentCreated) {
                    return "content_created";
                }
            
                if(E.ActivityTypeContentUpdated && obj instanceof E.ActivityTypeContentUpdated) {
                    return "content_updated";
                }
            
                if(E.ActivityTypeContentCommented && obj instanceof E.ActivityTypeContentCommented) {
                    return "content_commented";
                }
            }

function psActivityType(str) {switch(str){
case "content_created":
return (E.ActivityTypeContentCreated || { value: null }).value;
case "content_updated":
return (E.ActivityTypeContentUpdated || { value: null }).value;
case "content_commented":
return (E.ActivityTypeContentCommented || { value: null }).value;
}}

const jsActivitySk = x => x;


const psActivitySk = x => x;


const jsActivityId = x => x;


const psActivityId = x => x;


const jsCommentSk = x => x;


const psCommentSk = x => x;


const jsCommentId = x => x;


const psCommentId = x => x;


function jsCommentState(obj) {
                if(E.CommentStateNormal && obj instanceof E.CommentStateNormal) {
                    return "normal";
                }
            
                if(E.CommentStateDeleted && obj instanceof E.CommentStateDeleted) {
                    return "deleted";
                }
            }

function psCommentState(str) {switch(str){
case "normal":
return (E.CommentStateNormal || { value: null }).value;
case "deleted":
return (E.CommentStateDeleted || { value: null }).value;
}}

const jsCommentLikeSk = x => x;


const psCommentLikeSk = x => x;


const jsContentLikeSk = x => x;


const psContentLikeSk = x => x;


function jsNotificationType(obj) {
                if(E.NotificationTypeContentCommented && obj instanceof E.NotificationTypeContentCommented) {
                    return "content_commented";
                }
            
                if(E.NotificationTypeCommentReplied && obj instanceof E.NotificationTypeCommentReplied) {
                    return "comment_replied";
                }
            }

function psNotificationType(str) {switch(str){
case "content_commented":
return (E.NotificationTypeContentCommented || { value: null }).value;
case "comment_replied":
return (E.NotificationTypeCommentReplied || { value: null }).value;
}}

const jsNotificationSk = x => x;


const psNotificationSk = x => x;


const jsNotificationId = x => x;


const psNotificationId = x => x;


function jsReactorState(obj) {
                if(E.Invaild && obj instanceof E.Invaild) {
                    return "invaild";
                }
            }

function psReactorState(str) {switch(str){
case "invaild":
return (E.Invaild || { value: null }).value;
}}

const jsReactorSk = x => x;


const psReactorSk = x => x;


const jsReactorId = x => x;


const psReactorId = x => x;


function jsMembershipMethod(obj) {
                if(E.MembershipMethodNone && obj instanceof E.MembershipMethodNone) {
                    return "none";
                }
            
                if(E.MembershipMethodApp && obj instanceof E.MembershipMethodApp) {
                    return "app";
                }
            }

function psMembershipMethod(str) {switch(str){
case "none":
return (E.MembershipMethodNone || { value: null }).value;
case "app":
return (E.MembershipMethodApp || { value: null }).value;
}}

function jsSpaceAuthority(obj) {
                if(E.SpaceAuthorityNone && obj instanceof E.SpaceAuthorityNone) {
                    return "none";
                }
            
                if(E.SpaceAuthorityVisible && obj instanceof E.SpaceAuthorityVisible) {
                    return "visible";
                }
            
                if(E.SpaceAuthorityReadable && obj instanceof E.SpaceAuthorityReadable) {
                    return "readable";
                }
            
                if(E.SpaceAuthorityWritable && obj instanceof E.SpaceAuthorityWritable) {
                    return "writable";
                }
            }

function psSpaceAuthority(str) {switch(str){
case "none":
return (E.SpaceAuthorityNone || { value: null }).value;
case "visible":
return (E.SpaceAuthorityVisible || { value: null }).value;
case "readable":
return (E.SpaceAuthorityReadable || { value: null }).value;
case "writable":
return (E.SpaceAuthorityWritable || { value: null }).value;
}}

const jsSpaceSk = x => x;


const psSpaceSk = x => x;


const jsSpaceId = x => x;


const psSpaceId = x => x;


const jsSpaceDisplayId = x => x;


const psSpaceDisplayId = x => x;


const jsSpaceFollowSk = x => x;


const psSpaceFollowSk = x => x;


function jsMemberType(obj) {
                if(E.MemberTypeNormal && obj instanceof E.MemberTypeNormal) {
                    return "normal";
                }
            
                if(E.MemberTypeOwner && obj instanceof E.MemberTypeOwner) {
                    return "owner";
                }
            }

function psMemberType(str) {switch(str){
case "normal":
return (E.MemberTypeNormal || { value: null }).value;
case "owner":
return (E.MemberTypeOwner || { value: null }).value;
}}

const jsSpaceMemberSk = x => x;


const psSpaceMemberSk = x => x;


const jsSpaceMembershipApplicationSk = x => x;


const psSpaceMembershipApplicationSk = x => x;


const jsUserSk = x => x;


const psUserSk = x => x;


const jsUserId = x => x;


const psUserId = x => x;


const jsUserDisplayId = x => x;


const psUserDisplayId = x => x;


function jsRelatedContainer(obj){obj.containerId = obj.containerId ? jsContainerId(obj.containerId) : null;
obj.space = obj.space ? jsRelatedSpace(obj.space) : null;
obj.format = obj.format ? jsRelatedFormat(obj.format) : null;




                        if (obj.generator instanceof Data_Maybe.Just) {
                            obj.generator = obj.generator.value0;
                            obj.generator = obj.generator ? jsContentGenerator(obj.generator) : null;
                        } else {
                            obj.generator = null;
                        }
                    return obj;}exports.fromRelatedContainerToJson = x => jsRelatedContainer(_.cloneDeep(x));

function psRelatedContainer(obj){obj.containerId = obj.containerId ? psContainerId(obj.containerId) : null;
obj.space = obj.space ? psRelatedSpace(obj.space) : null;
obj.format = obj.format ? psRelatedFormat(obj.format) : null;




                    if (obj.generator) {
                        obj.generator = obj.generator ? psContentGenerator(obj.generator) : null;
                        obj.generator = new Data_Maybe.Just(obj.generator);
                    } else {
                        obj.generator = Data_Maybe.Nothing.value;
                    }
                return obj;}exports.fromJsonToRelatedContainer = x => psRelatedContainer(_.cloneDeep(x));

function jsAdditionalContainerInfo(obj){

                        if (obj.latestUpdatedAt instanceof Data_Maybe.Just) {
                            obj.latestUpdatedAt = obj.latestUpdatedAt.value0;
                            obj.latestUpdatedAt = obj.latestUpdatedAt ? jsDate(obj.latestUpdatedAt) : null;
                        } else {
                            obj.latestUpdatedAt = null;
                        }
                    return obj;}exports.fromAdditionalContainerInfoToJson = x => jsAdditionalContainerInfo(_.cloneDeep(x));

function psAdditionalContainerInfo(obj){

                    if (obj.latestUpdatedAt) {
                        obj.latestUpdatedAt = obj.latestUpdatedAt ? psDate(obj.latestUpdatedAt) : null;
                        obj.latestUpdatedAt = new Data_Maybe.Just(obj.latestUpdatedAt);
                    } else {
                        obj.latestUpdatedAt = Data_Maybe.Nothing.value;
                    }
                return obj;}exports.fromJsonToAdditionalContainerInfo = x => psAdditionalContainerInfo(_.cloneDeep(x));

function jsFocusedContainer(obj){obj.containerId = obj.containerId ? jsContainerId(obj.containerId) : null;
obj.space = obj.space ? jsRelatedSpace(obj.space) : null;
obj.format = obj.format ? jsRelatedFormat(obj.format) : null;



                        if (obj.generator instanceof Data_Maybe.Just) {
                            obj.generator = obj.generator.value0;
                            obj.generator = obj.generator ? jsContentGenerator(obj.generator) : null;
                        } else {
                            obj.generator = null;
                        }
                    

                        if (obj.reactor instanceof Data_Maybe.Just) {
                            obj.reactor = obj.reactor.value0;
                            obj.reactor = obj.reactor ? jsIntactReactor(obj.reactor) : null;
                        } else {
                            obj.reactor = null;
                        }
                    


                        if (obj.latestUpdatedAt instanceof Data_Maybe.Just) {
                            obj.latestUpdatedAt = obj.latestUpdatedAt.value0;
                            
                        } else {
                            obj.latestUpdatedAt = null;
                        }
                    return obj;}exports.fromFocusedContainerToJson = x => jsFocusedContainer(_.cloneDeep(x));

function psFocusedContainer(obj){obj.containerId = obj.containerId ? psContainerId(obj.containerId) : null;
obj.space = obj.space ? psRelatedSpace(obj.space) : null;
obj.format = obj.format ? psRelatedFormat(obj.format) : null;



                    if (obj.generator) {
                        obj.generator = obj.generator ? psContentGenerator(obj.generator) : null;
                        obj.generator = new Data_Maybe.Just(obj.generator);
                    } else {
                        obj.generator = Data_Maybe.Nothing.value;
                    }
                

                    if (obj.reactor) {
                        obj.reactor = obj.reactor ? psIntactReactor(obj.reactor) : null;
                        obj.reactor = new Data_Maybe.Just(obj.reactor);
                    } else {
                        obj.reactor = Data_Maybe.Nothing.value;
                    }
                


                    if (obj.latestUpdatedAt) {
                        
                        obj.latestUpdatedAt = new Data_Maybe.Just(obj.latestUpdatedAt);
                    } else {
                        obj.latestUpdatedAt = Data_Maybe.Nothing.value;
                    }
                return obj;}exports.fromJsonToFocusedContainer = x => psFocusedContainer(_.cloneDeep(x));

function jsAuthority(obj) {
                if(E.AuthorityNone && obj instanceof E.AuthorityNone) {
                    return "none";
                }
            
                if(E.AuthorityReadable && obj instanceof E.AuthorityReadable) {
                    return "readable";
                }
            
                if(E.AuthorityWritable && obj instanceof E.AuthorityWritable) {
                    return "writable";
                }
            }

function psAuthority(str) {switch(str){
case "none":
return (E.AuthorityNone || { value: null }).value;
case "readable":
return (E.AuthorityReadable || { value: null }).value;
case "writable":
return (E.AuthorityWritable || { value: null }).value;
}}

function jsRelatedContent(obj){obj.contentId = obj.contentId ? jsContentId(obj.contentId) : null;


obj.creatorUser = obj.creatorUser ? jsRelatedUser(obj.creatorUser) : null;
obj.updaterUser = obj.updaterUser ? jsRelatedUser(obj.updaterUser) : null;



obj.format = obj.format ? jsFocusedFormat(obj.format) : null;

obj.authority = obj.authority ? jsAuthority(obj.authority) : null;return obj;}exports.fromRelatedContentToJson = x => jsRelatedContent(_.cloneDeep(x));

function psRelatedContent(obj){obj.contentId = obj.contentId ? psContentId(obj.contentId) : null;


obj.creatorUser = obj.creatorUser ? psRelatedUser(obj.creatorUser) : null;
obj.updaterUser = obj.updaterUser ? psRelatedUser(obj.updaterUser) : null;



obj.format = obj.format ? psFocusedFormat(obj.format) : null;

obj.authority = obj.authority ? psAuthority(obj.authority) : null;return obj;}exports.fromJsonToRelatedContent = x => psRelatedContent(_.cloneDeep(x));

function jsFocusedContent(obj){obj.contentId = obj.contentId ? jsContentId(obj.contentId) : null;


obj.creatorUser = obj.creatorUser ? jsRelatedUser(obj.creatorUser) : null;
obj.updaterUser = obj.updaterUser ? jsRelatedUser(obj.updaterUser) : null;



obj.format = obj.format ? jsFocusedFormat(obj.format) : null;
obj.authority = obj.authority ? jsAuthority(obj.authority) : null;
return obj;}exports.fromFocusedContentToJson = x => jsFocusedContent(_.cloneDeep(x));

function psFocusedContent(obj){obj.contentId = obj.contentId ? psContentId(obj.contentId) : null;


obj.creatorUser = obj.creatorUser ? psRelatedUser(obj.creatorUser) : null;
obj.updaterUser = obj.updaterUser ? psRelatedUser(obj.updaterUser) : null;



obj.format = obj.format ? psFocusedFormat(obj.format) : null;
obj.authority = obj.authority ? psAuthority(obj.authority) : null;
return obj;}exports.fromJsonToFocusedContent = x => psFocusedContent(_.cloneDeep(x));

function jsContentRelation(obj){
                            obj.contents = obj.contents ? obj.contents.map(x => {
                                x = x ? jsRelatedContent(x) : null;
                                return x;
                            }) : null;
                        
obj.relation = obj.relation ? jsRelation(obj.relation) : null;return obj;}exports.fromContentRelationToJson = x => jsContentRelation(_.cloneDeep(x));

function psContentRelation(obj){
                        obj.contents = obj.contents ? obj.contents.map(x => {
                            x = x ? psRelatedContent(x) : null;
                            return x;
                        }) : null;
                    
obj.relation = obj.relation ? psRelation(obj.relation) : null;return obj;}exports.fromJsonToContentRelation = x => psContentRelation(_.cloneDeep(x));

function jsSearchedContent(obj){obj.content = obj.content ? jsRelatedContent(obj.content) : null;

                            obj.highlights = obj.highlights ? obj.highlights.map(x => {
                                
                                return x;
                            }) : null;
                        
return obj;}exports.fromSearchedContentToJson = x => jsSearchedContent(_.cloneDeep(x));

function psSearchedContent(obj){obj.content = obj.content ? psRelatedContent(obj.content) : null;

                        obj.highlights = obj.highlights ? obj.highlights.map(x => {
                            
                            return x;
                        }) : null;
                    
return obj;}exports.fromJsonToSearchedContent = x => psSearchedContent(_.cloneDeep(x));

function jsIntactContentPage(obj){obj.content = obj.content ? jsFocusedContent(obj.content) : null;

                        if (obj.draft instanceof Data_Maybe.Just) {
                            obj.draft = obj.draft.value0;
                            obj.draft = obj.draft ? jsRelatedContentDraft(obj.draft) : null;
                        } else {
                            obj.draft = null;
                        }
                    

                            obj.comments = obj.comments ? obj.comments.map(x => {
                                x = x ? jsFocusedTreeComment(x) : null;
                                return x;
                            }) : null;
                        

                            obj.relations = obj.relations ? obj.relations.map(x => {
                                x = x ? jsContentRelation(x) : null;
                                return x;
                            }) : null;
                        return obj;}exports.fromIntactContentPageToJson = x => jsIntactContentPage(_.cloneDeep(x));

function psIntactContentPage(obj){obj.content = obj.content ? psFocusedContent(obj.content) : null;

                    if (obj.draft) {
                        obj.draft = obj.draft ? psRelatedContentDraft(obj.draft) : null;
                        obj.draft = new Data_Maybe.Just(obj.draft);
                    } else {
                        obj.draft = Data_Maybe.Nothing.value;
                    }
                

                        obj.comments = obj.comments ? obj.comments.map(x => {
                            x = x ? psFocusedTreeComment(x) : null;
                            return x;
                        }) : null;
                    

                        obj.relations = obj.relations ? obj.relations.map(x => {
                            x = x ? psContentRelation(x) : null;
                            return x;
                        }) : null;
                    return obj;}exports.fromJsonToIntactContentPage = x => psIntactContentPage(_.cloneDeep(x));

function jsRelatedContentCommit(obj){obj.commitId = obj.commitId ? jsContentCommitId(obj.commitId) : null;

obj.committerUser = obj.committerUser ? jsRelatedUser(obj.committerUser) : null;
obj.contentId = obj.contentId ? jsContentId(obj.contentId) : null;return obj;}exports.fromRelatedContentCommitToJson = x => jsRelatedContentCommit(_.cloneDeep(x));

function psRelatedContentCommit(obj){obj.commitId = obj.commitId ? psContentCommitId(obj.commitId) : null;

obj.committerUser = obj.committerUser ? psRelatedUser(obj.committerUser) : null;
obj.contentId = obj.contentId ? psContentId(obj.contentId) : null;return obj;}exports.fromJsonToRelatedContentCommit = x => psRelatedContentCommit(_.cloneDeep(x));

function jsFocusedContentCommit(obj){obj.commitId = obj.commitId ? jsContentCommitId(obj.commitId) : null;

obj.committerUser = obj.committerUser ? jsRelatedUser(obj.committerUser) : null;
obj.contentId = obj.contentId ? jsContentId(obj.contentId) : null;return obj;}exports.fromFocusedContentCommitToJson = x => jsFocusedContentCommit(_.cloneDeep(x));

function psFocusedContentCommit(obj){obj.commitId = obj.commitId ? psContentCommitId(obj.commitId) : null;

obj.committerUser = obj.committerUser ? psRelatedUser(obj.committerUser) : null;
obj.contentId = obj.contentId ? psContentId(obj.contentId) : null;return obj;}exports.fromJsonToFocusedContentCommit = x => psFocusedContentCommit(_.cloneDeep(x));

function jsRelatedContentDraft(obj){obj.draftId = obj.draftId ? jsContentDraftId(obj.draftId) : null;




                        if (obj.contentId instanceof Data_Maybe.Just) {
                            obj.contentId = obj.contentId.value0;
                            obj.contentId = obj.contentId ? jsContentId(obj.contentId) : null;
                        } else {
                            obj.contentId = null;
                        }
                    
obj.format = obj.format ? jsFocusedFormat(obj.format) : null;return obj;}exports.fromRelatedContentDraftToJson = x => jsRelatedContentDraft(_.cloneDeep(x));

function psRelatedContentDraft(obj){obj.draftId = obj.draftId ? psContentDraftId(obj.draftId) : null;




                    if (obj.contentId) {
                        obj.contentId = obj.contentId ? psContentId(obj.contentId) : null;
                        obj.contentId = new Data_Maybe.Just(obj.contentId);
                    } else {
                        obj.contentId = Data_Maybe.Nothing.value;
                    }
                
obj.format = obj.format ? psFocusedFormat(obj.format) : null;return obj;}exports.fromJsonToRelatedContentDraft = x => psRelatedContentDraft(_.cloneDeep(x));

function jsFocusedContentDraft(obj){obj.draftId = obj.draftId ? jsContentDraftId(obj.draftId) : null;




                        if (obj.contentId instanceof Data_Maybe.Just) {
                            obj.contentId = obj.contentId.value0;
                            obj.contentId = obj.contentId ? jsContentId(obj.contentId) : null;
                        } else {
                            obj.contentId = null;
                        }
                    
obj.format = obj.format ? jsFocusedFormat(obj.format) : null;return obj;}exports.fromFocusedContentDraftToJson = x => jsFocusedContentDraft(_.cloneDeep(x));

function psFocusedContentDraft(obj){obj.draftId = obj.draftId ? psContentDraftId(obj.draftId) : null;




                    if (obj.contentId) {
                        obj.contentId = obj.contentId ? psContentId(obj.contentId) : null;
                        obj.contentId = new Data_Maybe.Just(obj.contentId);
                    } else {
                        obj.contentId = Data_Maybe.Nothing.value;
                    }
                
obj.format = obj.format ? psFocusedFormat(obj.format) : null;return obj;}exports.fromJsonToFocusedContentDraft = x => psFocusedContentDraft(_.cloneDeep(x));

function jsRelatedFormat(obj){obj.formatId = obj.formatId ? jsFormatId(obj.formatId) : null;
obj.displayId = obj.displayId ? jsFormatDisplayId(obj.displayId) : null;



                        if (obj.icon instanceof Data_Maybe.Just) {
                            obj.icon = obj.icon.value0;
                            
                        } else {
                            obj.icon = null;
                        }
                    
obj.space = obj.space ? jsRelatedSpace(obj.space) : null;
obj.usage = obj.usage ? jsFormatUsage(obj.usage) : null;

                        if (obj.semanticId instanceof Data_Maybe.Just) {
                            obj.semanticId = obj.semanticId.value0;
                            
                        } else {
                            obj.semanticId = null;
                        }
                    
obj.currentStructureId = obj.currentStructureId ? jsStructureId(obj.currentStructureId) : null;return obj;}exports.fromRelatedFormatToJson = x => jsRelatedFormat(_.cloneDeep(x));

function psRelatedFormat(obj){obj.formatId = obj.formatId ? psFormatId(obj.formatId) : null;
obj.displayId = obj.displayId ? psFormatDisplayId(obj.displayId) : null;



                    if (obj.icon) {
                        
                        obj.icon = new Data_Maybe.Just(obj.icon);
                    } else {
                        obj.icon = Data_Maybe.Nothing.value;
                    }
                
obj.space = obj.space ? psRelatedSpace(obj.space) : null;
obj.usage = obj.usage ? psFormatUsage(obj.usage) : null;

                    if (obj.semanticId) {
                        
                        obj.semanticId = new Data_Maybe.Just(obj.semanticId);
                    } else {
                        obj.semanticId = Data_Maybe.Nothing.value;
                    }
                
obj.currentStructureId = obj.currentStructureId ? psStructureId(obj.currentStructureId) : null;return obj;}exports.fromJsonToRelatedFormat = x => psRelatedFormat(_.cloneDeep(x));

function jsRelation(obj){obj.property = obj.property ? jsPropertyInfo(obj.property) : null;

obj.formatId = obj.formatId ? jsFormatId(obj.formatId) : null;return obj;}exports.fromRelationToJson = x => jsRelation(_.cloneDeep(x));

function psRelation(obj){obj.property = obj.property ? psPropertyInfo(obj.property) : null;

obj.formatId = obj.formatId ? psFormatId(obj.formatId) : null;return obj;}exports.fromJsonToRelation = x => psRelation(_.cloneDeep(x));

function jsFocusedFormat(obj){obj.formatId = obj.formatId ? jsFormatId(obj.formatId) : null;
obj.displayId = obj.displayId ? jsFormatDisplayId(obj.displayId) : null;



                        if (obj.icon instanceof Data_Maybe.Just) {
                            obj.icon = obj.icon.value0;
                            
                        } else {
                            obj.icon = null;
                        }
                    
obj.space = obj.space ? jsRelatedSpace(obj.space) : null;
obj.usage = obj.usage ? jsFormatUsage(obj.usage) : null;

obj.creatorUser = obj.creatorUser ? jsRelatedUser(obj.creatorUser) : null;

obj.updaterUser = obj.updaterUser ? jsRelatedUser(obj.updaterUser) : null;
obj.currentStructure = obj.currentStructure ? jsFocusedStructure(obj.currentStructure) : null;

                        if (obj.semanticId instanceof Data_Maybe.Just) {
                            obj.semanticId = obj.semanticId.value0;
                            
                        } else {
                            obj.semanticId = null;
                        }
                    return obj;}exports.fromFocusedFormatToJson = x => jsFocusedFormat(_.cloneDeep(x));

function psFocusedFormat(obj){obj.formatId = obj.formatId ? psFormatId(obj.formatId) : null;
obj.displayId = obj.displayId ? psFormatDisplayId(obj.displayId) : null;



                    if (obj.icon) {
                        
                        obj.icon = new Data_Maybe.Just(obj.icon);
                    } else {
                        obj.icon = Data_Maybe.Nothing.value;
                    }
                
obj.space = obj.space ? psRelatedSpace(obj.space) : null;
obj.usage = obj.usage ? psFormatUsage(obj.usage) : null;

obj.creatorUser = obj.creatorUser ? psRelatedUser(obj.creatorUser) : null;

obj.updaterUser = obj.updaterUser ? psRelatedUser(obj.updaterUser) : null;
obj.currentStructure = obj.currentStructure ? psFocusedStructure(obj.currentStructure) : null;

                    if (obj.semanticId) {
                        
                        obj.semanticId = new Data_Maybe.Just(obj.semanticId);
                    } else {
                        obj.semanticId = Data_Maybe.Nothing.value;
                    }
                return obj;}exports.fromJsonToFocusedFormat = x => psFocusedFormat(_.cloneDeep(x));

function jsIntactMetaProperty(obj){obj.id = obj.id ? jsMetaPropertyId(obj.id) : null;
obj.type = obj.type ? jsMetaPropertyType(obj.type) : null;return obj;}exports.fromIntactMetaPropertyToJson = x => jsIntactMetaProperty(_.cloneDeep(x));

function psIntactMetaProperty(obj){obj.id = obj.id ? psMetaPropertyId(obj.id) : null;
obj.type = obj.type ? psMetaPropertyType(obj.type) : null;return obj;}exports.fromJsonToIntactMetaProperty = x => psIntactMetaProperty(_.cloneDeep(x));

function jsPropertyInfo(obj){

                        if (obj.fieldName instanceof Data_Maybe.Just) {
                            obj.fieldName = obj.fieldName.value0;
                            
                        } else {
                            obj.fieldName = null;
                        }
                    
obj.id = obj.id ? jsPropertyId(obj.id) : null;


                        if (obj.semantic instanceof Data_Maybe.Just) {
                            obj.semantic = obj.semantic.value0;
                            
                        } else {
                            obj.semantic = null;
                        }
                    

                        if (obj.icon instanceof Data_Maybe.Just) {
                            obj.icon = obj.icon.value0;
                            
                        } else {
                            obj.icon = null;
                        }
                    
obj.type = obj.type ? jsType(obj.type) : null;

                            obj.metaProperties = obj.metaProperties ? obj.metaProperties.map(x => {
                                x = x ? jsIntactMetaProperty(x) : null;
                                return x;
                            }) : null;
                        return obj;}exports.fromPropertyInfoToJson = x => jsPropertyInfo(_.cloneDeep(x));

function psPropertyInfo(obj){

                    if (obj.fieldName) {
                        
                        obj.fieldName = new Data_Maybe.Just(obj.fieldName);
                    } else {
                        obj.fieldName = Data_Maybe.Nothing.value;
                    }
                
obj.id = obj.id ? psPropertyId(obj.id) : null;


                    if (obj.semantic) {
                        
                        obj.semantic = new Data_Maybe.Just(obj.semantic);
                    } else {
                        obj.semantic = Data_Maybe.Nothing.value;
                    }
                

                    if (obj.icon) {
                        
                        obj.icon = new Data_Maybe.Just(obj.icon);
                    } else {
                        obj.icon = Data_Maybe.Nothing.value;
                    }
                
obj.type = obj.type ? psType(obj.type) : null;

                        obj.metaProperties = obj.metaProperties ? obj.metaProperties.map(x => {
                            x = x ? psIntactMetaProperty(x) : null;
                            return x;
                        }) : null;
                    return obj;}exports.fromJsonToPropertyInfo = x => psPropertyInfo(_.cloneDeep(x));

function jsEnumerator(obj){


                        if (obj.fieldName instanceof Data_Maybe.Just) {
                            obj.fieldName = obj.fieldName.value0;
                            
                        } else {
                            obj.fieldName = null;
                        }
                    return obj;}exports.fromEnumeratorToJson = x => jsEnumerator(_.cloneDeep(x));

function psEnumerator(obj){


                    if (obj.fieldName) {
                        
                        obj.fieldName = new Data_Maybe.Just(obj.fieldName);
                    } else {
                        obj.fieldName = Data_Maybe.Nothing.value;
                    }
                return obj;}exports.fromJsonToEnumerator = x => psEnumerator(_.cloneDeep(x));

function jsType(obj) {
                if(E.IntType && obj instanceof E.IntType) {
                    
                    return {
                        name: "integer",
                        
                    };
                }
            
                if(E.BoolType && obj instanceof E.BoolType) {
                    
                    return {
                        name: "boolean",
                        
                    };
                }
            
                if(E.StringType && obj instanceof E.StringType) {
                    
                    return {
                        name: "string",
                        
                    };
                }
            
                if(E.ContentType && obj instanceof E.ContentType) {
                    obj.value0 = obj.value0 ? jsFocusedFormat(obj.value0) : null;
                    return {
                        name: "content",
                        format: obj.value0
                    };
                }
            
                if(E.UrlType && obj instanceof E.UrlType) {
                    
                    return {
                        name: "url",
                        
                    };
                }
            
                if(E.ObjectType && obj instanceof E.ObjectType) {
                    
                            obj.value0 = obj.value0 ? obj.value0.map(x => {
                                x = x ? jsPropertyInfo(x) : null;
                                return x;
                            }) : null;
                        
                    return {
                        name: "object",
                        properties: obj.value0
                    };
                }
            
                if(E.TextType && obj instanceof E.TextType) {
                    
                    return {
                        name: "text",
                        
                    };
                }
            
                if(E.ArrayType && obj instanceof E.ArrayType) {
                    obj.value0 = obj.value0 ? jsType(obj.value0) : null;
                    return {
                        name: "array",
                        subType: obj.value0
                    };
                }
            
                if(E.EnumType && obj instanceof E.EnumType) {
                    
                            obj.value0 = obj.value0 ? obj.value0.map(x => {
                                x = x ? jsEnumerator(x) : null;
                                return x;
                            }) : null;
                        
                    return {
                        name: "enumerator",
                        enumerators: obj.value0
                    };
                }
            
                if(E.DocumentType && obj instanceof E.DocumentType) {
                    
                    return {
                        name: "document",
                        
                    };
                }
            
                if(E.ImageType && obj instanceof E.ImageType) {
                    
                    return {
                        name: "image",
                        
                    };
                }
            
                if(E.EntityType && obj instanceof E.EntityType) {
                    obj.value0 = obj.value0 ? jsFocusedFormat(obj.value0) : null;
                    return {
                        name: "entity",
                        format: obj.value0
                    };
                }
            }

function psType(obj) {switch(obj.name){case "integer":
return new E.IntType();
case "boolean":
return new E.BoolType();
case "string":
return new E.StringType();
case "content":
obj.format = obj.format ? psFocusedFormat(obj.format) : null;return new E.ContentType(obj.format);
case "url":
return new E.UrlType();
case "object":

                        obj.properties = obj.properties ? obj.properties.map(x => {
                            x = x ? psPropertyInfo(x) : null;
                            return x;
                        }) : null;
                    return new E.ObjectType(obj.properties);
case "text":
return new E.TextType();
case "array":
obj.subType = obj.subType ? psType(obj.subType) : null;return new E.ArrayType(obj.subType);
case "enumerator":

                        obj.enumerators = obj.enumerators ? obj.enumerators.map(x => {
                            x = x ? psEnumerator(x) : null;
                            return x;
                        }) : null;
                    return new E.EnumType(obj.enumerators);
case "document":
return new E.DocumentType();
case "image":
return new E.ImageType();
case "entity":
obj.format = obj.format ? psFocusedFormat(obj.format) : null;return new E.EntityType(obj.format);
}}

function jsRelatedStructure(obj){obj.formatId = obj.formatId ? jsFormatId(obj.formatId) : null;
obj.structureId = obj.structureId ? jsStructureId(obj.structureId) : null;


                        if (obj.title instanceof Data_Maybe.Just) {
                            obj.title = obj.title.value0;
                            
                        } else {
                            obj.title = null;
                        }
                    
return obj;}exports.fromRelatedStructureToJson = x => jsRelatedStructure(_.cloneDeep(x));

function psRelatedStructure(obj){obj.formatId = obj.formatId ? psFormatId(obj.formatId) : null;
obj.structureId = obj.structureId ? psStructureId(obj.structureId) : null;


                    if (obj.title) {
                        
                        obj.title = new Data_Maybe.Just(obj.title);
                    } else {
                        obj.title = Data_Maybe.Nothing.value;
                    }
                
return obj;}exports.fromJsonToRelatedStructure = x => psRelatedStructure(_.cloneDeep(x));

function jsFocusedStructure(obj){obj.structureId = obj.structureId ? jsStructureId(obj.structureId) : null;


                        if (obj.title instanceof Data_Maybe.Just) {
                            obj.title = obj.title.value0;
                            
                        } else {
                            obj.title = null;
                        }
                    

                            obj.properties = obj.properties ? obj.properties.map(x => {
                                x = x ? jsPropertyInfo(x) : null;
                                return x;
                            }) : null;
                        
return obj;}exports.fromFocusedStructureToJson = x => jsFocusedStructure(_.cloneDeep(x));

function psFocusedStructure(obj){obj.structureId = obj.structureId ? psStructureId(obj.structureId) : null;


                    if (obj.title) {
                        
                        obj.title = new Data_Maybe.Just(obj.title);
                    } else {
                        obj.title = Data_Maybe.Nothing.value;
                    }
                

                        obj.properties = obj.properties ? obj.properties.map(x => {
                            x = x ? psPropertyInfo(x) : null;
                            return x;
                        }) : null;
                    
return obj;}exports.fromJsonToFocusedStructure = x => psFocusedStructure(_.cloneDeep(x));

const jsDocumentBlockId = x => x;


const psDocumentBlockId = x => x;


function jsBlockType(obj) {
                if(E.Paragraph && obj instanceof E.Paragraph) {
                    return "paragraph";
                }
            
                if(E.Header && obj instanceof E.Header) {
                    return "header";
                }
            }

function psBlockType(str) {switch(str){
case "paragraph":
return (E.Paragraph || { value: null }).value;
case "header":
return (E.Header || { value: null }).value;
}}

function jsDocumentBlock(obj){obj.id = obj.id ? jsDocumentBlockId(obj.id) : null;
obj.data = obj.data ? jsBlockData(obj.data) : null;return obj;}exports.fromDocumentBlockToJson = x => jsDocumentBlock(_.cloneDeep(x));

function psDocumentBlock(obj){obj.id = obj.id ? psDocumentBlockId(obj.id) : null;
obj.data = obj.data ? psBlockData(obj.data) : null;return obj;}exports.fromJsonToDocumentBlock = x => psDocumentBlock(_.cloneDeep(x));

function jsBlockData(obj) {
                if(E.ParagraphBlockData && obj instanceof E.ParagraphBlockData) {
                    
                    return {
                        type: "paragraph",
                        text: obj.value0
                    };
                }
            
                if(E.HeaderBlockData && obj instanceof E.HeaderBlockData) {
                    ;
                    return {
                        type: "header",
                        level: obj.value0,text: obj.value1
                    };
                }
            }

function psBlockData(obj) {switch(obj.type){case "paragraph":
return new E.ParagraphBlockData(obj.text);
case "header":
;return new E.HeaderBlockData(obj.level,obj.text);
}}

function jsDocument(obj){
                            obj.blocks = obj.blocks ? obj.blocks.map(x => {
                                x = x ? jsDocumentBlock(x) : null;
                                return x;
                            }) : null;
                        return obj;}exports.fromDocumentToJson = x => jsDocument(_.cloneDeep(x));

function psDocument(obj){
                        obj.blocks = obj.blocks ? obj.blocks.map(x => {
                            x = x ? psDocumentBlock(x) : null;
                            return x;
                        }) : null;
                    return obj;}exports.fromJsonToDocument = x => psDocument(_.cloneDeep(x));

function jsRelatedMaterial(obj){obj.materialId = obj.materialId ? jsMaterialId(obj.materialId) : null;

                        if (obj.contentId instanceof Data_Maybe.Just) {
                            obj.contentId = obj.contentId.value0;
                            obj.contentId = obj.contentId ? jsContentId(obj.contentId) : null;
                        } else {
                            obj.contentId = null;
                        }
                    

obj.materialType = obj.materialType ? jsMaterialType(obj.materialType) : null;

obj.creatorUser = obj.creatorUser ? jsRelatedUser(obj.creatorUser) : null;

obj.updaterUser = obj.updaterUser ? jsRelatedUser(obj.updaterUser) : null;return obj;}exports.fromRelatedMaterialToJson = x => jsRelatedMaterial(_.cloneDeep(x));

function psRelatedMaterial(obj){obj.materialId = obj.materialId ? psMaterialId(obj.materialId) : null;

                    if (obj.contentId) {
                        obj.contentId = obj.contentId ? psContentId(obj.contentId) : null;
                        obj.contentId = new Data_Maybe.Just(obj.contentId);
                    } else {
                        obj.contentId = Data_Maybe.Nothing.value;
                    }
                

obj.materialType = obj.materialType ? psMaterialType(obj.materialType) : null;

obj.creatorUser = obj.creatorUser ? psRelatedUser(obj.creatorUser) : null;

obj.updaterUser = obj.updaterUser ? psRelatedUser(obj.updaterUser) : null;return obj;}exports.fromJsonToRelatedMaterial = x => psRelatedMaterial(_.cloneDeep(x));

function jsMaterialData(obj) {
                if(E.PlaintextMaterialData && obj instanceof E.PlaintextMaterialData) {
                    
                    return {
                        type: "plaintext",
                        text: obj.value0
                    };
                }
            
                if(E.DocumentMaterialData && obj instanceof E.DocumentMaterialData) {
                    obj.value0 = obj.value0 ? jsDocument(obj.value0) : null;
                    return {
                        type: "document",
                        document: obj.value0
                    };
                }
            }

function psMaterialData(obj) {switch(obj.type){case "plaintext":
return new E.PlaintextMaterialData(obj.text);
case "document":
obj.document = obj.document ? psDocument(obj.document) : null;return new E.DocumentMaterialData(obj.document);
}}

function jsFocusedMaterial(obj){obj.materialId = obj.materialId ? jsMaterialId(obj.materialId) : null;

                        if (obj.contentId instanceof Data_Maybe.Just) {
                            obj.contentId = obj.contentId.value0;
                            obj.contentId = obj.contentId ? jsContentId(obj.contentId) : null;
                        } else {
                            obj.contentId = null;
                        }
                    

obj.materialType = obj.materialType ? jsMaterialType(obj.materialType) : null;

obj.creatorUser = obj.creatorUser ? jsRelatedUser(obj.creatorUser) : null;

obj.updaterUser = obj.updaterUser ? jsRelatedUser(obj.updaterUser) : null;
obj.data = obj.data ? jsMaterialData(obj.data) : null;

                        if (obj.draft instanceof Data_Maybe.Just) {
                            obj.draft = obj.draft.value0;
                            obj.draft = obj.draft ? jsRelatedMaterialDraft(obj.draft) : null;
                        } else {
                            obj.draft = null;
                        }
                    return obj;}exports.fromFocusedMaterialToJson = x => jsFocusedMaterial(_.cloneDeep(x));

function psFocusedMaterial(obj){obj.materialId = obj.materialId ? psMaterialId(obj.materialId) : null;

                    if (obj.contentId) {
                        obj.contentId = obj.contentId ? psContentId(obj.contentId) : null;
                        obj.contentId = new Data_Maybe.Just(obj.contentId);
                    } else {
                        obj.contentId = Data_Maybe.Nothing.value;
                    }
                

obj.materialType = obj.materialType ? psMaterialType(obj.materialType) : null;

obj.creatorUser = obj.creatorUser ? psRelatedUser(obj.creatorUser) : null;

obj.updaterUser = obj.updaterUser ? psRelatedUser(obj.updaterUser) : null;
obj.data = obj.data ? psMaterialData(obj.data) : null;

                    if (obj.draft) {
                        obj.draft = obj.draft ? psRelatedMaterialDraft(obj.draft) : null;
                        obj.draft = new Data_Maybe.Just(obj.draft);
                    } else {
                        obj.draft = Data_Maybe.Nothing.value;
                    }
                return obj;}exports.fromJsonToFocusedMaterial = x => psFocusedMaterial(_.cloneDeep(x));

function jsRelatedMaterialCommit(obj){obj.commitId = obj.commitId ? jsMaterialCommitId(obj.commitId) : null;



                        if (obj.basedCommitId instanceof Data_Maybe.Just) {
                            obj.basedCommitId = obj.basedCommitId.value0;
                            obj.basedCommitId = obj.basedCommitId ? jsMaterialCommitId(obj.basedCommitId) : null;
                        } else {
                            obj.basedCommitId = null;
                        }
                    
obj.committerUser = obj.committerUser ? jsRelatedUser(obj.committerUser) : null;return obj;}exports.fromRelatedMaterialCommitToJson = x => jsRelatedMaterialCommit(_.cloneDeep(x));

function psRelatedMaterialCommit(obj){obj.commitId = obj.commitId ? psMaterialCommitId(obj.commitId) : null;



                    if (obj.basedCommitId) {
                        obj.basedCommitId = obj.basedCommitId ? psMaterialCommitId(obj.basedCommitId) : null;
                        obj.basedCommitId = new Data_Maybe.Just(obj.basedCommitId);
                    } else {
                        obj.basedCommitId = Data_Maybe.Nothing.value;
                    }
                
obj.committerUser = obj.committerUser ? psRelatedUser(obj.committerUser) : null;return obj;}exports.fromJsonToRelatedMaterialCommit = x => psRelatedMaterialCommit(_.cloneDeep(x));

function jsFocusedMaterialCommit(obj){obj.commitId = obj.commitId ? jsMaterialCommitId(obj.commitId) : null;


return obj;}exports.fromFocusedMaterialCommitToJson = x => jsFocusedMaterialCommit(_.cloneDeep(x));

function psFocusedMaterialCommit(obj){obj.commitId = obj.commitId ? psMaterialCommitId(obj.commitId) : null;


return obj;}exports.fromJsonToFocusedMaterialCommit = x => psFocusedMaterialCommit(_.cloneDeep(x));

function jsRelatedMaterialDraft(obj){obj.draftId = obj.draftId ? jsMaterialDraftId(obj.draftId) : null;



return obj;}exports.fromRelatedMaterialDraftToJson = x => jsRelatedMaterialDraft(_.cloneDeep(x));

function psRelatedMaterialDraft(obj){obj.draftId = obj.draftId ? psMaterialDraftId(obj.draftId) : null;



return obj;}exports.fromJsonToRelatedMaterialDraft = x => psRelatedMaterialDraft(_.cloneDeep(x));

function jsFocusedMaterialDraft(obj){obj.draftId = obj.draftId ? jsMaterialDraftId(obj.draftId) : null;




                        if (obj.material instanceof Data_Maybe.Just) {
                            obj.material = obj.material.value0;
                            obj.material = obj.material ? jsRelatedMaterial(obj.material) : null;
                        } else {
                            obj.material = null;
                        }
                    

                        if (obj.basedCommitId instanceof Data_Maybe.Just) {
                            obj.basedCommitId = obj.basedCommitId.value0;
                            obj.basedCommitId = obj.basedCommitId ? jsMaterialCommitId(obj.basedCommitId) : null;
                        } else {
                            obj.basedCommitId = null;
                        }
                    
obj.data = obj.data ? jsMaterialData(obj.data) : null;
return obj;}exports.fromFocusedMaterialDraftToJson = x => jsFocusedMaterialDraft(_.cloneDeep(x));

function psFocusedMaterialDraft(obj){obj.draftId = obj.draftId ? psMaterialDraftId(obj.draftId) : null;




                    if (obj.material) {
                        obj.material = obj.material ? psRelatedMaterial(obj.material) : null;
                        obj.material = new Data_Maybe.Just(obj.material);
                    } else {
                        obj.material = Data_Maybe.Nothing.value;
                    }
                

                    if (obj.basedCommitId) {
                        obj.basedCommitId = obj.basedCommitId ? psMaterialCommitId(obj.basedCommitId) : null;
                        obj.basedCommitId = new Data_Maybe.Just(obj.basedCommitId);
                    } else {
                        obj.basedCommitId = Data_Maybe.Nothing.value;
                    }
                
obj.data = obj.data ? psMaterialData(obj.data) : null;
return obj;}exports.fromJsonToFocusedMaterialDraft = x => psFocusedMaterialDraft(_.cloneDeep(x));

function jsMaterialDraftUpdation(obj){obj.draftId = obj.draftId ? jsMaterialDraftId(obj.draftId) : null;
obj.data = obj.data ? jsMaterialData(obj.data) : null;return obj;}exports.fromMaterialDraftUpdationToJson = x => jsMaterialDraftUpdation(_.cloneDeep(x));

function psMaterialDraftUpdation(obj){obj.draftId = obj.draftId ? psMaterialDraftId(obj.draftId) : null;
obj.data = obj.data ? psMaterialData(obj.data) : null;return obj;}exports.fromJsonToMaterialDraftUpdation = x => psMaterialDraftUpdation(_.cloneDeep(x));

function jsIntactMaterialEditing(obj){obj.materialEditingId = obj.materialEditingId ? jsMaterialEditingId(obj.materialEditingId) : null;

return obj;}exports.fromIntactMaterialEditingToJson = x => jsIntactMaterialEditing(_.cloneDeep(x));

function psIntactMaterialEditing(obj){obj.materialEditingId = obj.materialEditingId ? psMaterialEditingId(obj.materialEditingId) : null;

return obj;}exports.fromJsonToIntactMaterialEditing = x => psIntactMaterialEditing(_.cloneDeep(x));

function jsRelatedMaterialSnapshot(obj){

return obj;}exports.fromRelatedMaterialSnapshotToJson = x => jsRelatedMaterialSnapshot(_.cloneDeep(x));

function psRelatedMaterialSnapshot(obj){

return obj;}exports.fromJsonToRelatedMaterialSnapshot = x => psRelatedMaterialSnapshot(_.cloneDeep(x));

function jsFocusedMaterialSnapshot(obj){obj.data = obj.data ? jsMaterialData(obj.data) : null;


return obj;}exports.fromFocusedMaterialSnapshotToJson = x => jsFocusedMaterialSnapshot(_.cloneDeep(x));

function psFocusedMaterialSnapshot(obj){obj.data = obj.data ? psMaterialData(obj.data) : null;


return obj;}exports.fromJsonToFocusedMaterialSnapshot = x => psFocusedMaterialSnapshot(_.cloneDeep(x));

function jsActivityAction(obj) {
                if(E.ContentCreatedActivityAction && obj instanceof E.ContentCreatedActivityAction) {
                    obj.value0 = obj.value0 ? jsRelatedContent(obj.value0) : null;
                    return {
                        type: "content_created",
                        content: obj.value0
                    };
                }
            
                if(E.ContentUpdatedActivityAction && obj instanceof E.ContentUpdatedActivityAction) {
                    obj.value0 = obj.value0 ? jsRelatedContent(obj.value0) : null;
                    return {
                        type: "content_updated",
                        content: obj.value0
                    };
                }
            
                if(E.ContentCommentedActivityAction && obj instanceof E.ContentCommentedActivityAction) {
                    obj.value0 = obj.value0 ? jsRelatedContent(obj.value0) : null;;obj.value1 = obj.value1 ? jsRelatedComment(obj.value1) : null;
                    return {
                        type: "content_commented",
                        content: obj.value0,comment: obj.value1
                    };
                }
            }

function psActivityAction(obj) {switch(obj.type){case "content_created":
obj.content = obj.content ? psRelatedContent(obj.content) : null;return new E.ContentCreatedActivityAction(obj.content);
case "content_updated":
obj.content = obj.content ? psRelatedContent(obj.content) : null;return new E.ContentUpdatedActivityAction(obj.content);
case "content_commented":
obj.content = obj.content ? psRelatedContent(obj.content) : null;;obj.comment = obj.comment ? psRelatedComment(obj.comment) : null;return new E.ContentCommentedActivityAction(obj.content,obj.comment);
}}

function jsIntactActivityBySpace(obj){obj.activityId = obj.activityId ? jsActivityId(obj.activityId) : null;
obj.action = obj.action ? jsActivityAction(obj.action) : null;
obj.actorUser = obj.actorUser ? jsRelatedUser(obj.actorUser) : null;
return obj;}exports.fromIntactActivityBySpaceToJson = x => jsIntactActivityBySpace(_.cloneDeep(x));

function psIntactActivityBySpace(obj){obj.activityId = obj.activityId ? psActivityId(obj.activityId) : null;
obj.action = obj.action ? psActivityAction(obj.action) : null;
obj.actorUser = obj.actorUser ? psRelatedUser(obj.actorUser) : null;
return obj;}exports.fromJsonToIntactActivityBySpace = x => psIntactActivityBySpace(_.cloneDeep(x));

function jsIntactActivityByUser(obj){obj.activityId = obj.activityId ? jsActivityId(obj.activityId) : null;
obj.action = obj.action ? jsActivityAction(obj.action) : null;
obj.space = obj.space ? jsRelatedSpace(obj.space) : null;
return obj;}exports.fromIntactActivityByUserToJson = x => jsIntactActivityByUser(_.cloneDeep(x));

function psIntactActivityByUser(obj){obj.activityId = obj.activityId ? psActivityId(obj.activityId) : null;
obj.action = obj.action ? psActivityAction(obj.action) : null;
obj.space = obj.space ? psRelatedSpace(obj.space) : null;
return obj;}exports.fromJsonToIntactActivityByUser = x => psIntactActivityByUser(_.cloneDeep(x));

function jsRelatedComment(obj){obj.commentId = obj.commentId ? jsCommentId(obj.commentId) : null;
obj.user = obj.user ? jsRelatedUser(obj.user) : null;


return obj;}exports.fromRelatedCommentToJson = x => jsRelatedComment(_.cloneDeep(x));

function psRelatedComment(obj){obj.commentId = obj.commentId ? psCommentId(obj.commentId) : null;
obj.user = obj.user ? psRelatedUser(obj.user) : null;


return obj;}exports.fromJsonToRelatedComment = x => psRelatedComment(_.cloneDeep(x));

function jsFocusedComment(obj){obj.commentId = obj.commentId ? jsCommentId(obj.commentId) : null;
obj.user = obj.user ? jsRelatedUser(obj.user) : null;



return obj;}exports.fromFocusedCommentToJson = x => jsFocusedComment(_.cloneDeep(x));

function psFocusedComment(obj){obj.commentId = obj.commentId ? psCommentId(obj.commentId) : null;
obj.user = obj.user ? psRelatedUser(obj.user) : null;



return obj;}exports.fromJsonToFocusedComment = x => psFocusedComment(_.cloneDeep(x));

function jsFocusedTreeComment(obj){obj.commentId = obj.commentId ? jsCommentId(obj.commentId) : null;
obj.user = obj.user ? jsRelatedUser(obj.user) : null;





                            obj.replies = obj.replies ? obj.replies.map(x => {
                                x = x ? jsFocusedComment(x) : null;
                                return x;
                            }) : null;
                        return obj;}exports.fromFocusedTreeCommentToJson = x => jsFocusedTreeComment(_.cloneDeep(x));

function psFocusedTreeComment(obj){obj.commentId = obj.commentId ? psCommentId(obj.commentId) : null;
obj.user = obj.user ? psRelatedUser(obj.user) : null;





                        obj.replies = obj.replies ? obj.replies.map(x => {
                            x = x ? psFocusedComment(x) : null;
                            return x;
                        }) : null;
                    return obj;}exports.fromJsonToFocusedTreeComment = x => psFocusedTreeComment(_.cloneDeep(x));

function jsNotificationAction(obj) {
                if(E.ContentCommentedNotificationAction && obj instanceof E.ContentCommentedNotificationAction) {
                    obj.value0 = obj.value0 ? jsRelatedContent(obj.value0) : null;;obj.value1 = obj.value1 ? jsRelatedComment(obj.value1) : null;
                    return {
                        type: "content_commented",
                        content: obj.value0,comment: obj.value1
                    };
                }
            
                if(E.CommentRepliedNotificationAction && obj instanceof E.CommentRepliedNotificationAction) {
                    obj.value0 = obj.value0 ? jsRelatedContent(obj.value0) : null;;obj.value1 = obj.value1 ? jsRelatedComment(obj.value1) : null;
                    return {
                        type: "comment_replied",
                        content: obj.value0,comment: obj.value1
                    };
                }
            }

function psNotificationAction(obj) {switch(obj.type){case "content_commented":
obj.content = obj.content ? psRelatedContent(obj.content) : null;;obj.comment = obj.comment ? psRelatedComment(obj.comment) : null;return new E.ContentCommentedNotificationAction(obj.content,obj.comment);
case "comment_replied":
obj.content = obj.content ? psRelatedContent(obj.content) : null;;obj.comment = obj.comment ? psRelatedComment(obj.comment) : null;return new E.CommentRepliedNotificationAction(obj.content,obj.comment);
}}

function jsIntactNotification(obj){obj.notificationId = obj.notificationId ? jsNotificationId(obj.notificationId) : null;
obj.action = obj.action ? jsNotificationAction(obj.action) : null;
obj.notifiedFromUser = obj.notifiedFromUser ? jsRelatedUser(obj.notifiedFromUser) : null;

return obj;}exports.fromIntactNotificationToJson = x => jsIntactNotification(_.cloneDeep(x));

function psIntactNotification(obj){obj.notificationId = obj.notificationId ? psNotificationId(obj.notificationId) : null;
obj.action = obj.action ? psNotificationAction(obj.action) : null;
obj.notifiedFromUser = obj.notifiedFromUser ? psRelatedUser(obj.notifiedFromUser) : null;

return obj;}exports.fromJsonToIntactNotification = x => psIntactNotification(_.cloneDeep(x));

function jsIntactReactor(obj){obj.reactorId = obj.reactorId ? jsReactorId(obj.reactorId) : null;
obj.container = obj.container ? jsRelatedContainer(obj.container) : null;
obj.state = obj.state ? jsReactorState(obj.state) : null;

                        if (obj.definitionId instanceof Data_Maybe.Just) {
                            obj.definitionId = obj.definitionId.value0;
                            obj.definitionId = obj.definitionId ? jsContentId(obj.definitionId) : null;
                        } else {
                            obj.definitionId = null;
                        }
                    

obj.creatorUser = obj.creatorUser ? jsRelatedUser(obj.creatorUser) : null;return obj;}exports.fromIntactReactorToJson = x => jsIntactReactor(_.cloneDeep(x));

function psIntactReactor(obj){obj.reactorId = obj.reactorId ? psReactorId(obj.reactorId) : null;
obj.container = obj.container ? psRelatedContainer(obj.container) : null;
obj.state = obj.state ? psReactorState(obj.state) : null;

                    if (obj.definitionId) {
                        obj.definitionId = obj.definitionId ? psContentId(obj.definitionId) : null;
                        obj.definitionId = new Data_Maybe.Just(obj.definitionId);
                    } else {
                        obj.definitionId = Data_Maybe.Nothing.value;
                    }
                

obj.creatorUser = obj.creatorUser ? psRelatedUser(obj.creatorUser) : null;return obj;}exports.fromJsonToIntactReactor = x => psIntactReactor(_.cloneDeep(x));

function jsAdditionalSpaceInfo(obj){

return obj;}exports.fromAdditionalSpaceInfoToJson = x => jsAdditionalSpaceInfo(_.cloneDeep(x));

function psAdditionalSpaceInfo(obj){

return obj;}exports.fromJsonToAdditionalSpaceInfo = x => psAdditionalSpaceInfo(_.cloneDeep(x));

function jsRelatedSpace(obj){obj.spaceId = obj.spaceId ? jsSpaceId(obj.spaceId) : null;
obj.displayId = obj.displayId ? jsSpaceDisplayId(obj.displayId) : null;




                        if (obj.headerImage instanceof Data_Maybe.Just) {
                            obj.headerImage = obj.headerImage.value0;
                            
                        } else {
                            obj.headerImage = null;
                        }
                    

obj.membershipMethod = obj.membershipMethod ? jsMembershipMethod(obj.membershipMethod) : null;
obj.defaultAuthority = obj.defaultAuthority ? jsSpaceAuthority(obj.defaultAuthority) : null;return obj;}exports.fromRelatedSpaceToJson = x => jsRelatedSpace(_.cloneDeep(x));

function psRelatedSpace(obj){obj.spaceId = obj.spaceId ? psSpaceId(obj.spaceId) : null;
obj.displayId = obj.displayId ? psSpaceDisplayId(obj.displayId) : null;




                    if (obj.headerImage) {
                        
                        obj.headerImage = new Data_Maybe.Just(obj.headerImage);
                    } else {
                        obj.headerImage = Data_Maybe.Nothing.value;
                    }
                

obj.membershipMethod = obj.membershipMethod ? psMembershipMethod(obj.membershipMethod) : null;
obj.defaultAuthority = obj.defaultAuthority ? psSpaceAuthority(obj.defaultAuthority) : null;return obj;}exports.fromJsonToRelatedSpace = x => psRelatedSpace(_.cloneDeep(x));

function jsFocusedSpace(obj){obj.spaceId = obj.spaceId ? jsSpaceId(obj.spaceId) : null;
obj.displayId = obj.displayId ? jsSpaceDisplayId(obj.displayId) : null;


obj.creatorUser = obj.creatorUser ? jsRelatedUser(obj.creatorUser) : null;


                        if (obj.headerImage instanceof Data_Maybe.Just) {
                            obj.headerImage = obj.headerImage.value0;
                            
                        } else {
                            obj.headerImage = null;
                        }
                    

obj.membershipMethod = obj.membershipMethod ? jsMembershipMethod(obj.membershipMethod) : null;
obj.defaultAuthority = obj.defaultAuthority ? jsSpaceAuthority(obj.defaultAuthority) : null;





                            obj.containers = obj.containers ? obj.containers.map(x => {
                                x = x ? jsRelatedContainer(x) : null;
                                return x;
                            }) : null;
                        return obj;}exports.fromFocusedSpaceToJson = x => jsFocusedSpace(_.cloneDeep(x));

function psFocusedSpace(obj){obj.spaceId = obj.spaceId ? psSpaceId(obj.spaceId) : null;
obj.displayId = obj.displayId ? psSpaceDisplayId(obj.displayId) : null;


obj.creatorUser = obj.creatorUser ? psRelatedUser(obj.creatorUser) : null;


                    if (obj.headerImage) {
                        
                        obj.headerImage = new Data_Maybe.Just(obj.headerImage);
                    } else {
                        obj.headerImage = Data_Maybe.Nothing.value;
                    }
                

obj.membershipMethod = obj.membershipMethod ? psMembershipMethod(obj.membershipMethod) : null;
obj.defaultAuthority = obj.defaultAuthority ? psSpaceAuthority(obj.defaultAuthority) : null;





                        obj.containers = obj.containers ? obj.containers.map(x => {
                            x = x ? psRelatedContainer(x) : null;
                            return x;
                        }) : null;
                    return obj;}exports.fromJsonToFocusedSpace = x => psFocusedSpace(_.cloneDeep(x));

function jsIntactSpageHomePage(obj){
                            obj.activities = obj.activities ? obj.activities.map(x => {
                                x = x ? jsIntactActivityBySpace(x) : null;
                                return x;
                            }) : null;
                        

                            obj.topics = obj.topics ? obj.topics.map(x => {
                                x = x ? jsFocusedContent(x) : null;
                                return x;
                            }) : null;
                        

                            obj.members = obj.members ? obj.members.map(x => {
                                x = x ? jsIntactSpaceMember(x) : null;
                                return x;
                            }) : null;
                        return obj;}exports.fromIntactSpageHomePageToJson = x => jsIntactSpageHomePage(_.cloneDeep(x));

function psIntactSpageHomePage(obj){
                        obj.activities = obj.activities ? obj.activities.map(x => {
                            x = x ? psIntactActivityBySpace(x) : null;
                            return x;
                        }) : null;
                    

                        obj.topics = obj.topics ? obj.topics.map(x => {
                            x = x ? psFocusedContent(x) : null;
                            return x;
                        }) : null;
                    

                        obj.members = obj.members ? obj.members.map(x => {
                            x = x ? psIntactSpaceMember(x) : null;
                            return x;
                        }) : null;
                    return obj;}exports.fromJsonToIntactSpageHomePage = x => psIntactSpageHomePage(_.cloneDeep(x));

function jsIntactSpaceMember(obj){obj.user = obj.user ? jsRelatedUser(obj.user) : null;

obj.type = obj.type ? jsMemberType(obj.type) : null;return obj;}exports.fromIntactSpaceMemberToJson = x => jsIntactSpaceMember(_.cloneDeep(x));

function psIntactSpaceMember(obj){obj.user = obj.user ? psRelatedUser(obj.user) : null;

obj.type = obj.type ? psMemberType(obj.type) : null;return obj;}exports.fromJsonToIntactSpaceMember = x => psIntactSpaceMember(_.cloneDeep(x));

function jsIntactSpaceMembershipApplication(obj){obj.user = obj.user ? jsRelatedUser(obj.user) : null;
return obj;}exports.fromIntactSpaceMembershipApplicationToJson = x => jsIntactSpaceMembershipApplication(_.cloneDeep(x));

function psIntactSpaceMembershipApplication(obj){obj.user = obj.user ? psRelatedUser(obj.user) : null;
return obj;}exports.fromJsonToIntactSpaceMembershipApplication = x => psIntactSpaceMembershipApplication(_.cloneDeep(x));

function jsIntactAccount(obj){obj.userId = obj.userId ? jsUserId(obj.userId) : null;
obj.displayId = obj.displayId ? jsUserDisplayId(obj.displayId) : null;


                        if (obj.iconImage instanceof Data_Maybe.Just) {
                            obj.iconImage = obj.iconImage.value0;
                            
                        } else {
                            obj.iconImage = null;
                        }
                    

return obj;}exports.fromIntactAccountToJson = x => jsIntactAccount(_.cloneDeep(x));

function psIntactAccount(obj){obj.userId = obj.userId ? psUserId(obj.userId) : null;
obj.displayId = obj.displayId ? psUserDisplayId(obj.displayId) : null;


                    if (obj.iconImage) {
                        
                        obj.iconImage = new Data_Maybe.Just(obj.iconImage);
                    } else {
                        obj.iconImage = Data_Maybe.Nothing.value;
                    }
                

return obj;}exports.fromJsonToIntactAccount = x => psIntactAccount(_.cloneDeep(x));

function jsRelatedUser(obj){obj.userId = obj.userId ? jsUserId(obj.userId) : null;
obj.displayId = obj.displayId ? jsUserDisplayId(obj.displayId) : null;


                        if (obj.iconImage instanceof Data_Maybe.Just) {
                            obj.iconImage = obj.iconImage.value0;
                            
                        } else {
                            obj.iconImage = null;
                        }
                    
return obj;}exports.fromRelatedUserToJson = x => jsRelatedUser(_.cloneDeep(x));

function psRelatedUser(obj){obj.userId = obj.userId ? psUserId(obj.userId) : null;
obj.displayId = obj.displayId ? psUserDisplayId(obj.displayId) : null;


                    if (obj.iconImage) {
                        
                        obj.iconImage = new Data_Maybe.Just(obj.iconImage);
                    } else {
                        obj.iconImage = Data_Maybe.Nothing.value;
                    }
                
return obj;}exports.fromJsonToRelatedUser = x => psRelatedUser(_.cloneDeep(x));

function jsFocusedUser(obj){obj.userId = obj.userId ? jsUserId(obj.userId) : null;
obj.displayId = obj.displayId ? jsUserDisplayId(obj.displayId) : null;


                        if (obj.iconImage instanceof Data_Maybe.Just) {
                            obj.iconImage = obj.iconImage.value0;
                            
                        } else {
                            obj.iconImage = null;
                        }
                    
return obj;}exports.fromFocusedUserToJson = x => jsFocusedUser(_.cloneDeep(x));

function psFocusedUser(obj){obj.userId = obj.userId ? psUserId(obj.userId) : null;
obj.displayId = obj.displayId ? psUserDisplayId(obj.displayId) : null;


                    if (obj.iconImage) {
                        
                        obj.iconImage = new Data_Maybe.Just(obj.iconImage);
                    } else {
                        obj.iconImage = Data_Maybe.Nothing.value;
                    }
                
return obj;}exports.fromJsonToFocusedUser = x => psFocusedUser(_.cloneDeep(x));

function jsAuthInfo(obj){
obj.userId = obj.userId ? jsUserId(obj.userId) : null;return obj;}exports.fromAuthInfoToJson = x => jsAuthInfo(_.cloneDeep(x));

function psAuthInfo(obj){
obj.userId = obj.userId ? psUserId(obj.userId) : null;return obj;}exports.fromJsonToAuthInfo = x => psAuthInfo(_.cloneDeep(x));

exports.__getContainers = (() => {return async function (spaceId) {
                let argObject = { spaceId };
                argObject = _.cloneDeep(argObject);
                argObject.spaceId = argObject.spaceId ? jsSpaceId(argObject.spaceId) : null;
                argObject = [ argObject.spaceId ];
                let result = await requestApi("getContainers", argObject);
                
                        result = result ? result.map(x => {
                            x = x ? psFocusedContainer(x) : null;
                            return x;
                        }) : null;
                    
                return result;};})();

function jsMaterialCompositionType(obj) {
                if(E.Creation && obj instanceof E.Creation) {
                    return "creation";
                }
            
                if(E.Move && obj instanceof E.Move) {
                    return "move";
                }
            }

function psMaterialCompositionType(str) {switch(str){
case "creation":
return (E.Creation || { value: null }).value;
case "move":
return (E.Move || { value: null }).value;
}}

function jsMaterialComposition(obj) {
                if(E.CreationMaterialComposition && obj instanceof E.CreationMaterialComposition) {
                    ;
                    return {
                        type: "creation",
                        propertyId: obj.value0,data: obj.value1
                    };
                }
            
                if(E.MoveMaterialComposition && obj instanceof E.MoveMaterialComposition) {
                    obj.value0 = obj.value0 ? jsMaterialId(obj.value0) : null;
                    return {
                        type: "move",
                        materialId: obj.value0
                    };
                }
            }

function psMaterialComposition(obj) {switch(obj.type){case "creation":
;return new E.CreationMaterialComposition(obj.propertyId,obj.data);
case "move":
obj.materialId = obj.materialId ? psMaterialId(obj.materialId) : null;return new E.MoveMaterialComposition(obj.materialId);
}}

exports.__startContentEditing = (() => {return (contentId) => {return async function (basedCommitId) {
                let argObject = { contentId,basedCommitId };
                argObject = _.cloneDeep(argObject);
                argObject.contentId = argObject.contentId ? jsContentId(argObject.contentId) : null;
                        if (argObject.basedCommitId instanceof Data_Maybe.Just) {
                            argObject.basedCommitId = argObject.basedCommitId.value0;
                            argObject.basedCommitId = argObject.basedCommitId ? jsContentCommitId(argObject.basedCommitId) : null;
                        } else {
                            argObject.basedCommitId = null;
                        }
                    
                argObject = [ argObject.contentId,argObject.basedCommitId ];
                let result = await requestApi("startContentEditing", argObject);
                result = result ? psContentDraftId(result) : null;
                return result;}};})();

exports.__createNewContentDraft = (() => {return (structureId) => {return (spaceId) => {return async function (data) {
                let argObject = { structureId,spaceId,data };
                argObject = _.cloneDeep(argObject);
                argObject.structureId = argObject.structureId ? jsStructureId(argObject.structureId) : null;
                        if (argObject.spaceId instanceof Data_Maybe.Just) {
                            argObject.spaceId = argObject.spaceId.value0;
                            argObject.spaceId = argObject.spaceId ? jsSpaceId(argObject.spaceId) : null;
                        } else {
                            argObject.spaceId = null;
                        }
                    
                argObject = [ argObject.structureId,argObject.spaceId,argObject.data ];
                let result = await requestApi("createNewContentDraft", argObject);
                result = result ? psContentDraftId(result) : null;
                return result;}}};})();

exports.__editContentDraft = (() => {return (contentDraftId) => {return (data) => {return async function (materialUpdations) {
                let argObject = { contentDraftId,data,materialUpdations };
                argObject = _.cloneDeep(argObject);
                argObject.contentDraftId = argObject.contentDraftId ? jsContentDraftId(argObject.contentDraftId) : null;
                            argObject.materialUpdations = argObject.materialUpdations ? argObject.materialUpdations.map(x => {
                                x = x ? jsMaterialDraftUpdation(x) : null;
                                return x;
                            }) : null;
                        
                argObject = [ argObject.contentDraftId,argObject.data,argObject.materialUpdations ];
                let result = await requestApi("editContentDraft", argObject);
                
                return result;}}};})();

exports.__commitContent = (() => {return (contentDraftId) => {return (data) => {return async function (materialUpdations) {
                let argObject = { contentDraftId,data,materialUpdations };
                argObject = _.cloneDeep(argObject);
                argObject.contentDraftId = argObject.contentDraftId ? jsContentDraftId(argObject.contentDraftId) : null;
                            argObject.materialUpdations = argObject.materialUpdations ? argObject.materialUpdations.map(x => {
                                x = x ? jsMaterialDraftUpdation(x) : null;
                                return x;
                            }) : null;
                        
                argObject = [ argObject.contentDraftId,argObject.data,argObject.materialUpdations ];
                let result = await requestApi("commitContent", argObject);
                result = result ? psContentId(result) : null;
                return result;}}};})();

exports.__getContent = (() => {return async function (contentId) {
                let argObject = { contentId };
                argObject = _.cloneDeep(argObject);
                argObject.contentId = argObject.contentId ? jsContentId(argObject.contentId) : null;
                argObject = [ argObject.contentId ];
                let result = await requestApi("getContent", argObject);
                result = result ? psFocusedContent(result) : null;
                return result;};})();

exports.__getContentPage = (() => {return async function (contentId) {
                let argObject = { contentId };
                argObject = _.cloneDeep(argObject);
                argObject.contentId = argObject.contentId ? jsContentId(argObject.contentId) : null;
                argObject = [ argObject.contentId ];
                let result = await requestApi("getContentPage", argObject);
                result = result ? psIntactContentPage(result) : null;
                return result;};})();

exports.__getRelatedContent = (() => {return async function (contentId) {
                let argObject = { contentId };
                argObject = _.cloneDeep(argObject);
                argObject.contentId = argObject.contentId ? jsContentId(argObject.contentId) : null;
                argObject = [ argObject.contentId ];
                let result = await requestApi("getRelatedContent", argObject);
                result = result ? psRelatedContent(result) : null;
                return result;};})();

exports.__getContents = (() => {return (spaceId) => {return async function (formatId) {
                let argObject = { spaceId,formatId };
                argObject = _.cloneDeep(argObject);
                argObject.spaceId = argObject.spaceId ? jsSpaceId(argObject.spaceId) : null;argObject.formatId = argObject.formatId ? jsFormatId(argObject.formatId) : null;
                argObject = [ argObject.spaceId,argObject.formatId ];
                let result = await requestApi("getContents", argObject);
                
                        result = result ? result.map(x => {
                            x = x ? psRelatedContent(x) : null;
                            return x;
                        }) : null;
                    
                return result;}};})();

exports.__getContentsByDisplayId = (() => {return (spaceId) => {return async function (formatId) {
                let argObject = { spaceId,formatId };
                argObject = _.cloneDeep(argObject);
                argObject.spaceId = argObject.spaceId ? jsSpaceDisplayId(argObject.spaceId) : null;argObject.formatId = argObject.formatId ? jsFormatDisplayId(argObject.formatId) : null;
                argObject = [ argObject.spaceId,argObject.formatId ];
                let result = await requestApi("getContentsByDisplayId", argObject);
                
                        result = result ? result.map(x => {
                            x = x ? psRelatedContent(x) : null;
                            return x;
                        }) : null;
                    
                return result;}};})();

exports.__getFocusedContentsByDisplayId = (() => {return (spaceId) => {return async function (formatId) {
                let argObject = { spaceId,formatId };
                argObject = _.cloneDeep(argObject);
                argObject.spaceId = argObject.spaceId ? jsSpaceDisplayId(argObject.spaceId) : null;argObject.formatId = argObject.formatId ? jsFormatDisplayId(argObject.formatId) : null;
                argObject = [ argObject.spaceId,argObject.formatId ];
                let result = await requestApi("getFocusedContentsByDisplayId", argObject);
                
                        result = result ? result.map(x => {
                            x = x ? psFocusedContent(x) : null;
                            return x;
                        }) : null;
                    
                return result;}};})();


                exports.__getMyContentDrafts = (() => { return async function () { 
                    let result = await requestApi("getMyContentDrafts", []);
                    
                        result = result ? result.map(x => {
                            x = x ? psRelatedContentDraft(x) : null;
                            return x;
                        }) : null;
                    
                    return result;
                }})();
            

exports.__getContentDraft = (() => {return async function (draftId) {
                let argObject = { draftId };
                argObject = _.cloneDeep(argObject);
                argObject.draftId = argObject.draftId ? jsContentDraftId(argObject.draftId) : null;
                argObject = [ argObject.draftId ];
                let result = await requestApi("getContentDraft", argObject);
                result = result ? psFocusedContentDraft(result) : null;
                return result;};})();

exports.__cancelContentDraft = (() => {return async function (draftId) {
                let argObject = { draftId };
                argObject = _.cloneDeep(argObject);
                argObject.draftId = argObject.draftId ? jsContentDraftId(argObject.draftId) : null;
                argObject = [ argObject.draftId ];
                let result = await requestApi("cancelContentDraft", argObject);
                
                return result;};})();

exports.__getContentCommits = (() => {return async function (contentId) {
                let argObject = { contentId };
                argObject = _.cloneDeep(argObject);
                argObject.contentId = argObject.contentId ? jsContentId(argObject.contentId) : null;
                argObject = [ argObject.contentId ];
                let result = await requestApi("getContentCommits", argObject);
                
                        result = result ? result.map(x => {
                            x = x ? psRelatedContentCommit(x) : null;
                            return x;
                        }) : null;
                    
                return result;};})();

exports.__getContentCommit = (() => {return async function (commitId) {
                let argObject = { commitId };
                argObject = _.cloneDeep(argObject);
                argObject.commitId = argObject.commitId ? jsContentCommitId(argObject.commitId) : null;
                argObject = [ argObject.commitId ];
                let result = await requestApi("getContentCommit", argObject);
                result = result ? psFocusedContentCommit(result) : null;
                return result;};})();

exports.__getSearchedAllContents = (() => {return async function (text) {
                let argObject = { text };
                argObject = _.cloneDeep(argObject);
                
                argObject = [ argObject.text ];
                let result = await requestApi("getSearchedAllContents", argObject);
                
                        result = result ? result.map(x => {
                            x = x ? psSearchedContent(x) : null;
                            return x;
                        }) : null;
                    
                return result;};})();

exports.__getSearchedContentsInContainer = (() => {return (spaceId) => {return (formatId) => {return async function (text) {
                let argObject = { spaceId,formatId,text };
                argObject = _.cloneDeep(argObject);
                argObject.spaceId = argObject.spaceId ? jsSpaceDisplayId(argObject.spaceId) : null;argObject.formatId = argObject.formatId ? jsFormatDisplayId(argObject.formatId) : null;
                argObject = [ argObject.spaceId,argObject.formatId,argObject.text ];
                let result = await requestApi("getSearchedContentsInContainer", argObject);
                
                        result = result ? result.map(x => {
                            x = x ? psSearchedContent(x) : null;
                            return x;
                        }) : null;
                    
                return result;}}};})();


                exports.__createFormat = (() => {return async function (argObject) {
                    argObject = _.cloneDeep(argObject);
                    argObject.spaceId = argObject.spaceId ? jsSpaceId(argObject.spaceId) : null;argObject.usage = argObject.usage ? jsFormatUsage(argObject.usage) : null;
                            argObject.properties = argObject.properties ? argObject.properties.map(x => {
                                x = x ? jsPropertyInfo(x) : null;
                                return x;
                            }) : null;
                        
                    let args = [ argObject.spaceId,argObject.displayName,argObject.description,argObject.usage,argObject.properties ];
                    let result = await requestApi("createFormat", args);
                    result = result ? psFormatDisplayId(result) : null;
                    return result;
                } })();
            

exports.__getFormat = (() => {return async function (formatDisplayId) {
                let argObject = { formatDisplayId };
                argObject = _.cloneDeep(argObject);
                argObject.formatDisplayId = argObject.formatDisplayId ? jsFormatDisplayId(argObject.formatDisplayId) : null;
                argObject = [ argObject.formatDisplayId ];
                let result = await requestApi("getFormat", argObject);
                result = result ? psFocusedFormat(result) : null;
                return result;};})();

exports.__getFocusedFormat = (() => {return async function (formatId) {
                let argObject = { formatId };
                argObject = _.cloneDeep(argObject);
                argObject.formatId = argObject.formatId ? jsFormatId(argObject.formatId) : null;
                argObject = [ argObject.formatId ];
                let result = await requestApi("getFocusedFormat", argObject);
                result = result ? psFocusedFormat(result) : null;
                return result;};})();

exports.__getRelatedFormat = (() => {return async function (formatId) {
                let argObject = { formatId };
                argObject = _.cloneDeep(argObject);
                argObject.formatId = argObject.formatId ? jsFormatId(argObject.formatId) : null;
                argObject = [ argObject.formatId ];
                let result = await requestApi("getRelatedFormat", argObject);
                result = result ? psRelatedFormat(result) : null;
                return result;};})();

exports.__getFocusedFormatByStructure = (() => {return async function (structureId) {
                let argObject = { structureId };
                argObject = _.cloneDeep(argObject);
                argObject.structureId = argObject.structureId ? jsStructureId(argObject.structureId) : null;
                argObject = [ argObject.structureId ];
                let result = await requestApi("getFocusedFormatByStructure", argObject);
                result = result ? psFocusedFormat(result) : null;
                return result;};})();

exports.__getRelatedStructure = (() => {return async function (structureId) {
                let argObject = { structureId };
                argObject = _.cloneDeep(argObject);
                argObject.structureId = argObject.structureId ? jsStructureId(argObject.structureId) : null;
                argObject = [ argObject.structureId ];
                let result = await requestApi("getRelatedStructure", argObject);
                result = result ? psRelatedStructure(result) : null;
                return result;};})();

exports.__getFormats = (() => {return async function (spaceId) {
                let argObject = { spaceId };
                argObject = _.cloneDeep(argObject);
                argObject.spaceId = argObject.spaceId ? jsSpaceId(argObject.spaceId) : null;
                argObject = [ argObject.spaceId ];
                let result = await requestApi("getFormats", argObject);
                
                        result = result ? result.map(x => {
                            x = x ? psRelatedFormat(x) : null;
                            return x;
                        }) : null;
                    
                return result;};})();

exports.__getStructures = (() => {return async function (formatId) {
                let argObject = { formatId };
                argObject = _.cloneDeep(argObject);
                argObject.formatId = argObject.formatId ? jsFormatId(argObject.formatId) : null;
                argObject = [ argObject.formatId ];
                let result = await requestApi("getStructures", argObject);
                
                        result = result ? result.map(x => {
                            x = x ? psRelatedStructure(x) : null;
                            return x;
                        }) : null;
                    
                return result;};})();

exports.__updateFormatStructure = (() => {return (formatId) => {return async function (properties) {
                let argObject = { formatId,properties };
                argObject = _.cloneDeep(argObject);
                argObject.formatId = argObject.formatId ? jsFormatId(argObject.formatId) : null;
                            argObject.properties = argObject.properties ? argObject.properties.map(x => {
                                x = x ? jsPropertyInfo(x) : null;
                                return x;
                            }) : null;
                        
                argObject = [ argObject.formatId,argObject.properties ];
                let result = await requestApi("updateFormatStructure", argObject);
                
                return result;}};})();

exports.__setFormatDisplayName = (() => {return (formatId) => {return async function (displayName) {
                let argObject = { formatId,displayName };
                argObject = _.cloneDeep(argObject);
                argObject.formatId = argObject.formatId ? jsFormatId(argObject.formatId) : null;
                argObject = [ argObject.formatId,argObject.displayName ];
                let result = await requestApi("setFormatDisplayName", argObject);
                
                return result;}};})();

exports.__setFormatDisplayId = (() => {return (formatId) => {return async function (displayId) {
                let argObject = { formatId,displayId };
                argObject = _.cloneDeep(argObject);
                argObject.formatId = argObject.formatId ? jsFormatId(argObject.formatId) : null;argObject.displayId = argObject.displayId ? jsFormatDisplayId(argObject.displayId) : null;
                argObject = [ argObject.formatId,argObject.displayId ];
                let result = await requestApi("setFormatDisplayId", argObject);
                
                return result;}};})();

exports.__setFormatIcon = (() => {return (formatId) => {return async function (icon) {
                let argObject = { formatId,icon };
                argObject = _.cloneDeep(argObject);
                argObject.formatId = argObject.formatId ? jsFormatId(argObject.formatId) : null;
                        if (argObject.icon instanceof Data_Maybe.Just) {
                            argObject.icon = argObject.icon.value0;
                            
                        } else {
                            argObject.icon = null;
                        }
                    
                argObject = [ argObject.formatId,argObject.icon ];
                let result = await requestApi("setFormatIcon", argObject);
                
                return result;}};})();

exports.__getAvailableFormatDisplayId = (() => {return async function (formatDisplayId) {
                let argObject = { formatDisplayId };
                argObject = _.cloneDeep(argObject);
                argObject.formatDisplayId = argObject.formatDisplayId ? jsFormatDisplayId(argObject.formatDisplayId) : null;
                argObject = [ argObject.formatDisplayId ];
                let result = await requestApi("getAvailableFormatDisplayId", argObject);
                
                return result;};})();

exports.__startMaterialEditing = (() => {return (materialId) => {return async function (basedCommitId) {
                let argObject = { materialId,basedCommitId };
                argObject = _.cloneDeep(argObject);
                argObject.materialId = argObject.materialId ? jsMaterialId(argObject.materialId) : null;
                        if (argObject.basedCommitId instanceof Data_Maybe.Just) {
                            argObject.basedCommitId = argObject.basedCommitId.value0;
                            argObject.basedCommitId = argObject.basedCommitId ? jsMaterialCommitId(argObject.basedCommitId) : null;
                        } else {
                            argObject.basedCommitId = null;
                        }
                    
                argObject = [ argObject.materialId,argObject.basedCommitId ];
                let result = await requestApi("startMaterialEditing", argObject);
                result = result ? psRelatedMaterialDraft(result) : null;
                return result;}};})();

exports.__createNewMaterialDraft = (() => {return (spaceId) => {return async function (materialData) {
                let argObject = { spaceId,materialData };
                argObject = _.cloneDeep(argObject);
                
                        if (argObject.spaceId instanceof Data_Maybe.Just) {
                            argObject.spaceId = argObject.spaceId.value0;
                            argObject.spaceId = argObject.spaceId ? jsSpaceId(argObject.spaceId) : null;
                        } else {
                            argObject.spaceId = null;
                        }
                    argObject.materialData = argObject.materialData ? jsMaterialData(argObject.materialData) : null;
                argObject = [ argObject.spaceId,argObject.materialData ];
                let result = await requestApi("createNewMaterialDraft", argObject);
                result = result ? psRelatedMaterialDraft(result) : null;
                return result;}};})();

exports.__editMaterialDraft = (() => {return (materialDraftId) => {return async function (materialData) {
                let argObject = { materialDraftId,materialData };
                argObject = _.cloneDeep(argObject);
                argObject.materialDraftId = argObject.materialDraftId ? jsMaterialDraftId(argObject.materialDraftId) : null;argObject.materialData = argObject.materialData ? jsMaterialData(argObject.materialData) : null;
                argObject = [ argObject.materialDraftId,argObject.materialData ];
                let result = await requestApi("editMaterialDraft", argObject);
                
                return result;}};})();

exports.__commitMaterial = (() => {return (materialDraftId) => {return async function (materialData) {
                let argObject = { materialDraftId,materialData };
                argObject = _.cloneDeep(argObject);
                argObject.materialDraftId = argObject.materialDraftId ? jsMaterialDraftId(argObject.materialDraftId) : null;argObject.materialData = argObject.materialData ? jsMaterialData(argObject.materialData) : null;
                argObject = [ argObject.materialDraftId,argObject.materialData ];
                let result = await requestApi("commitMaterial", argObject);
                
                return result;}};})();

exports.__getMaterial = (() => {return async function (materialId) {
                let argObject = { materialId };
                argObject = _.cloneDeep(argObject);
                argObject.materialId = argObject.materialId ? jsMaterialId(argObject.materialId) : null;
                argObject = [ argObject.materialId ];
                let result = await requestApi("getMaterial", argObject);
                result = result ? psFocusedMaterial(result) : null;
                return result;};})();


                exports.__getMyMaterialDrafts = (() => { return async function () { 
                    let result = await requestApi("getMyMaterialDrafts", []);
                    
                        result = result ? result.map(x => {
                            x = x ? psRelatedMaterialDraft(x) : null;
                            return x;
                        }) : null;
                    
                    return result;
                }})();
            

exports.__getMaterialDraft = (() => {return async function (draftId) {
                let argObject = { draftId };
                argObject = _.cloneDeep(argObject);
                argObject.draftId = argObject.draftId ? jsMaterialDraftId(argObject.draftId) : null;
                argObject = [ argObject.draftId ];
                let result = await requestApi("getMaterialDraft", argObject);
                result = result ? psFocusedMaterialDraft(result) : null;
                return result;};})();

exports.__cancelMaterialDraft = (() => {return async function (draftId) {
                let argObject = { draftId };
                argObject = _.cloneDeep(argObject);
                argObject.draftId = argObject.draftId ? jsMaterialDraftId(argObject.draftId) : null;
                argObject = [ argObject.draftId ];
                let result = await requestApi("cancelMaterialDraft", argObject);
                
                return result;};})();

exports.__getMaterialCommits = (() => {return async function (materialId) {
                let argObject = { materialId };
                argObject = _.cloneDeep(argObject);
                argObject.materialId = argObject.materialId ? jsMaterialId(argObject.materialId) : null;
                argObject = [ argObject.materialId ];
                let result = await requestApi("getMaterialCommits", argObject);
                
                        result = result ? result.map(x => {
                            x = x ? psRelatedMaterialCommit(x) : null;
                            return x;
                        }) : null;
                    
                return result;};})();

exports.__getMaterialEditings = (() => {return async function (draftId) {
                let argObject = { draftId };
                argObject = _.cloneDeep(argObject);
                argObject.draftId = argObject.draftId ? jsMaterialDraftId(argObject.draftId) : null;
                argObject = [ argObject.draftId ];
                let result = await requestApi("getMaterialEditings", argObject);
                
                        result = result ? result.map(x => {
                            x = x ? psIntactMaterialEditing(x) : null;
                            return x;
                        }) : null;
                    
                return result;};})();

exports.__getMaterialSnapshot = (() => {return async function (snapshotId) {
                let argObject = { snapshotId };
                argObject = _.cloneDeep(argObject);
                argObject.snapshotId = argObject.snapshotId ? jsMaterialSnapshotId(argObject.snapshotId) : null;
                argObject = [ argObject.snapshotId ];
                let result = await requestApi("getMaterialSnapshot", argObject);
                result = result ? psFocusedMaterialSnapshot(result) : null;
                return result;};})();

exports.__getMaterialCommit = (() => {return async function (commitId) {
                let argObject = { commitId };
                argObject = _.cloneDeep(argObject);
                argObject.commitId = argObject.commitId ? jsMaterialCommitId(argObject.commitId) : null;
                argObject = [ argObject.commitId ];
                let result = await requestApi("getMaterialCommit", argObject);
                result = result ? psFocusedMaterialCommit(result) : null;
                return result;};})();

exports.__commentContent = (() => {return (contentId) => {return async function (text) {
                let argObject = { contentId,text };
                argObject = _.cloneDeep(argObject);
                argObject.contentId = argObject.contentId ? jsContentId(argObject.contentId) : null;
                argObject = [ argObject.contentId,argObject.text ];
                let result = await requestApi("commentContent", argObject);
                result = result ? psFocusedTreeComment(result) : null;
                return result;}};})();

exports.__replyToComment = (() => {return (commentId) => {return async function (text) {
                let argObject = { commentId,text };
                argObject = _.cloneDeep(argObject);
                argObject.commentId = argObject.commentId ? jsCommentId(argObject.commentId) : null;
                argObject = [ argObject.commentId,argObject.text ];
                let result = await requestApi("replyToComment", argObject);
                result = result ? psFocusedComment(result) : null;
                return result;}};})();

exports.__modifyComment = (() => {return (commentId) => {return async function (text) {
                let argObject = { commentId,text };
                argObject = _.cloneDeep(argObject);
                argObject.commentId = argObject.commentId ? jsCommentId(argObject.commentId) : null;
                argObject = [ argObject.commentId,argObject.text ];
                let result = await requestApi("modifyComment", argObject);
                
                return result;}};})();

exports.__likeComment = (() => {return async function (commentId) {
                let argObject = { commentId };
                argObject = _.cloneDeep(argObject);
                argObject.commentId = argObject.commentId ? jsCommentId(argObject.commentId) : null;
                argObject = [ argObject.commentId ];
                let result = await requestApi("likeComment", argObject);
                
                return result;};})();

exports.__unlikeComment = (() => {return async function (commentId) {
                let argObject = { commentId };
                argObject = _.cloneDeep(argObject);
                argObject.commentId = argObject.commentId ? jsCommentId(argObject.commentId) : null;
                argObject = [ argObject.commentId ];
                let result = await requestApi("unlikeComment", argObject);
                
                return result;};})();


                exports.__getNotifications = (() => { return async function () { 
                    let result = await requestApi("getNotifications", []);
                    
                        result = result ? result.map(x => {
                            x = x ? psIntactNotification(x) : null;
                            return x;
                        }) : null;
                    
                    return result;
                }})();
            

exports.__getActivitiesBySpace = (() => {return async function (spaceId) {
                let argObject = { spaceId };
                argObject = _.cloneDeep(argObject);
                argObject.spaceId = argObject.spaceId ? jsSpaceId(argObject.spaceId) : null;
                argObject = [ argObject.spaceId ];
                let result = await requestApi("getActivitiesBySpace", argObject);
                
                        result = result ? result.map(x => {
                            x = x ? psIntactActivityBySpace(x) : null;
                            return x;
                        }) : null;
                    
                return result;};})();

exports.__getActivitiesByUser = (() => {return async function (spaceId) {
                let argObject = { spaceId };
                argObject = _.cloneDeep(argObject);
                argObject.spaceId = argObject.spaceId ? jsSpaceId(argObject.spaceId) : null;
                argObject = [ argObject.spaceId ];
                let result = await requestApi("getActivitiesByUser", argObject);
                
                        result = result ? result.map(x => {
                            x = x ? psIntactActivityByUser(x) : null;
                            return x;
                        }) : null;
                    
                return result;};})();


                exports.__getNotReadNotificationCount = (() => { return async function () { 
                    let result = await requestApi("getNotReadNotificationCount", []);
                    
                    return result;
                }})();
            


                exports.__readAllNotifications = (() => { return async function () { 
                    let result = await requestApi("readAllNotifications", []);
                    
                    return result;
                }})();
            


                exports.__createSpace = (() => {return async function (argObject) {
                    argObject = _.cloneDeep(argObject);
                    
                    let args = [ argObject.displayId,argObject.displayName,argObject.description ];
                    let result = await requestApi("createSpace", args);
                    result = result ? psSpaceDisplayId(result) : null;
                    return result;
                } })();
            

exports.__getSpace = (() => {return async function (spaceDisplayId) {
                let argObject = { spaceDisplayId };
                argObject = _.cloneDeep(argObject);
                argObject.spaceDisplayId = argObject.spaceDisplayId ? jsSpaceDisplayId(argObject.spaceDisplayId) : null;
                argObject = [ argObject.spaceDisplayId ];
                let result = await requestApi("getSpace", argObject);
                result = result ? psFocusedSpace(result) : null;
                return result;};})();

exports.__getRelatedSpace = (() => {return async function (spaceId) {
                let argObject = { spaceId };
                argObject = _.cloneDeep(argObject);
                argObject.spaceId = argObject.spaceId ? jsSpaceId(argObject.spaceId) : null;
                argObject = [ argObject.spaceId ];
                let result = await requestApi("getRelatedSpace", argObject);
                result = result ? psRelatedSpace(result) : null;
                return result;};})();

exports.__getSpaceMembers = (() => {return async function (spaceId) {
                let argObject = { spaceId };
                argObject = _.cloneDeep(argObject);
                argObject.spaceId = argObject.spaceId ? jsSpaceId(argObject.spaceId) : null;
                argObject = [ argObject.spaceId ];
                let result = await requestApi("getSpaceMembers", argObject);
                
                        result = result ? result.map(x => {
                            x = x ? psIntactSpaceMember(x) : null;
                            return x;
                        }) : null;
                    
                return result;};})();

exports.__getSpaceMembershipApplications = (() => {return async function (spaceId) {
                let argObject = { spaceId };
                argObject = _.cloneDeep(argObject);
                argObject.spaceId = argObject.spaceId ? jsSpaceId(argObject.spaceId) : null;
                argObject = [ argObject.spaceId ];
                let result = await requestApi("getSpaceMembershipApplications", argObject);
                
                        result = result ? result.map(x => {
                            x = x ? psIntactSpaceMembershipApplication(x) : null;
                            return x;
                        }) : null;
                    
                return result;};})();

exports.__getAvailableSpaceDisplayId = (() => {return async function (spaceDisplayId) {
                let argObject = { spaceDisplayId };
                argObject = _.cloneDeep(argObject);
                argObject.spaceDisplayId = argObject.spaceDisplayId ? jsSpaceDisplayId(argObject.spaceDisplayId) : null;
                argObject = [ argObject.spaceDisplayId ];
                let result = await requestApi("getAvailableSpaceDisplayId", argObject);
                
                return result;};})();


                exports.__getCandidateSpaces = (() => { return async function () { 
                    let result = await requestApi("getCandidateSpaces", []);
                    
                        result = result ? result.map(x => {
                            x = x ? psRelatedSpace(x) : null;
                            return x;
                        }) : null;
                    
                    return result;
                }})();
            


                exports.__getMySpaces = (() => { return async function () { 
                    let result = await requestApi("getMySpaces", []);
                    
                        result = result ? result.map(x => {
                            x = x ? psRelatedSpace(x) : null;
                            return x;
                        }) : null;
                    
                    return result;
                }})();
            


                exports.__getFollowingSpaces = (() => { return async function () { 
                    let result = await requestApi("getFollowingSpaces", []);
                    
                        result = result ? result.map(x => {
                            x = x ? psRelatedSpace(x) : null;
                            return x;
                        }) : null;
                    
                    return result;
                }})();
            


                exports.__getPublishedSpaces = (() => { return async function () { 
                    let result = await requestApi("getPublishedSpaces", []);
                    
                        result = result ? result.map(x => {
                            x = x ? psRelatedSpace(x) : null;
                            return x;
                        }) : null;
                    
                    return result;
                }})();
            

exports.__applySpaceMembership = (() => {return async function (spaceId) {
                let argObject = { spaceId };
                argObject = _.cloneDeep(argObject);
                argObject.spaceId = argObject.spaceId ? jsSpaceId(argObject.spaceId) : null;
                argObject = [ argObject.spaceId ];
                let result = await requestApi("applySpaceMembership", argObject);
                
                return result;};})();

exports.__acceptSpaceMembership = (() => {return (spaceId) => {return async function (targetUserId) {
                let argObject = { spaceId,targetUserId };
                argObject = _.cloneDeep(argObject);
                argObject.spaceId = argObject.spaceId ? jsSpaceId(argObject.spaceId) : null;argObject.targetUserId = argObject.targetUserId ? jsUserId(argObject.targetUserId) : null;
                argObject = [ argObject.spaceId,argObject.targetUserId ];
                let result = await requestApi("acceptSpaceMembership", argObject);
                
                return result;}};})();

exports.__rejectSpaceMembership = (() => {return (spaceId) => {return async function (targetUserId) {
                let argObject = { spaceId,targetUserId };
                argObject = _.cloneDeep(argObject);
                argObject.spaceId = argObject.spaceId ? jsSpaceId(argObject.spaceId) : null;argObject.targetUserId = argObject.targetUserId ? jsUserId(argObject.targetUserId) : null;
                argObject = [ argObject.spaceId,argObject.targetUserId ];
                let result = await requestApi("rejectSpaceMembership", argObject);
                
                return result;}};})();

exports.__cancelSpaceMembershipApplication = (() => {return async function (spaceId) {
                let argObject = { spaceId };
                argObject = _.cloneDeep(argObject);
                argObject.spaceId = argObject.spaceId ? jsSpaceId(argObject.spaceId) : null;
                argObject = [ argObject.spaceId ];
                let result = await requestApi("cancelSpaceMembershipApplication", argObject);
                
                return result;};})();

exports.__setSpaceMembershipMethod = (() => {return (spaceId) => {return async function (membershipMethod) {
                let argObject = { spaceId,membershipMethod };
                argObject = _.cloneDeep(argObject);
                argObject.spaceId = argObject.spaceId ? jsSpaceId(argObject.spaceId) : null;argObject.membershipMethod = argObject.membershipMethod ? jsMembershipMethod(argObject.membershipMethod) : null;
                argObject = [ argObject.spaceId,argObject.membershipMethod ];
                let result = await requestApi("setSpaceMembershipMethod", argObject);
                
                return result;}};})();

exports.__setSpaceDisplayName = (() => {return (spaceId) => {return async function (displayName) {
                let argObject = { spaceId,displayName };
                argObject = _.cloneDeep(argObject);
                argObject.spaceId = argObject.spaceId ? jsSpaceId(argObject.spaceId) : null;
                argObject = [ argObject.spaceId,argObject.displayName ];
                let result = await requestApi("setSpaceDisplayName", argObject);
                
                return result;}};})();

exports.__setSpaceDescription = (() => {return (spaceId) => {return async function (description) {
                let argObject = { spaceId,description };
                argObject = _.cloneDeep(argObject);
                argObject.spaceId = argObject.spaceId ? jsSpaceId(argObject.spaceId) : null;
                argObject = [ argObject.spaceId,argObject.description ];
                let result = await requestApi("setSpaceDescription", argObject);
                
                return result;}};})();

exports.__uploadSpaceHeaderImage = (() => {return async function (args) {
                let argObject = { args };
                argObject = _.cloneDeep(argObject);
                argObject.args.spaceId = argObject.args.spaceId ? jsSpaceId(argObject.args.spaceId) : null;
                argObject = [ argObject.args ];
                let result = await requestApi("uploadSpaceHeaderImage", argObject);
                
                return result;};})();

exports.__setSpaceDisplayId = (() => {return (spaceId) => {return async function (displayId) {
                let argObject = { spaceId,displayId };
                argObject = _.cloneDeep(argObject);
                argObject.spaceId = argObject.spaceId ? jsSpaceId(argObject.spaceId) : null;argObject.displayId = argObject.displayId ? jsSpaceDisplayId(argObject.displayId) : null;
                argObject = [ argObject.spaceId,argObject.displayId ];
                let result = await requestApi("setSpaceDisplayId", argObject);
                
                return result;}};})();

exports.__setSpacePublished = (() => {return (spaceId) => {return async function (published) {
                let argObject = { spaceId,published };
                argObject = _.cloneDeep(argObject);
                argObject.spaceId = argObject.spaceId ? jsSpaceId(argObject.spaceId) : null;
                argObject = [ argObject.spaceId,argObject.published ];
                let result = await requestApi("setSpacePublished", argObject);
                
                return result;}};})();

exports.__setSpaceDefaultAuthority = (() => {return (spaceId) => {return async function (defaultAuthority) {
                let argObject = { spaceId,defaultAuthority };
                argObject = _.cloneDeep(argObject);
                argObject.spaceId = argObject.spaceId ? jsSpaceId(argObject.spaceId) : null;argObject.defaultAuthority = argObject.defaultAuthority ? jsSpaceAuthority(argObject.defaultAuthority) : null;
                argObject = [ argObject.spaceId,argObject.defaultAuthority ];
                let result = await requestApi("setSpaceDefaultAuthority", argObject);
                
                return result;}};})();

exports.__getSpaceContainers = (() => {return async function (spaceId) {
                let argObject = { spaceId };
                argObject = _.cloneDeep(argObject);
                argObject.spaceId = argObject.spaceId ? jsSpaceId(argObject.spaceId) : null;
                argObject = [ argObject.spaceId ];
                let result = await requestApi("getSpaceContainers", argObject);
                
                        result = result ? result.map(x => {
                            x = x ? psRelatedContainer(x) : null;
                            return x;
                        }) : null;
                    
                return result;};})();

exports.__getSpaceHomePage = (() => {return async function (spaceId) {
                let argObject = { spaceId };
                argObject = _.cloneDeep(argObject);
                argObject.spaceId = argObject.spaceId ? jsSpaceId(argObject.spaceId) : null;
                argObject = [ argObject.spaceId ];
                let result = await requestApi("getSpaceHomePage", argObject);
                result = result ? psIntactSpageHomePage(result) : null;
                return result;};})();


                exports.__createUser = (() => {return async function (argObject) {
                    argObject = _.cloneDeep(argObject);
                    
                    let args = [ argObject.email,argObject.displayName,argObject.password ];
                    let result = await requestApi("createUser", args);
                    result = result ? psUserId(result) : null;
                    return result;
                } })();
            


                exports.__getMyUser = (() => { return async function () { 
                    let result = await requestApi("getMyUser", []);
                    result = result ? psFocusedUser(result) : null;
                    return result;
                }})();
            


                exports.__getMyAccount = (() => { return async function () { 
                    let result = await requestApi("getMyAccount", []);
                    result = result ? psIntactAccount(result) : null;
                    return result;
                }})();
            

exports.__getUser = (() => {return async function (displayId) {
                let argObject = { displayId };
                argObject = _.cloneDeep(argObject);
                argObject.displayId = argObject.displayId ? jsUserDisplayId(argObject.displayId) : null;
                argObject = [ argObject.displayId ];
                let result = await requestApi("getUser", argObject);
                result = result ? psFocusedUser(result) : null;
                return result;};})();


                exports.__authenticate = (() => {return async function (argObject) {
                    argObject = _.cloneDeep(argObject);
                    
                    let args = [ argObject.email,argObject.password ];
                    let result = await requestApi("authenticate", args);
                    result = result ? psAuthInfo(result) : null;
                    return result;
                } })();
            

exports.__activateAccount = (() => {return async function (token) {
                let argObject = { token };
                argObject = _.cloneDeep(argObject);
                
                argObject = [ argObject.token ];
                let result = await requestApi("activateAccount", argObject);
                result = result ? psAuthInfo(result) : null;
                return result;};})();

exports.__getFocusedUser = (() => {return async function (userId) {
                let argObject = { userId };
                argObject = _.cloneDeep(argObject);
                argObject.userId = argObject.userId ? jsUserId(argObject.userId) : null;
                argObject = [ argObject.userId ];
                let result = await requestApi("getFocusedUser", argObject);
                result = result ? psFocusedUser(result) : null;
                return result;};})();

exports.__getRelatedUser = (() => {return async function (userId) {
                let argObject = { userId };
                argObject = _.cloneDeep(argObject);
                argObject.userId = argObject.userId ? jsUserId(argObject.userId) : null;
                argObject = [ argObject.userId ];
                let result = await requestApi("getRelatedUser", argObject);
                result = result ? psRelatedUser(result) : null;
                return result;};})();


                exports.__setMyPassword = (() => {return async function (argObject) {
                    argObject = _.cloneDeep(argObject);
                    
                    let args = [ argObject.oldPassword,argObject.newPassword ];
                    let result = await requestApi("setMyPassword", args);
                    
                    return result;
                } })();
            

exports.__setMyDisplayName = (() => {return async function (displayName) {
                let argObject = { displayName };
                argObject = _.cloneDeep(argObject);
                
                argObject = [ argObject.displayName ];
                let result = await requestApi("setMyDisplayName", argObject);
                
                return result;};})();

exports.__setMyDisplayId = (() => {return async function (displayId) {
                let argObject = { displayId };
                argObject = _.cloneDeep(argObject);
                argObject.displayId = argObject.displayId ? jsUserDisplayId(argObject.displayId) : null;
                argObject = [ argObject.displayId ];
                let result = await requestApi("setMyDisplayId", argObject);
                
                return result;};})();

exports.__setMyEmail = (() => {return async function (email) {
                let argObject = { email };
                argObject = _.cloneDeep(argObject);
                
                argObject = [ argObject.email ];
                let result = await requestApi("setMyEmail", argObject);
                
                return result;};})();

exports.__uploadMyIcon = (() => {return async function (args) {
                let argObject = { args };
                argObject = _.cloneDeep(argObject);
                
                argObject = [ argObject.args ];
                let result = await requestApi("uploadMyIcon", argObject);
                
                return result;};})();

