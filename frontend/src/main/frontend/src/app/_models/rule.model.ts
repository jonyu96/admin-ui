const IGNORE_FIELDS = ['values', 'external_data_key', 'criteria'];

export class Rule {
    rule_id: string;
    rule_name: string;
    active: boolean;
    features: string[];
    data_type: string;
    data_source: string;
    result_text: string;
    system: string;
    event_types: string[];
    default_response: string;
    subscription_data_keys: string[];
    method: string;
    validate_external_data: boolean;
    customer_issue: string;
    values: { string: string[] };
    external_data_key: { string: string };
    criteria: { string: { string: string }};
    create_user: string;
    create_dttm: string;
    mod_user: string;
    mod_dttm: string;

    constructor(input: any) {
        Object.assign(this, input);
    }

    update(input: any) {
        Object.assign(this, input);
    }
}