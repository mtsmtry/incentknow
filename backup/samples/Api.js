

function require(str) {
    if (str == "firebase") {
        console.log("require firebase")
        console.log(firebase)
        return firebase;
    } else {
        return null;
    }
}

function disinct(array) {
    return Array.from(new Set(array));
}

firebase = require("firebase");

const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();
const getParams = { source: "cache" };
const fromServer = { source: "server" };

const defaultIconUrl = "/assets/imgs/default_icon.jpg";

const snapshotOptions = { includeMetadataChanges: true };

exports.defaultIconUrl = defaultIconUrl;

db.settings({
    cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED
});
// db.enablePersistence();
db.enablePersistence({ synchronizeTabs: true });

// auth.currentUserは読み込み中にnullになり、ログインしていない状態と読み込み状態の区別がつかないため
// localStorageに保存した値を用いる
var currentUser = JSON.parse(window.localStorage.getItem("UID"));
auth.onAuthStateChanged(user => {
    currentUser = user;
    window.localStorage.setItem("UID", JSON.stringify(user));
});

// https://tenderfeel.xsrv.jp/javascript/3820/
function showFirebaseError(e, method = "") {
    if (!e.errorInfo) {
        return "エラーが発生しました";
    }
    e = e.errorInfo;
    switch (e.code) {
        case 'auth/cancelled-popup-request':
        case 'auth/popup-closed-by-user':
            return null;
        case 'auth/email-already-exists':
            return 'このメールアドレスで既にアカウントが登録されています';
        case 'auth/email-already-in-use':
            if (method.indexOf('signup') !== -1) {
                return 'このメールアドレスは使用されています';
            } else {
                return 'メールアドレスまたはパスワードが違います';
            }
        case 'auth/invalid-email':
            return 'メールアドレスの形式が正しくありません';
        case 'auth/user-disabled':
            return 'サービスの利用が停止されています';
        case 'auth/user-not-found':
            return 'メールアドレスまたはパスワードが違います';
        case 'auth/user-mismatch':
            if (method === 'signin/popup') {
                return '認証されているユーザーと異なるアカウントが選択されました';
            } else {
                return 'メールアドレスまたはパスワードが違います';
            }
        case 'auth/weak-password':
            return 'パスワードは6文字以上にしてください';
        case 'auth/wrong-password':
            return 'メールアドレスまたはパスワードが違います';
        case 'auth/popup-blocked':
            return '認証ポップアップがブロックされました。ポップアップブロックをご利用の場合は設定を解除してください';
        case 'auth/operation-not-supported-in-this-environment':
        case 'auth/auth-domain-config-required':
        case 'auth/operation-not-allowed':
        case 'auth/unauthorized-domain':
            return '現在この認証方法はご利用頂けません';
        case 'auth/requires-recent-login':
            return '認証の有効期限が切れています';
        default:
            if (method.indexOf('signin') !== -1) {
                return '認証に失敗しました';
            } else {
                return 'エラーが発生しました';
            }
    }
};

async function mkSpace(spaceSnap, userSpaceSnap = null, options) {
    const space = spaceSnap.data();
    space.spaceId = spaceSnap.id;
    if (!userSpaceSnap && currentUser) {
        userSpaceSnap = await db.collection("users").doc(currentUser.uid).collection("spaces").doc(space.spaceId).get(options);
    }
    if (userSpaceSnap && userSpaceSnap.exists) {
        const userSpace = userSpaceSnap.data();
        space.myStatus = userSpace.type;
    } else {
        space.myStatus = "none";
    }

    var memberSnap = null;
    if (currentUser) {
        memberSnap = await db.collection("spaces").doc(space.spaceId).collection("members").doc(currentUser.uid).get(options);
    }
    if (memberSnap && memberSnap.exists) {
        space.myMember = await mkSpaceMember(memberSnap, space.spaceId, options);
    } else {
        space.myMember = null;
    }

    if (space.homeUrl) {
        const url = await storage.ref().child(getSpaceHomeImagePath(space.spaceId)).getDownloadURL();
        space.homeUrl = url;
    } else {
        space.homeUrl = null;
    }
    return space;
}

function mkStructure(structureSnap) {
    const structure = structureSnap.data();
    structure.version = structureSnap.id;
    return structure;
}

