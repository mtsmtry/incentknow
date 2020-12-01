var Data_Maybe = require("../Data.Maybe/index.js");
var E = require("../Incentknow.Data.Entities/index.js");
const endpoint = "https://api.incentknow.com";

async function fetch(method, args) {
    const session = localStorage.getItem("session");

    const response = await fetch(endpoint + "/" + method, {
        method: "POST",
        body: args,

        headers: {
            "Content-Type": "application/json",
            "Session": session
        }
    });

    return await response.json();
}

function psMembershipMethod(str) {
    switch (str) {
    case "none":
        return E.MembershipMethodNone.value;
    case "app":
        return E.MembershipMethodApp.value;
    }
}

function jsMembershipMethod(obj) {
    if (obj instanceof E.MembershipMethodNone) {
        return "none";
    }

    if (obj instanceof E.MembershipMethodApp) {
        return "app";
    }
}

function psSpaceAuth(str) {
    switch (str) {
    case "none":
        return E.SpaceAuthNone.value;
    case "visible":
        return E.SpaceAuthVisible.value;
    case "readable":
        return E.SpaceAuthReadable.value;
    case "writable":
        return E.SpaceAuthWritable.value;
    }
}

function jsSpaceAuth(obj) {
    if (obj instanceof E.SpaceAuthNone) {
        return "none";
    }

    if (obj instanceof E.SpaceAuthVisible) {
        return "visible";
    }

    if (obj instanceof E.SpaceAuthReadable) {
        return "readable";
    }

    if (obj instanceof E.SpaceAuthWritable) {
        return "writable";
    }
}

function psMemberType(str) {
    switch (str) {
    case "normal":
        return E.Normal.value;
    case "owner":
        return E.Owner.value;
    }
}

function jsMemberType(obj) {
    if (obj instanceof E.Normal) {
        return "normal";
    }

    if (obj instanceof E.Owner) {
        return "owner";
    }
}

function psContentGenerator(str) {
    switch (str) {
    case "none":
        return E.ContentGeneratorNone.value;
    case "reactor":
        return E.ContentGeneratorReactor.value;
    case "crawler":
        return E.ContentGeneratorCrawler.value;
    }
}

function jsContentGenerator(obj) {
    if (obj instanceof E.ContentGeneratorNone) {
        return "none";
    }

    if (obj instanceof E.ContentGeneratorReactor) {
        return "reactor";
    }

    if (obj instanceof E.ContentGeneratorCrawler) {
        return "crawler";
    }
}

function psFormatUsage(str) {
    switch (str) {
    case "internal":
        return E.Internal.value;
    case "external":
        return E.External.value;
    }
}

function jsFormatUsage(obj) {
    if (obj instanceof E.Internal) {
        return "internal";
    }

    if (obj instanceof E.External) {
        return "external";
    }
}

function psTypeName(str) {
    switch (str) {
    case "integer":
        return E.TypeNameInt.value;
    case "boolean":
        return E.TypeNameBool.value;
    case "string":
        return E.TypeNameString.value;
    case "format":
        return E.TypeNameFormat.value;
    case "space":
        return E.TypeNameSpace.value;
    case "content":
        return E.TypeNameContent.value;
    case "url":
        return E.TypeNameUrl.value;
    case "object":
        return E.TypeNameObject.value;
    case "text":
        return E.TypeNameText.value;
    case "array":
        return E.TypeNameArray.value;
    case "code":
        return E.TypeNameCode.value;
    case "enumerator":
        return E.TypeNameEnum.value;
    case "document":
        return E.TypeNameDocument.value;
    case "image":
        return E.TypeNameImage.value;
    case "entity":
        return E.TypeNameEntity.value;
    }
}

function jsTypeName(obj) {
    if (obj instanceof E.TypeNameInt) {
        return "integer";
    }

    if (obj instanceof E.TypeNameBool) {
        return "boolean";
    }

    if (obj instanceof E.TypeNameString) {
        return "string";
    }

    if (obj instanceof E.TypeNameFormat) {
        return "format";
    }

    if (obj instanceof E.TypeNameSpace) {
        return "space";
    }

    if (obj instanceof E.TypeNameContent) {
        return "content";
    }

    if (obj instanceof E.TypeNameUrl) {
        return "url";
    }

    if (obj instanceof E.TypeNameObject) {
        return "object";
    }

    if (obj instanceof E.TypeNameText) {
        return "text";
    }

    if (obj instanceof E.TypeNameArray) {
        return "array";
    }

    if (obj instanceof E.TypeNameCode) {
        return "code";
    }

    if (obj instanceof E.TypeNameEnum) {
        return "enumerator";
    }

    if (obj instanceof E.TypeNameDocument) {
        return "document";
    }

    if (obj instanceof E.TypeNameImage) {
        return "image";
    }

    if (obj instanceof E.TypeNameEntity) {
        return "entity";
    }
}

function psLanguage(str) {
    switch (str) {
    case "python":
        return E.Python.value;
    case "javascript":
        return E.Javascript.value;
    }
}

function jsLanguage(obj) {
    if (obj instanceof E.Python) {
        return "python";
    }

    if (obj instanceof E.Javascript) {
        return "javascript";
    }
}

function psEditingState(str) {
    switch (str) {
    case "editing":
        return E.EditingStateEditing.value;
    case "committed":
        return E.EditingStateCommitted.value;
    case "canceled":
        return E.EditingStateCanceld.value;
    }
}

function jsEditingState(obj) {
    if (obj instanceof E.EditingStateEditing) {
        return "editing";
    }

    if (obj instanceof E.EditingStateCommitted) {
        return "committed";
    }

    if (obj instanceof E.EditingStateCanceld) {
        return "canceled";
    }
}

function psDraftState(str) {
    switch (str) {
    case "editing":
        return E.DraftStateEditing.value;
    }
}

function jsDraftState(obj) {
    if (obj instanceof E.DraftStateEditing) {
        return "editing";
    }
}

function psChangeType(str) {
    switch (str) {
    case "initial":
        return E.Initial.value;
    case "write":
        return E.Write.value;
    case "remove":
        return E.Remove.value;
    }
}

function jsChangeType(obj) {
    if (obj instanceof E.Initial) {
        return "initial";
    }

    if (obj instanceof E.Write) {
        return "write";
    }

    if (obj instanceof E.Remove) {
        return "remove";
    }
}

function psMaterialType(str) {
    switch (str) {
    case "folder":
        return E.MaterialTypeFolder.value;
    case "document":
        return E.MaterialTypeDocument.value;
    }
}

function jsMaterialType(obj) {
    if (obj instanceof E.MaterialTypeFolder) {
        return "folder";
    }

    if (obj instanceof E.MaterialTypeDocument) {
        return "document";
    }
}

function psCrawlerTaskStatus(str) {
    switch (str) {
    case "pending":
        return E.CrawlerTaskStatusPdending.value;
    case "running":
        return E.CrawlerTaskStatusRunning.value;
    case "completed":
        return E.CrawlerTaskStatusCompleted.value;
    case "failedFetching":
        return E.CrawlerTaskStatusFailedFetching.value;
    case "failedScraping":
        return E.CrawlerTaskStatusFailedScraping.value;
    case "failedImporting":
        return E.CrawlerTaskStatusFailedImporting.value;
    }
}

