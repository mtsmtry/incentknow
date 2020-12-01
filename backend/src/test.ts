
import { createConnection } from "typeorm";
import { DbClient, FormatService, PropertyInfo, SpaceService, UserService } from './client_sql';
import { FormatUsage, TypeName } from "./sql";
import * as util from "util";

createConnection().then(async connection => {

    const userDb = new UserService(connection);
    const spaceDb = new SpaceService(connection);
    const formatDb = new FormatService(connection);

    const props: PropertyInfo[] = [
        {
            displayName: "Title",
            fieldName: "title",
            id: "00",
            optional: false,
            semantic: null,
            type: {
                name: TypeName.STRING,
                arguments: {}
            }
        },
        {
            displayName: "Description",
            fieldName: "desc",
            id: "01",
            optional: false,
            semantic: null,
            type: {
                name: TypeName.TEXT,
                arguments: {}
            }
        },
        {
            displayName: "Authors",
            fieldName: "authors",
            id: "02",
            optional: false,
            semantic: null,
            type: {
                name: TypeName.OBJECT,
                arguments: {
                    properties:
                        [
                            {
                                displayName: "Name",
                                fieldName: "name",
                                id: "aa",
                                optional: false,
                                semantic: null,
                                type: {
                                    name: TypeName.STRING,
                                    arguments: {}
                                }
                            },
                            {
                                displayName: "Id",
                                fieldName: "id",
                                id: "bb",
                                optional: false,
                                semantic: null,
                                type: {
                                    name: TypeName.STRING,
                                    arguments: {}
                                }
                            },
                        ]
                }
            }
        }
    ];
   // const f = await formatDb.createFormat(1, 1, "TestFormat", "dest", FormatUsage.INTERNAL, props);
    //console.log(f);

    //await formatDb.deleteFormat(1);
    //await formatDb.deleteFormat(3);

    //const ss = await spaceDb.getMembers("FbfYhY76KK3k");
    // console.log(ss);

    const f = await formatDb.getFormat("gHDrMXIyH7ZI");
    console.log(util.inspect(f, {showHidden: false, depth: null}));

    /*
    const user = await userDb.createUser("ryoi@keio.jp", "Ryoi", "2128");
    console.log(user);
    const space = await spaceDb.createSpace(user.id, "TestSpace222", "desc");
    console.log(space);
    */

}).catch(error => console.log(error));
