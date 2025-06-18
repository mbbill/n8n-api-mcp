logo
n8n Docs
Search

Using n8n
Integrations
Hosting n8n
Code in n8n
Advanced AI
API
Embed
n8n home ↗
Forum ↗
Blog ↗
User
get
Retrieve all users
post
Create multiple users
get
Get user by ID/Email
del
Delete a user
patch
Change a user's global role
Audit
post
Generate an audit
Execution
get
Retrieve all executions
get
Retrieve an execution
del
Delete an execution
Workflow
post
Create a workflow
get
Retrieve all workflows
get
Retrieves a workflow
del
Delete a workflow
put
Update a workflow
post
Activate a workflow
post
Deactivate a workflow
put
Transfer a workflow to another project.
put
Transfer a credential to another project.
get
Get workflow tags
put
Update tags of a workflow
Credential
post
Create a credential
del
Delete credential by ID
get
Show credential data schema
Tags
post
Create a tag
get
Retrieve all tags
get
Retrieves a tag
del
Delete a tag
put
Update a tag
SourceControl
post
Pull changes from the remote repository
Variables
post
Create a variable
get
Retrieve variables
del
Delete a variable
put
Update a variable
Projects
post
Create a project
get
Retrieve projects
del
Delete a project
put
Update a project
post
Add one or more users to a project
del
Delete a user from a project
patch
Change a user's role in a project
redocly logoAPI docs by Redocly
n8n Public API (1.1.1)
Download OpenAPI specification:Download

E-mail: hello@n8n.io
License: Sustainable Use License
Terms of Service
n8n Public API

n8n API documentation
User
Operations about users

Retrieve all users
Retrieve all users from your instance. Only available for the instance owner.

Authorizations:
ApiKeyAuth
query Parameters
limit
number <= 250
Default: 100
Example: limit=100
The maximum number of items to return.

cursor
string
Paginate by setting the cursor parameter to the nextCursor attribute returned by the previous request's response. Default value fetches the first "page" of the collection. See pagination for more detail.

includeRole
boolean
Default: false
Example: includeRole=true
Whether to include the user's role or not.

projectId
string
Example: projectId=VmwOO9HeTEj20kxM
Responses
200 Operation successful.
401 Unauthorized

get
/users
Response samples
200
Content type
application/json

Copy
Expand allCollapse all
{
"data": [
{}
],
"nextCursor": "MTIzZTQ1NjctZTg5Yi0xMmQzLWE0NTYtNDI2NjE0MTc0MDA"
}
Create multiple users
Create one or more users.

Authorizations:
ApiKeyAuth
Request Body schema: application/json
required
Array of users to be created.

Array
email
required
string <email>
role
string
Enum: "global:admin" "global:member"
Responses
200 Operation successful.
401 Unauthorized
403 Forbidden

post
/users
Request samples
Payload
Content type
application/json

Copy
Expand allCollapse all
[
{
"email": "user@example.com",
"role": "global:admin"
}
]
Response samples
200
Content type
application/json

Copy
Expand allCollapse all
{
"user": {
"id": "string",
"email": "string",
"inviteAcceptUrl": "string",
"emailSent": true
},
"error": "string"
}
Get user by ID/Email
Retrieve a user from your instance. Only available for the instance owner.

Authorizations:
ApiKeyAuth
path Parameters
id
required
string <identifier>
The ID or email of the user.

query Parameters
includeRole
boolean
Default: false
Example: includeRole=true
Whether to include the user's role or not.

Responses
200 Operation successful.
401 Unauthorized

get
/users/{id}
Response samples
200
Content type
application/json

Copy
{
"id": "123e4567-e89b-12d3-a456-426614174000",
"email": "john.doe@company.com",
"firstName": "john",
"lastName": "Doe",
"isPending": true,
"createdAt": "2019-08-24T14:15:22Z",
"updatedAt": "2019-08-24T14:15:22Z",
"role": "owner"
}
Delete a user
Delete a user from your instance.