function mkFormat(formatSnap, structureSnap) {
    const format = formatSnap.data();
    format.formatId = formatSnap.id;
    format.structure = mkStructure(structureSnap);
    if (!format.collectionPage) {
        format.collectionPage = { compositions: [] };
    }
    if (!format.contentPage) {
        format.contentPage = { relations: [] };
    }
    return format;
}

function mkContent(contentSnap, formatSnap, structureSnap, containerSnap) {
    const content = contentSnap.data();
    const container = containerSnap.data();
    content.contentId = contentSnap.id;
    content.formatId = formatSnap.id;
    content.spaceId = container.spaceId;
    content.containerId = containerSnap.id;
    content.format = mkFormat(formatSnap, structureSnap);
    return content;
}

function getIconPath(uid) {
    return "users/" + uid + "/icon";
}

function getSpaceHomeImagePath(spaceId) {
    return "spaces/" + spaceId + "/home"
}

async function mkUser(userSnap) {
    const user = userSnap.data();
    user.userId = userSnap.id;
    if (user.iconUrl) {
        const url = await storage.ref().child(getIconPath(user.userId)).getDownloadURL();
        user.iconUrl = url;
    } else {
        user.iconUrl = defaultIconUrl;
    }
    return user;
}

async function mkSpaceMember(memberSnap, spaceId, options) {
    const member = memberSnap.data();
    member.userId = memberSnap.id;
    member.spaceId = spaceId;

    const userSnap = await db.collection("users").doc(memberSnap.id).get(options);
    member.user = await mkUser(userSnap);

    return member;
}

function mkSpaceCommitter(committerSnap) {
    const committer = committerSnap.data();
    committer.userId = committerSnap.id;
    return committer;
}

function mkWork(workSnap, junctionSnap, formatSnap, structureSnap) {
    const work = workSnap.data();
    work.workId = workSnap.id;
    if (!work.contentId) {
        work.contentId = null;
    }
    if (junctionSnap) {
        work.spaceId = junctionSnap.spaceId;
    }
    work.format = mkFormat(formatSnap, structureSnap);
    return work;
}

async function mkAccount(account, userSnap) {
    const settingSnap = await db.collection("_users").doc(account.uid).get();
    account.setting = settingSnap.data();
    account.user = await mkUser(userSnap);
    account.userId = account.uid;
    return account;
}

function mkSnapshot(snapshotSnap) {
    const snapshot = snapshotSnap.data();
    snapshot.snapshotId = snapshotSnap.id;
    return snapshot;
}

function receive(res) {
    console.log("receive");
    console.log(res);
    if (res.data.error) {
        console.log(res);
        throw res.data.error;
    } else {
        return res.data;
    }
}

getFormatDict = async function (contents, options) {
    const formatIdVers = disinct(contents.map(content => content.formatId + ":" + content.structureId));
    var fun = async formatIdVer => {
        const parts = formatIdVer.split(":");
        const formatId = parts[0];
        const structureId = parts[1];
        const formatRef = db.collection("formats").doc(formatId);
        const structureRef = formatRef.collection("structures").doc(structureId);
        const [formatSnap, structureSnap] = await Promise.all([formatRef.get(options), structureRef.get(options)]);
        return { key: formatIdVer, value: { format: formatSnap, structure: structureSnap } };
    };
    const formatAndStructurePromises = formatIdVers.map(fun);
    fun = await Promise.all(formatAndStructurePromises);
    return toMap(fun);
};

function containerQuery(spaceId, formatId) {
    return db.collection("containers").where("spaceId", "==", spaceId).where("formatId", "==", formatId);
}

async function getContainer(spaceId, formatId, options) {
    const containersSnap = await containerQuery(spaceId, formatId).get(options);
    if (containersSnap.empty) {
        return null;
    } else {
        return containersSnap.docs[0];
    }
}

exports.showError = error => error.message;

/*
exports.getAccount = async req => {
    if (currentUser) {
        const userSnap = await db.collection("users").doc(account.uid).get();
        return mkAccount(currentUser, userSnap);
    } else {
        return null;
    }
};*/

exports.getCurrentUserId = () => {
    if (currentUser) {
        return currentUser.uid;
    } else {
        return null;
    }
}

