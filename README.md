# Tigris code generation and schema templates

## Schemas repository

Schemas repository resides in the `schema` directory.
Every directory inside `schema` is a schema template, which
contains [JSON schemas](https://json-schema.org) of the collections in the `.json` files:

`schema/{template name}/{collection name}.json`

For example `ecommerce` and `todo` templates look like the following:

```
├── schema
│   ├── ecommerce
│   │   ├── orders.json
│   │   ├── products.json
│   │   └── users.json
│   └── todo
│       └── tasks.json
```

Schema templates can be used like the following during project creation or scaffolding:

```
tigris create project my_proj1 --schema-template=ecommerce
```

This creates three collections `orders`, `products`, `users`, with
schemas from the `schema/ecommerce/` directory.

## Code templates

Applications code templates resides in the `source` directory.
Templates are grouped by the language in the `source` directory.
Every directory in the language directory is a template, which
consists of the components, every component reside in its own directory:

`source/{language}/{template name}/{component name}/`

Component directories processed in the lexicographical orders.
The prefix before underscore in the component directory can be used to change
the order of components processing and is not considered a part of the component name.

In the case of files with the same name in the multiple components,
the last file entirely overwrites previous ones.

Example of application code template layout:

```
source/
└── typescript
    └── express
        ├── 01_models
        └── 02_crud_backend
```

It shows `express` template for the `typescript` language with two components: `models` and `crud_backend`.
By default, all component directories are processed.

To scaffold an application from the above template the following command can be used:

```
tigris scaffold project my_proj1 --template=express --language=typescript
```

## Per collection templates

In order to process templates once per every database collection the file name should contain:
`_collection_name_` placeholder.
For example if there is two collecitons in the database `orders` and `users`, then
the file with name `my_collection_name_helper.ts`, will be process for both orders and users and
the following two files will be generated:
```
myorderhelper.ts
myuserhelper.ts
```
While processing that file [collection context](#collection-context) variables would be set.

## Template variables

Every file of the template directory processed as [Go template](https://pkg.go.dev/text/template).

### Global context

Every template can use the following variables in the global context:

  * URL          string // api.preview.tigrisdata.cloud
  * Collections  []Collection // Array of project collections
  * Collection   Collection // Per collection variables. It only set when processing per collection files.
  * ProjectName       string // user_name
  * ProjectNameCamel  string // UserName
  * PackageName  string // github.com/tigrisdata/example (can be set by --package-name CLI parameter)
  * ClientID     string // Application ID
  * ClientSecret string // Application secret

### Collection context

Per collection files, in addition to global context, set the current collection context, and it contains the following variables:

  * Name      string // UserName
  * NameDecap string // userName

  * JSON         string // user_names
  * JSONSingular string // user_name

  * NamePluralDecap string // userNames
  * NamePlural      string // UserNames

  * PrimaryKey []string // List of primary key field names

  * HasTime bool // set if collection schema contains fields with Time type
  * HasUUID bool // set if colletion schema contains fields with UUID type

## Developing templates

Templates with the local changes can be instantiated using helper script
as follows:

```
./instantiate typescript nextjs ecommerce my_proj1 company/my_proj1
```

Command generates project code in `./my_proj1`.

Usage:
```
"Usage: {language} {framework} {schema} {project name} {package name} [components]"
```