Authorizations:
ApiKeyAuth
path Parameters
id
required
string <identifier>
The ID or email of the user.

Responses
204 Operation successful.
401 Unauthorized
403 Forbidden
404 The specified resource was not found.

delete
/users/{id}
Change a user's global role
Change a user's global role

Authorizations:
ApiKeyAuth
path Parameters
id
required
string <identifier>
The ID or email of the user.

Request Body schema: application/json
required
New role for the user

newRoleName
required
string
Enum: "global:admin" "global:member"
Responses
200 Operation successful.
401 Unauthorized
403 Forbidden
404 The specified resource was not found.

patch
/users/{id}/role
Request samples
Payload
Content type
application/json

Copy
{
"newRoleName": "global:admin"
}
Audit
Operations about security audit

Generate an audit
Generate a security audit for your n8n instance.

Authorizations:
ApiKeyAuth
Request Body schema: application/json
optional
additionalOptions
object
Responses
200 Operation successful.
401 Unauthorized
500 Internal server error.

post
/audit
Request samples
Payload
Content type
application/json

Copy
Expand allCollapse all
{
"additionalOptions": {
"daysAbandonedWorkflow": 0,
"categories": []
}
}
Response samples
200
Content type
application/json

Copy
Expand allCollapse all
{
"Credentials Risk Report": {
"risk": "credentials",
"sections": []
},
"Database Risk Report": {
"risk": "database",
"sections": []
},
"Filesystem Risk Report": {
"risk": "filesystem",
"sections": []
},
"Nodes Risk Report": {
"risk": "nodes",
"sections": []
},
"Instance Risk Report": {
"risk": "execution",
"sections": []
}
}
Execution
Operations about executions

Retrieve all executions
Retrieve all executions from your instance.

Authorizations:
ApiKeyAuth
query Parameters
includeData
boolean
Whether or not to include the execution's detailed data.

status
string
Enum: "error" "success" "waiting"
Status to filter the executions by.

workflowId
string
Example: workflowId=1000
Workflow to filter the executions by.

projectId
string
Example: projectId=VmwOO9HeTEj20kxM
limit
number <= 250
Default: 100
Example: limit=100
The maximum number of items to return.

cursor
string
Paginate by setting the cursor parameter to the nextCursor attribute returned by the previous request's response. Default value fetches the first "page" of the collection. See pagination for more detail.

Responses
200 Operation successful.
401 Unauthorized
404 The specified resource was not found.

get
/executions
Response samples
200
Content type
application/json

Copy
Expand allCollapse all
{
"data": [
{}
],
"nextCursor": "MTIzZTQ1NjctZTg5Yi0xMmQzLWE0NTYtNDI2NjE0MTc0MDA"
}
Retrieve an execution
Retrieve an execution from your instance.

Authorizations:
ApiKeyAuth
path Parameters
id
required
number
The ID of the execution.

query Parameters
includeData
boolean
Whether or not to include the execution's detailed data.

Responses
200 Operation successful.
401 Unauthorized
404 The specified resource was not found.

get
/executions/{id}
Response samples
200
Content type
application/json

Copy
Expand allCollapse all
{
"id": 1000,
"data": { },
"finished": true,
"mode": "cli",
"retryOf": 0,
"retrySuccessId": "2",
"startedAt": "2019-08-24T14:15:22Z",
"stoppedAt": "2019-08-24T14:15:22Z",
"workflowId": "1000",
"waitTill": "2019-08-24T14:15:22Z",
"customData": { }
}
Delete an execution
Deletes an execution from your instance.

Authorizations:
ApiKeyAuth
path Parameters
id
required
number
The ID of the execution.

Responses
200 Operation successful.
401 Unauthorized
404 The specified resource was not found.

delete
/executions/{id}
Response samples
200
Content type
application/json

