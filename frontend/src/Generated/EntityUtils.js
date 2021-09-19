
const Data_Maybe = PS["Data.Maybe"]; 
const E = PS["Incentknow.Data.Entities"] || {};
PS["Incentknow.Data.Entities"] = E;

exports.getTypeName = src => {if (src instanceof E.IntType) {
                    return E.TypeNameInt.value;

                }if (src instanceof E.BoolType) {
                    return E.TypeNameBool.value;

                }if (src instanceof E.StringType) {
                    return E.TypeNameString.value;

                }if (src instanceof E.ContentType) {
                    return E.TypeNameContent.value;

                }if (src instanceof E.UrlType) {
                    return E.TypeNameUrl.value;

                }if (src instanceof E.ObjectType) {
                    return E.TypeNameObject.value;

                }if (src instanceof E.TextType) {
                    return E.TypeNameText.value;

                }if (src instanceof E.ArrayType) {
                    return E.TypeNameArray.value;

                }if (src instanceof E.EnumType) {
                    return E.TypeNameEnum.value;

                }if (src instanceof E.DocumentType) {
                    return E.TypeNameDocument.value;

                }if (src instanceof E.ImageType) {
                    return E.TypeNameImage.value;

                }if (src instanceof E.EntityType) {
                    return E.TypeNameEntity.value;

                }};exports.buildType = name => { return options => { if (name instanceof E.TypeNameInt) {
                    const result = new E.IntType();
                    return new Data_Maybe.Just(result);
                } if (name instanceof E.TypeNameBool) {
                    const result = new E.BoolType();
                    return new Data_Maybe.Just(result);
                } if (name instanceof E.TypeNameString) {
                    const result = new E.StringType();
                    return new Data_Maybe.Just(result);
                } if (name instanceof E.TypeNameContent) {if (options.format instanceof Data_Maybe.Nothing) {
                            return Data_Maybe.Nothing.value;
                    }
                    const result = new E.ContentType(options.format.value0);
                    return new Data_Maybe.Just(result);
                } if (name instanceof E.TypeNameUrl) {
                    const result = new E.UrlType();
                    return new Data_Maybe.Just(result);
                } if (name instanceof E.TypeNameObject) {if (options.properties instanceof Data_Maybe.Nothing) {
                            return Data_Maybe.Nothing.value;
                    }
                    const result = new E.ObjectType(options.properties);
                    return new Data_Maybe.Just(result);
                } if (name instanceof E.TypeNameText) {
                    const result = new E.TextType();
                    return new Data_Maybe.Just(result);
                } if (name instanceof E.TypeNameArray) {if (options.subType instanceof Data_Maybe.Nothing) {
                            return Data_Maybe.Nothing.value;
                    }
                    const result = new E.ArrayType(options.subType.value0);
                    return new Data_Maybe.Just(result);
                } if (name instanceof E.TypeNameEnum) {if (options.enumerators instanceof Data_Maybe.Nothing) {
                            return Data_Maybe.Nothing.value;
                    }
                    const result = new E.EnumType(options.enumerators);
                    return new Data_Maybe.Just(result);
                } if (name instanceof E.TypeNameDocument) {
                    const result = new E.DocumentType();
                    return new Data_Maybe.Just(result);
                } if (name instanceof E.TypeNameImage) {
                    const result = new E.ImageType();
                    return new Data_Maybe.Just(result);
                } if (name instanceof E.TypeNameEntity) {if (options.format instanceof Data_Maybe.Nothing) {
                            return Data_Maybe.Nothing.value;
                    }
                    const result = new E.EntityType(options.format.value0);
                    return new Data_Maybe.Just(result);
                }}};exports.getTypeOptions = src => {
                    if (src instanceof E.IntType) {
                        return {
                            format: Data_Maybe.Nothing.value,subType: Data_Maybe.Nothing.value,language: Data_Maybe.Nothing.value,properties: Data_Maybe.Nothing.value,enumerators: Data_Maybe.Nothing.value
                        }
                    }
                    
                    if (src instanceof E.BoolType) {
                        return {
                            format: Data_Maybe.Nothing.value,subType: Data_Maybe.Nothing.value,language: Data_Maybe.Nothing.value,properties: Data_Maybe.Nothing.value,enumerators: Data_Maybe.Nothing.value
                        }
                    }
                    
                    if (src instanceof E.StringType) {
                        return {
                            format: Data_Maybe.Nothing.value,subType: Data_Maybe.Nothing.value,language: Data_Maybe.Nothing.value,properties: Data_Maybe.Nothing.value,enumerators: Data_Maybe.Nothing.value
                        }
                    }
                    
                    if (src instanceof E.ContentType) {
                        return {
                            format: new Data_Maybe.Just(src.value0),subType: Data_Maybe.Nothing.value,language: Data_Maybe.Nothing.value,properties: Data_Maybe.Nothing.value,enumerators: Data_Maybe.Nothing.value
                        }
                    }
                    
                    if (src instanceof E.UrlType) {
                        return {
                            format: Data_Maybe.Nothing.value,subType: Data_Maybe.Nothing.value,language: Data_Maybe.Nothing.value,properties: Data_Maybe.Nothing.value,enumerators: Data_Maybe.Nothing.value
                        }
                    }
                    
                    if (src instanceof E.ObjectType) {
                        return {
                            properties: new Data_Maybe.Just(src.value0),format: Data_Maybe.Nothing.value,subType: Data_Maybe.Nothing.value,language: Data_Maybe.Nothing.value,enumerators: Data_Maybe.Nothing.value
                        }
                    }
                    
                    if (src instanceof E.TextType) {
                        return {
                            format: Data_Maybe.Nothing.value,subType: Data_Maybe.Nothing.value,language: Data_Maybe.Nothing.value,properties: Data_Maybe.Nothing.value,enumerators: Data_Maybe.Nothing.value
                        }
                    }
                    
                    if (src instanceof E.ArrayType) {
                        return {
                            subType: new Data_Maybe.Just(src.value0),format: Data_Maybe.Nothing.value,language: Data_Maybe.Nothing.value,properties: Data_Maybe.Nothing.value,enumerators: Data_Maybe.Nothing.value
                        }
                    }
                    
                    if (src instanceof E.EnumType) {
                        return {
                            enumerators: new Data_Maybe.Just(src.value0),format: Data_Maybe.Nothing.value,subType: Data_Maybe.Nothing.value,language: Data_Maybe.Nothing.value,properties: Data_Maybe.Nothing.value
                        }
                    }
                    
                    if (src instanceof E.DocumentType) {
                        return {
                            format: Data_Maybe.Nothing.value,subType: Data_Maybe.Nothing.value,language: Data_Maybe.Nothing.value,properties: Data_Maybe.Nothing.value,enumerators: Data_Maybe.Nothing.value
                        }
                    }
                    
                    if (src instanceof E.ImageType) {
                        return {
                            format: Data_Maybe.Nothing.value,subType: Data_Maybe.Nothing.value,language: Data_Maybe.Nothing.value,properties: Data_Maybe.Nothing.value,enumerators: Data_Maybe.Nothing.value
                        }
                    }
                    
                    if (src instanceof E.EntityType) {
                        return {
                            format: new Data_Maybe.Just(src.value0),subType: Data_Maybe.Nothing.value,language: Data_Maybe.Nothing.value,properties: Data_Maybe.Nothing.value,enumerators: Data_Maybe.Nothing.value
                        }
                    }
                    };

