[![Current Version](https://img.shields.io/badge/version-1.0.0-ea0a8e.svg?label=Version&style=flat-square)](https://github.com/jonyu96/admin-ui) [![Live Demo](https://img.shields.io/badge/demo-online-green.svg?label=Demo&style=flat-square)](https://zed-admin-ui.herokuapp.com)

# Zed Admin UI 🤖

🤖 A minimal admin dashboard / tool developed using Angular for managing users and data.<br>

<img src="./images/screenshot.png?raw=true" height="300"> <br>

> Check out the [DEMO](https://zed-admin-ui.herokuapp.com/)

<br>

## Features

- **Registration Component** for registering and storing users internally.
- **Login Component** component for implementation with external SSO API. 
- View registered users and manage their app permissions on **Home Page**.
- CRUD operations with custom form validation (can be implemented with any API backend service)
- Search and alpha-sort filter (for rules data)
- View JSON data with **ngx-json-viewer**
- Configure and view API data sources (think of [Swagger UI](https://petstore.swagger.io)) through form or Swagger file upload
- Custom component (modified **ngx-json-viewer**) for building out JSON objects
- Nebular UI framework used for design

## Running Locally

1. Clone repo
```
git clone https://github.com/jonyu96/admin-ui.git

cd admin-ui
```
2. Install dependencies using NPM
```
npm i 
```
3. Run `ng serve` for dev server and navigate to `http://localhost:4200/`

## Technologies Used

[![Angular](https://img.shields.io/badge/angular-%23DD0031.svg?style=for-the-badge&logo=angular&logoColor=white)](https://angular.io)
[![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/en/)
[![NebularUI](https://img.shields.io/badge/nebular-3366ff.svg?style=for-the-badge&logo=nebular&logoColor=white)](https://akveo.github.io/nebular/)

## License

>You can check out the full license [here](https://github.com/jonyu96/admin-ui/blob/master/LICENSE.MD)

This project is licensed under the terms of the **MIT** license.