# @xellafe/ngx-deploy-git-repo

**Deploy your Angular app to any Git repo directly from the Angular CLI! 🚀**

## Usage

Add `@xellafe/ngx-deploy-git-repo` to your project.

```bash
ng add @xellafe/ngx-deploy-git-repo
```

Deploy your project.

```
ng deploy [options]
```

## Options

The following options are available.

#### --base-href

- **optional**
- Default: `undefined` (string)
- Example:
  - `ng deploy` -- `<base href="/">` remains unchanged in your `index.html`
  - `ng deploy --base-href=/the-repositoryname/` -- `<base href="/the-repositoryname/">` is added to your `index.html`

Specifies the base URL for the application being built.
Same as `ng build --base-href=/XXX/`

#### --build-target

- **optional**
- Default: `undefined` (string)
- Example:
  - `ng deploy` – Angular project is built in `production` mode
  - `ng deploy --build-target=test` – Angular project is using the build configuration `test` (this configuration must exist in the `angular.json` file)

If no `buildTarget` is set, the `production` build of the default project will be chosen.
The `buildTarget` simply points to an existing build configuration for your project, as specified in the `configurations` section of `angular.json`.
Most projects have a default configuration and a production configuration (commonly activated by using the `--prod` flag) but it is possible to specify as many build configurations as needed.

This is equivalent to calling the command `ng build --configuration=XXX`.
This command has no effect if the option `--no-build` is active.

#### --no-build

- **optional**
- Default: `false` (string)
- Example:
  - `ng deploy` – Angular project is build in production mode before the deployment
  - `ng deploy --no-build` – Angular project is NOT build

Skip build process during deployment.
This can be used when you are sure that you haven't changed anything and want to deploy with the latest artifact.
This command causes the `--build-target` setting to have no effect.

#### --target-dir <a name="target-dir"></a>

- **optional**
- Default: `undefined` (string) – If undefined use value from `--build-target` options, or `production` otherwise.
- Example:
  - `ng deploy --dir=dist/staging`

Overrides the directory where the build to deploy is located.

#### --repo

- Example:
  - `ng deploy --repo=https://<yout-git-repo-url>.git`

Specify the target repository.

#### --branch

- **optional**
- Default: `main` (string)
- Example:
  - `ng deploy --branch=develop`

Specify the target branch. If it doesn't exists, it is created.

#### --message

- **optional**
- Default: `Deploy release` (string)
- Example:
  - `ng deploy --message="This is not an auto generated commit message"`

Specify the commit message.

#### --oauth-pac

- **optional**
- Default: `undefined`
- Example:
  - `xxxxxx-xxxxxxxxxxxxxxxxxxxx`

If you have set up 2FA on your account, you need to use a Personal Access Token to perform operations on the repository. See https://docs.gitlab.com/ee/user/profile/personal_access_tokens.html for an example.  
The only needed scopes are read & write repository.


#### --name & --email <a name="name"></a>

- **optional**
- Default: value of `git config user.name` and `git config user.email`
- Example: `ng deploy --name="Username" --email=mail@example.org`

If you run the command in a repository without `user.name` or `user.email` Git config properties
(or on a machine without these global config properties),
you must provide user info before Git allows you to commit.
In this case, provide **both** `name` and `email` string values to identify the committer.

## License <a name="license"></a>

Code released under the [MIT license](LICENSE).

<hr>

## 🚀 Powered by [ngx-deploy-starter](https://github.com/angular-schule/ngx-deploy-starter)