Copy
Expand allCollapse all
{
"id": 1000,
"data": { },
"finished": true,
"mode": "cli",
"retryOf": 0,
"retrySuccessId": "2",
"startedAt": "2019-08-24T14:15:22Z",
"stoppedAt": "2019-08-24T14:15:22Z",
"workflowId": "1000",
"waitTill": "2019-08-24T14:15:22Z",
"customData": { }
}
Workflow
Operations about workflows

Create a workflow
Create a workflow in your instance.

Authorizations:
ApiKeyAuth
Request Body schema: application/json
required
Created workflow object.

name
required
string
nodes
required
Array of objects (node)
connections
required
object
settings
required
object (workflowSettings)
staticData
(string or null) or (object or null)
Responses
200 A workflow object
400 The request is invalid or provides malformed data.
401 Unauthorized

post
/workflows
Request samples
Payload
Content type
application/json

Copy
Expand allCollapse all
{
"name": "Workflow 1",
"nodes": [
{}
],
"connections": {
"main": []
},
"settings": {
"saveExecutionProgress": true,
"saveManualExecutions": true,
"saveDataErrorExecution": "all",
"saveDataSuccessExecution": "all",
"executionTimeout": 3600,
"errorWorkflow": "VzqKEW0ShTXA5vPj",
"timezone": "America/New_York",
"executionOrder": "v1"
},
"staticData": {
"lastId": 1
}
}
Response samples
200
Content type
application/json

Copy
Expand allCollapse all
{
"id": "2tUt1wbLX592XDdX",
"name": "Workflow 1",
"active": true,
"createdAt": "2019-08-24T14:15:22Z",
"updatedAt": "2019-08-24T14:15:22Z",
"nodes": [
{}
],
"connections": {
"main": []
},
"settings": {
"saveExecutionProgress": true,
"saveManualExecutions": true,
"saveDataErrorExecution": "all",
"saveDataSuccessExecution": "all",
"executionTimeout": 3600,
"errorWorkflow": "VzqKEW0ShTXA5vPj",
"timezone": "America/New_York",
"executionOrder": "v1"
},
"staticData": {
"lastId": 1
},
"tags": [
{}
]
}
Retrieve all workflows
Retrieve all workflows from your instance.

Authorizations:
ApiKeyAuth
query Parameters
active
boolean
Example: active=true
tags
string
Example: tags=test,production
name
string
Example: name=My Workflow
projectId
string
Example: projectId=VmwOO9HeTEj20kxM
excludePinnedData
boolean
Example: excludePinnedData=true
Set this to avoid retrieving pinned data

limit
number <= 250
Default: 100
Example: limit=100
The maximum number of items to return.

cursor
string
Paginate by setting the cursor parameter to the nextCursor attribute returned by the previous request's response. Default value fetches the first "page" of the collection. See pagination for more detail.

Responses
200 Operation successful.
401 Unauthorized

get
/workflows
Response samples
200
Content type
application/json

Copy
Expand allCollapse all
{
"data": [
{}
],
"nextCursor": "MTIzZTQ1NjctZTg5Yi0xMmQzLWE0NTYtNDI2NjE0MTc0MDA"
}
Retrieves a workflow
Retrieves a workflow.

Authorizations:
ApiKeyAuth
path Parameters
id
required
string
The ID of the workflow.

query Parameters
excludePinnedData
boolean
Example: excludePinnedData=true
Set this to avoid retrieving pinned data

Responses
200 Operation successful.
401 Unauthorized
404 The specified resource was not found.

get
/workflows/{id}
Response samples
200
Content type
application/json

Copy
Expand allCollapse all
{
"id": "2tUt1wbLX592XDdX",
"name": "Workflow 1",
"active": true,
"createdAt": "2019-08-24T14:15:22Z",
"updatedAt": "2019-08-24T14:15:22Z",
"nodes": [
{}
],
"connections": {
"main": []
},
"settings": {
"saveExecutionProgress": true,
"saveManualExecutions": true,
"saveDataErrorExecution": "all",
"saveDataSuccessExecution": "all",
"executionTimeout": 3600,
"errorWorkflow": "VzqKEW0ShTXA5vPj",
"timezone": "America/New_York",
"executionOrder": "v1"
},
"staticData": {
"lastId": 1
},
"tags": [
{}
]
}
Delete a workflow
Deletes a workflow.

