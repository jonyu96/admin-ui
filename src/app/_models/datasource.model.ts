export class Datasource {

    name: string;
    dataSource:  { [key: string]: EndpointData };
    encodedCredentials: string;
    hostUrl: string;
    noDataCodes: number[];
    noDataStrings: { [key: number]: string[] };

    constructor(input: any) {
        Object.assign(this, input);
        
        if (input['dataSource']) {
            Object.entries(input['dataSource']).forEach(
                ([key, value]) => {
                    this.dataSource[key] = new EndpointData(value);
                }
            )
        }
    }
}

export class EndpointData {
    operationId: string;
    endpoint: string;
    httpMethod: string;
    parameter: EndpointParameter[];
    body: EndpointBody;

    constructor(input: any) {
        Object.assign(this, input);

        if (input['parameter']) {
            this.parameter = Object.values(input['parameter']).map(param => new EndpointParameter(param));
        } else {
            this.parameter = [];
        }

        if (input['body']) {
            this.body = new EndpointBody(input['body']);
        }
    }
}

export class EndpointParameter {    
    parameterName: string;
    in: string;
    required: boolean; 
    type: string;
    hardcoded: boolean;
    value: string;

    constructor(input: any) {
        Object.assign(this, input);
    }
}

export class EndpointBody {
    bodyContent: { [key: string]: { [key: string]: string } };
    type: string;
    required: boolean;

    constructor(input: any) {
        Object.assign(this, input);
    }
}