exports.register = async req => {
    var userId;
    try {
        userId = await functions.httpsCallable("createUser")(req).then(receive);
    } catch (error) {
        console.log("register error");
        console.log(error);
        throw showFirebaseError(error);
    }
    var actionCodeSettings = {
        // URL you want to redirect back to. The domain (www.example.com) for this
        // URL must be whitelisted in the Firebase Console.
        url: "https://incentknow.com",  //'https://www.incentknow.com/registered',
        // This must be true.
        handleCodeInApp: true,
        iOS: {
            bundleId: 'com.incentknow.ios'
        },
        android: {
            packageName: 'com.incentknow.android',
            installApp: true,
            minimumVersion: '12'
        },
        dynamicLinkDomain: 'incentknow.page.link'
    };
    try {
        await auth.sendSignInLinkToEmail(req.email, actionCodeSettings);
    } catch (error) {
        console.log(error);
        throw "確認メールの送信に失敗しました";
    }
    return userId;
};

exports.login = req => {
    return auth.signInWithEmailAndPassword(req.email, req.password)
        .then(cred => {
            console.log("login");
            console.log(cred);
            window.localStorage.setItem("UID", JSON.stringify(cred.user));
        })
        .catch(error => { throw showFirebaseError(error, "signin") });
};

exports.logout = req => {
    return auth.signOut()
        .then(_ => {
            window.localStorage.removeItem("UID");
        })
        .catch(error => { throw showFirebaseError(error) });
};

exports.createSpace = req => {
    return functions.httpsCallable("createSpace")(req).then(receive);
};

exports.createFormat = req => {
    return functions.httpsCallable("createFormat")(req).then(receive);
};

exports.createContent = req => {
    return functions.httpsCallable("createContent")(req).then(receive);
};

exports.createCrawler = req => {
    return functions.httpsCallable("createCrawler")(req).then(receive);
};

exports.runCrawler = req => {
    return functions.httpsCallable("runCrawler")(req).then(receive);
};

exports.commitContent = req => {
    return functions.httpsCallable("commitContent")(req).then(receive);
};

exports.writeContentWork = req => {
    return functions.httpsCallable("writeContentWork")(req).then(receive);
};

exports.updateBlankWork = req => {
    return functions.httpsCallable("updateBlankWork")(req).then(receive);
};

exports.createBlankWork = req => {
    return functions.httpsCallable("createBlankWork")(req).then(receive);
};

exports.setMyDisplayName = req => {
    return functions.httpsCallable("setMyDisplayName")(req).then(receive);
};

exports.checkSpaceDisplayId = req => {
    return functions.httpsCallable("checkSpaceDisplayId")(req).then(receive);
};

exports.setMyIcon = async req => {
    await storage.ref().child(getIconPath(currentUser.uid)).put(req).then();
    return await functions.httpsCallable("setMyIcon")({}).then(receive);
};

exports.setSpaceDisplayName = spaceId => {
    return displayName => {
        const req = { spaceId, displayName };
        return functions.httpsCallable("setSpaceDisplayName")(req).then(receive);
    };
};

exports.setSpaceHomeImage = spaceId => {
    return async image => {
        await storage.ref().child(getSpaceHomeImagePath(spaceId)).put(image).then();
        return await functions.httpsCallable("setSpaceHomeImage")({ spaceId }).then(receive);
    };
};

exports.setSpacePublished = spaceId => {
    return published => {
        const req = { spaceId, published };
        return functions.httpsCallable("setSpacePublished")(req).then(receive);
    };
};

exports.setSpaceDisplayId = spaceId => {
    return displayId => {
        const req = { spaceId, displayId };
        return functions.httpsCallable("setSpaceDisplayId")(req).then(receive);
    };
};

exports.setSpaceAuthorityority = spaceId => {
    return authority => {
        const req = { spaceId, authority };
        return functions.httpsCallable("setSpaceAuthorityority")(req).then(receive);
    };
};

exports.setFormatContentPage = formatId => {
    return contentPage => {
        const req = { formatId, contentPage };
        return functions.httpsCallable("setFormatContentPage")(req).then(receive);
    };
};

exports.setFormatCollectionPage = formatId => {
    return collectionPage => {
        const req = { formatId, collectionPage };
        return functions.httpsCallable("setFormatCollectionPage")(req).then(receive);
    };
};