function jsCrawlerTaskStatus(obj) {
    if (obj instanceof E.CrawlerTaskStatusPdending) {
        return "pending";
    }

    if (obj instanceof E.CrawlerTaskStatusRunning) {
        return "running";
    }

    if (obj instanceof E.CrawlerTaskStatusCompleted) {
        return "completed";
    }

    if (obj instanceof E.CrawlerTaskStatusFailedFetching) {
        return "failedFetching";
    }

    if (obj instanceof E.CrawlerTaskStatusFailedScraping) {
        return "failedScraping";
    }

    if (obj instanceof E.CrawlerTaskStatusFailedImporting) {
        return "failedImporting";
    }
}

function psStatus(str) {
    switch (str) {

    }
}

function jsStatus(obj) {}

function psCrawlerTaskMethod(str) {
    switch (str) {
    case "crawling":
        return E.CrawlerTaskMethodCrawling.value;
    case "scraping":
        return E.CrawlerTaskMethodScraping.value;
    }
}

function jsCrawlerTaskMethod(obj) {
    if (obj instanceof E.CrawlerTaskMethodCrawling) {
        return "crawling";
    }

    if (obj instanceof E.CrawlerTaskMethodScraping) {
        return "scraping";
    }
}

function psCrawlerTakeoverClass(str) {
    switch (str) {
    case "new":
        return E.New.value;
    case "duplication":
        return E.Duplication.value;
    }
}

function jsCrawlerTakeoverClass(obj) {
    if (obj instanceof E.New) {
        return "new";
    }

    if (obj instanceof E.Duplication) {
        return "duplication";
    }
}

function psCrawlerTaskOutput(obj) {
    obj.indexes = obj.indexes.map(x => {
        if (x.taskId) {
            x.taskId = new Data_Maybe.Just(x.taskId);
        } else {
            x.taskId = Data_Maybe.Nothing.value;
        }

        x.class = psCrawlerTakeoverClass(x.class);
        return x;
    });

    if (obj.contents) {
        obj.contents = new Data_Maybe.Just(obj.contents);
    } else {
        obj.contents = Data_Maybe.Nothing.value;
    }

    return obj;
}

function jsCrawlerTaskOutput(obj) {
    obj.indexes = obj.indexes.map(x => {
        if (x.taskId instanceof Data_Maybe.Just) {
            x.taskId = x.taskId.value;
        } else {
            x.taskId = null;
        }

        x.class = jsCrawlerTakeoverClass(x.class);
        return x;
    });

    if (obj.contents instanceof Data_Maybe.Just) {
        obj.contents = obj.contents.value;
    } else {
        obj.contents = null;
    }

    return obj;
}

function psCrawlerOperationStatus(str) {
    switch (str) {
    case "pending":
        return E.CrawlerOperationStatusPending.value;
    case "running":
        return E.CrawlerOperationStatusRunning.value;
    case "completed":
        return E.CrawlerOperationStatusCompleted.value;
    }
}

function jsCrawlerOperationStatus(obj) {
    if (obj instanceof E.CrawlerOperationStatusPending) {
        return "pending";
    }

    if (obj instanceof E.CrawlerOperationStatusRunning) {
        return "running";
    }

    if (obj instanceof E.CrawlerOperationStatusCompleted) {
        return "completed";
    }
}

function psCrawlerOperationMethod(str) {
    switch (str) {
    case "crawling":
        return E.CrawlerOperationMethodCrawling.value;
    case "scraping":
        return E.CrawlerOperationMethodScraping.value;
    }
}

function jsCrawlerOperationMethod(obj) {
    if (obj instanceof E.CrawlerOperationMethodCrawling) {
        return "crawling";
    }

    if (obj instanceof E.CrawlerOperationMethodScraping) {
        return "scraping";
    }
}

function psCrawlerCacheStatus(str) {
    switch (str) {
    case "stored":
        return E.Stored.value;
    case "deleted":
        return E.Deleted.value;
    }
}

function jsCrawlerCacheStatus(obj) {
    if (obj instanceof E.Stored) {
        return "stored";
    }

    if (obj instanceof E.Deleted) {
        return "deleted";
    }
}

function psReactorState(str) {
    switch (str) {
    case "invaild":
        return E.Invaild.value;
    }
}

function jsReactorState(obj) {
    if (obj instanceof E.Invaild) {
        return "invaild";
    }
}

const psContainerId = x => x;
const jsContainerId = x => x;

function psIntactContainer(obj) {
    obj.containerId = psContainerId(obj.containerId);
    obj.space = psRelatedSpace(obj.space);
    obj.format = psRelatedFormat(obj.format);
    return obj;
}

function jsIntactContainer(obj) {
    obj.containerId = jsContainerId(obj.containerId);
    obj.space = jsRelatedSpace(obj.space);
    obj.format = jsRelatedFormat(obj.format);
    return obj;
}

const psSpaceId = x => x;
const jsSpaceId = x => x;
const psSpaceDisplayId = x => x;
const jsSpaceDisplayId = x => x;

function psRelatedSpace(obj) {
    obj.spaceId = psSpaceId(obj.spaceId);
    obj.displayId = psSpaceDisplayId(obj.displayId);

    if (obj.homeUrl) {
        obj.homeUrl = new Data_Maybe.Just(obj.homeUrl);
    } else {
        obj.homeUrl = Data_Maybe.Nothing.value;
    }

    obj.membershipMethod = psMembershipMethod(obj.membershipMethod);
    obj.defaultAuthority = psSpaceAuth(obj.defaultAuthority);
    return obj;
}

function jsRelatedSpace(obj) {
    obj.spaceId = jsSpaceId(obj.spaceId);
    obj.displayId = jsSpaceDisplayId(obj.displayId);

    if (obj.homeUrl instanceof Data_Maybe.Just) {
        obj.homeUrl = obj.homeUrl.value;
    } else {
        obj.homeUrl = null;
    }

    obj.membershipMethod = jsMembershipMethod(obj.membershipMethod);
    obj.defaultAuthority = jsSpaceAuth(obj.defaultAuthority);
    return obj;
}

function psFocusedSpace(obj) {
    obj.spaceId = psSpaceId(obj.spaceId);
    obj.displayId = psSpaceDisplayId(obj.displayId);
    obj.creatorUser = psRelatedUser(obj.creatorUser);

    if (obj.homeUrl) {
        obj.homeUrl = new Data_Maybe.Just(obj.homeUrl);
    } else {
        obj.homeUrl = Data_Maybe.Nothing.value;
    }

    obj.membershipMethod = psMembershipMethod(obj.membershipMethod);
    obj.defaultAuthority = psSpaceAuth(obj.defaultAuthority);
    return obj;
}

function jsFocusedSpace(obj) {
    obj.spaceId = jsSpaceId(obj.spaceId);
    obj.displayId = jsSpaceDisplayId(obj.displayId);
    obj.creatorUser = jsRelatedUser(obj.creatorUser);

    if (obj.homeUrl instanceof Data_Maybe.Just) {
        obj.homeUrl = obj.homeUrl.value;
    } else {
        obj.homeUrl = null;
    }

    obj.membershipMethod = jsMembershipMethod(obj.membershipMethod);
    obj.defaultAuthority = jsSpaceAuth(obj.defaultAuthority);
    return obj;
}

function psIntactSpaceMember(obj) {
    obj.user = psRelatedUser(obj.user);
    obj.type = psMemberType(obj.type);
    return obj;
}

function jsIntactSpaceMember(obj) {
    obj.user = jsRelatedUser(obj.user);
    obj.type = jsMemberType(obj.type);
    return obj;
}