Authorizations:
ApiKeyAuth
path Parameters
id
required
string
The ID of the workflow.

Responses
200 Operation successful.
401 Unauthorized
404 The specified resource was not found.

delete
/workflows/{id}
Response samples
200
Content type
application/json

Copy
Expand allCollapse all
{
"id": "2tUt1wbLX592XDdX",
"name": "Workflow 1",
"active": true,
"createdAt": "2019-08-24T14:15:22Z",
"updatedAt": "2019-08-24T14:15:22Z",
"nodes": [
{}
],
"connections": {
"main": []
},
"settings": {
"saveExecutionProgress": true,
"saveManualExecutions": true,
"saveDataErrorExecution": "all",
"saveDataSuccessExecution": "all",
"executionTimeout": 3600,
"errorWorkflow": "VzqKEW0ShTXA5vPj",
"timezone": "America/New_York",
"executionOrder": "v1"
},
"staticData": {
"lastId": 1
},
"tags": [
{}
]
}
Update a workflow
Update a workflow.

Authorizations:
ApiKeyAuth
path Parameters
id
required
string
The ID of the workflow.

Request Body schema: application/json
required
Updated workflow object.

name
required
string
nodes
required
Array of objects (node)
connections
required
object
settings
required
object (workflowSettings)
staticData
(string or null) or (object or null)
Responses
200 Workflow object
400 The request is invalid or provides malformed data.
401 Unauthorized
404 The specified resource was not found.

put
/workflows/{id}
Request samples
Payload
Content type
application/json

Copy
Expand allCollapse all
{
"name": "Workflow 1",
"nodes": [
{}
],
"connections": {
"main": []
},
"settings": {
"saveExecutionProgress": true,
"saveManualExecutions": true,
"saveDataErrorExecution": "all",
"saveDataSuccessExecution": "all",
"executionTimeout": 3600,
"errorWorkflow": "VzqKEW0ShTXA5vPj",
"timezone": "America/New_York",
"executionOrder": "v1"
},
"staticData": {
"lastId": 1
}
}
Response samples
200
Content type
application/json

Copy
Expand allCollapse all
{
"id": "2tUt1wbLX592XDdX",
"name": "Workflow 1",
"active": true,
"createdAt": "2019-08-24T14:15:22Z",
"updatedAt": "2019-08-24T14:15:22Z",
"nodes": [
{}
],
"connections": {
"main": []
},
"settings": {
"saveExecutionProgress": true,
"saveManualExecutions": true,
"saveDataErrorExecution": "all",
"saveDataSuccessExecution": "all",
"executionTimeout": 3600,
"errorWorkflow": "VzqKEW0ShTXA5vPj",
"timezone": "America/New_York",
"executionOrder": "v1"
},
"staticData": {
"lastId": 1
},
"tags": [
{}
]
}
Activate a workflow
Active a workflow.

Authorizations:
ApiKeyAuth
path Parameters
id
required
string
The ID of the workflow.

Responses
200 Workflow object
401 Unauthorized
404 The specified resource was not found.

post
/workflows/{id}/activate
Response samples
200
Content type
application/json

Copy
Expand allCollapse all
{
"id": "2tUt1wbLX592XDdX",
"name": "Workflow 1",
"active": true,
"createdAt": "2019-08-24T14:15:22Z",
"updatedAt": "2019-08-24T14:15:22Z",
"nodes": [
{}
],
"connections": {
"main": []
},
"settings": {
"saveExecutionProgress": true,
"saveManualExecutions": true,
"saveDataErrorExecution": "all",
"saveDataSuccessExecution": "all",
"executionTimeout": 3600,
"errorWorkflow": "VzqKEW0ShTXA5vPj",
"timezone": "America/New_York",
"executionOrder": "v1"
},
"staticData": {
"lastId": 1
},
"tags": [
{}
]
}
Deactivate a workflow
Deactivate a workflow.

