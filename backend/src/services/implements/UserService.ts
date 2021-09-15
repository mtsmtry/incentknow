
import * as nodemailer from "nodemailer";
import * as sharp from "sharp";
import * as uuid from "uuid";
import * as fs from "fs";
import { UserDisplayId, UserId } from "../../entities/user/User";
import { Blob } from "../../Implication";
import { AuthInfo, FocusedUser, IntactAccount, RelatedUser } from "../../interfaces/user/User";
import { AuthorityRepository } from "../../repositories/implements/space/AuthorityRepository";
import { UserRepository } from '../../repositories/implements/user/UserRepository';
import { BaseService } from "../BaseService";
import { PasswordSecurity, SessionSecurity } from "../Security";
import { ServiceContext } from "../ServiceContext";

export class UserService extends BaseService {
    constructor(
        ctx: ServiceContext,
        private users: UserRepository,
        private auth: AuthorityRepository) {
        super(ctx);
    }

    async createUser(email: string, displayName: string, password: string): Promise<UserId> {
        return await this.ctx.transaction(async trx => {
            const emailRegex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
            if (!email.match(emailRegex) || displayName.length < 4 || password.length < 8) {
                throw Error("Wrong arguments");
            }

            // check email
            const alreadyUser = await this.users.fromUsers().byEmail(email).getOne();
            if (alreadyUser) {
                if (alreadyUser.certificationToken) {
                    await this.users.createCommand(trx).deleteUser(alreadyUser.id);
                } else {
                    throw Error("このメールアドレスは既に使われています");
                }
            }

            // create user
            const passwordHash = PasswordSecurity.getHash(password);
            const user = await this.users.createCommand(trx).createUser(email, displayName, passwordHash);

            // send email
            const smtpData = {
                host: 'smtp.gmail.com', // Gmailのサーバ
                port: 465,              // Gmailの場合　SSL: 465 / TLS: 587
                secure: true,           // true = SSL
                auth: {
                    user: 'incentknow@gmail.com',  // メールアドレス（自身のアドレスを指定）
                    pass: 'nvbrtsgnpqsbgpyk'          // パスワード（自身のパスワードを指定）
                }
            };
            const transporter = nodemailer.createTransport(smtpData);
            await transporter.sendMail({
                from: '"Incentknow" <' + smtpData.auth.user + '>',
                to: email,
                subject: 'Incentknow メールアドレス確認のお知らせ',
                text: "こちらのURLからログインし、メールアドレスを認証してください。\nhttp://www.incentknow.com/activate?token=" + user.certificationToken,
            });

            return user.entityId;
        });
    }

    async getMyUser(): Promise<FocusedUser> {
        const userId = this.ctx.getAuthorized();
        return await this.users.fromUsers().byId(userId).selectFocused().getNeededOne();
    }

    async getMyAccount(): Promise<IntactAccount> {
        const userId = this.ctx.getAuthorized();
        return await this.users.fromUsers().byId(userId).selectIntactAccount().getNeededOne();
    }

    async getUser(displayId: UserDisplayId): Promise<FocusedUser> {
        return await this.users.fromUsers().byDisplayId(displayId).selectFocused().getNeededOne();
    }

    async authenticate(email: string, password: string): Promise<AuthInfo> {
        const user = await this.users.fromUsers().byEmail(email).getNeededOne();
        if (user.certificationToken) {
            throw new Error("メールアドレスの確認が完了していません");
        }
        if (!PasswordSecurity.compare(password, user.passwordHash)) {
            throw new Error("Wrong password");
        }
        const session = SessionSecurity.getToken(user.id);
        return { session, userId: user.entityId };
    }

    async activateAccount(token: string): Promise<AuthInfo> {
        return await this.ctx.transaction(async trx => {
            const user = await this.users.createCommand(trx).activateUser(token);
            const session = SessionSecurity.getToken(user.id);
            return { session, userId: user.entityId };
        });
    }

    async getFocusedUser(userId: UserId): Promise<FocusedUser> {
        return await this.users.fromUsers().byEntityId(userId).selectFocused().getNeededOne();
    }

    async getRelatedUser(userId: UserId): Promise<RelatedUser> {
        return await this.users.fromUsers().byEntityId(userId).selectRelated().getNeededOne();
    }

    async setMyPassword(oldPassword: string, newPassword: string): Promise<{}> {
        return await this.ctx.transactionAuthorized(async (trx, userId) => {
            const user = await this.users.fromUsers(trx).byId(userId).getNeededOne();
            if (!PasswordSecurity.compare(oldPassword, user.passwordHash)) {
                throw "Wrong password";
            }
            const passwordHash = PasswordSecurity.getHash(newPassword);
            await this.users.createCommand(trx).setUserPassword(userId, passwordHash);
            return {};
        });
    }

    async setMyDisplayName(displayName: string): Promise<{}> {
        return await this.ctx.transactionAuthorized(async (trx, userId) => {
            await this.users.createCommand(trx).setUserDisplayName(userId, displayName);
            return {};
        });
    }

    async setMyDisplayId(displayId: UserDisplayId): Promise<{}> {
        return await this.ctx.transactionAuthorized(async (trx, userId) => {
            await this.users.createCommand(trx).setUserDisplayId(userId, displayId);
            return {};
        });
    }

    async setMyEmail(email: string): Promise<{}> {
        return await this.ctx.transactionAuthorized(async (trx, userId) => {
            // await this.users.createCommand(trx).setUserEmail(userId, email);
            return {};
        });
    }

    async uploadMyIcon(args: { blob: Blob }): Promise<{}> {
        return await this.ctx.transactionAuthorized(async (trx, userId) => {
            const user = await this.users.fromUsers(trx).byId(userId).getNeededOne();
            if (user.iconImage) {
                fs.unlinkSync("public/uploaded/" + user.iconImage + ".jpg");
                fs.unlinkSync("public/uploaded/" + user.iconImage + ".full.jpg");
            }

            const filename = uuid.v4();
            sharp(args.blob.buffer)
                .resize({
                    width: 80,
                    height: 80,
                    fit: sharp.fit.cover,
                    position: sharp.gravity.center
                })
                .jpeg()
                .toFile("public/uploaded/" + filename + ".jpg");
            sharp(args.blob.buffer)
                .resize({
                    width: 360,
                    height: 360,
                    fit: sharp.fit.cover,
                    position: sharp.gravity.center
                })
                .jpeg()
                .toFile("public/uploaded/" + filename + ".full.jpg");
            await this.users.createCommand(trx).setUserIcon(userId, filename);
            return {};
        });
    }
}