function psIntactSpaceMembershipApplication(obj) {
    obj.user = psRelatedUser(obj.user);
    return obj;
}

function jsIntactSpaceMembershipApplication(obj) {
    obj.user = jsRelatedUser(obj.user);
    return obj;
}

const psUserId = x => x;
const jsUserId = x => x;
const psUserDisplayId = x => x;
const jsUserDisplayId = x => x;

function psIntactAccount(obj) {
    obj.userId = psUserId(obj.userId);
    obj.displayId = psUserDisplayId(obj.displayId);

    if (obj.iconUrl) {
        obj.iconUrl = new Data_Maybe.Just(obj.iconUrl);
    } else {
        obj.iconUrl = Data_Maybe.Nothing.value;
    }

    return obj;
}

function jsIntactAccount(obj) {
    obj.userId = jsUserId(obj.userId);
    obj.displayId = jsUserDisplayId(obj.displayId);

    if (obj.iconUrl instanceof Data_Maybe.Just) {
        obj.iconUrl = obj.iconUrl.value;
    } else {
        obj.iconUrl = null;
    }

    return obj;
}

function psRelatedUser(obj) {
    obj.userId = psUserId(obj.userId);
    obj.displayId = psUserDisplayId(obj.displayId);

    if (obj.iconUrl) {
        obj.iconUrl = new Data_Maybe.Just(obj.iconUrl);
    } else {
        obj.iconUrl = Data_Maybe.Nothing.value;
    }

    return obj;
}

function jsRelatedUser(obj) {
    obj.userId = jsUserId(obj.userId);
    obj.displayId = jsUserDisplayId(obj.displayId);

    if (obj.iconUrl instanceof Data_Maybe.Just) {
        obj.iconUrl = obj.iconUrl.value;
    } else {
        obj.iconUrl = null;
    }

    return obj;
}

function psFocusedUser(obj) {
    obj.userId = psUserId(obj.userId);
    obj.displayId = psUserDisplayId(obj.displayId);

    if (obj.iconUrl) {
        obj.iconUrl = new Data_Maybe.Just(obj.iconUrl);
    } else {
        obj.iconUrl = Data_Maybe.Nothing.value;
    }

    return obj;
}

function jsFocusedUser(obj) {
    obj.userId = jsUserId(obj.userId);
    obj.displayId = jsUserDisplayId(obj.displayId);

    if (obj.iconUrl instanceof Data_Maybe.Just) {
        obj.iconUrl = obj.iconUrl.value;
    } else {
        obj.iconUrl = null;
    }

    return obj;
}

function psPropertyInfo(obj) {
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
    return obj;
}

function jsPropertyInfo(obj) {
    if (obj.fieldName instanceof Data_Maybe.Just) {
        obj.fieldName = obj.fieldName.value;
    } else {
        obj.fieldName = null;
    }

    if (obj.semantic instanceof Data_Maybe.Just) {
        obj.semantic = obj.semantic.value;
    } else {
        obj.semantic = null;
    }

    obj.type = jsType(obj.type);
    return obj;
}

function psEnumerator(obj) {
    if (obj.fieldName) {
        obj.fieldName = new Data_Maybe.Just(obj.fieldName);
    } else {
        obj.fieldName = Data_Maybe.Nothing.value;
    }

    return obj;
}

function jsEnumerator(obj) {
    if (obj.fieldName instanceof Data_Maybe.Just) {
        obj.fieldName = obj.fieldName.value;
    } else {
        obj.fieldName = null;
    }

    return obj;
}

function psType(obj) {
    switch (obj.name) {
    case "integer":
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
    }
}

function jsType(obj) {
    if (obj instanceof E.IntType) {
        return {
            name: "integer"
        };
    }

    if (obj instanceof E.BoolType) {
        return {
            name: "boolean"
        };
    }

    if (obj instanceof E.StringType) {
        return {
            name: "string"
        };
    }

    if (obj instanceof E.FormatType) {
        return {
            name: "format"
        };
    }

    if (obj instanceof E.SpaceType) {
        return {
            name: "space"
        };
    }

    if (obj instanceof E.ContentType) {
        return {
            name: "content",
            format: obj.value0
        };
    }

    if (obj instanceof E.UrlType) {
        return {
            name: "url"
        };
    }

    if (obj instanceof E.ObjectType) {
        return {
            name: "object",
            properties: obj.value0
        };
    }

    if (obj instanceof E.TextType) {
        return {
            name: "text"
        };
    }

    if (obj instanceof E.ArrayType) {
        return {
            name: "array",
            subType: obj.value0
        };
    }

    if (obj instanceof E.CodeType) {
        return {
            name: "code",
            language: obj.value0
        };
    }

    if (obj instanceof E.EnumType) {
        return {
            name: "enumerator",
            enumerators: obj.value0
        };
    }

    if (obj instanceof E.DocumentType) {
        return {
            name: "document"
        };
    }

    if (obj instanceof E.ImageType) {
        return {
            name: "image"
        };
    }

    if (obj instanceof E.EntityType) {
        return {
            name: "entity",
            format: obj.value0
        };
    }
}

const psStructureId = x => x;
const jsStructureId = x => x;

function psFocusedStructure(obj) {
    obj.structureId = psStructureId(obj.structureId);

    obj.properties = obj.properties.map(x => {
        x = psPropertyInfo(x);
        return x;
    });

    return obj;
}

function jsFocusedStructure(obj) {
    obj.structureId = jsStructureId(obj.structureId);

    obj.properties = obj.properties.map(x => {
        x = jsPropertyInfo(x);
        return x;
    });

    return obj;
}

const psFormatId = x => x;
const jsFormatId = x => x;
const psFormatDisplayId = x => x;
const jsFormatDisplayId = x => x;

function psRelatedFormat(obj) {
    obj.formatId = psFormatId(obj.formatId);
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

    return obj;
}

function jsRelatedFormat(obj) {
    obj.formatId = jsFormatId(obj.formatId);
    obj.displayId = jsFormatDisplayId(obj.displayId);
    obj.space = jsRelatedSpace(obj.space);
    obj.usage = jsFormatUsage(obj.usage);
    obj.creatorUser = jsRelatedUser(obj.creatorUser);
    obj.updaterUser = jsRelatedUser(obj.updaterUser);

    if (obj.semanticId instanceof Data_Maybe.Just) {
        obj.semanticId = obj.semanticId.value;
    } else {
        obj.semanticId = null;
    }

    return obj;
}

function psFocusedFormat(obj) {
    obj.formatId = psFormatId(obj.formatId);
    obj.displayId = psFormatDisplayId(obj.displayId);
    obj.space = psRelatedSpace(obj.space);
    obj.usage = psFormatUsage(obj.usage);
    obj.creatorUser = psRelatedUser(obj.creatorUser);
    obj.updaterUser = psRelatedUser(obj.updaterUser);
    obj.structure = psFocusedStructure(obj.structure);

    if (obj.semanticId) {
        obj.semanticId = new Data_Maybe.Just(obj.semanticId);
    } else {
        obj.semanticId = Data_Maybe.Nothing.value;
    }

    return obj;
}

