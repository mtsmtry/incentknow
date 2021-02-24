
var Data_Maybe = require("../Data.Maybe/index.js");
var E = require("../Incentknow.Data.Entities/index.js");
const endpoint = "https://api.incentknow.com";

async function fetch(method, args) {
    const session = localStorage.getItem("session");
    const response = await fetch(endpoint + "/" + method, {
        method: 'POST',
        body: args,
        headers: {
            'Content-Type': 'application/json',
            'Session': session
        }
    });
    return await response.json();
}

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
            }function psContentGenerator(str) {switch(str){case "none":return E.ContentGeneratorNone.value;case "reactor":return E.ContentGeneratorReactor.value;case "crawler":return E.ContentGeneratorCrawler.value;}}function jsContentChangeType(obj) {
                if(obj instanceof E.ContentChangeTypeInitial) {
                    return "initial";
                }
            
                if(obj instanceof E.ContentChangeTypeWrite) {
                    return "write";
                }
            
                if(obj instanceof E.ContentChangeTypeRemove) {
                    return "remove";
                }
            }function psContentChangeType(str) {switch(str){case "initial":return E.ContentChangeTypeInitial.value;case "write":return E.ContentChangeTypeWrite.value;case "remove":return E.ContentChangeTypeRemove.value;}}function jsContentEditingState(obj) {
                if(obj instanceof E.ContentEditingStateEditing) {
                    return "editing";
                }
            
                if(obj instanceof E.ContentEditingStateCommitted) {
                    return "committed";
                }
            
                if(obj instanceof E.ContentEditingStateCanceld) {
                    return "canceled";
                }
            }function psContentEditingState(str) {switch(str){case "editing":return E.ContentEditingStateEditing.value;case "committed":return E.ContentEditingStateCommitted.value;case "canceled":return E.ContentEditingStateCanceld.value;}}function jsFormatUsage(obj) {
                if(obj instanceof E.Internal) {
                    return "internal";
                }
            
                if(obj instanceof E.External) {
                    return "external";
                }
            }function psFormatUsage(str) {switch(str){case "internal":return E.Internal.value;case "external":return E.External.value;}}function jsTypeName(obj) {
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
            }function psTypeName(str) {switch(str){case "integer":return E.TypeNameInt.value;case "boolean":return E.TypeNameBool.value;case "string":return E.TypeNameString.value;case "format":return E.TypeNameFormat.value;case "space":return E.TypeNameSpace.value;case "content":return E.TypeNameContent.value;case "url":return E.TypeNameUrl.value;case "object":return E.TypeNameObject.value;case "text":return E.TypeNameText.value;case "array":return E.TypeNameArray.value;case "code":return E.TypeNameCode.value;case "enumerator":return E.TypeNameEnum.value;case "document":return E.TypeNameDocument.value;case "image":return E.TypeNameImage.value;case "entity":return E.TypeNameEntity.value;}}function jsLanguage(obj) {
                if(obj instanceof E.Python) {
                    return "python";
                }
            
                if(obj instanceof E.Javascript) {
                    return "javascript";
                }
            }function psLanguage(str) {switch(str){case "python":return E.Python.value;case "javascript":return E.Javascript.value;}}function jsMaterialType(obj) {
                if(obj instanceof E.MaterialTypeFolder) {
                    return "folder";
                }
            
                if(obj instanceof E.MaterialTypeDocument) {
                    return "document";
                }
            }function psMaterialType(str) {switch(str){case "folder":return E.MaterialTypeFolder.value;case "document":return E.MaterialTypeDocument.value;}}function jsMaterialChangeType(obj) {
                if(obj instanceof E.MaterialChangeTypeInitial) {
                    return "initial";
                }
            
                if(obj instanceof E.MaterialChangeTypeWrite) {
                    return "write";
                }
            
                if(obj instanceof E.MaterialChangeTypeRemove) {
                    return "remove";
                }
            }function psMaterialChangeType(str) {switch(str){case "initial":return E.MaterialChangeTypeInitial.value;case "write":return E.MaterialChangeTypeWrite.value;case "remove":return E.MaterialChangeTypeRemove.value;}}function jsMaterialEditingState(obj) {
                if(obj instanceof E.MaterialEditingStateEditing) {
                    return "editing";
                }
            
                if(obj instanceof E.MaterialEditingStateCommitted) {
                    return "committed";
                }
            
                if(obj instanceof E.MaterialEditingStateCanceld) {
                    return "canceled";
                }
            }function psMaterialEditingState(str) {switch(str){case "editing":return E.MaterialEditingStateEditing.value;case "committed":return E.MaterialEditingStateCommitted.value;case "canceled":return E.MaterialEditingStateCanceld.value;}}function jsReactorState(obj) {
                if(obj instanceof E.Invaild) {
                    return "invaild";
                }
            }function psReactorState(str) {switch(str){case "invaild":return E.Invaild.value;}}function jsMembershipMethod(obj) {
                if(obj instanceof E.MembershipMethodNone) {
                    return "none";
                }
            
                if(obj instanceof E.MembershipMethodApp) {
                    return "app";
                }
            }function psMembershipMethod(str) {switch(str){case "none":return E.MembershipMethodNone.value;case "app":return E.MembershipMethodApp.value;}}function jsSpaceAuth(obj) {
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
            }function psSpaceAuth(str) {switch(str){case "none":return E.SpaceAuthNone.value;case "visible":return E.SpaceAuthVisible.value;case "readable":return E.SpaceAuthReadable.value;case "writable":return E.SpaceAuthWritable.value;}}function jsMemberType(obj) {
                if(obj instanceof E.Normal) {
                    return "normal";
                }
            
                if(obj instanceof E.Owner) {
                    return "owner";
                }
            }function psMemberType(str) {switch(str){case "normal":return E.Normal.value;case "owner":return E.Owner.value;}}function jsContentNodeType(obj) {
                if(obj instanceof E.ContentNodeTypeCommitted) {
                    return "committed";
                }
            
                if(obj instanceof E.ContentNodeTypePresent) {
                    return "present";
                }
            
                if(obj instanceof E.ContentNodeTypeCanceld) {
                    return "canceled";
                }
            }function psContentNodeType(str) {switch(str){case "committed":return E.ContentNodeTypeCommitted.value;case "present":return E.ContentNodeTypePresent.value;case "canceled":return E.ContentNodeTypeCanceld.value;}}function jsContentNodeTarget(obj) {
                if(obj instanceof E.ContentNodeTargetContent) {
                    return "content";
                }
            
                if(obj instanceof E.ContentNodeTargetMaterial) {
                    return "material";
                }
            
                if(obj instanceof E.ContentNodeTargetWhole) {
                    return "whole";
                }
            }function psContentNodeTarget(str) {switch(str){case "content":return E.ContentNodeTargetContent.value;case "material":return E.ContentNodeTargetMaterial.value;case "whole":return E.ContentNodeTargetWhole.value;}}function jsContentRevisionSource(obj) {
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
            }function psContentRevisionSource(str) {switch(str){case "commit":return E.ContentRevisionSourceCommit.value;case "snapshot":return E.ContentRevisionSourceSnapshot.value;case "editing":return E.ContentRevisionSourceEditing.value;case "draft":return E.ContentRevisionSourceDraft.value;}}function jsType(obj) {
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
            }function psType(obj) {switch(obj.name){case "integer":return new E.IntType();case "boolean":return new E.BoolType();case "string":return new E.StringType();case "format":return new E.FormatType();case "space":return new E.SpaceType();case "content":return new E.ContentType(obj.format);case "url":return new E.UrlType();case "object":return new E.ObjectType(obj.properties);case "text":return new E.TextType();case "array":return new E.ArrayType(obj.subType);case "code":return new E.CodeType(obj.language);case "enumerator":return new E.EnumType(obj.enumerators);case "document":return new E.DocumentType();case "image":return new E.ImageType();case "entity":return new E.EntityType(obj.format);}}function jsMaterialNodeType(obj) {
                if(obj instanceof E.MaterialNodeTypeCommitted) {
                    return "committed";
                }
            
                if(obj instanceof E.MaterialNodeTypePresent) {
                    return "present";
                }
            
                if(obj instanceof E.MaterialNodeTypeCanceld) {
                    return "canceled";
                }
            }function psMaterialNodeType(str) {switch(str){case "committed":return E.MaterialNodeTypeCommitted.value;case "present":return E.MaterialNodeTypePresent.value;case "canceled":return E.MaterialNodeTypeCanceld.value;}}function jsMaterialRevisionSource(obj) {
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
            }function psMaterialRevisionSource(str) {switch(str){case "commit":return E.MaterialRevisionSourceCommit.value;case "snapshot":return E.MaterialRevisionSourceSnapshot.value;case "editing":return E.MaterialRevisionSourceEditing.value;case "draft":return E.MaterialRevisionSourceDraft.value;}}exports.getContainers = async function (spaceId) {
                let args = [ spaceId ];
                argObject.spaceId = jsSpaceId(argObject.spaceId);
                let result = await fetch("getContainers", args);
                
                        result = result.map(x => {
                            x = psRelatedContainer(x);
                            return x;
                        });
                    
                return result;};function jsMaterialCompositionType(obj) {
                if(obj instanceof E.Creation) {
                    return "creation";
                }
            
                if(obj instanceof E.Move) {
                    return "move";
                }
            }function psMaterialCompositionType(str) {switch(str){case "creation":return E.Creation.value;case "move":return E.Move.value;}}function jsMaterialComposition(obj) {
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
            }function psMaterialComposition(obj) {switch(obj.type){case "creation":return new E.CreationMaterialComposition(obj.propertyId,obj.data);case "move":return new E.MoveMaterialComposition(obj.materialId);}}exports.startContentEditing = (contentId) => {return async function (basedCommitId) {
                let args = [ contentId,basedCommitId ];
                argObject.contentId = jsContentId(argObject.contentId);
                        if (argObject.basedCommitId instanceof Data_Maybe.Just) {
                            argObject.basedCommitId = argObject.basedCommitId.value; 
                        } else {
                            argObject.basedCommitId = null;
                        }
                    
                let result = await fetch("startContentEditing", args);
                result = psContentDraftId(result);
                return result;}};exports.createNewContentDraft = (structureId) => {return (spaceId) => {return async function (data) {
                let args = [ structureId,spaceId,data ];
                argObject.structureId = jsStructureId(argObject.structureId);
                        if (argObject.spaceId instanceof Data_Maybe.Just) {
                            argObject.spaceId = argObject.spaceId.value; 
                        } else {
                            argObject.spaceId = null;
                        }
                    
                        if (argObject.data instanceof Data_Maybe.Just) {
                            argObject.data = argObject.data.value; 
                        } else {
                            argObject.data = null;
                        }
                    
                let result = await fetch("createNewContentDraft", args);
                result = psContentDraftId(result);
                return result;}}};exports.editContentDraft = (contentDraftId) => {return async function (data) {
                let args = [ contentDraftId,data ];
                argObject.contentDraftId = jsContentDraftId(argObject.contentDraftId);
                let result = await fetch("editContentDraft", args);
                
                    if (result) {
                        result = new Data_Maybe.Just(result);
                    } else {
                        result = Data_Maybe.Nothing.value;
                    }
                
                return result;}};exports.commitContent = (contentDraftId) => {return async function (data) {
                let args = [ contentDraftId,data ];
                argObject.contentDraftId = jsContentDraftId(argObject.contentDraftId);
                let result = await fetch("commitContent", args);
                
                    if (result) {
                        result = new Data_Maybe.Just(result);
                    } else {
                        result = Data_Maybe.Nothing.value;
                    }
                
                return result;}};exports.getContent = async function (contentId) {
                let args = [ contentId ];
                argObject.contentId = jsContentId(argObject.contentId);
                let result = await fetch("getContent", args);
                result = psFocusedContent(result);
                return result;};exports.getRelatedContent = async function (contentId) {
                let args = [ contentId ];
                argObject.contentId = jsContentId(argObject.contentId);
                let result = await fetch("getRelatedContent", args);
                result = psRelatedContent(result);
                return result;};exports.getContents = (spaceId) => {return async function (formatId) {
                let args = [ spaceId,formatId ];
                argObject.spaceId = jsSpaceId(argObject.spaceId);argObject.formatId = jsFormatId(argObject.formatId);
                let result = await fetch("getContents", args);
                
                        result = result.map(x => {
                            x = psRelatedContent(x);
                            return x;
                        });
                    
                return result;}};
                exports.getMyContentDrafts = function () { 
                    const r = async function () {
                        let result = await fetch("getMyContentDrafts", []);
                        
                        result = result.map(x => {
                            x = psRelatedContentDraft(x);
                            return x;
                        });
                    
                        return result;
                    }; 
                    return r(); 
                };
            exports.getContentDraft = async function (draftId) {
                let args = [ draftId ];
                argObject.draftId = jsContentDraftId(argObject.draftId);
                let result = await fetch("getContentDraft", args);
                result = psFocusedContentDraft(result);
                return result;};exports.getContentCommits = async function (contentId) {
                let args = [ contentId ];
                argObject.contentId = jsContentId(argObject.contentId);
                let result = await fetch("getContentCommits", args);
                
                        result = result.map(x => {
                            x = psRelatedContentCommit(x);
                            return x;
                        });
                    
                return result;};exports.getContentEditingNodes = async function (draftId) {
                let args = [ draftId ];
                argObject.draftId = jsContentDraftId(argObject.draftId);
                let result = await fetch("getContentEditingNodes", args);
                
                        result = result.map(x => {
                            x = psContentNode(x);
                            return x;
                        });
                    
                return result;};exports.getContentRevision = async function (revisionId) {
                let args = [ revisionId ];
                argObject.revisionId = jsContentWholeRevisionId(argObject.revisionId);
                let result = await fetch("getContentRevision", args);
                result = psFocusedContentRevision(result);
                return result;};exports.getContentCommit = async function (commitId) {
                let args = [ commitId ];
                argObject.commitId = jsContentCommitId(argObject.commitId);
                let result = await fetch("getContentCommit", args);
                result = psFocusedContentCommit(result);
                return result;};
                exports.createFormat = async function (argObject) {
                    argObject.spaceId = jsSpaceId(argObject.spaceId);argObject.usage = jsFormatUsage(argObject.usage);
                            argObject.properties = argObject.properties.map(x => {
                                x = jsPropertyInfo(x);
                                return x;
                            });
                        
                    let args = [ argObject.spaceId,argObject.displayName,argObject.description,argObject.usage,argObject.properties ];
                    let result = await fetch("createFormat", args);
                    result = psFormatDisplayId(result);
                    return result;
                };
            exports.getFormat = async function (formatDisplayId) {
                let args = [ formatDisplayId ];
                argObject.formatDisplayId = jsFormatDisplayId(argObject.formatDisplayId);
                let result = await fetch("getFormat", args);
                result = psFocusedFormat(result);
                return result;};exports.getFocusedFormat = async function (formatId) {
                let args = [ formatId ];
                argObject.formatId = jsFormatId(argObject.formatId);
                let result = await fetch("getFocusedFormat", args);
                result = psFocusedFormat(result);
                return result;};exports.getRelatedFormat = async function (formatId) {
                let args = [ formatId ];
                argObject.formatId = jsFormatId(argObject.formatId);
                let result = await fetch("getRelatedFormat", args);
                result = psRelatedFormat(result);
                return result;};exports.getFormats = async function (spaceId) {
                let args = [ spaceId ];
                argObject.spaceId = jsSpaceId(argObject.spaceId);
                let result = await fetch("getFormats", args);
                
                        result = result.map(x => {
                            x = psRelatedFormat(x);
                            return x;
                        });
                    
                return result;};exports.getStructures = async function (formatId) {
                let args = [ formatId ];
                argObject.formatId = jsFormatId(argObject.formatId);
                let result = await fetch("getStructures", args);
                
                        result = result.map(x => {
                            x = psRelatedStructure(x);
                            return x;
                        });
                    
                return result;};exports.updateFormatStructure = (formatId) => {return async function (properties) {
                let args = [ formatId,properties ];
                argObject.formatId = jsFormatId(argObject.formatId);
                            argObject.properties = argObject.properties.map(x => {
                                x = jsPropertyInfo(x);
                                return x;
                            });
                        
                let result = await fetch("updateFormatStructure", args);
                
                return result;}};exports.startMaterialEditing = (materialId) => {return async function (basedCommitId) {
                let args = [ materialId,basedCommitId ];
                argObject.materialId = jsMaterialId(argObject.materialId);
                        if (argObject.basedCommitId instanceof Data_Maybe.Just) {
                            argObject.basedCommitId = argObject.basedCommitId.value; 
                        } else {
                            argObject.basedCommitId = null;
                        }
                    
                let result = await fetch("startMaterialEditing", args);
                result = psRelatedMaterialDraft(result);
                return result;}};exports.startBlankMaterialEditing = (spaceId) => {return async function (type) {
                let args = [ spaceId,type ];
                argObject.spaceId = jsSpaceId(argObject.spaceId);argObject.type = jsMaterialType(argObject.type);
                let result = await fetch("startBlankMaterialEditing", args);
                result = psRelatedMaterialDraft(result);
                return result;}};exports.editMaterialDraft = (materialDraftId) => {return async function (data) {
                let args = [ materialDraftId,data ];
                argObject.materialDraftId = jsMaterialDraftId(argObject.materialDraftId);
                let result = await fetch("editMaterialDraft", args);
                
                    if (result) {
                        result = new Data_Maybe.Just(result);
                    } else {
                        result = Data_Maybe.Nothing.value;
                    }
                
                return result;}};exports.commitMaterial = async function (materialDraftId) {
                let args = [ materialDraftId ];
                argObject.materialDraftId = jsMaterialDraftId(argObject.materialDraftId);
                let result = await fetch("commitMaterial", args);
                result = psRelatedMaterialRevision(result);
                return result;};exports.getMaterial = async function (materialId) {
                let args = [ materialId ];
                argObject.materialId = jsMaterialId(argObject.materialId);
                let result = await fetch("getMaterial", args);
                result = psFocusedMaterial(result);
                return result;};
                exports.getMyMaterialDrafts = function () { 
                    const r = async function () {
                        let result = await fetch("getMyMaterialDrafts", []);
                        
                        result = result.map(x => {
                            x = psRelatedMaterialDraft(x);
                            return x;
                        });
                    
                        return result;
                    }; 
                    return r(); 
                };
            exports.getMaterialDraft = async function (draftId) {
                let args = [ draftId ];
                argObject.draftId = jsMaterialDraftId(argObject.draftId);
                let result = await fetch("getMaterialDraft", args);
                result = psFocusedMaterialDraft(result);
                return result;};exports.getMaterialCommits = async function (materialId) {
                let args = [ materialId ];
                argObject.materialId = jsMaterialId(argObject.materialId);
                let result = await fetch("getMaterialCommits", args);
                
                        result = result.map(x => {
                            x = psRelatedMaterialCommit(x);
                            return x;
                        });
                    
                return result;};exports.getMaterialEditingNodes = async function (draftId) {
                let args = [ draftId ];
                argObject.draftId = jsMaterialDraftId(argObject.draftId);
                let result = await fetch("getMaterialEditingNodes", args);
                
                        result = result.map(x => {
                            x = psMaterialNode(x);
                            return x;
                        });
                    
                return result;};exports.getMaterialRevision = async function (revisionId) {
                let args = [ revisionId ];
                argObject.revisionId = jsMaterialRevisionId(argObject.revisionId);
                let result = await fetch("getMaterialRevision", args);
                result = psFocusedMaterialRevision(result);
                return result;};exports.getMaterialCommit = async function (commitId) {
                let args = [ commitId ];
                argObject.commitId = jsMaterialCommitId(argObject.commitId);
                let result = await fetch("getMaterialCommit", args);
                result = psFocusedMaterialCommit(result);
                return result;};
                exports.createSpace = async function (argObject) {
                    
                    let args = [ argObject.displayId,argObject.displayName,argObject.description ];
                    let result = await fetch("createSpace", args);
                    result = psSpaceDisplayId(result);
                    return result;
                };
            exports.getSpace = async function (spaceDisplayId) {
                let args = [ spaceDisplayId ];
                argObject.spaceDisplayId = jsSpaceDisplayId(argObject.spaceDisplayId);
                let result = await fetch("getSpace", args);
                result = psFocusedSpace(result);
                return result;};
                exports.getMySpaces = function () { 
                    const r = async function () {
                        let result = await fetch("getMySpaces", []);
                        
                        result = result.map(x => {
                            x = psRelatedSpace(x);
                            return x;
                        });
                    
                        return result;
                    }; 
                    return r(); 
                };
            exports.getRelatedSpace = async function (spaceId) {
                let args = [ spaceId ];
                argObject.spaceId = jsSpaceId(argObject.spaceId);
                let result = await fetch("getRelatedSpace", args);
                result = psRelatedSpace(result);
                return result;};exports.getSpaceMembers = async function (spaceId) {
                let args = [ spaceId ];
                argObject.spaceId = jsSpaceId(argObject.spaceId);
                let result = await fetch("getSpaceMembers", args);
                
                        result = result.map(x => {
                            x = psIntactSpaceMember(x);
                            return x;
                        });
                    
                return result;};exports.getSpaceMembershipApplications = async function (spaceId) {
                let args = [ spaceId ];
                argObject.spaceId = jsSpaceId(argObject.spaceId);
                let result = await fetch("getSpaceMembershipApplications", args);
                
                        result = result.map(x => {
                            x = psIntactSpaceMembershipApplication(x);
                            return x;
                        });
                    
                return result;};exports.getAvailableSpaceDisplayId = async function (spaceDisplayId) {
                let args = [ spaceDisplayId ];
                argObject.spaceDisplayId = jsSpaceDisplayId(argObject.spaceDisplayId);
                let result = await fetch("getAvailableSpaceDisplayId", args);
                
                return result;};
                exports.getFollowingSpaces = function () { 
                    const r = async function () {
                        let result = await fetch("getFollowingSpaces", []);
                        
                        result = result.map(x => {
                            x = psRelatedSpace(x);
                            return x;
                        });
                    
                        return result;
                    }; 
                    return r(); 
                };
            
                exports.getPublishedSpaces = function () { 
                    const r = async function () {
                        let result = await fetch("getPublishedSpaces", []);
                        
                        result = result.map(x => {
                            x = psRelatedSpace(x);
                            return x;
                        });
                    
                        return result;
                    }; 
                    return r(); 
                };
            exports.applySpaceMembership = async function (spaceId) {
                let args = [ spaceId ];
                argObject.spaceId = jsSpaceId(argObject.spaceId);
                let result = await fetch("applySpaceMembership", args);
                
                return result;};exports.acceptSpaceMembership = (spaceId) => {return async function (targetUserId) {
                let args = [ spaceId,targetUserId ];
                argObject.spaceId = jsSpaceId(argObject.spaceId);argObject.targetUserId = jsUserId(argObject.targetUserId);
                let result = await fetch("acceptSpaceMembership", args);
                
                return result;}};exports.rejectSpaceMembership = (spaceId) => {return async function (targetUserId) {
                let args = [ spaceId,targetUserId ];
                argObject.spaceId = jsSpaceId(argObject.spaceId);argObject.targetUserId = jsUserId(argObject.targetUserId);
                let result = await fetch("rejectSpaceMembership", args);
                
                return result;}};exports.cancelSpaceMembershipApplication = async function (spaceId) {
                let args = [ spaceId ];
                argObject.spaceId = jsSpaceId(argObject.spaceId);
                let result = await fetch("cancelSpaceMembershipApplication", args);
                
                return result;};exports.setSpaceMembershipMethod = (spaceId) => {return async function (membershipMethod) {
                let args = [ spaceId,membershipMethod ];
                argObject.spaceId = jsSpaceId(argObject.spaceId);argObject.membershipMethod = jsMembershipMethod(argObject.membershipMethod);
                let result = await fetch("setSpaceMembershipMethod", args);
                
                return result;}};
                exports.createUser = async function (argObject) {
                    
                    let args = [ argObject.email,argObject.displayName,argObject.password ];
                    let result = await fetch("createUser", args);
                    result = psUserId(result);
                    return result;
                };
            
                exports.getMyUser = function () { 
                    const r = async function () {
                        let result = await fetch("getMyUser", []);
                        result = psFocusedUser(result);
                        return result;
                    }; 
                    return r(); 
                };
            
                exports.getMyAccount = function () { 
                    const r = async function () {
                        let result = await fetch("getMyAccount", []);
                        result = psIntactAccount(result);
                        return result;
                    }; 
                    return r(); 
                };
            exports.getUser = async function (displayId) {
                let args = [ displayId ];
                argObject.displayId = jsUserDisplayId(argObject.displayId);
                let result = await fetch("getUser", args);
                result = psFocusedUser(result);
                return result;};
                exports.authenticate = async function (argObject) {
                    
                    let args = [ argObject.email,argObject.password ];
                    let result = await fetch("authenticate", args);
                    
                    return result;
                };
            exports.getFocusedUser = async function (userId) {
                let args = [ userId ];
                argObject.userId = jsUserId(argObject.userId);
                let result = await fetch("getFocusedUser", args);
                result = psFocusedUser(result);
                return result;};exports.getRelatedUser = async function (userId) {
                let args = [ userId ];
                argObject.userId = jsUserId(argObject.userId);
                let result = await fetch("getRelatedUser", args);
                result = psRelatedUser(result);
                return result;};
                exports.setMyPassword = async function (argObject) {
                    
                    let args = [ argObject.oldPassword,argObject.newPassword ];
                    let result = await fetch("setMyPassword", args);
                    
                    return result;
                };
            exports.setMyDisplayName = async function (displayName) {
                let args = [ displayName ];
                
                let result = await fetch("setMyDisplayName", args);
                
                return result;};exports.setMyDisplayId = async function (displayId) {
                let args = [ displayId ];
                argObject.displayId = jsUserDisplayId(argObject.displayId);
                let result = await fetch("setMyDisplayId", args);
                
                return result;};exports.setMyEmail = async function (email) {
                let args = [ email ];
                
                let result = await fetch("setMyEmail", args);
                
                return result;};exports.setMyIcon = async function (icon) {
                let args = [ icon ];
                
                let result = await fetch("setMyIcon", args);
                
                return result;};