exports.getBlockType = src => {if (src instanceof E.ParagraphBlockData) {
                    return E.Paragraph.value;

                }if (src instanceof E.HeaderBlockData) {
                    return E.Header.value;

                }};exports.buildBlockData = type => { return options => { if (type instanceof E.Paragraph) {if (options.text instanceof Data_Maybe.Nothing) {
                            return Data_Maybe.Nothing.value;
                    }
                    const result = new E.ParagraphBlockData(options.text.value0);
                    return new Data_Maybe.Just(result);
                } if (type instanceof E.Header) {if (options.level instanceof Data_Maybe.Nothing) {
                            return Data_Maybe.Nothing.value;
                    }if (options.text instanceof Data_Maybe.Nothing) {
                            return Data_Maybe.Nothing.value;
                    }
                    const result = new E.HeaderBlockData(options.level.value0,options.text.value0);
                    return new Data_Maybe.Just(result);
                }}};exports.getBlockDataOptions = src => {
                    if (src instanceof E.ParagraphBlockData) {
                        return {
                            text: new Data_Maybe.Just(src.value0),level: Data_Maybe.Nothing.value
                        }
                    }
                    
                    if (src instanceof E.HeaderBlockData) {
                        return {
                            level: new Data_Maybe.Just(src.value0),text: new Data_Maybe.Just(src.value1)
                        }
                    }
                    };