function jsFocusedFormat(obj) {
    obj.formatId = jsFormatId(obj.formatId);
    obj.displayId = jsFormatDisplayId(obj.displayId);
    obj.space = jsRelatedSpace(obj.space);
    obj.usage = jsFormatUsage(obj.usage);
    obj.creatorUser = jsRelatedUser(obj.creatorUser);
    obj.updaterUser = jsRelatedUser(obj.updaterUser);
    obj.structure = jsFocusedStructure(obj.structure);

    if (obj.semanticId instanceof Data_Maybe.Just) {
        obj.semanticId = obj.semanticId.value;
    } else {
        obj.semanticId = null;
    }

    return obj;
}

const psContentId = x => x;
const jsContentId = x => x;
const psSemanticId = x => x;
const jsSemanticId = x => x;

function psRelatedContent(obj) {
    obj.contentId = psContentId(obj.contentId);
    obj.creatorUser = psRelatedUser(obj.creatorUser);
    obj.updaterUser = psRelatedUser(obj.updaterUser);
    obj.format = psFocusedFormat(obj.format);
    return obj;
}

function jsRelatedContent(obj) {
    obj.contentId = jsContentId(obj.contentId);
    obj.creatorUser = jsRelatedUser(obj.creatorUser);
    obj.updaterUser = jsRelatedUser(obj.updaterUser);
    obj.format = jsFocusedFormat(obj.format);
    return obj;
}

function psFocusedContent(obj) {
    obj.contentId = psContentId(obj.contentId);
    obj.creatorUser = psRelatedUser(obj.creatorUser);
    obj.updaterUser = psRelatedUser(obj.updaterUser);
    obj.format = psFocusedFormat(obj.format);

    if (obj.draftId) {
        obj.draftId = new Data_Maybe.Just(obj.draftId);
    } else {
        obj.draftId = Data_Maybe.Nothing.value;
    }

    return obj;
}

function jsFocusedContent(obj) {
    obj.contentId = jsContentId(obj.contentId);
    obj.creatorUser = jsRelatedUser(obj.creatorUser);
    obj.updaterUser = jsRelatedUser(obj.updaterUser);
    obj.format = jsFocusedFormat(obj.format);

    if (obj.draftId instanceof Data_Maybe.Just) {
        obj.draftId = obj.draftId.value;
    } else {
        obj.draftId = null;
    }

    return obj;
}

const psContentCommitId = x => x;
const jsContentCommitId = x => x;

function psRelatedContentCommit(obj) {
    obj.commitId = psContentCommitId(obj.commitId);
    obj.committerUser = psRelatedUser(obj.committerUser);
    return obj;
}

function jsRelatedContentCommit(obj) {
    obj.commitId = jsContentCommitId(obj.commitId);
    obj.committerUser = jsRelatedUser(obj.committerUser);
    return obj;
}

function psFocusedContentCommit(obj) {
    obj.commitId = psContentCommitId(obj.commitId);
    obj.committerUser = psRelatedUser(obj.committerUser);
    return obj;
}

function jsFocusedContentCommit(obj) {
    obj.commitId = jsContentCommitId(obj.commitId);
    obj.committerUser = jsRelatedUser(obj.committerUser);
    return obj;
}

const psContentDraftId = x => x;
const jsContentDraftId = x => x;

function psRelatedContentDraft(obj) {
    obj.draftId = psContentDraftId(obj.draftId);
    obj.format = psFocusedFormat(obj.format);
    obj.state = psEditingState(obj.state);
    return obj;
}

function jsRelatedContentDraft(obj) {
    obj.draftId = jsContentDraftId(obj.draftId);
    obj.format = jsFocusedFormat(obj.format);
    obj.state = jsEditingState(obj.state);
    return obj;
}

function psFocusedContentDraft(obj) {
    obj.draftId = psContentDraftId(obj.draftId);

    obj.materialDrafts = obj.materialDrafts.map(x => {
        x = psFocusedMaterialDraft(x);
        return x;
    });

    obj.state = psEditingState(obj.state);
    return obj;
}

function jsFocusedContentDraft(obj) {
    obj.draftId = jsContentDraftId(obj.draftId);

    obj.materialDrafts = obj.materialDrafts.map(x => {
        x = jsFocusedMaterialDraft(x);
        return x;
    });

    obj.state = jsEditingState(obj.state);
    return obj;
}

const psMaterialId = x => x;
const jsMaterialId = x => x;

function psRelatedMaterial(obj) {
    obj.materialId = psMaterialId(obj.materialId);
    obj.materialType = psMaterialType(obj.materialType);
    obj.creatorUser = psRelatedUser(obj.creatorUser);
    obj.updaterUser = psRelatedUser(obj.updaterUser);
    return obj;
}

function jsRelatedMaterial(obj) {
    obj.materialId = jsMaterialId(obj.materialId);
    obj.materialType = jsMaterialType(obj.materialType);
    obj.creatorUser = jsRelatedUser(obj.creatorUser);
    obj.updaterUser = jsRelatedUser(obj.updaterUser);
    return obj;
}

function psFocusedMaterial(obj) {
    obj.materialId = psMaterialId(obj.materialId);
    obj.materialType = psMaterialType(obj.materialType);
    obj.creatorUser = psRelatedUser(obj.creatorUser);
    obj.updaterUser = psRelatedUser(obj.updaterUser);
    obj.draft = psRelatedMaterialDraft(obj.draft);
    return obj;
}

function jsFocusedMaterial(obj) {
    obj.materialId = jsMaterialId(obj.materialId);
    obj.materialType = jsMaterialType(obj.materialType);
    obj.creatorUser = jsRelatedUser(obj.creatorUser);
    obj.updaterUser = jsRelatedUser(obj.updaterUser);
    obj.draft = jsRelatedMaterialDraft(obj.draft);
    return obj;
}

const psMaterialCommitId = x => x;
const jsMaterialCommitId = x => x;

function psRelatedMaterialCommit(obj) {
    obj.commitId = psMaterialCommitId(obj.commitId);
    obj.committerUser = psRelatedUser(obj.committerUser);
    return obj;
}

function jsRelatedMaterialCommit(obj) {
    obj.commitId = jsMaterialCommitId(obj.commitId);
    obj.committerUser = jsRelatedUser(obj.committerUser);
    return obj;
}

function psFocusedMaterialCommit(obj) {
    obj.commitId = psMaterialCommitId(obj.commitId);
    return obj;
}

function jsFocusedMaterialCommit(obj) {
    obj.commitId = jsMaterialCommitId(obj.commitId);
    return obj;
}

const psMaterialDraftId = x => x;
const jsMaterialDraftId = x => x;

function psRelatedMaterialDraft(obj) {
    obj.draftId = psMaterialDraftId(obj.draftId);
    return obj;
}

function jsRelatedMaterialDraft(obj) {
    obj.draftId = jsMaterialDraftId(obj.draftId);
    return obj;
}

function psFocusedMaterialDraft(obj) {
    obj.draftId = psMaterialDraftId(obj.draftId);
    obj.material = psRelatedMaterial(obj.material);
    return obj;
}

function jsFocusedMaterialDraft(obj) {
    obj.draftId = jsMaterialDraftId(obj.draftId);
    obj.material = jsRelatedMaterial(obj.material);
    return obj;
}

function psSnapshotSource(str) {
    switch (str) {
    case "commit":
        return E.SnapshotSourceCommit.value;
    case "snapshot":
        return E.SnapshotSourceSnapshot.value;
    case "editing":
        return E.SnapshotSourceEditing.value;
    case "draft":
        return E.SnapshotSourceDraft.value;
    }
}

