import { UtilsBase } from "./utils_base";
import { Container, Content, ContentGenerator, Format, FormatUsage, Language, MembershipMethod, MemberType, Property, Space, SpaceAuth, SpaceMember, Structure, TypeName, User } from "./client_sql";

const base = UtilsBase;

export class UtilsSpaceAuthorization {

    static async hasSpaceAuth(user: User | null, space: Space, auth: SpaceAuth) {
        const belongSpace = () => {
            if (!user) {
                return false;
            }
            const member = base.conn.getRepository(SpaceMember).findOne({ space: space, user: user })
            return Boolean(member);
        };

        switch (auth) {
            case SpaceAuth.NONE:
                return true;

            case SpaceAuth.VISIBLE:
                switch (space.defaultAuthority) {
                    case SpaceAuth.NONE:
                        return await belongSpace();
                    case SpaceAuth.VISIBLE:
                    case SpaceAuth.READABLE:
                    case SpaceAuth.WRITABLE:
                        return true;
                }

            case SpaceAuth.READABLE:
                switch (space.defaultAuthority) {
                    case SpaceAuth.NONE:
                    case SpaceAuth.VISIBLE:
                        return await belongSpace();
                    case SpaceAuth.READABLE:
                    case SpaceAuth.WRITABLE:
                        return true;
                }

            case SpaceAuth.WRITABLE:
                switch (space.defaultAuthority) {
                    case SpaceAuth.NONE:
                    case SpaceAuth.VISIBLE:
                    case SpaceAuth.READABLE:
                        return await belongSpace();
                    case SpaceAuth.WRITABLE:
                        return true;
                }
        }
    }

    static async checkSpaceAuth(user: User | null, space: Space, auth: SpaceAuth) {
        if (!await this.hasSpaceAuth(user, space, auth)) {
            throw "lacked authority";
        }
    }

    // MaterialDraft -> Space
    //               -> ContentDraft -> Content -> Container
    //               -> Material     -> Content -> Container
    //                               -> Space

    // ContentDraft -> Container
    //              -> Content   -> Container
}