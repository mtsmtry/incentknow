
var Data_Maybe = require("../Data.Maybe/index.js");
var E = require("../Incentknow.Data.Entities/index.js");

exports.getTypeName = src => {if (src instanceof E.IntType) {
                    return E.Int.value;

                }if (src instanceof E.BoolType) {
                    return E.Bool.value;

                }if (src instanceof E.StringType) {
                    return E.String.value;

                }if (src instanceof E.FormatType) {
                    return E.Format.value;

                }if (src instanceof E.SpaceType) {
                    return E.Space.value;

                }if (src instanceof E.ContentType) {
                    return E.Content.value;

                }if (src instanceof E.UrlType) {
                    return E.Url.value;

                }if (src instanceof E.ObjectType) {
                    return E.Object.value;

                }if (src instanceof E.TextType) {
                    return E.Text.value;

                }if (src instanceof E.ArrayType) {
                    return E.Array.value;

                }if (src instanceof E.CodeType) {
                    return E.Code.value;

                }if (src instanceof E.EnumType) {
                    return E.Enum.value;

                }if (src instanceof E.DocumentType) {
                    return E.Document.value;

                }if (src instanceof E.ImageType) {
                    return E.Image.value;

                }if (src instanceof E.EntityType) {
                    return E.Entity.value;

                }};exports.buildType = name => { return options => { if (name instanceof E.Int) {
                    const result = new E.IntType();
                    return new Data_Maybe.Just(result);
                } if (name instanceof E.Bool) {
                    const result = new E.BoolType();
                    return new Data_Maybe.Just(result);
                } if (name instanceof E.String) {
                    const result = new E.StringType();
                    return new Data_Maybe.Just(result);
                } if (name instanceof E.Format) {
                    const result = new E.FormatType();
                    return new Data_Maybe.Just(result);
                } if (name instanceof E.Space) {
                    const result = new E.SpaceType();
                    return new Data_Maybe.Just(result);
                } if (name instanceof E.Content) {if (options.format instanceof Data_Maybe.Nothing) {
                            return Data_Maybe.Nothing.value;
                    }
                    const result = new E.ContentType(options.format.value0);
                    return new Data_Maybe.Just(result);
                } if (name instanceof E.Url) {
                    const result = new E.UrlType();
                    return new Data_Maybe.Just(result);
                } if (name instanceof E.Object) {if (options.properties instanceof Data_Maybe.Nothing) {
                            return Data_Maybe.Nothing.value;
                    }
                    const result = new E.ObjectType(options.properties);
                    return new Data_Maybe.Just(result);
                } if (name instanceof E.Text) {
                    const result = new E.TextType();
                    return new Data_Maybe.Just(result);
                } if (name instanceof E.Array) {if (options.subType instanceof Data_Maybe.Nothing) {
                            return Data_Maybe.Nothing.value;
                    }
                    const result = new E.ArrayType(options.subType.value0);
                    return new Data_Maybe.Just(result);
                } if (name instanceof E.Code) {if (options.language instanceof Data_Maybe.Nothing) {
                            return Data_Maybe.Nothing.value;
                    }
                    const result = new E.CodeType(options.language.value0);
                    return new Data_Maybe.Just(result);
                } if (name instanceof E.Enum) {if (options.enumerators instanceof Data_Maybe.Nothing) {
                            return Data_Maybe.Nothing.value;
                    }
                    const result = new E.EnumType(options.enumerators);
                    return new Data_Maybe.Just(result);
                } if (name instanceof E.Document) {
                    const result = new E.DocumentType();
                    return new Data_Maybe.Just(result);
                } if (name instanceof E.Image) {
                    const result = new E.ImageType();
                    return new Data_Maybe.Just(result);
                } if (name instanceof E.Entity) {if (options.format instanceof Data_Maybe.Nothing) {
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
                            format: src.value0,subType: Data_Maybe.Nothing.value,language: Data_Maybe.Nothing.value,properties: Data_Maybe.Nothing.value,enumerators: Data_Maybe.Nothing.value
                        }
                    }
                    
                    if (src instanceof E.UrlType) {
                        return {
                            format: Data_Maybe.Nothing.value,subType: Data_Maybe.Nothing.value,language: Data_Maybe.Nothing.value,properties: Data_Maybe.Nothing.value,enumerators: Data_Maybe.Nothing.value
                        }
                    }
                    
                    if (src instanceof E.ObjectType) {
                        return {
                            properties: src.value0,format: Data_Maybe.Nothing.value,subType: Data_Maybe.Nothing.value,language: Data_Maybe.Nothing.value,enumerators: Data_Maybe.Nothing.value
                        }
                    }
                    
                    if (src instanceof E.TextType) {
                        return {
                            format: Data_Maybe.Nothing.value,subType: Data_Maybe.Nothing.value,language: Data_Maybe.Nothing.value,properties: Data_Maybe.Nothing.value,enumerators: Data_Maybe.Nothing.value
                        }
                    }
                    
                    if (src instanceof E.ArrayType) {
                        return {
                            subType: src.value0,format: Data_Maybe.Nothing.value,language: Data_Maybe.Nothing.value,properties: Data_Maybe.Nothing.value,enumerators: Data_Maybe.Nothing.value
                        }
                    }
                    
                    if (src instanceof E.CodeType) {
                        return {
                            language: src.value0,format: Data_Maybe.Nothing.value,subType: Data_Maybe.Nothing.value,properties: Data_Maybe.Nothing.value,enumerators: Data_Maybe.Nothing.value
                        }
                    }
                    
                    if (src instanceof E.EnumType) {
                        return {
                            enumerators: src.value0,format: Data_Maybe.Nothing.value,subType: Data_Maybe.Nothing.value,language: Data_Maybe.Nothing.value,properties: Data_Maybe.Nothing.value
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
                            format: src.value0,subType: Data_Maybe.Nothing.value,language: Data_Maybe.Nothing.value,properties: Data_Maybe.Nothing.value,enumerators: Data_Maybe.Nothing.value
                        }
                    }
                    };exports.getMaterialCompositionType = src => {if (src instanceof E.CreationMaterialComposition) {
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
                            propertyId: src.value0,data: src.value1,materialId: Data_Maybe.Nothing.value
                        }
                    }
                    
                    if (src instanceof E.MoveMaterialComposition) {
                        return {
                            materialId: src.value0,propertyId: Data_Maybe.Nothing.value,data: Data_Maybe.Nothing.value
                        }
                    }
                    };