function jsSnapshotSource(obj) {
    if (obj instanceof E.SnapshotSourceCommit) {
        return "commit";
    }

    if (obj instanceof E.SnapshotSourceSnapshot) {
        return "snapshot";
    }

    if (obj instanceof E.SnapshotSourceEditing) {
        return "editing";
    }

    if (obj instanceof E.SnapshotSourceDraft) {
        return "draft";
    }
}

function psNodeType(str) {
    switch (str) {
    case "committed":
        return E.NodeTypeCommitted.value;
    case "present":
        return E.NodeTypePresent.value;
    case "canceled":
        return E.NodeTypeCanceld.value;
    }
}

function jsNodeType(obj) {
    if (obj instanceof E.NodeTypeCommitted) {
        return "committed";
    }

    if (obj instanceof E.NodeTypePresent) {
        return "present";
    }

    if (obj instanceof E.NodeTypeCanceld) {
        return "canceled";
    }
}

const psMaterialSnapshotId = x => x;
const jsMaterialSnapshotId = x => x;

function psMaterialSnapshotStructure(obj) {
    obj.source = psSnapshotSource(obj.source);
    return obj;
}

function jsMaterialSnapshotStructure(obj) {
    obj.source = jsSnapshotSource(obj.source);
    return obj;
}

function psRelatedMaterialSnapshot(obj) {
    obj.snapshotId = psMaterialSnapshotId(obj.snapshotId);
    return obj;
}

function jsRelatedMaterialSnapshot(obj) {
    obj.snapshotId = jsMaterialSnapshotId(obj.snapshotId);
    return obj;
}

function psFocusedMaterialSnapshot(obj) {
    return obj;
}

function jsFocusedMaterialSnapshot(obj) {
    return obj;
}

function psMaterialNode(obj) {
    obj.type = psNodeType(obj.type);
    obj.user = psRelatedUser(obj.user);

    if (obj.editingId) {
        obj.editingId = new Data_Maybe.Just(obj.editingId);
    } else {
        obj.editingId = Data_Maybe.Nothing.value;
    }

    obj.snapshot = psRelatedMaterialSnapshot(obj.snapshot);
    return obj;
}

function jsMaterialNode(obj) {
    obj.type = jsNodeType(obj.type);
    obj.user = jsRelatedUser(obj.user);

    if (obj.editingId instanceof Data_Maybe.Just) {
        obj.editingId = obj.editingId.value;
    } else {
        obj.editingId = null;
    }

    obj.snapshot = jsRelatedMaterialSnapshot(obj.snapshot);
    return obj;
}

function psNodeTarget(str) {
    switch (str) {
    case "content":
        return E.NodeTargetContent.value;
    case "material":
        return E.NodeTargetMaterial.value;
    case "whole":
        return E.NodeTargetWhole.value;
    }
}

function jsNodeTarget(obj) {
    if (obj instanceof E.NodeTargetContent) {
        return "content";
    }

    if (obj instanceof E.NodeTargetMaterial) {
        return "material";
    }

    if (obj instanceof E.NodeTargetWhole) {
        return "whole";
    }
}

function psContentNode(obj) {
    obj.type = psNodeType(obj.type);
    obj.target = psNodeTarget(obj.target);
    obj.user = psRelatedUser(obj.user);

    if (obj.editingId) {
        obj.editingId = new Data_Maybe.Just(obj.editingId);
    } else {
        obj.editingId = Data_Maybe.Nothing.value;
    }

    obj.snapshot = psRelatedContentSnapshot(obj.snapshot);
    return obj;
}

function jsContentNode(obj) {
    obj.type = jsNodeType(obj.type);
    obj.target = jsNodeTarget(obj.target);
    obj.user = jsRelatedUser(obj.user);

    if (obj.editingId instanceof Data_Maybe.Just) {
        obj.editingId = obj.editingId.value;
    } else {
        obj.editingId = null;
    }

    obj.snapshot = jsRelatedContentSnapshot(obj.snapshot);
    return obj;
}

const psContentSnapshotId = x => x;
const jsContentSnapshotId = x => x;

function psContentSnapshotStructure(obj) {
    obj.source = psSnapshotSource(obj.source);

    obj.materials = obj.materials.map(x => {
        x = psMaterialSnapshotId(x);
        return x;
    });

    return obj;
}

function jsContentSnapshotStructure(obj) {
    obj.source = jsSnapshotSource(obj.source);

    obj.materials = obj.materials.map(x => {
        x = jsMaterialSnapshotId(x);
        return x;
    });

    return obj;
}

function psRelatedContentSnapshot(obj) {
    obj.snapshotId = psContentSnapshotId(obj.snapshotId);
    return obj;
}

function jsRelatedContentSnapshot(obj) {
    obj.snapshotId = jsContentSnapshotId(obj.snapshotId);
    return obj;
}

function psFocusedContentSnapshot(obj) {
    obj.materials = obj.materials.map(x => {
        x = psFocusedMaterialSnapshot(x);
        return x;
    });

    return obj;
}

function jsFocusedContentSnapshot(obj) {
    obj.materials = obj.materials.map(x => {
        x = jsFocusedMaterialSnapshot(x);
        return x;
    });

    return obj;
}

const psCrawlerId = x => x;
const jsCrawlerId = x => x;

function psIntactCrawler(obj) {
    obj.crawlerId = psCrawlerId(obj.crawlerId);
    obj.definitionId = psContentId(obj.definitionId);
    obj.spaceId = psSpaceId(obj.spaceId);

    if (obj.runningOperation) {
        obj.runningOperation = new Data_Maybe.Just(obj.runningOperation);
    } else {
        obj.runningOperation = Data_Maybe.Nothing.value;
    }

    return obj;
}

function jsIntactCrawler(obj) {
    obj.crawlerId = jsCrawlerId(obj.crawlerId);
    obj.definitionId = jsContentId(obj.definitionId);
    obj.spaceId = jsSpaceId(obj.spaceId);

    if (obj.runningOperation instanceof Data_Maybe.Just) {
        obj.runningOperation = obj.runningOperation.value;
    } else {
        obj.runningOperation = null;
    }

    return obj;
}

const psCrawlerOperationId = x => x;
const jsCrawlerOperationId = x => x;

function psIntactCrawlerOperation(obj) {
    obj.operationId = psCrawlerOperationId(obj.operationId);
    obj.executorUser = psRelatedUser(obj.executorUser);
    obj.method = psCrawlerOperationMethod(obj.method);

    if (obj.startedAt) {
        obj.startedAt = new Data_Maybe.Just(obj.startedAt);
    } else {
        obj.startedAt = Data_Maybe.Nothing.value;
    }

    if (obj.endedAt) {
        obj.endedAt = new Data_Maybe.Just(obj.endedAt);
    } else {
        obj.endedAt = Data_Maybe.Nothing.value;
    }

    obj.status = psCrawlerOperationStatus(obj.status);
    return obj;
}

function jsIntactCrawlerOperation(obj) {
    obj.operationId = jsCrawlerOperationId(obj.operationId);
    obj.executorUser = jsRelatedUser(obj.executorUser);
    obj.method = jsCrawlerOperationMethod(obj.method);

    if (obj.startedAt instanceof Data_Maybe.Just) {
        obj.startedAt = obj.startedAt.value;
    } else {
        obj.startedAt = null;
    }

    if (obj.endedAt instanceof Data_Maybe.Just) {
        obj.endedAt = obj.endedAt.value;
    } else {
        obj.endedAt = null;
    }

    obj.status = jsCrawlerOperationStatus(obj.status);
    return obj;
}