Authorizations:
ApiKeyAuth
path Parameters
id
required
string
The ID of the workflow.

Responses
200 Workflow object
401 Unauthorized
404 The specified resource was not found.

post
/workflows/{id}/deactivate
Response samples
200
Content type
application/json

Copy
Expand allCollapse all
{
"id": "2tUt1wbLX592XDdX",
"name": "Workflow 1",
"active": true,
"createdAt": "2019-08-24T14:15:22Z",
"updatedAt": "2019-08-24T14:15:22Z",
"nodes": [
{}
],
"connections": {
"main": []
},
"settings": {
"saveExecutionProgress": true,
"saveManualExecutions": true,
"saveDataErrorExecution": "all",
"saveDataSuccessExecution": "all",
"executionTimeout": 3600,
"errorWorkflow": "VzqKEW0ShTXA5vPj",
"timezone": "America/New_York",
"executionOrder": "v1"
},
"staticData": {
"lastId": 1
},
"tags": [
{}
]
}
Transfer a workflow to another project.
Transfer a workflow to another project.

Authorizations:
ApiKeyAuth
path Parameters
id
required
string
The ID of the workflow.

Request Body schema: application/json
required
Destination project information for the workflow transfer.

destinationProjectId
required
string
The ID of the project to transfer the workflow to.

Responses
200 Operation successful.
400 The request is invalid or provides malformed data.
401 Unauthorized
404 The specified resource was not found.

put
/workflows/{id}/transfer
Request samples
Payload
Content type
application/json

Copy
{
"destinationProjectId": "string"
}
Transfer a credential to another project.
Transfer a credential to another project.

Authorizations:
ApiKeyAuth
path Parameters
id
required
string
The ID of the credential.

Request Body schema: application/json
required
Destination project for the credential transfer.

destinationProjectId
required
string
The ID of the project to transfer the credential to.

Responses
200 Operation successful.
400 The request is invalid or provides malformed data.
401 Unauthorized
404 The specified resource was not found.

put
/credentials/{id}/transfer
Request samples
Payload
Content type
application/json

Copy
{
"destinationProjectId": "string"
}
Get workflow tags
Get workflow tags.

Authorizations:
ApiKeyAuth
path Parameters
id
required
string
The ID of the workflow.

Responses
200 List of tags
400 The request is invalid or provides malformed data.
401 Unauthorized
404 The specified resource was not found.

get
/workflows/{id}/tags
Response samples
200
Content type
application/json

Copy
Expand allCollapse all
[
{
"id": "2tUt1wbLX592XDdX",
"name": "Production",
"createdAt": "2019-08-24T14:15:22Z",
"updatedAt": "2019-08-24T14:15:22Z"
}
]
Update tags of a workflow
Update tags of a workflow.

Authorizations:
ApiKeyAuth
path Parameters
id
required
string
The ID of the workflow.

Request Body schema: application/json
required
List of tags

Array
id
required
string
Responses
200 List of tags after add the tag
400 The request is invalid or provides malformed data.
401 Unauthorized
404 The specified resource was not found.

put
/workflows/{id}/tags
Request samples
Payload
Content type
application/json

Copy
Expand allCollapse all
[
{
"id": "2tUt1wbLX592XDdX"
}
]
Response samples
200
Content type
application/json

Copy
Expand allCollapse all
[
{
"id": "2tUt1wbLX592XDdX",
"name": "Production",
"createdAt": "2019-08-24T14:15:22Z",
"updatedAt": "2019-08-24T14:15:22Z"
}
]
Credential
Operations about credentials

Create a credential
Creates a credential that can be used by nodes of the specified type.

