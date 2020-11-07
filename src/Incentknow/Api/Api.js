var Data_Maybe = require("../Data.Maybe/index.js");
var E = require("../Incentknow.Data.Entities/index.js");
const endpoint = "https://api.incentknow.com";

async function fetch(method, args) {
    const response = await fetch(endpoint + method, {
        method: "POST",
        body: args,

        headers: {
            "Content-Type": "application/json"
        }
    });

    return await response.json();
}

function psMembershipMethod(str) {
    switch (str) {
    case "none":
        return E.MembershipMethodNone.value;
    case "app":
        return E.App.value;
    }
}

function jsMembershipMethod(obj) {
    if (obj instanceof E.MembershipMethodNone) {
        return "none";
    }

    if (obj instanceof E.App) {
        return "app";
    }
}

function psSpaceAuth(str) {
    switch (str) {
    case "none":
        return E.SpaceAuthNone.value;
    case "visible":
        return E.Visible.value;
    case "readable":
        return E.Readable.value;
    case "writable":
        return E.Writable.value;
    }
}

function jsSpaceAuth(obj) {
    if (obj instanceof E.SpaceAuthNone) {
        return "none";
    }

    if (obj instanceof E.Visible) {
        return "visible";
    }

    if (obj instanceof E.Readable) {
        return "readable";
    }

    if (obj instanceof E.Writable) {
        return "writable";
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

function psContentGenerator(str) {
    switch (str) {
    case "reactor":
        return E.Reactor.value;
    case "crawler":
        return E.Crawler.value;
    }
}

function jsContentGenerator(obj) {
    if (obj instanceof E.Reactor) {
        return "reactor";
    }

    if (obj instanceof E.Crawler) {
        return "crawler";
    }
}

function psTypeName(str) {
    switch (str) {
    case "integer":
        return E.Int.value;
    case "boolean":
        return E.Bool.value;
    case "string":
        return E.String.value;
    case "format":
        return E.Format.value;
    case "space":
        return E.Space.value;
    case "content":
        return E.TypeNameContent.value;
    case "url":
        return E.Url.value;
    case "object":
        return E.Object.value;
    case "text":
        return E.Text.value;
    case "array":
        return E.Array.value;
    case "code":
        return E.Code.value;
    }
}

function jsTypeName(obj) {
    if (obj instanceof E.Int) {
        return "integer";
    }

    if (obj instanceof E.Bool) {
        return "boolean";
    }

    if (obj instanceof E.String) {
        return "string";
    }

    if (obj instanceof E.Format) {
        return "format";
    }

    if (obj instanceof E.Space) {
        return "space";
    }

    if (obj instanceof E.TypeNameContent) {
        return "content";
    }

    if (obj instanceof E.Url) {
        return "url";
    }

    if (obj instanceof E.Object) {
        return "object";
    }

    if (obj instanceof E.Text) {
        return "text";
    }

    if (obj instanceof E.Array) {
        return "array";
    }

    if (obj instanceof E.Code) {
        return "code";
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
        return E.Folder.value;
    case "document":
        return E.Document.value;
    }
}

function jsMaterialType(obj) {
    if (obj instanceof E.Folder) {
        return "folder";
    }

    if (obj instanceof E.Document) {
        return "document";
    }
}

const psContainerId = x => x;
const jsContainerId = x => x;

function psIntactContainer(obj) {
    obj.entityId = psContainerId(obj.entityId);
    obj.space = psRelatedSpace(obj.space);
    obj.format = psRelatedFormat(obj.format);
    return obj;
}

function jsIntactContainer(obj) {
    obj.entityId = jsContainerId(obj.entityId);
    obj.space = jsRelatedSpace(obj.space);
    obj.format = jsRelatedFormat(obj.format);
    return obj;
}

const psSpaceId = x => x;
const jsSpaceId = x => x;
const psSpaceDisplayId = x => x;
const jsSpaceDisplayId = x => x;

function psRelatedSpace(obj) {
    obj.entityId = psSpaceId(obj.entityId);
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
    obj.entityId = jsSpaceId(obj.entityId);
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
    obj.entityId = psSpaceId(obj.entityId);
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
    obj.entityId = jsSpaceId(obj.entityId);
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

function psFocusedSpaceMember(obj) {
    obj.user = psRelatedUser(obj.user);
    obj.type = psMemberType(obj.type);
    return obj;
}

function jsFocusedSpaceMember(obj) {
    obj.user = jsRelatedUser(obj.user);
    obj.type = jsMemberType(obj.type);
    return obj;
}

const psUserId = x => x;
const jsUserId = x => x;
const psUserDisplayId = x => x;
const jsUserDisplayId = x => x;

function psRelatedUser(obj) {
    obj.entityId = psUserId(obj.entityId);
    obj.displayId = psUserDisplayId(obj.displayId);

    if (obj.iconUrl) {
        obj.iconUrl = new Data_Maybe.Just(obj.iconUrl);
    } else {
        obj.iconUrl = Data_Maybe.Nothing.value;
    }

    return obj;
}

function jsRelatedUser(obj) {
    obj.entityId = jsUserId(obj.entityId);
    obj.displayId = jsUserDisplayId(obj.displayId);

    if (obj.iconUrl instanceof Data_Maybe.Just) {
        obj.iconUrl = obj.iconUrl.value;
    } else {
        obj.iconUrl = null;
    }

    return obj;
}

function psFocusedUser(obj) {
    obj.entityId = psUserId(obj.entityId);
    obj.displayId = psUserDisplayId(obj.displayId);

    if (obj.iconUrl) {
        obj.iconUrl = new Data_Maybe.Just(obj.iconUrl);
    } else {
        obj.iconUrl = Data_Maybe.Nothing.value;
    }

    return obj;
}

function jsFocusedUser(obj) {
    obj.entityId = jsUserId(obj.entityId);
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

function psType(obj) {
    switch (obj.name) {
    case "integer":
        return new E.IntType(obj);
    case "boolean":
        return new E.BoolType(obj);
    case "string":
        return new E.StringType(obj);
    case "format":
        return new E.FormatType(obj);
    case "space":
        return new E.SpaceType(obj);
    case "content":
        return new E.ContentType(obj);
    case "url":
        return new E.UrlType(obj);
    case "object":
        return new E.ObjectType(obj);
    case "text":
        return new E.TextType(obj);
    case "array":
        return new E.ArrayType(obj);
    case "code":
        return new E.CodeType(obj);
    }
}

function jsType(obj) {
    if (obj instanceof E.IntType) {
        obj.value.name = "integer";
        return obj.value;
    }

    if (obj instanceof E.BoolType) {
        obj.value.name = "boolean";
        return obj.value;
    }

    if (obj instanceof E.StringType) {
        obj.value.name = "string";
        return obj.value;
    }

    if (obj instanceof E.FormatType) {
        obj.value.name = "format";
        return obj.value;
    }

    if (obj instanceof E.SpaceType) {
        obj.value.name = "space";
        return obj.value;
    }

    if (obj instanceof E.ContentType) {
        obj.value.name = "content";
        return obj.value;
    }

    if (obj instanceof E.UrlType) {
        obj.value.name = "url";
        return obj.value;
    }

    if (obj instanceof E.ObjectType) {
        obj.value.name = "object";
        return obj.value;
    }

    if (obj instanceof E.TextType) {
        obj.value.name = "text";
        return obj.value;
    }

    if (obj instanceof E.ArrayType) {
        obj.value.name = "array";
        return obj.value;
    }

    if (obj instanceof E.CodeType) {
        obj.value.name = "code";
        return obj.value;
    }
}

const psStructureId = x => x;
const jsStructureId = x => x;

function psFocusedStructure(obj) {
    obj.entityId = psStructureId(obj.entityId);

    obj.properties = obj.properties.map(x => {
        x = psPropertyInfo(x);
        return x;
    });

    return obj;
}

function jsFocusedStructure(obj) {
    obj.entityId = jsStructureId(obj.entityId);

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
    obj.entityId = psFormatId(obj.entityId);
    obj.displayId = psFormatDisplayId(obj.displayId);
    obj.space = psRelatedSpace(obj.space);
    obj.generator = psContentGenerator(obj.generator);
    obj.usage = psFormatUsage(obj.usage);
    obj.creatorUser = psRelatedUser(obj.creatorUser);
    obj.updaterUser = psRelatedUser(obj.updaterUser);
    return obj;
}

function jsRelatedFormat(obj) {
    obj.entityId = jsFormatId(obj.entityId);
    obj.displayId = jsFormatDisplayId(obj.displayId);
    obj.space = jsRelatedSpace(obj.space);
    obj.generator = jsContentGenerator(obj.generator);
    obj.usage = jsFormatUsage(obj.usage);
    obj.creatorUser = jsRelatedUser(obj.creatorUser);
    obj.updaterUser = jsRelatedUser(obj.updaterUser);
    return obj;
}

function psFocusedFormat(obj) {
    obj.entityId = psFormatId(obj.entityId);
    obj.displayId = psFormatDisplayId(obj.displayId);
    obj.space = psRelatedSpace(obj.space);
    obj.generator = psContentGenerator(obj.generator);
    obj.usage = psFormatUsage(obj.usage);
    obj.creatorUser = psRelatedUser(obj.creatorUser);
    obj.updaterUser = psRelatedUser(obj.updaterUser);
    obj.structure = psFocusedStructure(obj.structure);
    return obj;
}

function jsFocusedFormat(obj) {
    obj.entityId = jsFormatId(obj.entityId);
    obj.displayId = jsFormatDisplayId(obj.displayId);
    obj.space = jsRelatedSpace(obj.space);
    obj.generator = jsContentGenerator(obj.generator);
    obj.usage = jsFormatUsage(obj.usage);
    obj.creatorUser = jsRelatedUser(obj.creatorUser);
    obj.updaterUser = jsRelatedUser(obj.updaterUser);
    obj.structure = jsFocusedStructure(obj.structure);
    return obj;
}

const psContentId = x => x;
const jsContentId = x => x;

function psFocusedContent(obj) {
    obj.entityId = psContentId(obj.entityId);
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
    obj.entityId = jsContentId(obj.entityId);
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
    obj.entityId = psContentCommitId(obj.entityId);
    obj.committerUser = psRelatedUser(obj.committerUser);
    return obj;
}

function jsRelatedContentCommit(obj) {
    obj.entityId = jsContentCommitId(obj.entityId);
    obj.committerUser = jsRelatedUser(obj.committerUser);
    return obj;
}

function psFocusedContentCommit(obj) {
    obj.entityId = psContentCommitId(obj.entityId);
    obj.committerUser = psRelatedUser(obj.committerUser);
    return obj;
}

function jsFocusedContentCommit(obj) {
    obj.entityId = jsContentCommitId(obj.entityId);
    obj.committerUser = jsRelatedUser(obj.committerUser);
    return obj;
}

const psContentDraftId = x => x;
const jsContentDraftId = x => x;

function psRelatedContentDraft(obj) {
    obj.entityId = psContentDraftId(obj.entityId);
    return obj;
}

function jsRelatedContentDraft(obj) {
    obj.entityId = jsContentDraftId(obj.entityId);
    return obj;
}

function psFocusedContentDraft(obj) {
    obj.entityId = psContentDraftId(obj.entityId);

    obj.materialDrafts = obj.materialDrafts.map(x => {
        x = psFocusedMaterialDraft(x);
        return x;
    });

    return obj;
}

function jsFocusedContentDraft(obj) {
    obj.entityId = jsContentDraftId(obj.entityId);

    obj.materialDrafts = obj.materialDrafts.map(x => {
        x = jsFocusedMaterialDraft(x);
        return x;
    });

    return obj;
}

const psMaterialId = x => x;
const jsMaterialId = x => x;

function psRelatedMaterial(obj) {
    obj.entityId = psMaterialId(obj.entityId);
    obj.materialType = psMaterialType(obj.materialType);
    obj.creatorUser = psRelatedUser(obj.creatorUser);
    obj.updaterUser = psRelatedUser(obj.updaterUser);
    return obj;
}

function jsRelatedMaterial(obj) {
    obj.entityId = jsMaterialId(obj.entityId);
    obj.materialType = jsMaterialType(obj.materialType);
    obj.creatorUser = jsRelatedUser(obj.creatorUser);
    obj.updaterUser = jsRelatedUser(obj.updaterUser);
    return obj;
}

function psFocusedMaterial(obj) {
    obj.entityId = psMaterialId(obj.entityId);
    obj.materialType = psMaterialType(obj.materialType);
    obj.creatorUser = psRelatedUser(obj.creatorUser);
    obj.updaterUser = psRelatedUser(obj.updaterUser);
    obj.draft = psRelatedMaterialDraft(obj.draft);
    return obj;
}

function jsFocusedMaterial(obj) {
    obj.entityId = jsMaterialId(obj.entityId);
    obj.materialType = jsMaterialType(obj.materialType);
    obj.creatorUser = jsRelatedUser(obj.creatorUser);
    obj.updaterUser = jsRelatedUser(obj.updaterUser);
    obj.draft = jsRelatedMaterialDraft(obj.draft);
    return obj;
}

const psMaterialCommitId = x => x;
const jsMaterialCommitId = x => x;

function psRelatedMaterialCommit(obj) {
    obj.entityId = psMaterialCommitId(obj.entityId);
    obj.committerUser = psRelatedUser(obj.committerUser);
    return obj;
}

function jsRelatedMaterialCommit(obj) {
    obj.entityId = jsMaterialCommitId(obj.entityId);
    obj.committerUser = jsRelatedUser(obj.committerUser);
    return obj;
}

function psFocusedMaterialCommit(obj) {
    obj.entityId = psMaterialCommitId(obj.entityId);
    return obj;
}

function jsFocusedMaterialCommit(obj) {
    obj.entityId = jsMaterialCommitId(obj.entityId);
    return obj;
}

const psMaterialDraftId = x => x;
const jsMaterialDraftId = x => x;

function psRelatedMaterialDraft(obj) {
    obj.entityId = psMaterialDraftId(obj.entityId);
    return obj;
}

function jsRelatedMaterialDraft(obj) {
    obj.entityId = jsMaterialDraftId(obj.entityId);
    return obj;
}

function psFocusedMaterialDraft(obj) {
    obj.entityId = psMaterialDraftId(obj.entityId);
    obj.material = psRelatedMaterial(obj.material);
    return obj;
}

function jsFocusedMaterialDraft(obj) {
    obj.entityId = jsMaterialDraftId(obj.entityId);
    obj.material = jsRelatedMaterial(obj.material);
    return obj;
}

function psSnapshotSource(str) {
    switch (str) {
    case "commit":
        return E.Commit.value;
    case "snapshot":
        return E.Snapshot.value;
    case "editing":
        return E.SnapshotSourceEditing.value;
    case "draft":
        return E.Draft.value;
    }
}

function jsSnapshotSource(obj) {
    if (obj instanceof E.Commit) {
        return "commit";
    }

    if (obj instanceof E.Snapshot) {
        return "snapshot";
    }

    if (obj instanceof E.SnapshotSourceEditing) {
        return "editing";
    }

    if (obj instanceof E.Draft) {
        return "draft";
    }
}

function psNodeType(str) {
    switch (str) {
    case "committed":
        return E.NodeTypeCommitted.value;
    case "present":
        return E.Present.value;
    case "canceled":
        return E.NodeTypeCanceld.value;
    }
}

function jsNodeType(obj) {
    if (obj instanceof E.NodeTypeCommitted) {
        return "committed";
    }

    if (obj instanceof E.Present) {
        return "present";
    }

    if (obj instanceof E.NodeTypeCanceld) {
        return "canceled";
    }
}

function psRelatedMaterialSnapshot(obj) {
    obj.source = psSnapshotSource(obj.source);
    return obj;
}

function jsRelatedMaterialSnapshot(obj) {
    obj.source = jsSnapshotSource(obj.source);
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
        return E.Material.value;
    case "whole":
        return E.Whole.value;
    }
}

function jsNodeTarget(obj) {
    if (obj instanceof E.NodeTargetContent) {
        return "content";
    }

    if (obj instanceof E.Material) {
        return "material";
    }

    if (obj instanceof E.Whole) {
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

function psRelatedContentSnapshot(obj) {
    obj.source = psSnapshotSource(obj.source);

    obj.materials = obj.materials.map(x => {
        x = psRelatedMaterialSnapshot(x);
        return x;
    });

    return obj;
}

function jsRelatedContentSnapshot(obj) {
    obj.source = jsSnapshotSource(obj.source);

    obj.materials = obj.materials.map(x => {
        x = jsRelatedMaterialSnapshot(x);
        return x;
    });

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

exports.startContentEditing = async function(args) {
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

exports.startBlankContentEditing = async function(args) {
    args.spaceId = jsSpaceId(args.spaceId);
    args.type = jsMaterialType(args.type);
    let result = await fetch("startBlankContentEditing", args);
    result = psRelatedContentDraft(result);
    return result;
};

exports.editContent = async function(args) {
    args.contentDraftId = jsContentDraftId(args.contentDraftId);
    let result = await fetch("editContent", args);

    if (result) {
        result = new Data_Maybe.Just(result);
    } else {
        result = Data_Maybe.Nothing.value;
    }

    return result;
};

exports.commitContent = async function(args) {
    args.contentDraftId = jsContentDraftId(args.contentDraftId);
    let result = await fetch("commitContent", args);

    if (result) {
        result = new Data_Maybe.Just(result);
    } else {
        result = Data_Maybe.Nothing.value;
    }

    return result;
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

exports.getContentSnapshot = async function(args) {
    args.source = jsSnapshotSource(args.source);
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

exports.startMaterialEditing = async function(args) {
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

exports.startBlankMaterialEditing = async function(args) {
    args.spaceId = jsSpaceId(args.spaceId);
    args.type = jsMaterialType(args.type);
    let result = await fetch("startBlankMaterialEditing", args);
    result = psRelatedMaterialDraft(result);
    return result;
};

exports.editMaterial = async function(args) {
    args.materialDraftId = jsMaterialDraftId(args.materialDraftId);
    let result = await fetch("editMaterial", args);

    if (result) {
        result = new Data_Maybe.Just(result);
    } else {
        result = Data_Maybe.Nothing.value;
    }

    return result;
};

exports.commitMaterial = async function(args) {
    args.materialDraftId = jsMaterialDraftId(args.materialDraftId);
    let result = await fetch("commitMaterial", args);

    if (result) {
        result = new Data_Maybe.Just(result);
    } else {
        result = Data_Maybe.Nothing.value;
    }

    return result;
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

exports.getMaterialSnapshot = async function(args) {
    args.source = jsSnapshotSource(args.source);
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

exports.getSpaceMembers = async function(spaceId) {
    let args = {
        spaceId
    };

    args.spaceId = jsSpaceId(args.spaceId);
    let result = await fetch("getSpaceMembers", args);

    result = result.map(x => {
        x = psFocusedSpaceMember(x);
        return x;
    });

    return result;
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

exports.getUser = async function(displayId) {
    let args = {
        displayId
    };

    args.displayId = jsUserDisplayId(args.displayId);
    let result = await fetch("getUser", args);
    result = psFocusedUser(result);
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