const psCrawlerTaskId = x => x;
const jsCrawlerTaskId = x => x;

function psIntactCrawlerTask(obj) {
    obj.taskId = psCrawlerTaskId(obj.taskId);
    obj.scraperId = psContentId(obj.scraperId);

    if (obj.startedAt) {
        obj.startedAt = new Data_Maybe.Just(obj.startedAt);
    } else {
        obj.startedAt = Data_Maybe.Nothing.value;
    }

    if (obj.endedAt) {
        obj.endedAt = new Data_Maybe.Just(obj.endedAt);
    } else {
        obj.endedAt = Data_Maybe.Nothing.value;
    }

    if (obj.message) {
        obj.message = new Data_Maybe.Just(obj.message);
    } else {
        obj.message = Data_Maybe.Nothing.value;
    }

    obj.output = psCrawlerTaskOutput(obj.output);
    obj.cacheId = psCrawlerCacheId(obj.cacheId);
    return obj;
}

function jsIntactCrawlerTask(obj) {
    obj.taskId = jsCrawlerTaskId(obj.taskId);
    obj.scraperId = jsContentId(obj.scraperId);

    if (obj.startedAt instanceof Data_Maybe.Just) {
        obj.startedAt = obj.startedAt.value;
    } else {
        obj.startedAt = null;
    }

    if (obj.endedAt instanceof Data_Maybe.Just) {
        obj.endedAt = obj.endedAt.value;
    } else {
        obj.endedAt = null;
    }

    if (obj.message instanceof Data_Maybe.Just) {
        obj.message = obj.message.value;
    } else {
        obj.message = null;
    }

    obj.output = jsCrawlerTaskOutput(obj.output);
    obj.cacheId = jsCrawlerCacheId(obj.cacheId);
    return obj;
}

const psCrawlerCacheId = x => x;
const jsCrawlerCacheId = x => x;

function psIntendCrawlerCache(obj) {
    obj.cacheId = psCrawlerCacheId(obj.cacheId);
    obj.operationId = psCrawlerOperationId(obj.operationId);
    obj.scraperId = psContentId(obj.scraperId);
    obj.status = psCrawlerCacheStatus(obj.status);
    return obj;
}

function jsIntendCrawlerCache(obj) {
    obj.cacheId = jsCrawlerCacheId(obj.cacheId);
    obj.operationId = jsCrawlerOperationId(obj.operationId);
    obj.scraperId = jsContentId(obj.scraperId);
    obj.status = jsCrawlerCacheStatus(obj.status);
    return obj;
}

const psReactorId = x => x;
const jsReactorId = x => x;

function psIntactReactor(obj) {
    obj.reactorId = psReactorId(obj.reactorId);
    obj.space = psRelatedSpace(obj.space);
    obj.format = psRelatedFormat(obj.format);
    obj.state = psReactorState(obj.state);
    obj.definitionId = psContentId(obj.definitionId);
    obj.creatorUser = psRelatedUser(obj.creatorUser);
    return obj;
}

function jsIntactReactor(obj) {
    obj.reactorId = jsReactorId(obj.reactorId);
    obj.space = jsRelatedSpace(obj.space);
    obj.format = jsRelatedFormat(obj.format);
    obj.state = jsReactorState(obj.state);
    obj.definitionId = jsContentId(obj.definitionId);
    obj.creatorUser = jsRelatedUser(obj.creatorUser);
    return obj;
}

exports.getContents = function(spaceId) {
    return async function(formatId) {
        let args = {
            spaceId,
            formatId
        };

        args.spaceId = jsSpaceId(args.spaceId);
        args.formatId = jsFormatId(args.formatId);
        let result = await fetch("getContents", args);

        result = result.map(x => {
            x = psRelatedContent(x);
            return x;
        });

        return result;
    };
};

exports.startContentEditing = function(contentId) {
    return async function(forkedCommitId) {
        let args = {
            contentId,
            forkedCommitId
        };

        args.contentId = jsContentId(args.contentId);

        if (args.forkedCommitId instanceof Data_Maybe.Just) {
            args.forkedCommitId = args.forkedCommitId.value;
        } else {
            args.forkedCommitId = null;
        }

        let result = await fetch("startContentEditing", args);
        result = psRelatedContentDraft(result);
        return result;
    };
};

exports.startBlankContentEditing = function(spaceId) {
    return function(displayName) {
        return async function(type) {
            let args = {
                spaceId,
                displayName,
                type
            };

            args.spaceId = jsSpaceId(args.spaceId);
            args.type = jsMaterialType(args.type);
            let result = await fetch("startBlankContentEditing", args);
            result = psRelatedContentDraft(result);
            return result;
        };
    };
};

exports.editContent = function(contentDraftId) {
    return async function(data) {
        let args = {
            contentDraftId,
            data
        };

        args.contentDraftId = jsContentDraftId(args.contentDraftId);
        let result = await fetch("editContent", args);

        if (result) {
            result = new Data_Maybe.Just(result);
        } else {
            result = Data_Maybe.Nothing.value;
        }

        return result;
    };
};

exports.commitContent = function(contentDraftId) {
    return async function(data) {
        let args = {
            contentDraftId,
            data
        };

        args.contentDraftId = jsContentDraftId(args.contentDraftId);
        let result = await fetch("commitContent", args);

        if (result) {
            result = new Data_Maybe.Just(result);
        } else {
            result = Data_Maybe.Nothing.value;
        }

        return result;
    };
};

exports.getContent = async function(contentId) {
    let args = {
        contentId
    };

    args.contentId = jsContentId(args.contentId);
    let result = await fetch("getContent", args);
    result = psFocusedContent(result);
    return result;
};

exports.getRelatedContent = async function(contentId) {
    let args = {
        contentId
    };

    args.contentId = jsContentId(args.contentId);
    let result = await fetch("getRelatedContent", args);
    result = psRelatedContent(result);
    return result;
};

exports.getMyContentDrafts = async function() {
    let result = await fetch("getMyContentDrafts", args);

    result = result.map(x => {
        x = psRelatedContentDraft(x);
        return x;
    });

    return result;
}();

exports.getContentDraft = async function(draftId) {
    let args = {
        draftId
    };

    args.draftId = jsContentDraftId(args.draftId);
    let result = await fetch("getContentDraft", args);
    result = psFocusedContentDraft(result);
    return result;
};

exports.getContentCommits = async function(contentId) {
    let args = {
        contentId
    };

    args.contentId = jsContentId(args.contentId);
    let result = await fetch("getContentCommits", args);

    result = result.map(x => {
        x = psRelatedContentCommit(x);
        return x;
    });

    return result;
};

exports.getContentEditingNodes = async function(draftId) {
    let args = {
        draftId
    };

    args.draftId = jsContentDraftId(args.draftId);
    let result = await fetch("getContentEditingNodes", args);

    result = result.map(x => {
        x = psContentNode(x);
        return x;
    });

    return result;
};

exports.getContentSnapshot = async function(snapshotId) {
    let args = {
        snapshotId
    };

    args.snapshotId = jsContentSnapshotId(args.snapshotId);
    let result = await fetch("getContentSnapshot", args);
    result = psFocusedContentSnapshot(result);
    return result;
};

