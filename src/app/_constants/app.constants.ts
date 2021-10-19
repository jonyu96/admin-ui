import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AppConstants {

    // ROUTES

    public ADMIN_ROUTE = "/admin";
    public RULES_ROUTE = "/rules";
    public DATASOURCE_ROUTE = "/datasource";
    public LOGIN_ROUTE = "/account/login";
    public REGISTER_ROUTE = "/account/register";
    public ISSUES_ROUTE = "/issues";

    // API
    public ZED_ADMIN = "/zed-admin/v1";
    public ZED_PV = "/provisioning-validator/v1";

    // ENDPOINTS
    
    public LOG_ACTIVITY = "/logActivity";
    public LOG_ERROR = "/logError";

    public LOGIN = "/login";
    public REGISTER = "/register";
    public SDE_LOGIN = "/login?appid=ZED&referer=";
    public REFERER = "/admin-ui" + this.LOGIN_ROUTE;
    
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

    
    // APPS & PERMISSIONS

    public APPS = {
        'ADMIN': ['basic', 'super'],
        'RULE': ['read', 'create', 'edit', 'delete'],
        'DATASOURCE': ['read', 'create', 'edit', 'delete'],
        'ISSUES': ['read', 'create', 'edit', 'delete']
    }

    // LISTS
    public ROLES = ["role1", "role2"];

    public LOCATIONS = [
        'location1',
        'location2',
        'location3'
      ];
    public EVENT_TYPES = [
        "EVENT1",
        "EVENT2",
        "EVENT3"
    ];

    public DATASOURCE_MAP = {
        'System_1': ['system-1-api'],
        'System_2': ['system-2-api'],
        'System_3': ['system-3-api'],
        'System_4': ['system-4-api'],
        'System_5': ['system-5-api', 'system-5-api-alt']
    };

    public FEATURES = [
        'Feature1',
        'Feature2',
        'Feature3'
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