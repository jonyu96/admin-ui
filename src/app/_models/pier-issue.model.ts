export class PierIssue {
    issue: string;
    errorCode: string;
    pierDetails: PierData;

    constructor(input: any) {
        Object.assign(this, input);
    }

    update(input: any) {
        Object.assign(this, input);
    }
}

export class PierData {
    configItem: string;
    cause: string[];
    resolution: string;
    resolutionDescription: string;
    status: string;

    constructor(input: any) {
        Object.assign(this, input);
    }

    update(input: any) {
        Object.assign(this, input);
    }
}