exports.getContentCommit = async function(commitId) {
    let args = {
        commitId
    };

    args.commitId = jsContentCommitId(args.commitId);
    let result = await fetch("getContentCommit", args);
    result = psFocusedContentSnapshot(result);
    return result;
};

exports.createFormat = async function(args) {
    args.spaceId = jsSpaceId(args.spaceId);
    args.usage = jsFormatUsage(args.usage);

    args.properties = args.properties.map(x => {
        x = jsPropertyInfo(x);
        return x;
    });

    let result = await fetch("createFormat", args);
    result = psRelatedFormat(result);
    return result;
};

exports.getFormat = async function(formatDisplayId) {
    let args = {
        formatDisplayId
    };

    args.formatDisplayId = jsFormatDisplayId(args.formatDisplayId);
    let result = await fetch("getFormat", args);
    result = psFocusedFormat(result);
    return result;
};

exports.getFocusedFormat = async function(formatId) {
    let args = {
        formatId
    };

    args.formatId = jsFormatId(args.formatId);
    let result = await fetch("getFocusedFormat", args);
    result = psFocusedFormat(result);
    return result;
};

exports.getRelatedFormat = async function(formatId) {
    let args = {
        formatId
    };

    args.formatId = jsFormatId(args.formatId);
    let result = await fetch("getRelatedFormat", args);
    result = psRelatedFormat(result);
    return result;
};

exports.getFormats = async function(spaceId) {
    let args = {
        spaceId
    };

    args.spaceId = jsSpaceId(args.spaceId);
    let result = await fetch("getFormats", args);

    result = result.map(x => {
        x = psRelatedFormat(x);
        return x;
    });

    return result;
};

exports.updateFormatStructure = function(formatId) {
    return async function(properties) {
        let args = {
            formatId,
            properties
        };

        args.formatId = jsFormatId(args.formatId);

        args.properties = args.properties.map(x => {
            x = jsPropertyInfo(x);
            return x;
        });

        let result = await fetch("updateFormatStructure", args);
        return result;
    };
};

exports.startMaterialEditing = function(materialId) {
    return async function(forkedCommitId) {
        let args = {
            materialId,
            forkedCommitId
        };

        args.materialId = jsMaterialId(args.materialId);

        if (args.forkedCommitId instanceof Data_Maybe.Just) {
            args.forkedCommitId = args.forkedCommitId.value;
        } else {
            args.forkedCommitId = null;
        }

        let result = await fetch("startMaterialEditing", args);
        result = psRelatedMaterialDraft(result);
        return result;
    };
};

exports.startBlankMaterialEditing = function(spaceId) {
    return function(displayName) {
        return async function(type) {
            let args = {
                spaceId,
                displayName,
                type
            };

            args.spaceId = jsSpaceId(args.spaceId);
            args.type = jsMaterialType(args.type);
            let result = await fetch("startBlankMaterialEditing", args);
            result = psRelatedMaterialDraft(result);
            return result;
        };
    };
};

exports.editMaterial = function(materialDraftId) {
    return async function(data) {
        let args = {
            materialDraftId,
            data
        };

        args.materialDraftId = jsMaterialDraftId(args.materialDraftId);
        let result = await fetch("editMaterial", args);

        if (result) {
            result = new Data_Maybe.Just(result);
        } else {
            result = Data_Maybe.Nothing.value;
        }

        return result;
    };
};

exports.commitMaterial = function(materialDraftId) {
    return async function(data) {
        let args = {
            materialDraftId,
            data
        };

        args.materialDraftId = jsMaterialDraftId(args.materialDraftId);
        let result = await fetch("commitMaterial", args);

        if (result) {
            result = new Data_Maybe.Just(result);
        } else {
            result = Data_Maybe.Nothing.value;
        }

        return result;
    };
};

exports.getMaterial = async function(materialId) {
    let args = {
        materialId
    };

    args.materialId = jsMaterialId(args.materialId);
    let result = await fetch("getMaterial", args);
    result = psFocusedMaterial(result);
    return result;
};

exports.getMyMaterialDrafts = async function() {
    let result = await fetch("getMyMaterialDrafts", args);

    result = result.map(x => {
        x = psRelatedMaterialDraft(x);
        return x;
    });

    return result;
}();

exports.getMaterialDraft = async function(draftId) {
    let args = {
        draftId
    };

    args.draftId = jsMaterialDraftId(args.draftId);
    let result = await fetch("getMaterialDraft", args);
    result = psFocusedMaterialDraft(result);
    return result;
};

exports.getMaterialCommits = async function(materialId) {
    let args = {
        materialId
    };

    args.materialId = jsMaterialId(args.materialId);
    let result = await fetch("getMaterialCommits", args);

    result = result.map(x => {
        x = psRelatedMaterialCommit(x);
        return x;
    });

    return result;
};

exports.getMaterialEditingNodes = async function(draftId) {
    let args = {
        draftId
    };

    args.draftId = jsMaterialDraftId(args.draftId);
    let result = await fetch("getMaterialEditingNodes", args);

    result = result.map(x => {
        x = psMaterialNode(x);
        return x;
    });

    return result;
};

exports.getMaterialSnapshot = async function(snapshotId) {
    let args = {
        snapshotId
    };

    args.snapshotId = jsMaterialSnapshotId(args.snapshotId);
    let result = await fetch("getMaterialSnapshot", args);
    result = psFocusedMaterialSnapshot(result);
    return result;
};

exports.getMaterialCommit = async function(commitId) {
    let args = {
        commitId
    };

    args.commitId = jsMaterialCommitId(args.commitId);
    let result = await fetch("getMaterialCommit", args);
    result = psFocusedMaterialCommit(result);
    return result;
};

exports.createSpace = async function(args) {
    let result = await fetch("createSpace", args);
    result = psFocusedSpace(result);
    return result;
};

exports.getSpace = async function(spaceDisplayId) {
    let args = {
        spaceDisplayId
    };

    args.spaceDisplayId = jsSpaceDisplayId(args.spaceDisplayId);
    let result = await fetch("getSpace", args);
    result = psFocusedSpace(result);
    return result;
};

exports.getRelatedSpace = async function(spaceId) {
    let args = {
        spaceId
    };

    args.spaceId = jsSpaceId(args.spaceId);
    let result = await fetch("getRelatedSpace", args);
    result = psRelatedSpace(result);
    return result;
};

exports.getSpaceMembers = async function(spaceId) {
    let args = {
        spaceId
    };

    args.spaceId = jsSpaceId(args.spaceId);
    let result = await fetch("getSpaceMembers", args);

    result = result.map(x => {
        x = psIntactSpaceMember(x);
        return x;
    });

    return result;
};

exports.getSpaceMembershipApplications = async function(space) {
    let args = {
        space
    };

    args.space = jsSpaceId(args.space);
    let result = await fetch("getSpaceMembershipApplications", args);

    result = result.map(x => {
        x = psIntactSpaceMembershipApplication(x);
        return x;
    });

    return result;
};

exports.checkSpaceDisplayId = async function(spaceDisplayId) {
    let args = {
        spaceDisplayId
    };

    args.spaceDisplayId = jsSpaceDisplayId(args.spaceDisplayId);
    let result = await fetch("checkSpaceDisplayId", args);
    return result;
};

exports.getMySpaces = async function() {
    let result = await fetch("getMySpaces", args);

    result = result.map(x => {
        x = psRelatedSpace(x);
        return x;
    });

    return result;
}();

