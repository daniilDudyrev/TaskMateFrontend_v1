/* tslint:disable */
/* eslint-disable */
/**
 * TaskMate.WebApi
 * No description provided (generated by Swagger Codegen https://github.com/swagger-api/swagger-codegen)
 *
 * OpenAPI spec version: 1.0
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */
import { Project } from './project';
import { User } from './user';
/**
 * 
 * @export
 * @interface Invite
 */
export interface Invite {
    /**
     * 
     * @type {string}
     * @memberof Invite
     */
    id?: string;
    /**
     * 
     * @type {string}
     * @memberof Invite
     */
    initiatorUserId?: string;
    /**
     * 
     * @type {User}
     * @memberof Invite
     */
    initiatorUser?: User;
    /**
     * 
     * @type {string}
     * @memberof Invite
     */
    invitedUserId?: string;
    /**
     * 
     * @type {User}
     * @memberof Invite
     */
    invitedUser?: User;
    /**
     * 
     * @type {string}
     * @memberof Invite
     */
    projectId?: string;
    /**
     * 
     * @type {Project}
     * @memberof Invite
     */
    project?: Project;
    /**
     * 
     * @type {boolean}
     * @memberof Invite
     */
    isAccepted?: boolean;
}