exports.setMyPassword = async req => {
    const email = auth.currentUser.email;
    const cred = firebase.auth.EmailAuthProvider.credential(email, req.oldPassword);

    try {
        await auth.currentUser.reauthenticateWithCredential(cred);
    } catch (e) {
        throw "現在のパスワードが間違っています";
    }

    try {
        await auth.currentUser.updatePassword(req.newPassword);
    } catch (e) {
        throw "パスワードの変更に失敗しました";
    }
    return {};
};

exports.setMyEmail = async req => {
    await auth.currentUser.updateEmail(req);
    return {};
};

exports.getPublishedSpaces = async options => {
    const spaceSnaps = await db.collection("spaces").where("published", "==", true).get(options);
    const mkSpace2 = spaceSnap => {
        return mkSpace(spaceSnap, null, options);
    };
    return await Promise.all(spaceSnaps.docs.map(mkSpace2));
};

exports.getContent = contentId => {
    return async options => {
        const junctionSnap = await db.collection("contents").doc(contentId).get(options);
        const junction = junctionSnap.data();

        const containerRef = db.collection("containers").doc(junction.containerId);

        const contentRef = containerRef.collection("items").doc(contentId);
        const formatRef = db.collection("formats").doc(junction.formatId);
        const structureRef = formatRef.collection("structures").doc(junction.structureId);

        const [contentSnap, formatSnap, structureSnap, containerSnap] =
            await Promise.all([contentRef.get(options), formatRef.get(options), structureRef.get(options), containerRef.get(options)]);
        return mkContent(contentSnap, formatSnap, structureSnap, containerSnap);
    };
};

exports.getMySpaces = async options => {
    const userSpacesRef = db.collection("users").doc(currentUser.uid).collection("spaces");
    const userSpaceSnaps = await userSpacesRef.get(options);
    const getSpace = async userSpaceSnap => {
        const spaceSnap = await db.collection("spaces").doc(userSpaceSnap.id).get(options);
        const space = await mkSpace(spaceSnap, userSpaceSnap, options);
        return space;
    };
    const spacePromises = userSpaceSnaps.docs.map(getSpace);
    const spaces = await Promise.all(spacePromises);
    return spaces;
};

exports.onSnapshotContent = contentId => {
    return callback => {
        return () => {
            let unsubscribe = null, cancel = false;

            const get = async junctionSnap => {
                const junction = junctionSnap.data();
                const containerRef = db.collection("containers").doc(junction.containerId);
                const contentRef = containerRef.collection("items").doc(contentId);

                const formatRef = db.collection("formats").doc(junction.formatId);
                const structureRef = formatRef.collection("structures").doc(junction.structureId);
                const result = await Promise.all([formatRef.get(), structureRef.get(), containerRef.get()]);

                const observer = async contentSnap => {
                    const content = mkContent(contentSnap, result[0], result[1], result[2]);
                    callback(content)();
                };
                if (!cancel) {
                    unsubscribe = contentRef.onSnapshot(snapshotOptions, observer);
                }
            };
            db.collection("contents").doc(contentId).get().then(get);
            return () => {
                if (unsubscribe) {
                    unsubscribe();
                } else {
                    cancel = true;
                }
            };
        };
    };
};

exports.getFormat = formatId => {
    return async options => {
        const formatRef = db.collection("formats").doc(formatId);
        const formatSnap = await formatRef.get(options);
        const structureSnap = await formatRef.collection("structures").doc(formatSnap.data().defaultStructureId).get(options);
        return mkFormat(formatSnap, structureSnap);
    };
};

exports.getSpace = spaceId => {
    return async options => {
        const spaceSnap = await db.collection("spaces").doc(spaceId).get(options);
        return await mkSpace(spaceSnap, null, options);
    };
};

exports.getUser = userId => {
    return async options => {
        const userSnap = await db.collection("users").doc(userId).get(options);
        return await mkUser(userSnap);
    };
};

const mkContents = async function (contentSnaps, containerSnap) {
    const structureIds = disinct(contentSnaps.docs.map(contentSnap => contentSnap.data().structureId));
    const fun = async version => {
        const formatRef = db.collection("formats").doc(formatId);
        const structureRef = formatRef.collection("structures").doc(version);
        const structureSnap = await structureRef.get();
        return { key: version, value: structureSnap };
    };
    const container = containerSnap.data();
    const formatId = container.formatId;
    const promises = structureIds.map(fun);
    const structureSnaps = await Promise.all(promises);
    const structureDict = toMap(structureSnaps);
    const formatSnap = await db.collection("formats").doc(formatId).get();

    const contents = contentSnaps.docs.map(contentSnap => mkContent(contentSnap, formatSnap, structureDict[contentSnap.data().structureId], containerSnap));
    return contents;
};

