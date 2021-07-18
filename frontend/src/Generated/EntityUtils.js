
const Data_Maybe = PS["Data.Maybe"]; 
const E = PS["Incentknow.Data.Entities"] || {};
PS["Incentknow.Data.Entities"] = E;

exports.getTypeName = src => {if (src instanceof E.IntType) {
                    return E.TypeNameInt.value;

                }if (src instanceof E.BoolType) {
                    return E.TypeNameBool.value;

                }if (src instanceof E.StringType) {
                    return E.TypeNameString.value;

                }if (src instanceof E.FormatType) {
                    return E.TypeNameFormat.value;

                }if (src instanceof E.SpaceType) {
                    return E.TypeNameSpace.value;

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

                }if (src instanceof E.CodeType) {
                    return E.TypeNameCode.value;

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
                } if (name instanceof E.TypeNameFormat) {
                    const result = new E.FormatType();
                    return new Data_Maybe.Just(result);
                } if (name instanceof E.TypeNameSpace) {
                    const result = new E.SpaceType();
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
                } if (name instanceof E.TypeNameCode) {if (options.language instanceof Data_Maybe.Nothing) {
                            return Data_Maybe.Nothing.value;
                    }
                    const result = new E.CodeType(options.language.value0);
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
                    
                    if (src instanceof E.FormatType) {
                        return {
                            format: Data_Maybe.Nothing.value,subType: Data_Maybe.Nothing.value,language: Data_Maybe.Nothing.value,properties: Data_Maybe.Nothing.value,enumerators: Data_Maybe.Nothing.value
                        }
                    }
                    
                    if (src instanceof E.SpaceType) {
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
                    
                    if (src instanceof E.CodeType) {
                        return {
                            language: new Data_Maybe.Just(src.value0),format: Data_Maybe.Nothing.value,subType: Data_Maybe.Nothing.value,properties: Data_Maybe.Nothing.value,enumerators: Data_Maybe.Nothing.value
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

exports.getMaterialCompositionType = src => {if (src instanceof E.CreationMaterialComposition) {
                    return E.Creation.value;

                }if (src instanceof E.MoveMaterialComposition) {
                    return E.Move.value;

                }};exports.buildMaterialComposition = type => { return options => { if (type instanceof E.Creation) {if (options.propertyId instanceof Data_Maybe.Nothing) {
                            return Data_Maybe.Nothing.value;
                    }if (options.data instanceof Data_Maybe.Nothing) {
                            return Data_Maybe.Nothing.value;
                    }
                    const result = new E.CreationMaterialComposition(options.propertyId.value0,options.data.value0);
                    return new Data_Maybe.Just(result);
                } if (type instanceof E.Move) {if (options.materialId instanceof Data_Maybe.Nothing) {
                            return Data_Maybe.Nothing.value;
                    }
                    const result = new E.MoveMaterialComposition(options.materialId.value0);
                    return new Data_Maybe.Just(result);
                }}};exports.getMaterialCompositionOptions = src => {
                    if (src instanceof E.CreationMaterialComposition) {
                        return {
                            propertyId: new Data_Maybe.Just(src.value0),data: new Data_Maybe.Just(src.value1),materialId: Data_Maybe.Nothing.value
                        }
                    }
                    
                    if (src instanceof E.MoveMaterialComposition) {
                        return {
                            materialId: new Data_Maybe.Just(src.value0),propertyId: Data_Maybe.Nothing.value,data: Data_Maybe.Nothing.value
                        }
                    }
                    };

