
const Data_Maybe = PS["Data.Maybe"]; 
const E = PS["Incentknow.Data.Entities"] || {};
PS["Incentknow.Data.Entities"] = E;
const endpoint = "http://localhost:8080";

async function requestApi(method, args) {
    console.log({ method: method, body: args });
    const session = localStorage.getItem("session");
    const headers = {
        'Content-Type': 'application/json',
    };
    if (session) {
        headers['Session'] = session;
    }
    const response = await fetch(endpoint + "/" + method, {
        method: 'POST',
        body: JSON.stringify(args),
        headers: headers,
        mode: 'cors'
    });
    return await response.json();
}

const psObjectLiteral = x => x;

function jsContentGenerator(obj) {
                if(obj instanceof E.ContentGeneratorNone) {
                    return "none";
                }
            
                if(obj instanceof E.ContentGeneratorReactor) {
                    return "reactor";
                }
            
                if(obj instanceof E.ContentGeneratorCrawler) {
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


function jsContentChangeType(obj) {
                if(obj instanceof E.ContentChangeTypeInitial) {
                    return "initial";
                }
            
                if(obj instanceof E.ContentChangeTypeWrite) {
                    return "write";
                }
            
                if(obj instanceof E.ContentChangeTypeRemove) {
                    return "remove";
                }
            }

function psContentChangeType(str) {switch(str){
case "initial":
return (E.ContentChangeTypeInitial || { value: null }).value;
case "write":
return (E.ContentChangeTypeWrite || { value: null }).value;
case "remove":
return (E.ContentChangeTypeRemove || { value: null }).value;
}}

const jsContentDraftSk = x => x;


const psContentDraftSk = x => x;


const jsContentDraftId = x => x;


const psContentDraftId = x => x;


function jsContentEditingState(obj) {
                if(obj instanceof E.ContentEditingStateEditing) {
                    return "editing";
                }
            
                if(obj instanceof E.ContentEditingStateCommitted) {
                    return "committed";
                }
            
                if(obj instanceof E.ContentEditingStateCanceld) {
                    return "canceled";
                }
            }

function psContentEditingState(str) {switch(str){
case "editing":
return (E.ContentEditingStateEditing || { value: null }).value;
case "committed":
return (E.ContentEditingStateCommitted || { value: null }).value;
case "canceled":
return (E.ContentEditingStateCanceld || { value: null }).value;
}}

const jsContentEditingSk = x => x;


const psContentEditingSk = x => x;


const jsContentEditingId = x => x;


const psContentEditingId = x => x;


const jsContentSnapshotSk = x => x;


const psContentSnapshotSk = x => x;


const jsContentSnapshotId = x => x;


const psContentSnapshotId = x => x;


const jsContentTransitionSk = x => x;


const psContentTransitionSk = x => x;


const jsContentTransitionId = x => x;


const psContentTransitionId = x => x;


function jsFormatUsage(obj) {
                if(obj instanceof E.Internal) {
                    return "internal";
                }
            
                if(obj instanceof E.External) {
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
                if(obj instanceof E.ValueRelatively) {
                    return "value_relatively";
                }
            
                if(obj instanceof E.MutualExclutively) {
                    return "mutual_exclutively";
                }
            
                if(obj instanceof E.SeriesDependency) {
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
                if(obj instanceof E.TypeNameInt) {
                    return "integer";
                }
            
                if(obj instanceof E.TypeNameBool) {
                    return "boolean";
                }
            
                if(obj instanceof E.TypeNameString) {
                    return "string";
                }
            
                if(obj instanceof E.TypeNameFormat) {
                    return "format";
                }
            
                if(obj instanceof E.TypeNameSpace) {
                    return "space";
                }
            
                if(obj instanceof E.TypeNameContent) {
                    return "content";
                }
            
                if(obj instanceof E.TypeNameUrl) {
                    return "url";
                }
            
                if(obj instanceof E.TypeNameObject) {
                    return "object";
                }
            
                if(obj instanceof E.TypeNameText) {
                    return "text";
                }
            
                if(obj instanceof E.TypeNameArray) {
                    return "array";
                }
            
                if(obj instanceof E.TypeNameCode) {
                    return "code";
                }
            
                if(obj instanceof E.TypeNameEnum) {
                    return "enumerator";
                }
            
                if(obj instanceof E.TypeNameDocument) {
                    return "document";
                }
            
                if(obj instanceof E.TypeNameImage) {
                    return "image";
                }
            
                if(obj instanceof E.TypeNameEntity) {
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
case "format":
return (E.TypeNameFormat || { value: null }).value;
case "space":
return (E.TypeNameSpace || { value: null }).value;
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
case "code":
return (E.TypeNameCode || { value: null }).value;
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
                if(obj instanceof E.Python) {
                    return "python";
                }
            
                if(obj instanceof E.Javascript) {
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
                if(obj instanceof E.MaterialTypeFolder) {
                    return "folder";
                }
            
                if(obj instanceof E.MaterialTypeDocument) {
                    return "document";
                }
            }

function psMaterialType(str) {switch(str){
case "folder":
return (E.MaterialTypeFolder || { value: null }).value;
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
                if(obj instanceof E.MaterialChangeTypeInitial) {
                    return "initial";
                }
            
                if(obj instanceof E.MaterialChangeTypeWrite) {
                    return "write";
                }
            
                if(obj instanceof E.MaterialChangeTypeRemove) {
                    return "remove";
                }
            }

function psMaterialChangeType(str) {switch(str){
case "initial":
return (E.MaterialChangeTypeInitial || { value: null }).value;
case "write":
return (E.MaterialChangeTypeWrite || { value: null }).value;
case "remove":
return (E.MaterialChangeTypeRemove || { value: null }).value;
}}

const jsMaterialDraftSk = x => x;


const psMaterialDraftSk = x => x;


const jsMaterialDraftId = x => x;


const psMaterialDraftId = x => x;


function jsMaterialEditingState(obj) {
                if(obj instanceof E.MaterialEditingStateEditing) {
                    return "editing";
                }
            
                if(obj instanceof E.MaterialEditingStateCommitted) {
                    return "committed";
                }
            
                if(obj instanceof E.MaterialEditingStateCanceld) {
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


function jsReactorState(obj) {
                if(obj instanceof E.Invaild) {
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
                if(obj instanceof E.MembershipMethodNone) {
                    return "none";
                }
            
                if(obj instanceof E.MembershipMethodApp) {
                    return "app";
                }
            }

function psMembershipMethod(str) {switch(str){
case "none":
return (E.MembershipMethodNone || { value: null }).value;
case "app":
return (E.MembershipMethodApp || { value: null }).value;
}}

function jsSpaceAuth(obj) {
                if(obj instanceof E.SpaceAuthNone) {
                    return "none";
                }
            
                if(obj instanceof E.SpaceAuthVisible) {
                    return "visible";
                }
            
                if(obj instanceof E.SpaceAuthReadable) {
                    return "readable";
                }
            
                if(obj instanceof E.SpaceAuthWritable) {
                    return "writable";
                }
            }

function psSpaceAuth(str) {switch(str){
case "none":
return (E.SpaceAuthNone || { value: null }).value;
case "visible":
return (E.SpaceAuthVisible || { value: null }).value;
case "readable":
return (E.SpaceAuthReadable || { value: null }).value;
case "writable":
return (E.SpaceAuthWritable || { value: null }).value;
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
                if(obj instanceof E.Normal) {
                    return "normal";
                }
            
                if(obj instanceof E.Owner) {
                    return "owner";
                }
            }

function psMemberType(str) {switch(str){
case "normal":
return (E.Normal || { value: null }).value;
case "owner":
return (E.Owner || { value: null }).value;
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


function jsRelatedContainer(obj){obj.containerId = jsContainerId(obj.containerId);
obj.space = jsRelatedSpace(obj.space);
obj.format = jsRelatedFormat(obj.format);



                        if (obj.generator instanceof Data_Maybe.Just) {
                            obj.generator = obj.generator.value0; 
                        } else {
                            obj.generator = null;
                        }
                    return obj;}

function psRelatedContainer(obj){obj.containerId = psContainerId(obj.containerId);
obj.space = psRelatedSpace(obj.space);
obj.format = psRelatedFormat(obj.format);



                    if (obj.generator) {
                        obj.generator = new Data_Maybe.Just(obj.generator);
                    } else {
                        obj.generator = Data_Maybe.Nothing.value;
                    }
                return obj;}

function jsFocusedContainer(obj){obj.containerId = jsContainerId(obj.containerId);
obj.space = jsRelatedSpace(obj.space);
obj.format = jsRelatedFormat(obj.format);



                        if (obj.generator instanceof Data_Maybe.Just) {
                            obj.generator = obj.generator.value0; 
                        } else {
                            obj.generator = null;
                        }
                    

                        if (obj.reactor instanceof Data_Maybe.Just) {
                            obj.reactor = obj.reactor.value0; 
                        } else {
                            obj.reactor = null;
                        }
                    return obj;}

function psFocusedContainer(obj){obj.containerId = psContainerId(obj.containerId);
obj.space = psRelatedSpace(obj.space);
obj.format = psRelatedFormat(obj.format);



                    if (obj.generator) {
                        obj.generator = new Data_Maybe.Just(obj.generator);
                    } else {
                        obj.generator = Data_Maybe.Nothing.value;
                    }
                

                    if (obj.reactor) {
                        obj.reactor = new Data_Maybe.Just(obj.reactor);
                    } else {
                        obj.reactor = Data_Maybe.Nothing.value;
                    }
                return obj;}

function jsRelatedContent(obj){obj.contentId = jsContentId(obj.contentId);


obj.creatorUser = jsRelatedUser(obj.creatorUser);
obj.updaterUser = jsRelatedUser(obj.updaterUser);


obj.format = jsFocusedFormat(obj.format);
return obj;}

function psRelatedContent(obj){obj.contentId = psContentId(obj.contentId);


obj.creatorUser = psRelatedUser(obj.creatorUser);
obj.updaterUser = psRelatedUser(obj.updaterUser);


obj.format = psFocusedFormat(obj.format);
return obj;}

function jsFocusedContent(obj){obj.contentId = jsContentId(obj.contentId);


obj.creatorUser = jsRelatedUser(obj.creatorUser);
obj.updaterUser = jsRelatedUser(obj.updaterUser);


obj.format = jsFocusedFormat(obj.format);

                        if (obj.draft instanceof Data_Maybe.Just) {
                            obj.draft = obj.draft.value0; 
                        } else {
                            obj.draft = null;
                        }
                    
return obj;}

function psFocusedContent(obj){obj.contentId = psContentId(obj.contentId);


obj.creatorUser = psRelatedUser(obj.creatorUser);
obj.updaterUser = psRelatedUser(obj.updaterUser);


obj.format = psFocusedFormat(obj.format);

                    if (obj.draft) {
                        obj.draft = new Data_Maybe.Just(obj.draft);
                    } else {
                        obj.draft = Data_Maybe.Nothing.value;
                    }
                
return obj;}

function jsRelatedContentCommit(obj){obj.commitId = jsContentCommitId(obj.commitId);


                        if (obj.basedCommitId instanceof Data_Maybe.Just) {
                            obj.basedCommitId = obj.basedCommitId.value0; 
                        } else {
                            obj.basedCommitId = null;
                        }
                    
obj.committerUser = jsRelatedUser(obj.committerUser);
obj.contentId = jsContentId(obj.contentId);return obj;}

function psRelatedContentCommit(obj){obj.commitId = psContentCommitId(obj.commitId);


                    if (obj.basedCommitId) {
                        obj.basedCommitId = new Data_Maybe.Just(obj.basedCommitId);
                    } else {
                        obj.basedCommitId = Data_Maybe.Nothing.value;
                    }
                
obj.committerUser = psRelatedUser(obj.committerUser);
obj.contentId = psContentId(obj.contentId);return obj;}

function jsFocusedContentCommit(obj){obj.commitId = jsContentCommitId(obj.commitId);


                        if (obj.basedCommitId instanceof Data_Maybe.Just) {
                            obj.basedCommitId = obj.basedCommitId.value0; 
                        } else {
                            obj.basedCommitId = null;
                        }
                    
obj.committerUser = jsRelatedUser(obj.committerUser);
obj.contentId = jsContentId(obj.contentId);return obj;}

function psFocusedContentCommit(obj){obj.commitId = psContentCommitId(obj.commitId);


                    if (obj.basedCommitId) {
                        obj.basedCommitId = new Data_Maybe.Just(obj.basedCommitId);
                    } else {
                        obj.basedCommitId = Data_Maybe.Nothing.value;
                    }
                
obj.committerUser = psRelatedUser(obj.committerUser);
obj.contentId = psContentId(obj.contentId);return obj;}

function jsRelatedContentDraft(obj){obj.draftId = jsContentDraftId(obj.draftId);



                        if (obj.basedCommitId instanceof Data_Maybe.Just) {
                            obj.basedCommitId = obj.basedCommitId.value0; 
                        } else {
                            obj.basedCommitId = null;
                        }
                    


                        if (obj.contentId instanceof Data_Maybe.Just) {
                            obj.contentId = obj.contentId.value0; 
                        } else {
                            obj.contentId = null;
                        }
                    
obj.format = jsFocusedFormat(obj.format);
obj.changeType = jsContentChangeType(obj.changeType);return obj;}

function psRelatedContentDraft(obj){obj.draftId = psContentDraftId(obj.draftId);



                    if (obj.basedCommitId) {
                        obj.basedCommitId = new Data_Maybe.Just(obj.basedCommitId);
                    } else {
                        obj.basedCommitId = Data_Maybe.Nothing.value;
                    }
                


                    if (obj.contentId) {
                        obj.contentId = new Data_Maybe.Just(obj.contentId);
                    } else {
                        obj.contentId = Data_Maybe.Nothing.value;
                    }
                
obj.format = psFocusedFormat(obj.format);
obj.changeType = psContentChangeType(obj.changeType);return obj;}

function jsFocusedContentDraft(obj){obj.draftId = jsContentDraftId(obj.draftId);



                        if (obj.basedCommitId instanceof Data_Maybe.Just) {
                            obj.basedCommitId = obj.basedCommitId.value0; 
                        } else {
                            obj.basedCommitId = null;
                        }
                    
obj.data = jsObjectLiteral(obj.data);

                        if (obj.contentId instanceof Data_Maybe.Just) {
                            obj.contentId = obj.contentId.value0; 
                        } else {
                            obj.contentId = null;
                        }
                    

                            obj.materialDrafts = obj.materialDrafts.map(x => {
                                x = jsFocusedMaterialDraft(x);
                                return x;
                            });
                        
obj.format = jsFocusedFormat(obj.format);
obj.changeType = jsContentChangeType(obj.changeType);return obj;}

function psFocusedContentDraft(obj){obj.draftId = psContentDraftId(obj.draftId);



                    if (obj.basedCommitId) {
                        obj.basedCommitId = new Data_Maybe.Just(obj.basedCommitId);
                    } else {
                        obj.basedCommitId = Data_Maybe.Nothing.value;
                    }
                
obj.data = psObjectLiteral(obj.data);

                    if (obj.contentId) {
                        obj.contentId = new Data_Maybe.Just(obj.contentId);
                    } else {
                        obj.contentId = Data_Maybe.Nothing.value;
                    }
                

                        obj.materialDrafts = obj.materialDrafts.map(x => {
                            x = psFocusedMaterialDraft(x);
                            return x;
                        });
                    
obj.format = psFocusedFormat(obj.format);
obj.changeType = psContentChangeType(obj.changeType);return obj;}

function jsContentNodeType(obj) {
                if(obj instanceof E.ContentNodeTypeCommitted) {
                    return "committed";
                }
            
                if(obj instanceof E.ContentNodeTypePresent) {
                    return "present";
                }
            
                if(obj instanceof E.ContentNodeTypeCanceld) {
                    return "canceled";
                }
            }

function psContentNodeType(str) {switch(str){
case "committed":
return (E.ContentNodeTypeCommitted || { value: null }).value;
case "present":
return (E.ContentNodeTypePresent || { value: null }).value;
case "canceled":
return (E.ContentNodeTypeCanceld || { value: null }).value;
}}

function jsContentNodeTarget(obj) {
                if(obj instanceof E.ContentNodeTargetContent) {
                    return "content";
                }
            
                if(obj instanceof E.ContentNodeTargetMaterial) {
                    return "material";
                }
            
                if(obj instanceof E.ContentNodeTargetWhole) {
                    return "whole";
                }
            }

function psContentNodeTarget(str) {switch(str){
case "content":
return (E.ContentNodeTargetContent || { value: null }).value;
case "material":
return (E.ContentNodeTargetMaterial || { value: null }).value;
case "whole":
return (E.ContentNodeTargetWhole || { value: null }).value;
}}

function jsContentNode(obj){obj.type = jsContentNodeType(obj.type);
obj.target = jsContentNodeTarget(obj.target);
obj.user = jsRelatedUser(obj.user);

                        if (obj.editingId instanceof Data_Maybe.Just) {
                            obj.editingId = obj.editingId.value0; 
                        } else {
                            obj.editingId = null;
                        }
                    
obj.rivision = jsRelatedContentRevision(obj.rivision);return obj;}

function psContentNode(obj){obj.type = psContentNodeType(obj.type);
obj.target = psContentNodeTarget(obj.target);
obj.user = psRelatedUser(obj.user);

                    if (obj.editingId) {
                        obj.editingId = new Data_Maybe.Just(obj.editingId);
                    } else {
                        obj.editingId = Data_Maybe.Nothing.value;
                    }
                
obj.rivision = psRelatedContentRevision(obj.rivision);return obj;}

const jsContentRevisionId = x => x;


const psContentRevisionId = x => x;


const jsContentWholeRevisionId = x => x;


const psContentWholeRevisionId = x => x;


function jsContentRevisionSource(obj) {
                if(obj instanceof E.ContentRevisionSourceCommit) {
                    return "commit";
                }
            
                if(obj instanceof E.ContentRevisionSourceSnapshot) {
                    return "snapshot";
                }
            
                if(obj instanceof E.ContentRevisionSourceEditing) {
                    return "editing";
                }
            
                if(obj instanceof E.ContentRevisionSourceDraft) {
                    return "draft";
                }
            }

function psContentRevisionSource(str) {switch(str){
case "commit":
return (E.ContentRevisionSourceCommit || { value: null }).value;
case "snapshot":
return (E.ContentRevisionSourceSnapshot || { value: null }).value;
case "editing":
return (E.ContentRevisionSourceEditing || { value: null }).value;
case "draft":
return (E.ContentRevisionSourceDraft || { value: null }).value;
}}

function jsContentRivisionStructure(obj){obj.source = jsContentRevisionSource(obj.source);
return obj;}

function psContentRivisionStructure(obj){obj.source = psContentRevisionSource(obj.source);
return obj;}

function jsContentWholeRevisionStructure(obj){obj.content = jsContentRevisionId(obj.content);

                            obj.materials = obj.materials.map(x => {
                                x = jsMaterialRevisionId(x);
                                return x;
                            });
                        return obj;}

function psContentWholeRevisionStructure(obj){obj.content = psContentRevisionId(obj.content);

                        obj.materials = obj.materials.map(x => {
                            x = psMaterialRevisionId(x);
                            return x;
                        });
                    return obj;}

function jsRelatedContentRevision(obj){obj.snapshotId = jsContentWholeRevisionId(obj.snapshotId);
return obj;}

function psRelatedContentRevision(obj){obj.snapshotId = psContentWholeRevisionId(obj.snapshotId);
return obj;}

function jsFocusedContentRevision(obj){
obj.data = jsObjectLiteral(obj.data);

                            obj.materials = obj.materials.map(x => {
                                x = jsFocusedMaterialRevision(x);
                                return x;
                            });
                        return obj;}

function psFocusedContentRevision(obj){
obj.data = psObjectLiteral(obj.data);

                        obj.materials = obj.materials.map(x => {
                            x = psFocusedMaterialRevision(x);
                            return x;
                        });
                    return obj;}

function jsRelatedFormat(obj){obj.formatId = jsFormatId(obj.formatId);
obj.displayId = jsFormatDisplayId(obj.displayId);


obj.space = jsRelatedSpace(obj.space);
obj.usage = jsFormatUsage(obj.usage);

obj.creatorUser = jsRelatedUser(obj.creatorUser);

obj.updaterUser = jsRelatedUser(obj.updaterUser);

                        if (obj.semanticId instanceof Data_Maybe.Just) {
                            obj.semanticId = obj.semanticId.value0; 
                        } else {
                            obj.semanticId = null;
                        }
                    
obj.currentStructure = jsRelatedStructure(obj.currentStructure);return obj;}

function psRelatedFormat(obj){obj.formatId = psFormatId(obj.formatId);
obj.displayId = psFormatDisplayId(obj.displayId);


obj.space = psRelatedSpace(obj.space);
obj.usage = psFormatUsage(obj.usage);

obj.creatorUser = psRelatedUser(obj.creatorUser);

obj.updaterUser = psRelatedUser(obj.updaterUser);

                    if (obj.semanticId) {
                        obj.semanticId = new Data_Maybe.Just(obj.semanticId);
                    } else {
                        obj.semanticId = Data_Maybe.Nothing.value;
                    }
                
obj.currentStructure = psRelatedStructure(obj.currentStructure);return obj;}

function jsFocusedFormat(obj){obj.formatId = jsFormatId(obj.formatId);
obj.displayId = jsFormatDisplayId(obj.displayId);


obj.space = jsRelatedSpace(obj.space);
obj.usage = jsFormatUsage(obj.usage);

obj.creatorUser = jsRelatedUser(obj.creatorUser);

obj.updaterUser = jsRelatedUser(obj.updaterUser);
obj.currentStructure = jsFocusedStructure(obj.currentStructure);

                        if (obj.semanticId instanceof Data_Maybe.Just) {
                            obj.semanticId = obj.semanticId.value0; 
                        } else {
                            obj.semanticId = null;
                        }
                    return obj;}

function psFocusedFormat(obj){obj.formatId = psFormatId(obj.formatId);
obj.displayId = psFormatDisplayId(obj.displayId);


obj.space = psRelatedSpace(obj.space);
obj.usage = psFormatUsage(obj.usage);

obj.creatorUser = psRelatedUser(obj.creatorUser);

obj.updaterUser = psRelatedUser(obj.updaterUser);
obj.currentStructure = psFocusedStructure(obj.currentStructure);

                    if (obj.semanticId) {
                        obj.semanticId = new Data_Maybe.Just(obj.semanticId);
                    } else {
                        obj.semanticId = Data_Maybe.Nothing.value;
                    }
                return obj;}

function jsIntactMetaProperty(obj){obj.id = jsMetaPropertyId(obj.id);
obj.type = jsMetaPropertyType(obj.type);return obj;}

function psIntactMetaProperty(obj){obj.id = psMetaPropertyId(obj.id);
obj.type = psMetaPropertyType(obj.type);return obj;}

function jsPropertyInfo(obj){

                        if (obj.fieldName instanceof Data_Maybe.Just) {
                            obj.fieldName = obj.fieldName.value0; 
                        } else {
                            obj.fieldName = null;
                        }
                    



                        if (obj.semantic instanceof Data_Maybe.Just) {
                            obj.semantic = obj.semantic.value0; 
                        } else {
                            obj.semantic = null;
                        }
                    
obj.type = jsType(obj.type);

                            obj.metaProperties = obj.metaProperties.map(x => {
                                x = jsIntactMetaProperty(x);
                                return x;
                            });
                        return obj;}

function psPropertyInfo(obj){

                    if (obj.fieldName) {
                        obj.fieldName = new Data_Maybe.Just(obj.fieldName);
                    } else {
                        obj.fieldName = Data_Maybe.Nothing.value;
                    }
                



                    if (obj.semantic) {
                        obj.semantic = new Data_Maybe.Just(obj.semantic);
                    } else {
                        obj.semantic = Data_Maybe.Nothing.value;
                    }
                
obj.type = psType(obj.type);

                        obj.metaProperties = obj.metaProperties.map(x => {
                            x = psIntactMetaProperty(x);
                            return x;
                        });
                    return obj;}

function jsEnumerator(obj){


                        if (obj.fieldName instanceof Data_Maybe.Just) {
                            obj.fieldName = obj.fieldName.value0; 
                        } else {
                            obj.fieldName = null;
                        }
                    return obj;}

function psEnumerator(obj){


                    if (obj.fieldName) {
                        obj.fieldName = new Data_Maybe.Just(obj.fieldName);
                    } else {
                        obj.fieldName = Data_Maybe.Nothing.value;
                    }
                return obj;}

function jsType(obj) {
                if(obj instanceof E.IntType) {
                    return {
                        name: "integer",
                        
                    };
                }
            
                if(obj instanceof E.BoolType) {
                    return {
                        name: "boolean",
                        
                    };
                }
            
                if(obj instanceof E.StringType) {
                    return {
                        name: "string",
                        
                    };
                }
            
                if(obj instanceof E.FormatType) {
                    return {
                        name: "format",
                        
                    };
                }
            
                if(obj instanceof E.SpaceType) {
                    return {
                        name: "space",
                        
                    };
                }
            
                if(obj instanceof E.ContentType) {
                    return {
                        name: "content",
                        format: obj.value0
                    };
                }
            
                if(obj instanceof E.UrlType) {
                    return {
                        name: "url",
                        
                    };
                }
            
                if(obj instanceof E.ObjectType) {
                    return {
                        name: "object",
                        properties: obj.value0
                    };
                }
            
                if(obj instanceof E.TextType) {
                    return {
                        name: "text",
                        
                    };
                }
            
                if(obj instanceof E.ArrayType) {
                    return {
                        name: "array",
                        subType: obj.value0
                    };
                }
            
                if(obj instanceof E.CodeType) {
                    return {
                        name: "code",
                        language: obj.value0
                    };
                }
            
                if(obj instanceof E.EnumType) {
                    return {
                        name: "enumerator",
                        enumerators: obj.value0
                    };
                }
            
                if(obj instanceof E.DocumentType) {
                    return {
                        name: "document",
                        
                    };
                }
            
                if(obj instanceof E.ImageType) {
                    return {
                        name: "image",
                        
                    };
                }
            
                if(obj instanceof E.EntityType) {
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
case "format":
return new E.FormatType();
case "space":
return new E.SpaceType();
case "content":
return new E.ContentType(obj.format);
case "url":
return new E.UrlType();
case "object":
return new E.ObjectType(obj.properties);
case "text":
return new E.TextType();
case "array":
return new E.ArrayType(obj.subType);
case "code":
return new E.CodeType(obj.language);
case "enumerator":
return new E.EnumType(obj.enumerators);
case "document":
return new E.DocumentType();
case "image":
return new E.ImageType();
case "entity":
return new E.EntityType(obj.format);
}}

function jsRelatedStructure(obj){obj.formatId = jsFormatId(obj.formatId);
obj.structureId = jsStructureId(obj.structureId);


                        if (obj.title instanceof Data_Maybe.Just) {
                            obj.title = obj.title.value0; 
                        } else {
                            obj.title = null;
                        }
                    
return obj;}

function psRelatedStructure(obj){obj.formatId = psFormatId(obj.formatId);
obj.structureId = psStructureId(obj.structureId);


                    if (obj.title) {
                        obj.title = new Data_Maybe.Just(obj.title);
                    } else {
                        obj.title = Data_Maybe.Nothing.value;
                    }
                
return obj;}

function jsFocusedStructure(obj){obj.structureId = jsStructureId(obj.structureId);


                        if (obj.title instanceof Data_Maybe.Just) {
                            obj.title = obj.title.value0; 
                        } else {
                            obj.title = null;
                        }
                    

                            obj.properties = obj.properties.map(x => {
                                x = jsPropertyInfo(x);
                                return x;
                            });
                        
return obj;}

function psFocusedStructure(obj){obj.structureId = psStructureId(obj.structureId);


                    if (obj.title) {
                        obj.title = new Data_Maybe.Just(obj.title);
                    } else {
                        obj.title = Data_Maybe.Nothing.value;
                    }
                

                        obj.properties = obj.properties.map(x => {
                            x = psPropertyInfo(x);
                            return x;
                        });
                    
return obj;}

function jsRelatedMaterial(obj){obj.materialId = jsMaterialId(obj.materialId);

                        if (obj.contentId instanceof Data_Maybe.Just) {
                            obj.contentId = obj.contentId.value0; 
                        } else {
                            obj.contentId = null;
                        }
                    

obj.materialType = jsMaterialType(obj.materialType);

obj.creatorUser = jsRelatedUser(obj.creatorUser);

obj.updaterUser = jsRelatedUser(obj.updaterUser);return obj;}

function psRelatedMaterial(obj){obj.materialId = psMaterialId(obj.materialId);

                    if (obj.contentId) {
                        obj.contentId = new Data_Maybe.Just(obj.contentId);
                    } else {
                        obj.contentId = Data_Maybe.Nothing.value;
                    }
                

obj.materialType = psMaterialType(obj.materialType);

obj.creatorUser = psRelatedUser(obj.creatorUser);

obj.updaterUser = psRelatedUser(obj.updaterUser);return obj;}

function jsFocusedMaterial(obj){obj.materialId = jsMaterialId(obj.materialId);

                        if (obj.contentId instanceof Data_Maybe.Just) {
                            obj.contentId = obj.contentId.value0; 
                        } else {
                            obj.contentId = null;
                        }
                    

obj.materialType = jsMaterialType(obj.materialType);

obj.creatorUser = jsRelatedUser(obj.creatorUser);

obj.updaterUser = jsRelatedUser(obj.updaterUser);


                        if (obj.draft instanceof Data_Maybe.Just) {
                            obj.draft = obj.draft.value0; 
                        } else {
                            obj.draft = null;
                        }
                    return obj;}

function psFocusedMaterial(obj){obj.materialId = psMaterialId(obj.materialId);

                    if (obj.contentId) {
                        obj.contentId = new Data_Maybe.Just(obj.contentId);
                    } else {
                        obj.contentId = Data_Maybe.Nothing.value;
                    }
                

obj.materialType = psMaterialType(obj.materialType);

obj.creatorUser = psRelatedUser(obj.creatorUser);

obj.updaterUser = psRelatedUser(obj.updaterUser);


                    if (obj.draft) {
                        obj.draft = new Data_Maybe.Just(obj.draft);
                    } else {
                        obj.draft = Data_Maybe.Nothing.value;
                    }
                return obj;}

function jsRelatedMaterialCommit(obj){obj.commitId = jsMaterialCommitId(obj.commitId);



                        if (obj.basedCommitId instanceof Data_Maybe.Just) {
                            obj.basedCommitId = obj.basedCommitId.value0; 
                        } else {
                            obj.basedCommitId = null;
                        }
                    
obj.committerUser = jsRelatedUser(obj.committerUser);return obj;}

function psRelatedMaterialCommit(obj){obj.commitId = psMaterialCommitId(obj.commitId);



                    if (obj.basedCommitId) {
                        obj.basedCommitId = new Data_Maybe.Just(obj.basedCommitId);
                    } else {
                        obj.basedCommitId = Data_Maybe.Nothing.value;
                    }
                
obj.committerUser = psRelatedUser(obj.committerUser);return obj;}

function jsFocusedMaterialCommit(obj){obj.commitId = jsMaterialCommitId(obj.commitId);


return obj;}

function psFocusedMaterialCommit(obj){obj.commitId = psMaterialCommitId(obj.commitId);


return obj;}

function jsRelatedMaterialDraft(obj){obj.draftId = jsMaterialDraftId(obj.draftId);


return obj;}

function psRelatedMaterialDraft(obj){obj.draftId = psMaterialDraftId(obj.draftId);


return obj;}

function jsFocusedMaterialDraft(obj){obj.draftId = jsMaterialDraftId(obj.draftId);




                        if (obj.contentDraftId instanceof Data_Maybe.Just) {
                            obj.contentDraftId = obj.contentDraftId.value0; 
                        } else {
                            obj.contentDraftId = null;
                        }
                    

                        if (obj.material instanceof Data_Maybe.Just) {
                            obj.material = obj.material.value0; 
                        } else {
                            obj.material = null;
                        }
                    

                        if (obj.basedCommitId instanceof Data_Maybe.Just) {
                            obj.basedCommitId = obj.basedCommitId.value0; 
                        } else {
                            obj.basedCommitId = null;
                        }
                    
return obj;}

function psFocusedMaterialDraft(obj){obj.draftId = psMaterialDraftId(obj.draftId);




                    if (obj.contentDraftId) {
                        obj.contentDraftId = new Data_Maybe.Just(obj.contentDraftId);
                    } else {
                        obj.contentDraftId = Data_Maybe.Nothing.value;
                    }
                

                    if (obj.material) {
                        obj.material = new Data_Maybe.Just(obj.material);
                    } else {
                        obj.material = Data_Maybe.Nothing.value;
                    }
                

                    if (obj.basedCommitId) {
                        obj.basedCommitId = new Data_Maybe.Just(obj.basedCommitId);
                    } else {
                        obj.basedCommitId = Data_Maybe.Nothing.value;
                    }
                
return obj;}

function jsMaterialNodeType(obj) {
                if(obj instanceof E.MaterialNodeTypeCommitted) {
                    return "committed";
                }
            
                if(obj instanceof E.MaterialNodeTypePresent) {
                    return "present";
                }
            
                if(obj instanceof E.MaterialNodeTypeCanceld) {
                    return "canceled";
                }
            }

function psMaterialNodeType(str) {switch(str){
case "committed":
return (E.MaterialNodeTypeCommitted || { value: null }).value;
case "present":
return (E.MaterialNodeTypePresent || { value: null }).value;
case "canceled":
return (E.MaterialNodeTypeCanceld || { value: null }).value;
}}

function jsMaterialNode(obj){obj.type = jsMaterialNodeType(obj.type);
obj.user = jsRelatedUser(obj.user);

                        if (obj.editingId instanceof Data_Maybe.Just) {
                            obj.editingId = obj.editingId.value0; 
                        } else {
                            obj.editingId = null;
                        }
                    
obj.revision = jsRelatedMaterialRevision(obj.revision);return obj;}

function psMaterialNode(obj){obj.type = psMaterialNodeType(obj.type);
obj.user = psRelatedUser(obj.user);

                    if (obj.editingId) {
                        obj.editingId = new Data_Maybe.Just(obj.editingId);
                    } else {
                        obj.editingId = Data_Maybe.Nothing.value;
                    }
                
obj.revision = psRelatedMaterialRevision(obj.revision);return obj;}

const jsMaterialRevisionId = x => x;


const psMaterialRevisionId = x => x;


function jsMaterialRevisionSource(obj) {
                if(obj instanceof E.MaterialRevisionSourceCommit) {
                    return "commit";
                }
            
                if(obj instanceof E.MaterialRevisionSourceSnapshot) {
                    return "snapshot";
                }
            
                if(obj instanceof E.MaterialRevisionSourceEditing) {
                    return "editing";
                }
            
                if(obj instanceof E.MaterialRevisionSourceDraft) {
                    return "draft";
                }
            }

function psMaterialRevisionSource(str) {switch(str){
case "commit":
return (E.MaterialRevisionSourceCommit || { value: null }).value;
case "snapshot":
return (E.MaterialRevisionSourceSnapshot || { value: null }).value;
case "editing":
return (E.MaterialRevisionSourceEditing || { value: null }).value;
case "draft":
return (E.MaterialRevisionSourceDraft || { value: null }).value;
}}

function jsMaterialRevisionStructure(obj){obj.source = jsMaterialRevisionSource(obj.source);
return obj;}

function psMaterialRevisionStructure(obj){obj.source = psMaterialRevisionSource(obj.source);
return obj;}

function jsRelatedMaterialRevision(obj){obj.snapshotId = jsMaterialRevisionId(obj.snapshotId);

return obj;}

function psRelatedMaterialRevision(obj){obj.snapshotId = psMaterialRevisionId(obj.snapshotId);

return obj;}

function jsFocusedMaterialRevision(obj){
return obj;}

function psFocusedMaterialRevision(obj){
return obj;}

function jsIntactReactor(obj){obj.reactorId = jsReactorId(obj.reactorId);
obj.container = jsRelatedContainer(obj.container);
obj.state = jsReactorState(obj.state);

                        if (obj.definitionId instanceof Data_Maybe.Just) {
                            obj.definitionId = obj.definitionId.value0; 
                        } else {
                            obj.definitionId = null;
                        }
                    

obj.creatorUser = jsRelatedUser(obj.creatorUser);return obj;}

function psIntactReactor(obj){obj.reactorId = psReactorId(obj.reactorId);
obj.container = psRelatedContainer(obj.container);
obj.state = psReactorState(obj.state);

                    if (obj.definitionId) {
                        obj.definitionId = new Data_Maybe.Just(obj.definitionId);
                    } else {
                        obj.definitionId = Data_Maybe.Nothing.value;
                    }
                

obj.creatorUser = psRelatedUser(obj.creatorUser);return obj;}

function jsRelatedSpace(obj){obj.spaceId = jsSpaceId(obj.spaceId);
obj.displayId = jsSpaceDisplayId(obj.displayId);




                        if (obj.homeUrl instanceof Data_Maybe.Just) {
                            obj.homeUrl = obj.homeUrl.value0; 
                        } else {
                            obj.homeUrl = null;
                        }
                    

obj.membershipMethod = jsMembershipMethod(obj.membershipMethod);
obj.defaultAuthority = jsSpaceAuth(obj.defaultAuthority);return obj;}

function psRelatedSpace(obj){obj.spaceId = psSpaceId(obj.spaceId);
obj.displayId = psSpaceDisplayId(obj.displayId);




                    if (obj.homeUrl) {
                        obj.homeUrl = new Data_Maybe.Just(obj.homeUrl);
                    } else {
                        obj.homeUrl = Data_Maybe.Nothing.value;
                    }
                

obj.membershipMethod = psMembershipMethod(obj.membershipMethod);
obj.defaultAuthority = psSpaceAuth(obj.defaultAuthority);return obj;}

function jsFocusedSpace(obj){obj.spaceId = jsSpaceId(obj.spaceId);
obj.displayId = jsSpaceDisplayId(obj.displayId);


obj.creatorUser = jsRelatedUser(obj.creatorUser);


                        if (obj.homeUrl instanceof Data_Maybe.Just) {
                            obj.homeUrl = obj.homeUrl.value0; 
                        } else {
                            obj.homeUrl = null;
                        }
                    

obj.membershipMethod = jsMembershipMethod(obj.membershipMethod);
obj.defaultAuthority = jsSpaceAuth(obj.defaultAuthority);return obj;}

function psFocusedSpace(obj){obj.spaceId = psSpaceId(obj.spaceId);
obj.displayId = psSpaceDisplayId(obj.displayId);


obj.creatorUser = psRelatedUser(obj.creatorUser);


                    if (obj.homeUrl) {
                        obj.homeUrl = new Data_Maybe.Just(obj.homeUrl);
                    } else {
                        obj.homeUrl = Data_Maybe.Nothing.value;
                    }
                

obj.membershipMethod = psMembershipMethod(obj.membershipMethod);
obj.defaultAuthority = psSpaceAuth(obj.defaultAuthority);return obj;}

function jsIntactSpaceMember(obj){obj.user = jsRelatedUser(obj.user);

obj.type = jsMemberType(obj.type);return obj;}

function psIntactSpaceMember(obj){obj.user = psRelatedUser(obj.user);

obj.type = psMemberType(obj.type);return obj;}

function jsIntactSpaceMembershipApplication(obj){obj.user = jsRelatedUser(obj.user);
return obj;}

function psIntactSpaceMembershipApplication(obj){obj.user = psRelatedUser(obj.user);
return obj;}

function jsIntactAccount(obj){obj.userId = jsUserId(obj.userId);
obj.displayId = jsUserDisplayId(obj.displayId);


                        if (obj.iconUrl instanceof Data_Maybe.Just) {
                            obj.iconUrl = obj.iconUrl.value0; 
                        } else {
                            obj.iconUrl = null;
                        }
                    

return obj;}

function psIntactAccount(obj){obj.userId = psUserId(obj.userId);
obj.displayId = psUserDisplayId(obj.displayId);


                    if (obj.iconUrl) {
                        obj.iconUrl = new Data_Maybe.Just(obj.iconUrl);
                    } else {
                        obj.iconUrl = Data_Maybe.Nothing.value;
                    }
                

return obj;}

function jsRelatedUser(obj){obj.userId = jsUserId(obj.userId);
obj.displayId = jsUserDisplayId(obj.displayId);


                        if (obj.iconUrl instanceof Data_Maybe.Just) {
                            obj.iconUrl = obj.iconUrl.value0; 
                        } else {
                            obj.iconUrl = null;
                        }
                    
return obj;}

function psRelatedUser(obj){obj.userId = psUserId(obj.userId);
obj.displayId = psUserDisplayId(obj.displayId);


                    if (obj.iconUrl) {
                        obj.iconUrl = new Data_Maybe.Just(obj.iconUrl);
                    } else {
                        obj.iconUrl = Data_Maybe.Nothing.value;
                    }
                
return obj;}

function jsFocusedUser(obj){obj.userId = jsUserId(obj.userId);
obj.displayId = jsUserDisplayId(obj.displayId);


                        if (obj.iconUrl instanceof Data_Maybe.Just) {
                            obj.iconUrl = obj.iconUrl.value0; 
                        } else {
                            obj.iconUrl = null;
                        }
                    
return obj;}

function psFocusedUser(obj){obj.userId = psUserId(obj.userId);
obj.displayId = psUserDisplayId(obj.displayId);


                    if (obj.iconUrl) {
                        obj.iconUrl = new Data_Maybe.Just(obj.iconUrl);
                    } else {
                        obj.iconUrl = Data_Maybe.Nothing.value;
                    }
                
return obj;}

exports.__getContainers = (() => {return async function (spaceId) {
                let argObject = { spaceId };
                argObject.spaceId = jsSpaceId(argObject.spaceId);
                argObject = [ argObject.spaceId ];
                let result = await requestApi("getContainers", argObject);
                
                        result = result.map(x => {
                            x = psRelatedContainer(x);
                            return x;
                        });
                    
                return result;};})();

function jsMaterialCompositionType(obj) {
                if(obj instanceof E.Creation) {
                    return "creation";
                }
            
                if(obj instanceof E.Move) {
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
                if(obj instanceof E.CreationMaterialComposition) {
                    return {
                        type: "creation",
                        propertyId: obj.value0,data: obj.value1
                    };
                }
            
                if(obj instanceof E.MoveMaterialComposition) {
                    return {
                        type: "move",
                        materialId: obj.value0
                    };
                }
            }

function psMaterialComposition(obj) {switch(obj.type){case "creation":
return new E.CreationMaterialComposition(obj.propertyId,obj.data);
case "move":
return new E.MoveMaterialComposition(obj.materialId);
}}

exports.__startContentEditing = (() => {return (contentId) => {return async function (basedCommitId) {
                let argObject = { contentId,basedCommitId };
                argObject.contentId = jsContentId(argObject.contentId);
                        if (argObject.basedCommitId instanceof Data_Maybe.Just) {
                            argObject.basedCommitId = argObject.basedCommitId.value0; 
                        } else {
                            argObject.basedCommitId = null;
                        }
                    
                argObject = [ argObject.contentId,argObject.basedCommitId ];
                let result = await requestApi("startContentEditing", argObject);
                result = psContentDraftId(result);
                return result;}};})();

exports.__createNewContentDraft = (() => {return (structureId) => {return (spaceId) => {return async function (data) {
                let argObject = { structureId,spaceId,data };
                argObject.structureId = jsStructureId(argObject.structureId);
                        if (argObject.spaceId instanceof Data_Maybe.Just) {
                            argObject.spaceId = argObject.spaceId.value0; 
                        } else {
                            argObject.spaceId = null;
                        }
                    
                        if (argObject.data instanceof Data_Maybe.Just) {
                            argObject.data = argObject.data.value0; 
                        } else {
                            argObject.data = null;
                        }
                    
                argObject = [ argObject.structureId,argObject.spaceId,argObject.data ];
                let result = await requestApi("createNewContentDraft", argObject);
                result = psContentDraftId(result);
                return result;}}};})();

exports.__editContentDraft = (() => {return (contentDraftId) => {return async function (data) {
                let argObject = { contentDraftId,data };
                argObject.contentDraftId = jsContentDraftId(argObject.contentDraftId);
                argObject = [ argObject.contentDraftId,argObject.data ];
                let result = await requestApi("editContentDraft", argObject);
                
                    if (result) {
                        result = new Data_Maybe.Just(result);
                    } else {
                        result = Data_Maybe.Nothing.value;
                    }
                
                return result;}};})();

exports.__commitContent = (() => {return (contentDraftId) => {return async function (data) {
                let argObject = { contentDraftId,data };
                argObject.contentDraftId = jsContentDraftId(argObject.contentDraftId);
                argObject = [ argObject.contentDraftId,argObject.data ];
                let result = await requestApi("commitContent", argObject);
                
                return result;}};})();

exports.__getContent = (() => {return async function (contentId) {
                let argObject = { contentId };
                argObject.contentId = jsContentId(argObject.contentId);
                argObject = [ argObject.contentId ];
                let result = await requestApi("getContent", argObject);
                result = psFocusedContent(result);
                return result;};})();

exports.__getRelatedContent = (() => {return async function (contentId) {
                let argObject = { contentId };
                argObject.contentId = jsContentId(argObject.contentId);
                argObject = [ argObject.contentId ];
                let result = await requestApi("getRelatedContent", argObject);
                result = psRelatedContent(result);
                return result;};})();

exports.__getContents = (() => {return (spaceId) => {return async function (formatId) {
                let argObject = { spaceId,formatId };
                argObject.spaceId = jsSpaceId(argObject.spaceId);argObject.formatId = jsFormatId(argObject.formatId);
                argObject = [ argObject.spaceId,argObject.formatId ];
                let result = await requestApi("getContents", argObject);
                
                        result = result.map(x => {
                            x = psRelatedContent(x);
                            return x;
                        });
                    
                return result;}};})();


                exports.__getMyContentDrafts = (() => { return async function () { 
                    let result = await requestApi("getMyContentDrafts", []);
                    
                        result = result.map(x => {
                            x = psRelatedContentDraft(x);
                            return x;
                        });
                    
                    return result;
                }})()();
            

exports.__getContentDraft = (() => {return async function (draftId) {
                let argObject = { draftId };
                argObject.draftId = jsContentDraftId(argObject.draftId);
                argObject = [ argObject.draftId ];
                let result = await requestApi("getContentDraft", argObject);
                result = psFocusedContentDraft(result);
                return result;};})();

exports.__getContentCommits = (() => {return async function (contentId) {
                let argObject = { contentId };
                argObject.contentId = jsContentId(argObject.contentId);
                argObject = [ argObject.contentId ];
                let result = await requestApi("getContentCommits", argObject);
                
                        result = result.map(x => {
                            x = psRelatedContentCommit(x);
                            return x;
                        });
                    
                return result;};})();

exports.__getContentEditingNodes = (() => {return async function (draftId) {
                let argObject = { draftId };
                argObject.draftId = jsContentDraftId(argObject.draftId);
                argObject = [ argObject.draftId ];
                let result = await requestApi("getContentEditingNodes", argObject);
                
                        result = result.map(x => {
                            x = psContentNode(x);
                            return x;
                        });
                    
                return result;};})();

exports.__getContentRevision = (() => {return async function (revisionId) {
                let argObject = { revisionId };
                argObject.revisionId = jsContentWholeRevisionId(argObject.revisionId);
                argObject = [ argObject.revisionId ];
                let result = await requestApi("getContentRevision", argObject);
                result = psFocusedContentRevision(result);
                return result;};})();

exports.__getContentCommit = (() => {return async function (commitId) {
                let argObject = { commitId };
                argObject.commitId = jsContentCommitId(argObject.commitId);
                argObject = [ argObject.commitId ];
                let result = await requestApi("getContentCommit", argObject);
                result = psFocusedContentCommit(result);
                return result;};})();


                exports.__createFormat = (() => {return async function (argObject) {
                    argObject.spaceId = jsSpaceId(argObject.spaceId);argObject.usage = jsFormatUsage(argObject.usage);
                            argObject.properties = argObject.properties.map(x => {
                                x = jsPropertyInfo(x);
                                return x;
                            });
                        
                    let args = [ argObject.spaceId,argObject.displayName,argObject.description,argObject.usage,argObject.properties ];
                    let result = await requestApi("createFormat", args);
                    result = psFormatDisplayId(result);
                    return result;
                } })();
            

exports.__getFormat = (() => {return async function (formatDisplayId) {
                let argObject = { formatDisplayId };
                argObject.formatDisplayId = jsFormatDisplayId(argObject.formatDisplayId);
                argObject = [ argObject.formatDisplayId ];
                let result = await requestApi("getFormat", argObject);
                result = psFocusedFormat(result);
                return result;};})();

exports.__getFocusedFormat = (() => {return async function (formatId) {
                let argObject = { formatId };
                argObject.formatId = jsFormatId(argObject.formatId);
                argObject = [ argObject.formatId ];
                let result = await requestApi("getFocusedFormat", argObject);
                result = psFocusedFormat(result);
                return result;};})();

exports.__getRelatedFormat = (() => {return async function (formatId) {
                let argObject = { formatId };
                argObject.formatId = jsFormatId(argObject.formatId);
                argObject = [ argObject.formatId ];
                let result = await requestApi("getRelatedFormat", argObject);
                result = psRelatedFormat(result);
                return result;};})();

exports.__getFocusedFormatByStructure = (() => {return async function (structureId) {
                let argObject = { structureId };
                argObject.structureId = jsStructureId(argObject.structureId);
                argObject = [ argObject.structureId ];
                let result = await requestApi("getFocusedFormatByStructure", argObject);
                result = psFocusedFormat(result);
                return result;};})();

exports.__getRelatedStructure = (() => {return async function (structureId) {
                let argObject = { structureId };
                argObject.structureId = jsStructureId(argObject.structureId);
                argObject = [ argObject.structureId ];
                let result = await requestApi("getRelatedStructure", argObject);
                result = psRelatedStructure(result);
                return result;};})();

exports.__getFormats = (() => {return async function (spaceId) {
                let argObject = { spaceId };
                argObject.spaceId = jsSpaceId(argObject.spaceId);
                argObject = [ argObject.spaceId ];
                let result = await requestApi("getFormats", argObject);
                
                        result = result.map(x => {
                            x = psRelatedFormat(x);
                            return x;
                        });
                    
                return result;};})();

exports.__getStructures = (() => {return async function (formatId) {
                let argObject = { formatId };
                argObject.formatId = jsFormatId(argObject.formatId);
                argObject = [ argObject.formatId ];
                let result = await requestApi("getStructures", argObject);
                
                        result = result.map(x => {
                            x = psRelatedStructure(x);
                            return x;
                        });
                    
                return result;};})();

exports.__updateFormatStructure = (() => {return (formatId) => {return async function (properties) {
                let argObject = { formatId,properties };
                argObject.formatId = jsFormatId(argObject.formatId);
                            argObject.properties = argObject.properties.map(x => {
                                x = jsPropertyInfo(x);
                                return x;
                            });
                        
                argObject = [ argObject.formatId,argObject.properties ];
                let result = await requestApi("updateFormatStructure", argObject);
                
                return result;}};})();

exports.__startMaterialEditing = (() => {return (materialId) => {return async function (basedCommitId) {
                let argObject = { materialId,basedCommitId };
                argObject.materialId = jsMaterialId(argObject.materialId);
                        if (argObject.basedCommitId instanceof Data_Maybe.Just) {
                            argObject.basedCommitId = argObject.basedCommitId.value0; 
                        } else {
                            argObject.basedCommitId = null;
                        }
                    
                argObject = [ argObject.materialId,argObject.basedCommitId ];
                let result = await requestApi("startMaterialEditing", argObject);
                result = psRelatedMaterialDraft(result);
                return result;}};})();

exports.__startBlankMaterialEditing = (() => {return (spaceId) => {return async function (type) {
                let argObject = { spaceId,type };
                argObject.spaceId = jsSpaceId(argObject.spaceId);argObject.type = jsMaterialType(argObject.type);
                argObject = [ argObject.spaceId,argObject.type ];
                let result = await requestApi("startBlankMaterialEditing", argObject);
                result = psRelatedMaterialDraft(result);
                return result;}};})();

exports.__editMaterialDraft = (() => {return (materialDraftId) => {return async function (data) {
                let argObject = { materialDraftId,data };
                argObject.materialDraftId = jsMaterialDraftId(argObject.materialDraftId);
                argObject = [ argObject.materialDraftId,argObject.data ];
                let result = await requestApi("editMaterialDraft", argObject);
                
                    if (result) {
                        result = new Data_Maybe.Just(result);
                    } else {
                        result = Data_Maybe.Nothing.value;
                    }
                
                return result;}};})();

exports.__commitMaterial = (() => {return async function (materialDraftId) {
                let argObject = { materialDraftId };
                argObject.materialDraftId = jsMaterialDraftId(argObject.materialDraftId);
                argObject = [ argObject.materialDraftId ];
                let result = await requestApi("commitMaterial", argObject);
                result = psRelatedMaterialRevision(result);
                return result;};})();

exports.__getMaterial = (() => {return async function (materialId) {
                let argObject = { materialId };
                argObject.materialId = jsMaterialId(argObject.materialId);
                argObject = [ argObject.materialId ];
                let result = await requestApi("getMaterial", argObject);
                result = psFocusedMaterial(result);
                return result;};})();


                exports.__getMyMaterialDrafts = (() => { return async function () { 
                    let result = await requestApi("getMyMaterialDrafts", []);
                    
                        result = result.map(x => {
                            x = psRelatedMaterialDraft(x);
                            return x;
                        });
                    
                    return result;
                }})()();
            

exports.__getMaterialDraft = (() => {return async function (draftId) {
                let argObject = { draftId };
                argObject.draftId = jsMaterialDraftId(argObject.draftId);
                argObject = [ argObject.draftId ];
                let result = await requestApi("getMaterialDraft", argObject);
                result = psFocusedMaterialDraft(result);
                return result;};})();

exports.__getMaterialCommits = (() => {return async function (materialId) {
                let argObject = { materialId };
                argObject.materialId = jsMaterialId(argObject.materialId);
                argObject = [ argObject.materialId ];
                let result = await requestApi("getMaterialCommits", argObject);
                
                        result = result.map(x => {
                            x = psRelatedMaterialCommit(x);
                            return x;
                        });
                    
                return result;};})();

exports.__getMaterialEditingNodes = (() => {return async function (draftId) {
                let argObject = { draftId };
                argObject.draftId = jsMaterialDraftId(argObject.draftId);
                argObject = [ argObject.draftId ];
                let result = await requestApi("getMaterialEditingNodes", argObject);
                
                        result = result.map(x => {
                            x = psMaterialNode(x);
                            return x;
                        });
                    
                return result;};})();

exports.__getMaterialRevision = (() => {return async function (revisionId) {
                let argObject = { revisionId };
                argObject.revisionId = jsMaterialRevisionId(argObject.revisionId);
                argObject = [ argObject.revisionId ];
                let result = await requestApi("getMaterialRevision", argObject);
                result = psFocusedMaterialRevision(result);
                return result;};})();

exports.__getMaterialCommit = (() => {return async function (commitId) {
                let argObject = { commitId };
                argObject.commitId = jsMaterialCommitId(argObject.commitId);
                argObject = [ argObject.commitId ];
                let result = await requestApi("getMaterialCommit", argObject);
                result = psFocusedMaterialCommit(result);
                return result;};})();


                exports.__createSpace = (() => {return async function (argObject) {
                    
                    let args = [ argObject.displayId,argObject.displayName,argObject.description ];
                    let result = await requestApi("createSpace", args);
                    result = psSpaceDisplayId(result);
                    return result;
                } })();
            

exports.__getSpace = (() => {return async function (spaceDisplayId) {
                let argObject = { spaceDisplayId };
                argObject.spaceDisplayId = jsSpaceDisplayId(argObject.spaceDisplayId);
                argObject = [ argObject.spaceDisplayId ];
                let result = await requestApi("getSpace", argObject);
                result = psFocusedSpace(result);
                return result;};})();


                exports.__getMySpaces = (() => { return async function () { 
                    let result = await requestApi("getMySpaces", []);
                    
                        result = result.map(x => {
                            x = psRelatedSpace(x);
                            return x;
                        });
                    
                    return result;
                }})()();
            

exports.__getRelatedSpace = (() => {return async function (spaceId) {
                let argObject = { spaceId };
                argObject.spaceId = jsSpaceId(argObject.spaceId);
                argObject = [ argObject.spaceId ];
                let result = await requestApi("getRelatedSpace", argObject);
                result = psRelatedSpace(result);
                return result;};})();

exports.__getSpaceMembers = (() => {return async function (spaceId) {
                let argObject = { spaceId };
                argObject.spaceId = jsSpaceId(argObject.spaceId);
                argObject = [ argObject.spaceId ];
                let result = await requestApi("getSpaceMembers", argObject);
                
                        result = result.map(x => {
                            x = psIntactSpaceMember(x);
                            return x;
                        });
                    
                return result;};})();

exports.__getSpaceMembershipApplications = (() => {return async function (spaceId) {
                let argObject = { spaceId };
                argObject.spaceId = jsSpaceId(argObject.spaceId);
                argObject = [ argObject.spaceId ];
                let result = await requestApi("getSpaceMembershipApplications", argObject);
                
                        result = result.map(x => {
                            x = psIntactSpaceMembershipApplication(x);
                            return x;
                        });
                    
                return result;};})();

exports.__getAvailableSpaceDisplayId = (() => {return async function (spaceDisplayId) {
                let argObject = { spaceDisplayId };
                argObject.spaceDisplayId = jsSpaceDisplayId(argObject.spaceDisplayId);
                argObject = [ argObject.spaceDisplayId ];
                let result = await requestApi("getAvailableSpaceDisplayId", argObject);
                
                return result;};})();


                exports.__getFollowingSpaces = (() => { return async function () { 
                    let result = await requestApi("getFollowingSpaces", []);
                    
                        result = result.map(x => {
                            x = psRelatedSpace(x);
                            return x;
                        });
                    
                    return result;
                }})()();
            


                exports.__getPublishedSpaces = (() => { return async function () { 
                    let result = await requestApi("getPublishedSpaces", []);
                    
                        result = result.map(x => {
                            x = psRelatedSpace(x);
                            return x;
                        });
                    
                    return result;
                }})()();
            

exports.__applySpaceMembership = (() => {return async function (spaceId) {
                let argObject = { spaceId };
                argObject.spaceId = jsSpaceId(argObject.spaceId);
                argObject = [ argObject.spaceId ];
                let result = await requestApi("applySpaceMembership", argObject);
                
                return result;};})();

exports.__acceptSpaceMembership = (() => {return (spaceId) => {return async function (targetUserId) {
                let argObject = { spaceId,targetUserId };
                argObject.spaceId = jsSpaceId(argObject.spaceId);argObject.targetUserId = jsUserId(argObject.targetUserId);
                argObject = [ argObject.spaceId,argObject.targetUserId ];
                let result = await requestApi("acceptSpaceMembership", argObject);
                
                return result;}};})();

exports.__rejectSpaceMembership = (() => {return (spaceId) => {return async function (targetUserId) {
                let argObject = { spaceId,targetUserId };
                argObject.spaceId = jsSpaceId(argObject.spaceId);argObject.targetUserId = jsUserId(argObject.targetUserId);
                argObject = [ argObject.spaceId,argObject.targetUserId ];
                let result = await requestApi("rejectSpaceMembership", argObject);
                
                return result;}};})();

exports.__cancelSpaceMembershipApplication = (() => {return async function (spaceId) {
                let argObject = { spaceId };
                argObject.spaceId = jsSpaceId(argObject.spaceId);
                argObject = [ argObject.spaceId ];
                let result = await requestApi("cancelSpaceMembershipApplication", argObject);
                
                return result;};})();

exports.__setSpaceMembershipMethod = (() => {return (spaceId) => {return async function (membershipMethod) {
                let argObject = { spaceId,membershipMethod };
                argObject.spaceId = jsSpaceId(argObject.spaceId);argObject.membershipMethod = jsMembershipMethod(argObject.membershipMethod);
                argObject = [ argObject.spaceId,argObject.membershipMethod ];
                let result = await requestApi("setSpaceMembershipMethod", argObject);
                
                return result;}};})();

exports.__setSpaceDisplayName = (() => {return (spaceId) => {return async function (displayName) {
                let argObject = { spaceId,displayName };
                argObject.spaceId = jsSpaceId(argObject.spaceId);
                argObject = [ argObject.spaceId,argObject.displayName ];
                let result = await requestApi("setSpaceDisplayName", argObject);
                
                return result;}};})();

exports.__setSpaceDisplayId = (() => {return (spaceId) => {return async function (displayId) {
                let argObject = { spaceId,displayId };
                argObject.spaceId = jsSpaceId(argObject.spaceId);argObject.displayId = jsSpaceDisplayId(argObject.displayId);
                argObject = [ argObject.spaceId,argObject.displayId ];
                let result = await requestApi("setSpaceDisplayId", argObject);
                
                return result;}};})();

exports.__setSpacePublished = (() => {return (spaceId) => {return async function (published) {
                let argObject = { spaceId,published };
                argObject.spaceId = jsSpaceId(argObject.spaceId);
                argObject = [ argObject.spaceId,argObject.published ];
                let result = await requestApi("setSpacePublished", argObject);
                
                return result;}};})();

exports.__setSpaceDefaultAuthority = (() => {return (spaceId) => {return async function (defaultAuthority) {
                let argObject = { spaceId,defaultAuthority };
                argObject.spaceId = jsSpaceId(argObject.spaceId);argObject.defaultAuthority = jsSpaceAuth(argObject.defaultAuthority);
                argObject = [ argObject.spaceId,argObject.defaultAuthority ];
                let result = await requestApi("setSpaceDefaultAuthority", argObject);
                
                return result;}};})();


                exports.__createUser = (() => {return async function (argObject) {
                    
                    let args = [ argObject.email,argObject.displayName,argObject.password ];
                    let result = await requestApi("createUser", args);
                    result = psUserId(result);
                    return result;
                } })();
            


                exports.__getMyUser = (() => { return async function () { 
                    let result = await requestApi("getMyUser", []);
                    result = psFocusedUser(result);
                    return result;
                }})()();
            


                exports.__getMyAccount = (() => { return async function () { 
                    let result = await requestApi("getMyAccount", []);
                    result = psIntactAccount(result);
                    return result;
                }})()();
            

exports.__getUser = (() => {return async function (displayId) {
                let argObject = { displayId };
                argObject.displayId = jsUserDisplayId(argObject.displayId);
                argObject = [ argObject.displayId ];
                let result = await requestApi("getUser", argObject);
                result = psFocusedUser(result);
                return result;};})();


                exports.__authenticate = (() => {return async function (argObject) {
                    
                    let args = [ argObject.email,argObject.password ];
                    let result = await requestApi("authenticate", args);
                    
                    return result;
                } })();
            

exports.__getFocusedUser = (() => {return async function (userId) {
                let argObject = { userId };
                argObject.userId = jsUserId(argObject.userId);
                argObject = [ argObject.userId ];
                let result = await requestApi("getFocusedUser", argObject);
                result = psFocusedUser(result);
                return result;};})();

exports.__getRelatedUser = (() => {return async function (userId) {
                let argObject = { userId };
                argObject.userId = jsUserId(argObject.userId);
                argObject = [ argObject.userId ];
                let result = await requestApi("getRelatedUser", argObject);
                result = psRelatedUser(result);
                return result;};})();


                exports.__setMyPassword = (() => {return async function (argObject) {
                    
                    let args = [ argObject.oldPassword,argObject.newPassword ];
                    let result = await requestApi("setMyPassword", args);
                    
                    return result;
                } })();
            

exports.__setMyDisplayName = (() => {return async function (displayName) {
                let argObject = { displayName };
                
                argObject = [ argObject.displayName ];
                let result = await requestApi("setMyDisplayName", argObject);
                
                return result;};})();

exports.__setMyDisplayId = (() => {return async function (displayId) {
                let argObject = { displayId };
                argObject.displayId = jsUserDisplayId(argObject.displayId);
                argObject = [ argObject.displayId ];
                let result = await requestApi("setMyDisplayId", argObject);
                
                return result;};})();

exports.__setMyEmail = (() => {return async function (email) {
                let argObject = { email };
                
                argObject = [ argObject.email ];
                let result = await requestApi("setMyEmail", argObject);
                
                return result;};})();

exports.__setMyIcon = (() => {return async function (icon) {
                let argObject = { icon };
                
                argObject = [ argObject.icon ];
                let result = await requestApi("setMyIcon", argObject);
                
                return result;};})();

