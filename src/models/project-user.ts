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
 * @interface ProjectUser
 */
export interface ProjectUser {
    /**
     * 
     * @type {string}
     * @memberof ProjectUser
     */
    id?: string;
    /**
     * 
     * @type {string}
     * @memberof ProjectUser
     */
    userId?: string;
    /**
     * 
     * @type {User}
     * @memberof ProjectUser
     */
    user?: User;
    /**
     * 
     * @type {string}
     * @memberof ProjectUser
     */
    projectId?: string;
    /**
     * 
     * @type {Project}
     * @memberof ProjectUser
     */
    project?: Project;
}