exports.getMaterialType = src => {if (src instanceof E.PlaintextMaterialData) {
                    return E.MaterialTypePlaintext.value;

                }if (src instanceof E.DocumentMaterialData) {
                    return E.MaterialTypeDocument.value;

                }};exports.buildMaterialData = type => { return options => { if (type instanceof E.MaterialTypePlaintext) {if (options.text instanceof Data_Maybe.Nothing) {
                            return Data_Maybe.Nothing.value;
                    }
                    const result = new E.PlaintextMaterialData(options.text.value0);
                    return new Data_Maybe.Just(result);
                } if (type instanceof E.MaterialTypeDocument) {if (options.document instanceof Data_Maybe.Nothing) {
                            return Data_Maybe.Nothing.value;
                    }
                    const result = new E.DocumentMaterialData(options.document.value0);
                    return new Data_Maybe.Just(result);
                }}};exports.getMaterialDataOptions = src => {
                    if (src instanceof E.PlaintextMaterialData) {
                        return {
                            text: new Data_Maybe.Just(src.value0),document: Data_Maybe.Nothing.value
                        }
                    }
                    
                    if (src instanceof E.DocumentMaterialData) {
                        return {
                            document: new Data_Maybe.Just(src.value0),text: Data_Maybe.Nothing.value
                        }
                    }
                    };

exports.getActivityType = src => {if (src instanceof E.ContentCreatedActivityAction) {
                    return E.ActivityTypeContentCreated.value;

                }if (src instanceof E.ContentUpdatedActivityAction) {
                    return E.ActivityTypeContentUpdated.value;

                }if (src instanceof E.ContentCommentedActivityAction) {
                    return E.ActivityTypeContentCommented.value;

                }};exports.buildActivityAction = type => { return options => { if (type instanceof E.ActivityTypeContentCreated) {if (options.content instanceof Data_Maybe.Nothing) {
                            return Data_Maybe.Nothing.value;
                    }
                    const result = new E.ContentCreatedActivityAction(options.content.value0);
                    return new Data_Maybe.Just(result);
                } if (type instanceof E.ActivityTypeContentUpdated) {if (options.content instanceof Data_Maybe.Nothing) {
                            return Data_Maybe.Nothing.value;
                    }
                    const result = new E.ContentUpdatedActivityAction(options.content.value0);
                    return new Data_Maybe.Just(result);
                } if (type instanceof E.ActivityTypeContentCommented) {if (options.content instanceof Data_Maybe.Nothing) {
                            return Data_Maybe.Nothing.value;
                    }if (options.comment instanceof Data_Maybe.Nothing) {
                            return Data_Maybe.Nothing.value;
                    }
                    const result = new E.ContentCommentedActivityAction(options.content.value0,options.comment.value0);
                    return new Data_Maybe.Just(result);
                }}};exports.getActivityActionOptions = src => {
                    if (src instanceof E.ContentCreatedActivityAction) {
                        return {
                            content: new Data_Maybe.Just(src.value0),comment: Data_Maybe.Nothing.value
                        }
                    }
                    
                    if (src instanceof E.ContentUpdatedActivityAction) {
                        return {
                            content: new Data_Maybe.Just(src.value0),comment: Data_Maybe.Nothing.value
                        }
                    }
                    
                    if (src instanceof E.ContentCommentedActivityAction) {
                        return {
                            content: new Data_Maybe.Just(src.value0),comment: new Data_Maybe.Just(src.value1)
                        }
                    }
                    };

exports.getNotificationType = src => {if (src instanceof E.ContentCommentedNotificationAction) {
                    return E.NotificationTypeContentCommented.value;

                }if (src instanceof E.CommentRepliedNotificationAction) {
                    return E.NotificationTypeCommentReplied.value;

                }};exports.buildNotificationAction = type => { return options => { if (type instanceof E.NotificationTypeContentCommented) {if (options.content instanceof Data_Maybe.Nothing) {
                            return Data_Maybe.Nothing.value;
                    }if (options.comment instanceof Data_Maybe.Nothing) {
                            return Data_Maybe.Nothing.value;
                    }
                    const result = new E.ContentCommentedNotificationAction(options.content.value0,options.comment.value0);
                    return new Data_Maybe.Just(result);
                } if (type instanceof E.NotificationTypeCommentReplied) {if (options.content instanceof Data_Maybe.Nothing) {
                            return Data_Maybe.Nothing.value;
                    }if (options.comment instanceof Data_Maybe.Nothing) {
                            return Data_Maybe.Nothing.value;
                    }
                    const result = new E.CommentRepliedNotificationAction(options.content.value0,options.comment.value0);
                    return new Data_Maybe.Just(result);
                }}};exports.getNotificationActionOptions = src => {
                    if (src instanceof E.ContentCommentedNotificationAction) {
                        return {
                            content: new Data_Maybe.Just(src.value0),comment: new Data_Maybe.Just(src.value1)
                        }
                    }
                    
                    if (src instanceof E.CommentRepliedNotificationAction) {
                        return {
                            content: new Data_Maybe.Just(src.value0),comment: new Data_Maybe.Just(src.value1)
                        }
                    }
                    };

