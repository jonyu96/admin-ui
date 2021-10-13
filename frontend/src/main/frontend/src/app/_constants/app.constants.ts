import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AppConstants {

    // ROUTES

    public ADMIN_ROUTE = "/admin";
    public PV_ROUTE = "/pv";
    public DATASOURCE_ROUTE = "/datasource";
    public LOGIN_ROUTE = "/account/login";
    public REGISTER_ROUTE = "/account/register";
    public PIER_ISSUES_ROUTE = "/pier-issues";

    // API
    public ZOEY_ADMIN = "/zoey-admin/v1";
    public ZOEY_PV = "/provisioning-validator/v1";

    // ENDPOINTS
    
    public LOG_ACTIVITY = "/logActivity";
    public LOG_ERROR = "/logError";

    public LOGIN = "/login";
    public REGISTER = "/register";
    public SDE_LOGIN = "/login?appid=ZOEY&referer=";
    public REFERER = environment.host + "/admin-ui" + this.LOGIN_ROUTE;
    
    public QUERY_ALL_RULES = "/queryAllRules";
    public ADD_RULE = "/addRule";
    public MODIFY_RULE = "/modifyRule";
    public DELETE_RULE = "/deleteRule";

    public TEST_RULE = "/testRule";
    
    public GET_USER = "/getUser";
    public GET_USERS = "/getUsers";
    public DELETE_USER = "/deleteUser";
    public UPDATE_PERMISSIONS = "/updatePermissions";
    public REQUEST_PERMISSIONS = "/requestPermissions";
    public APPROVE_PERMISSIONS = "/approvePermissions";

    public ONBOARDING = "/onboarding";
    public GET_DATASOURCES = "/getDatasources";
    public REGISTER_DATASOURCE = "/registerDatasource";
    public MODIFY_DATASOURCE = "/modifyDatasource"; 
    public DELETE_DATASOURCE = "/deleteDatasource";
    public ADD_ENDPOINT = "/addEndpoint";
    public MODIFY_ENDPOINT = "/modifyEndpoint";
    public DELETE_ENDPOINT = "/deleteEndpoint";
    public PARSE_SWAGGER = "/parseSwagger";

    public QUERY_ALL_ISSUES = "/queryAllIssues";
    public INSERT_PIER_INFO = "/insertPierInfo";
    public UPDATE_PIER_INFO = "/updatePierInfo";
    public DELETE_PIER_INFO = "/deletePierInfo";

    
    // ZOEY APPS & PERMISSIONS

    public APPS = {
        'ZOEY_ADMIN': ['basic', 'super'],
        'PV_RULE': ['read', 'create', 'edit', 'delete'],
        'PS_BOT': ['access'],
        'DATASOURCE': ['read', 'create', 'edit', 'delete'],
        'ROLE': ['acms', 'digits'],
    }

    // LISTS

    public ROLES = ["acms", "digits"];
    public LOCATIONS = [
        'requestId',
        'SubscriptionId.msisdn',
        'SubscriptionId.imsi',
        'SubscriptionId.iccid',
        'SubscriptionId.imei',
        'SubscriptionId.eid',
        'SubscriptionId.secondary_msisdn',
        'SubscriptionId.old_msisdn',
        'SubscriptionId.old_imei',
        'SubscriptionId.old_imsi'
      ];
    public EVENT_TYPES = [
        "CREATE",
        "DELETE",
        "INSTANT_VALIDATION",
        "UPDATE_MSISDN",
        "UPDATE_IMSI",
        "UPDATE_IMEI",
        "UPDATE_BAN",
        "UPDATE_PERSONALINFO",
        "UPDATE_ACCOUNTSTATUS",
        "UPDATE_SERVICEINFO"
    ];

    public DATASOURCE_MAP = {
        'MDS': ['identity-api'],
        'SPS': ['messaging-api'],
        'USD': ['pwg-api'],
        'VMR': ['voicemail-api'],
        'WSG': ['bhc-api', 'digits-api']
    };

    public FEATURES = [
        'DIGITS', 
        'UCC', 
        'INSTANT', 
        'DL'
    ];

    public PARAMETER_TYPES = [
        'string',
        'integer',
        'boolean',
        'object'
    ]

    public BODY_TYPES = [
        'object',
        'array',
        'null'
    ]
}