Authorizations:
ApiKeyAuth
Request Body schema: application/json
required
Credential to be created.

name
required
string
type
required
string
data
required
object
Responses
200 Operation successful.
401 Unauthorized
415 Unsupported media type.

post
/credentials
Request samples
Payload
Content type
application/json

Copy
Expand allCollapse all
{
"name": "Joe's Github Credentials",
"type": "github",
"data": {
"token": "ada612vad6fa5df4adf5a5dsf4389adsf76da7s"
}
}
Response samples
200
Content type
application/json

Copy
{
"id": "vHxaz5UaCghVYl9C",
"name": "John's Github account",
"type": "github",
"createdAt": "2022-04-29T11:02:29.842Z",
"updatedAt": "2022-04-29T11:02:29.842Z"
}
Delete credential by ID
Deletes a credential from your instance. You must be the owner of the credentials

Authorizations:
ApiKeyAuth
path Parameters
id
required
string
The credential ID that needs to be deleted

Responses
200 Operation successful.
401 Unauthorized
404 The specified resource was not found.

delete
/credentials/{id}
Response samples
200
Content type
application/json

Copy
{
"id": "R2DjclaysHbqn778",
"name": "Joe's Github Credentials",
"type": "github",
"createdAt": "2022-04-29T11:02:29.842Z",
"updatedAt": "2022-04-29T11:02:29.842Z"
}
Show credential data schema
Authorizations:
ApiKeyAuth
path Parameters
credentialTypeName
required
string
The credential type name that you want to get the schema for

Responses
200 Operation successful.
401 Unauthorized
404 The specified resource was not found.

get
/credentials/schema/{credentialTypeName}
Response samples
200
Content type
application/json
Example

freshdeskApi
freshdeskApi

Copy
Expand allCollapse all
{
"additionalProperties": false,
"type": "object",
"properties": {
"apiKey": {},
"domain": {}
},
"required": [
"apiKey",
"domain"
]
}
Tags
Operations about tags

Create a tag
Create a tag in your instance.

Authorizations:
ApiKeyAuth
Request Body schema: application/json
required
Created tag object.

name
required
string
Responses
201 A tag object
400 The request is invalid or provides malformed data.
401 Unauthorized
409 Conflict

post
/tags
Request samples
Payload
Content type
application/json

Copy
{
"name": "Production"
}
Response samples
201
Content type
application/json

Copy
{
"id": "2tUt1wbLX592XDdX",
"name": "Production",
"createdAt": "2019-08-24T14:15:22Z",
"updatedAt": "2019-08-24T14:15:22Z"
}
Retrieve all tags
Retrieve all tags from your instance.

Authorizations:
ApiKeyAuth
query Parameters
limit
number <= 250
Default: 100
Example: limit=100
The maximum number of items to return.

cursor
string
Paginate by setting the cursor parameter to the nextCursor attribute returned by the previous request's response. Default value fetches the first "page" of the collection. See pagination for more detail.

Responses
200 Operation successful.
401 Unauthorized

get
/tags
Response samples
200
Content type
application/json

Copy
Expand allCollapse all
{
"data": [
{}
],
"nextCursor": "MTIzZTQ1NjctZTg5Yi0xMmQzLWE0NTYtNDI2NjE0MTc0MDA"
}
Retrieves a tag
Retrieves a tag.

Authorizations:
ApiKeyAuth
path Parameters
id
required
string
The ID of the tag.

Responses
200 Operation successful.
401 Unauthorized
404 The specified resource was not found.

get
/tags/{id}
Response samples
200
Content type
application/json

Copy
{
"id": "2tUt1wbLX592XDdX",
"name": "Production",
"createdAt": "2019-08-24T14:15:22Z",
"updatedAt": "2019-08-24T14:15:22Z"
}
Delete a tag
Deletes a tag.

Authorizations:
ApiKeyAuth
path Parameters
id
required
string
The ID of the tag.