const getContents = async function (spaceId, formatId, conds, options) {
    function applyFilter(collection, filter) {
        return collection.where(filter.fieldPath, filter.opStr, filter.value);
    }

    const containerSnap = await getContainer(spaceId, formatId, options);
    if (!containerSnap) {
        return [];
    } else {
        let ref = conds.filters.reduce(applyFilter, containerSnap.ref.collection("items"));
        if (conds.orderBy) {
            ref = ref.orderBy(conds.orderBy);
        }
        const contentsSnap = await ref.get();
        const contents = await mkContents(contentsSnap, containerSnap);
        return contents;
    }
};

exports.getContents = spaceId => {
    return formatId => {
        return conds => {
            return async options => {
                return await getContents(spaceId, formatId, conds, options);
            };
        };
    };
};

exports.getContentsByFormat = formatId => {
    return async options => {
        const formatSnap = await db.collection("formats").doc(formatId).get(options);
        const format = formatSnap.data();
        const conds = { filters: [], orderBy: null };
        return await getContents(format.spaceId, formatId, conds, options);
    };
};

exports.getAllSpaceContents = spaceId => {
    return async options => {
        const containersSnap = await db.collection("containers").where("spaceId", "==", spaceId).get(options);
        //   const containerDict = containersSnap.docs.reduce((m, x) => { m[x.data().formatId] = x; return m; }, {});
        const gets = containersSnap.docs.map(container => container.ref.collection("items").limit(100).get(options));
        const contentsSnapLists = await Promise.all(gets);
        const contents = contentsSnapLists.map((contentsSnap, index) => {
            return contentsSnap.docs.map(contentSnap => {
                const containerSnap = containersSnap.docs[index];
                const content = contentSnap.data();
                const container = containerSnap.data();
                content.formatId = container.formatId;
                return content;
            });
        }).flat();
        const formatDict = await getFormatDict(contents, options);
        return contentsSnapLists.map((contentsSnap, index) => {
            return contentsSnap.docs.map(contentSnap => {
                const content = contentSnap.data();
                const containerSnap = containersSnap.docs[index];
                const container = containerSnap.data();
                const formatStrcut = formatDict[container.formatId + ":" + content.structureId];
                const result = mkContent(contentSnap, formatStrcut.format, formatStrcut.structure, containerSnap);
                return result;
            });
        }).flat();
    };
};

exports.getFormats = spaceId => {
    return async options => {
        const formatSnaps = await db.collection("formats").where("spaceId", "==", spaceId).get(options);
        const buildFormat = async formatSnap => {
            const format = formatSnap.data();
            const structureSnap = await formatSnap.ref.collection("structures").doc(format.defaultStructureId.toString()).get(options);
            return mkFormat(formatSnap, structureSnap);
        };
        const promises = formatSnaps.docs.map(buildFormat);
        return await Promise.all(promises);
    };
};

exports.getFormatStructures = formatId => {
    return async options => {
        const structureSnaps = await db.collection("formats").doc(formatId).collection("structures").get(options);
        return structureSnaps.docs.map(mkStructure);
    };
};

exports.getSpaceMembers = spaceId => {
    return type => {
        return async options => {
            var membersRef = db.collection("spaces").doc(spaceId).collection("members");
            if (type) {
                membersRef = membersRef.where("type", "==", type);
            }
            const memberSnaps = await membersRef.get(options);
            const mkSpaceMember2 = async spaceSnap => {
                return await mkSpaceMember(spaceSnap, spaceId, options);
            };
            return await Promise.all(memberSnaps.docs.map(mkSpaceMember2));
        };
    };
};

exports.getSpaceMember = spaceId => {
    return userId => {
        return async options => {
            const memberSnap = await db.collection("spaces").doc(spaceId).collection("members").doc(userId).get(options);
            return await mkSpaceMember(memberSnap, spaceId, options);
        };
    };
};

exports.getSpaceCommitters = spaceId => {
    return async options => {
        const committerSnaps = await db.collection("spaces").doc(spaceId).collection("committers").get(options);
        return committerSnaps.docs.map(mkSpaceCommitter);
    };
};