exports.getPublishedSpaces = async function() {
    let result = await fetch("getPublishedSpaces", args);

    result = result.map(x => {
        x = psRelatedSpace(x);
        return x;
    });

    return result;
}();

exports.setSpaceDisplayId = function(spaceId) {
    return async function(spaceDisplayId) {
        let args = {
            spaceId,
            spaceDisplayId
        };

        args.spaceId = jsSpaceId(args.spaceId);
        args.spaceDisplayId = jsSpaceDisplayId(args.spaceDisplayId);
        let result = await fetch("setSpaceDisplayId", args);
        return result;
    };
};

exports.setSpaceDisplayName = function(spaceId) {
    return async function(displayName) {
        let args = {
            spaceId,
            displayName
        };

        args.spaceId = jsSpaceId(args.spaceId);
        let result = await fetch("setSpaceDisplayName", args);
        return result;
    };
};

exports.setSpaceAuthority = function(spaceId) {
    return async function(auth) {
        let args = {
            spaceId,
            auth
        };

        args.spaceId = jsSpaceId(args.spaceId);
        args.auth = jsSpaceAuth(args.auth);
        let result = await fetch("setSpaceAuthority", args);
        return result;
    };
};

exports.setSpacePublished = function(spaceId) {
    return async function(published) {
        let args = {
            spaceId,
            published
        };

        args.spaceId = jsSpaceId(args.spaceId);
        let result = await fetch("setSpacePublished", args);
        return result;
    };
};

exports.applySpaceMembership = async function(spaceId) {
    let args = {
        spaceId
    };

    args.spaceId = jsSpaceId(args.spaceId);
    let result = await fetch("applySpaceMembership", args);
    return result;
};

exports.acceptSpaceMembership = function(spaceId) {
    return async function(userId) {
        let args = {
            spaceId,
            userId
        };

        args.spaceId = jsSpaceId(args.spaceId);
        args.userId = jsUserId(args.userId);
        let result = await fetch("acceptSpaceMembership", args);
        return result;
    };
};

exports.rejectSpaceMembership = function(spaceId) {
    return async function(userId) {
        let args = {
            spaceId,
            userId
        };

        args.spaceId = jsSpaceId(args.spaceId);
        args.userId = jsUserId(args.userId);
        let result = await fetch("rejectSpaceMembership", args);
        return result;
    };
};

exports.cancelSpaceMembershipApplication = async function(spaceId) {
    let args = {
        spaceId
    };

    args.spaceId = jsSpaceId(args.spaceId);
    let result = await fetch("cancelSpaceMembershipApplication", args);
    return result;
};

exports.setSpaceMembershipMethod = function(spaceId) {
    return async function(membershipMethod) {
        let args = {
            spaceId,
            membershipMethod
        };

        args.spaceId = jsSpaceId(args.spaceId);
        args.membershipMethod = jsMembershipMethod(args.membershipMethod);
        let result = await fetch("setSpaceMembershipMethod", args);
        return result;
    };
};

exports.createUser = async function(args) {
    let result = await fetch("createUser", args);
    result = psFocusedUser(result);
    return result;
};

exports.getMyUser = async function() {
    let result = await fetch("getMyUser", args);
    result = psFocusedUser(result);
    return result;
}();

exports.getMyAccount = async function() {
    let result = await fetch("getMyAccount", args);
    result = psIntactAccount(result);
    return result;
}();

exports.getUser = async function(displayId) {
    let args = {
        displayId
    };

    args.displayId = jsUserDisplayId(args.displayId);
    let result = await fetch("getUser", args);
    result = psFocusedUser(result);
    return result;
};

exports.authenticate = async function(args) {
    let result = await fetch("authenticate", args);
    return result;
};

exports.getFocusedUser = async function(userId) {
    let args = {
        userId
    };

    args.userId = jsUserId(args.userId);
    let result = await fetch("getFocusedUser", args);
    result = psFocusedUser(result);
    return result;
};

exports.getRelatedUser = async function(userId) {
    let args = {
        userId
    };

    args.userId = jsUserId(args.userId);
    let result = await fetch("getRelatedUser", args);
    result = psRelatedUser(result);
    return result;
};

exports.setMyDisplayName = async function(displayName) {
    let args = {
        displayName
    };

    let result = await fetch("setMyDisplayName", args);
    return result;
};

exports.setMyDisplayId = async function(displayId) {
    let args = {
        displayId
    };

    args.displayId = jsUserDisplayId(args.displayId);
    let result = await fetch("setMyDisplayId", args);
    return result;
};

exports.setMyPassword = async function(args) {
    let result = await fetch("setMyPassword", args);
    return result;
};

exports.setMyEmail = async function(email) {
    let args = {
        email
    };

    let result = await fetch("setMyEmail", args);
    return result;
};

exports.setMyIcon = async function(icon) {
    let args = {
        icon
    };

    let result = await fetch("setMyIcon", args);
    return result;
};

exports.createCrawler = function(spaceId) {
    return function(definitionId) {
        return async function(displayName) {
            let args = {
                spaceId,
                definitionId,
                displayName
            };

            args.spaceId = jsSpaceId(args.spaceId);
            args.definitionId = jsContentId(args.definitionId);
            let result = await fetch("createCrawler", args);
            result = psIntactCrawler(result);
            return result;
        };
    };
};

exports.getCrawlers = async function(spaceId) {
    let args = {
        spaceId
    };

    args.spaceId = jsSpaceId(args.spaceId);
    let result = await fetch("getCrawlers", args);

    result = result.map(x => {
        x = psIntactCrawler(x);
        return x;
    });

    return result;
};

exports.getCrawler = async function(crawlerId) {
    let args = {
        crawlerId
    };

    args.crawlerId = jsCrawlerId(args.crawlerId);
    let result = await fetch("getCrawler", args);
    result = psIntactCrawler(result);
    return result;
};

exports.runCrawler = function(crawlerId) {
    return async function(method) {
        let args = {
            crawlerId,
            method
        };

        args.crawlerId = jsCrawlerId(args.crawlerId);
        args.method = jsCrawlerOperationMethod(args.method);
        let result = await fetch("runCrawler", args);
        return result;
    };
};

exports.beginCrawlingTask = async function(taskId) {
    let args = {
        taskId
    };

    args.taskId = jsCrawlerTaskId(args.taskId);
    let result = await fetch("beginCrawlingTask", args);
    return result;
};

exports.completeCrawlingTask = function(taskId) {
    return async function(output) {
        let args = {
            taskId,
            output
        };

        args.taskId = jsCrawlerTaskId(args.taskId);
        args.output = jsCrawlerTaskOutput(args.output);
        let result = await fetch("completeCrawlingTask", args);
        return result;
    };
};

exports.failedCrawlingTask = async function(args) {
    args.taskId = jsCrawlerTaskId(args.taskId);
    let result = await fetch("failedCrawlingTask", args);
    return result;
};

exports.getReactor = async function(reactorId) {
    let args = {
        reactorId
    };

    args.reactorId = jsReactorId(args.reactorId);
    let result = await fetch("getReactor", args);
    result = psIntactReactor(result);
    return result;
};

exports.setReactorDefinitionId = function(reactorId) {
    return async function(definitionId) {
        let args = {
            reactorId,
            definitionId
        };

        args.reactorId = jsReactorId(args.reactorId);
        args.definitionId = jsContentId(args.definitionId);
        let result = await fetch("setReactorDefinitionId", args);
        return result;
    };
};