Responses
200 Operation successful.
401 Unauthorized
403 Forbidden
404 The specified resource was not found.

delete
/tags/{id}
Response samples
200
Content type
application/json

Copy
{
"id": "2tUt1wbLX592XDdX",
"name": "Production",
"createdAt": "2019-08-24T14:15:22Z",
"updatedAt": "2019-08-24T14:15:22Z"
}
Update a tag
Update a tag.

Authorizations:
ApiKeyAuth
path Parameters
id
required
string
The ID of the tag.

Request Body schema: application/json
required
Updated tag object.

name
required
string
Responses
200 Tag object
400 The request is invalid or provides malformed data.
401 Unauthorized
404 The specified resource was not found.
409 Conflict

put
/tags/{id}
Request samples
Payload
Content type
application/json

Copy
{
"name": "Production"
}
Response samples
200
Content type
application/json

Copy
{
"id": "2tUt1wbLX592XDdX",
"name": "Production",
"createdAt": "2019-08-24T14:15:22Z",
"updatedAt": "2019-08-24T14:15:22Z"
}
SourceControl
Operations about source control

Pull changes from the remote repository
Requires the Source Control feature to be licensed and connected to a repository.

Authorizations:
ApiKeyAuth
Request Body schema: application/json
required
Pull options

force
boolean
variables
object
Responses
200 Import result
400 The request is invalid or provides malformed data.
409 Conflict

post
/source-control/pull
Request samples
Payload
Content type
application/json

Copy
Expand allCollapse all
{
"force": true,
"variables": {
"foo": "bar"
}
}
Response samples
200
Content type
application/json

Copy
Expand allCollapse all
{
"variables": {
"added": [],
"changed": []
},
"credentials": [
{}
],
"workflows": [
{}
],
"tags": {
"tags": [],
"mappings": []
}
}
Variables
Operations about variables

Create a variable
Create a variable in your instance.

Authorizations:
ApiKeyAuth
Request Body schema: application/json
required
Payload for variable to create.

key
required
string
value
required
string
Responses
201 Operation successful.
400 The request is invalid or provides malformed data.
401 Unauthorized

post
/variables
Request samples
Payload
Content type
application/json

Copy
{
"key": "string",
"value": "test"
}
Retrieve variables
Retrieve variables from your instance.

Authorizations:
ApiKeyAuth
query Parameters
limit
number <= 250
Default: 100
Example: limit=100
The maximum number of items to return.

cursor
string
Paginate by setting the cursor parameter to the nextCursor attribute returned by the previous request's response. Default value fetches the first "page" of the collection. See pagination for more detail.

Responses
200 Operation successful.
401 Unauthorized

get
/variables
Response samples
200
Content type
application/json

Copy
Expand allCollapse all
{
"data": [
{}
],
"nextCursor": "MTIzZTQ1NjctZTg5Yi0xMmQzLWE0NTYtNDI2NjE0MTc0MDA"
}
Delete a variable
Delete a variable from your instance.

Authorizations:
ApiKeyAuth
path Parameters
id
required
string
The ID of the variable.

Responses
204 Operation successful.
401 Unauthorized
404 The specified resource was not found.

delete
/variables/{id}
Update a variable
Update a variable from your instance.

Authorizations:
ApiKeyAuth
Request Body schema: application/json
required
Payload for variable to update.

key
required
string
value
required
string
Responses
204 Operation successful.
400 The request is invalid or provides malformed data.
401 Unauthorized
403 Forbidden
404 The specified resource was not found.

put
/variables/{id}
Request samples
Payload
Content type
application/json

Copy
{
"key": "string",
"value": "test"
}
Projects
Operations about projects

Create a project
Create a project in your instance.

Authorizations:
ApiKeyAuth
Request Body schema: application/json
required
Payload for project to create.

name
required
string
Responses
201 Operation successful.
400 The request is invalid or provides malformed data.
401 Unauthorized