function toMap(arr) {
    return arr.reduce(function (map, obj) {
        map[obj.key] = obj.value;
        return map;
    }, {});
}

exports.getMyWorks = req => {
    return async options => {
        var worksRef = db.collection("users").doc(currentUser.uid).collection("works");
        if (req.state != null) {
            worksRef = worksRef.where("state", "==", req.state);
        }
        const workSnaps = await worksRef.get(options);
        const works = workSnaps.docs.map(workSnap => workSnap.data());

        const formatAndStructureSnaps = await getFormatDict(works, options);

        var fun = async work => {
            if (work.contentId) {
                const value = await db.collection("contents").doc(work.contentId);
                return { key: work.workId, value: value };
            } else {
                return { key: work.workId, value: null };
            }
        };
        const junctionPromises = works.map(fun);
        fun = await Promise.all(junctionPromises);
        const junctionSnaps = toMap(fun);

        return workSnaps.docs.map(workSnap => {
            const work = workSnap.data();
            const formatIdVer = work.formatId + ":" + work.structureId;
            const formatAndStructureSnap = formatAndStructureSnaps[formatIdVer];
            const junctionSnap = junctionSnaps[workSnap.id];
            return mkWork(workSnap, junctionSnap, formatAndStructureSnap.format, formatAndStructureSnap.structure);
        });
    };
};

exports.deleteWork = async req => {
    return functions.httpsCallable("deleteWork")(req).then(receive);
};

exports.onSnapshotWork = workId => {
    return callback => {
        return () => {
            var result = null;
            const observer = async workSnap => {
                if (workSnap.exists) {
                    var work = workSnap.data();
                    if (!result) {
                        const formatRef = db.collection("formats").doc(work.formatId);
                        const structureRef = formatRef.collection("structures").doc(work.structureId);
                        if (work.contentId) {
                            const junctionRef = db.collection("contents").doc(work.contentId);
                            result = await Promise.all([formatRef.get(), structureRef.get(), junctionRef.get()]);
                        } else {
                            result = await Promise.all([formatRef.get(), structureRef.get()]);
                            result.push(null);
                        }
                    }
                    work = mkWork(workSnap, result[2], result[0], result[1]);
                    console.log(work);
                    callback(work)();
                } else {
                    callback(null)();
                }
            };
            return db.collection("users").doc(currentUser.uid).collection("works").doc(workId).onSnapshot(snapshotOptions, observer);
        };
    };
};

exports.onSnapshotAccount = callback => {
    return () => {
        var unscribeUser = null;
        var prevUid = null;
        if (currentUser) {
            prevUid = currentUser.uid;
        }
        const userObserver = async userSnap => {
            // ログインしている
            if (currentUser) {
                const account = await mkAccount(currentUser, userSnap);
                callback(account)();
                // ログインしていない
            } else {
                callback(null)();
            }
        };
        const accountObserver = async authUser => {
            if (authUser) {
                const userSnap = await db.collection("users").doc(authUser.uid).get();
                const account = await mkAccount(authUser, userSnap);
                callback(account)();

                if (prevUid != authUser.uid) {
                    unscribeUser();
                    unscribeUser = null;
                }
                if (!unscribeUser) {
                    unscribeUser = db.collection("users").doc(authUser.uid).onSnapshot(snapshotOptions, userObserver);
                }

                prevUid = authUser.uid;
            } else {
                callback(null)();

                if (unscribeUser) {
                    unscribeUser();
                    unscribeUser = null;
                }
            }
        };
        const unscribeAccount = auth.onAuthStateChanged(accountObserver);
        return () => {
            if (unscribeUser) {
                unscribeUser();
            }
            unscribeAccount();
        };
    };
};

exports.onSnapshotSpace = spaceId => {
    return callback => {
        return () => {
            const observer = async snap => {
                const space = await mkSpace(snap, null, { source: "server" });
                callback(space)();
            };
            return db.collection("spaces").doc(spaceId).onSnapshot(snapshotOptions, observer);
        };
    };
};

exports.onSnapshotSnapshots = workId => {
    return changeId => {
        return callback => {
            return () => {
                const observer = async snapshotsSnap => {
                    callback(snapshotsSnap.docs.map(snap => mkSnapshot(snap)))();
                };
                return db.collection("users").doc(currentUser.uid).collection("works").doc(workId).collection("changes").doc(changeId).collection("snapshots").onSnapshot(snapshotOptions, observer);
            };
        };
    };
};

