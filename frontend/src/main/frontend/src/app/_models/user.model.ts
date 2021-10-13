export class User {

    first_name: string;
    last_name: string;
    username: string;
    email: string;

    slack_id: string;
    pier_support_group: string;

    permissions: { [key: string]: string[] };
    requested_permissions: { [key: string]: string[] };

    isSuperAdmin: boolean;

    constructor(input: any) {
        Object.assign(this, input);

        if (input['permissions']['ZOEY_ADMIN'].includes('super')) {
            this.isSuperAdmin = true;
        }
    }
}