post
/projects
Request samples
Payload
Content type
application/json

Copy
{
"name": "string"
}
Retrieve projects
Retrieve projects from your instance.

Authorizations:
ApiKeyAuth
query Parameters
limit
number <= 250
Default: 100
Example: limit=100
The maximum number of items to return.

cursor
string
Paginate by setting the cursor parameter to the nextCursor attribute returned by the previous request's response. Default value fetches the first "page" of the collection. See pagination for more detail.

Responses
200 Operation successful.
401 Unauthorized

get
/projects
Response samples
200
Content type
application/json

Copy
Expand allCollapse all
{
"data": [
{}
],
"nextCursor": "MTIzZTQ1NjctZTg5Yi0xMmQzLWE0NTYtNDI2NjE0MTc0MDA"
}
Delete a project
Delete a project from your instance.

Authorizations:
ApiKeyAuth
path Parameters
projectId
required
string
The ID of the project.

Responses
204 Operation successful.
401 Unauthorized
403 Forbidden
404 The specified resource was not found.

delete
/projects/{projectId}
Update a project
Update a project.

Authorizations:
ApiKeyAuth
path Parameters
projectId
required
string
The ID of the project.

Request Body schema: application/json
required
Updated project object.

name
required
string
Responses
204 Operation successful.
400 The request is invalid or provides malformed data.
401 Unauthorized
403 Forbidden
404 The specified resource was not found.

put
/projects/{projectId}
Request samples
Payload
Content type
application/json

Copy
{
"name": "string"
}
Add one or more users to a project
Add one or more users to a project on your instance.

Authorizations:
ApiKeyAuth
path Parameters
projectId
required
string
The ID of the project.

Request Body schema: application/json
Payload containing an array of one or more users to add to the project.

relations
required
Array of objects
A list of userIds and roles to add to the project.

Responses
201 Operation successful.
401 Unauthorized
403 Forbidden
404 The specified resource was not found.

post
/projects/{projectId}/users
Request samples
Payload
Content type
application/json

Copy
Expand allCollapse all
{
"relations": [
{}
]
}
Delete a user from a project
Delete a user from a project on your instance.

Authorizations:
ApiKeyAuth
path Parameters
projectId
required
string
The ID of the project.

userId
required
string
The ID of the user.

Responses
204 Operation successful.
401 Unauthorized
403 Forbidden
404 The specified resource was not found.

delete
/projects/{projectId}/users/{userId}
Change a user's role in a project
Change a user's role in a project.

Authorizations:
ApiKeyAuth
path Parameters
projectId
required
string
The ID of the project.

userId
required
string
The ID of the user.

Request Body schema: application/json
Payload containing the new role to assign to the project user.

role
required
string
The role assigned to the user in the project.

Responses
204 Operation successful.
401 Unauthorized
403 Forbidden
404 The specified resource was not found.

patch
/projects/{projectId}/users/{userId}
Request samples
Payload
Content type
application/json

Copy
{
"role": "project:viewer"
}

 Back to top
Previous
Using the API playground
Next
n8n Embed Documentation and Guides
Popular integrations
Google Sheets
Telegram
MySQL
Slack
Discord
Postgres

Trending combinations
HubSpot and Salesforce
Twilio and WhatsApp
GitHub and Jira
Asana and Slack
Asana and Salesforce
Jira and Slack

Top integration categories
Development
Communication
Langchain
AI
Data & Storage
Marketing

Trending templates
Creating an API endpoint
AI agent chat
Scrape and summarize webpages with AI
Very quick quickstart
Pulling data from services that n8n doesn’t have a pre-built integration for
Joining different datasets

Top guides
Telegram bots
Open-source chatbot
Open-source LLM
Open-source low-code platforms
Zapier alternatives
Make vs Zapier

Pricing ↗
Workflow templates ↗
Feature highlights ↗
AI highlights ↗
Change cookie settings
Made with Material for MkDocs Insiders
