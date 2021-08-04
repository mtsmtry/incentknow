

export class LackOfAuthority extends Error {

}

export class InternalError extends Error {

}

export class WrongTargetState extends Error {
    constructor(private msg?: string) {
        super(msg);
    }
}

export class NotFoundEntity extends Error {

}