function getUseCache(ref) {
    return ref.get({ source: "cache" }).catch(res => ref.get({ source: "server" }));
}

exports.getSnapshot = workId => {
    return changeId => {
        return async snapshotId => {
            const snapshotRef = db.collection("users").doc(currentUser.uid)
                .collection("works").doc(workId)
                .collection("changes").doc(changeId)
                .collection("snapshots").doc(snapshotId);;
            const snapshotSnap = await getUseCache(snapshotRef);
            return mkSnapshot(snapshotSnap);
        };
    };
};

exports.onSnapshotContents = req => {
    return callback => {
        return () => {
            let unsubscribe = null, cancel = false;
            containerQuery(format.spaceId, req.formatId).get(options).then(containersSnap => {
                const containerSnap = containersSnap.docs[0];
                const observer = async contentsSnap => {
                    const contents = await mkContents(contentsSnap, containerSnap);
                    callback(contents)();
                };

                if (!cancel) {
                    containerSnap.ref.collection("items").onSnapshot(snapshotOptions, observer);
                }
            });
            return () => {
                if (unsubscribe) {
                    unsubscribe();
                } else {
                    cancel = true;
                }
            };
        };
    };
};

exports.applySpaceMembership = spaceId => {
    const req = { spaceId };
    return functions.httpsCallable("applySpaceMembership")(req).then(receive);
};

exports.acceptSpaceMembership = spaceId => {
    return userId => {
        const req = { spaceId, userId };
        return functions.httpsCallable("acceptSpaceMembership")(req).then(receive);
    };
};

exports.rejectSpaceMembership = spaceId => {
    return userId => {
        const req = { spaceId, userId };
        return functions.httpsCallable("rejectSpaceMembership")(req).then(receive);
    };
};

exports.cancelSpaceMembershipApplication = spaceId => {
    const req = { spaceId };
    return functions.httpsCallable("cancelSpaceMembershipApplication")(req).then(receive);
};

exports.setSpaceMembershipMethod = spaceId => {
    return membershipMethod => {
        const req = { spaceId, membershipMethod };
        return functions.httpsCallable("setSpaceMembershipMethod")(req).then(receive);
    };
};

exports.setContentGenerator = formatId => {
    return generator => {
        const req = { formatId, generator };
        return functions.httpsCallable("setContentGenerator")(req).then(receive);
    };
};

exports.setReactorDefinitionId = formatId => {
    return definitionId => {
        const req = { formatId, definitionId };
        return functions.httpsCallable("setReactorDefinitionId")(req).then(receive);
    };
};

function mkReactor(reactorSnap) {
    const reactor = reactorSnap.data();
    reactor.formatId = reactorSnap.id;
    return reactor;
}

exports.getReactor = formatId => {
    return async options => {
        const reactorSnap = await db.collection("reactors").doc(formatId).get(options);
        return mkReactor(reactorSnap);
    };
};

exports.onLoadContentBySemanticId = formatId => {
    return semanticId => {
        return callback => {
            return () => {
                async function fun() {
                    const formatRef = db.collection("formats").doc(formatId);
                    const formatSnap = await formatRef.get();
                    const format = formatSnap.data();
                    const containerSnap = await getContainer(format.spaceId, formatId, options);
                    const contentSnaps = await containerSnap.ref.collection("items").where("data." + format.semanticId, "==", semanticId).get();

                    if (!contentSnaps.empty) {
                        const contentSnap = contentSnaps.docs[0];
                        const structureSnap = await formatRef.collection("structures").doc(contentSnap.data().structureId).get();
                        const content = mkContent(contentSnap, formatSnap, structureSnap, containerSnap);
                        callback(content)();
                    }

                    const contentResult = await functions.httpsCallable("getContentBySemanticId")({ formatId, semanticId }).then(receive);
                    const contentSnap = {
                        id: contentResult.contentId,
                        data: () => contentResult
                    };
                    const structureSnap = await formatRef.collection("structures").doc(contentResult.structureId).get();
                    const content = mkContent(contentSnap, formatSnap, structureSnap, containerSnap);
                    callback(content)();
                };
                fun();
            };
        };
    };
};

exports.getContentsByReactor = async req => {
    const formatSnap = await db.collection("formats").doc(req.formatId).get();
    const format = formatSnap.data();
    const containerSnap = await getContainer(format.spaceId, req.formatId, fromServer);
    const contentResults = await functions.httpsCallable("getContentsByReactor")(req).then(receive);
    const contentSnaps = contentResults.map(contentResult => {
        return {
            id: null,
            data: () => contentResult
        };
    });
    const contents = await mkContents({ docs: contentSnaps }, containerSnap);
    return contents;
};

exports.updateFormatStructure = formatId => {
    return properties => {
        const req = { formatId, properties };
        return functions.httpsCallable("updateFormatStructure")(req).then(receive);
    };
};

function mkCrawler(crawlerSnap) {
    const crawler = crawlerSnap.data();
    crawler.crawlerId = crawlerSnap.id;
    return crawler;
}

exports.getCrawlers = spaceId => {
    return async options => {
        const crawlersSnap = await db.collection("crawlers").where("spaceId", "==", spaceId).get(options);
        const crawlers = crawlersSnap.docs.map(mkCrawler);
        return crawlers;
    };
};

function mkCrawlerOperation(crawlerId, operationSnap) {
    const operation = operationSnap.data();
    operation.crawlerId = crawlerId;
    operation.operationId = operationSnap.id;
    return operation;
}

exports.getCrawlerOperations = crawlerId => {
    return async options => {
        const operationsSnap = await db
            .collection("crawlers").doc(crawlerId)
            .collection("crawlerOperations").orderBy("createdAt", "desc").get(options);
        const operations = operationsSnap.docs.map(x => mkCrawlerOperation(crawlerId, x));
        return operations;
    };
};

function mkCrawlerCache(crawlerId, cacheSnap) {
    const cache = cacheSnap.data();
    cache.crawlerId = crawlerId;
    cache.cacheId = cacheSnap.id;
    return cache;
}

exports.getCrawlerCaches = crawlerId => {
    return async options => {
        const cachesSnap = await db.collection("crawlers").doc(crawlerId).collection("crawlerCaches").get(options);
        const caches = cachesSnap.docs.map(x => mkCrawlerCache(crawlerId, x));
        return caches;
    };
};

function mkCrawlerTask(crawlerId, operationId, taskSnap) {
    const task = taskSnap.data();
    task.taskId = taskSnap.id;
    task.crawlerId = crawlerId;
    task.oprationId = operationId;
    return task;
}

exports.onSnapshotCrawlerTasks = crawlerId => {
    return operationId => {
        return callback => {
            return () => {
                var result = null;
                const observer = async tasksSnap => {
                    const tasks = tasksSnap.docs.map(x => mkCrawlerTask(crawlerId, operationId, x));
                    callback(tasks)();
                };
                return db.collection("crawlers").doc(crawlerId)
                    .collection("crawlerOperations").doc(operationId)
                    .collection("crawlerTasks").orderBy("createdAt", "desc").onSnapshot(snapshotOptions, observer);
            };
        };
    };
};

exports.getCrawler = crawlerId => {
    return async options => {
        const crawlerSnap = await db.collection("crawlers").doc(crawlerId).get(options);
        return mkCrawler(crawlerSnap);
    };
};

exports.applyFirestoreCondition = conds => {
    return contents => {
        function getField(content, fieldPath) {
            const paths = fieldPath.split(".");
            let field = content;
            paths.forEach(path => {
                field = field[path];
            });
            return field;
        }

        function matchFilter(content, cond) {
            const field = getField(content, cond.fieldPath);
            switch (cond.opStr) {
                case "==":
                    return field == cond.value;
                case "!=":
                    return field != cond.value;
                case "<=":
                    return field <= cond.value;
                case "<":
                    return field < cond.value;
                case ">=":
                    return field >= cond.value;
                case ">":
                    return field > cond.value;
                case "in":
                    return cond.value.includes(field);
                case "array-contains":
                    return field.includes(cond.value);
                case "array-contains-any":
                    return cond.value.map(vl => field.includes(vl)).includes(true);
            }
            throw "opStr is invaild";
        }

        function matchFilters(content) {
            for (const filter in conds.filters) {
                if (!matchFilter(content, filter)) {
                    return false;
                }
            }
            return true;
        }

        return contents.filter(matchFilters);
    };
};