# MobileCaddy AWS Asset Upload

## Overview

This is the basic side menu shell application built with [MobileCaddy](https://mobilecaddy.net/) that show use of the [image-uploader project](https://github.com/sbolel/image-uploader/).

## Getting Started

* Get the code and the supporting node and packages. The following depencies are needed (For detailed instructions see the [Getting Started Guide](http://developer.mobilecaddy.net/docs));
 * npm (Version 3+ is supported by default  - See the [guides](http://developer.mobilecaddy.net/docs) for assitance with lower versions)
 * grunt-cli
 * ruby
 * sass


* Download the [zip](https://github.com/MobileCaddy/shell-ionic-sidemenu/archive/master.zip) and unzip

```
mv shell-ionic-sidemenu-master shell-ionic-sidemenu
cd shell-ionic-sidemenu
```

## What you get (prior to running any installs/grunt tasks)

```
├── apex-templates    ## Templates for the platform's startpage and cache manifest
├── Gruntfile.js      ## Defines our task automation
├── mock              ## Platform mock responses can go in here
├── package.json      ## The node package file and core app configuration
├── README.md         ## This file
├── scss              ## Where you do your SCSS
├── tests             ## unit tests etc
└── www               ## Where you do your coding
    ├── css
    ├── img
    ├── index.html    ## This is used locally only
    ├── js
    ├── lib
    └── templates
```

* Install the required packages and dependencies (note: you might need `sudo npm install` below)

```
npm install
grunt devsetup
```

The app can be started using this command (that uses the Mobilecaddy CLI) and should be accessible on [http://localhost:3030/www/](http://localhost:3030/www/), though a browser tab should be opened automagically for you.

```
mobilecaddy serve
```

The Codeflow control panel for your application should be availble on [http://localhost:3030/codeflow/](http://localhost:3030/codeflow/).


## Task automation

The Grunt config (out of the box) offers the following commands

* **grunt devsetup** : This should be run once following _npm install_ command. It will copy dependency files over into the correct place in your app
* **grunt serve** : This runs the **connect** and **watch** tasks below.
* **grunt connect** : This will start a server up so you can run your app in the browser
* **grunt watch** : This will watch your template files, JS and SCSS files for changes. And will run will depending on the type of file that changed, run JSHint, SASS compilation and will create a .zip file containing your app. You JS will be unminified in this archive to aid debugging. Any SCSS changes will prompt new CSS and cause live reload of these into your browser.
* **grunt unit-test** : run the karma unit tests
* **grunt dev** : This runs JSHint, SASS compilation and will create a .zip file containing your app. You JS will be unminified in this archive to aid debugging.
* **grunt prod** : This will do the same as **grunt dev** but your JS will be minified in the output archive.

## end2end Testing

e2e tests can be run with protractor. This may need to be installed if you haven't got it already;

```
npm install -g protractor
```

You may also need to install/update the webdriver

```
webdriver-manager update --standaloneUpdating selenium standalone
```

To run the tests;

```
webdriver-manager start
```
... and in another prompt
```
protractor tests/protractor.config.js
```

## Deploying for Production

* Uncomment the line `$compileProvider.debugInfoEnabled(false);` in the www/js/app.js file
* Run `grunt prod` from the command prompt. This creates a minified version
* Without saving anymore files run the "Deply to Salesforce" from within the app.


# To add this functionality to your existing MobileCaddy App

### Install the dependencies

```
npm install angular-file-upload aws-sdk image-uploader --save
```

### Update Grunt tasks to move the new assets to be bundled

Modidy the gruntfile.js so that the following lines in the *copy* task (~line 194) ...

```
        return {
          files: [
            {
              expand: true,
              flatten: true,
              src: ['node_modules/ionic-sdk/release/js/ionic.bundle.min.js',
                    'node_modules/ng-cordova/dist/ng-cordova.min.js'],
              dest: 'www/lib/js',
              filter: 'isFile'
            },
```

... now read
```
        return {
          files: [
            {
              expand: true,
              flatten: true,
              src: ['node_modules/ionic-sdk/release/js/ionic.bundle.min.js',
                    'node_modules/ng-cordova/dist/ng-cordova.min.js',
                    'node_modules/image-uploader/src/image-uploader.js',
                    'node_modules/angular-file-upload/dist/angular-file-upload.min.js',
                    'node_modules/aws-sdk//dist/aws-sdk.min.js'],
              dest: 'www/lib/js',
              filter: 'isFile'
            },
```

### Run the new grunt task
```
grunt devsetup
```

### Add the new libs to be referenced by our html

#### Codeflow

Add the following lines to the `head` of the *index.tpl.html* file, following the *ng-cordova-mocks* entry
```
    <script src="lib/js/angular-file-upload.min.js"></script>
    <script src="lib/js/aws-sdk.min.js"></script>
    <script src="lib/js/image-uploader.js"></script>
```

Re-run creation of our *index.html* file

```
grunt dev
```

#### Platform

Add the following lines to the `head` of the *apex-templates/startpage-template.apex* file, following the *ng-cordova.min.js* entry

```
        <script src="{!URLFOR($Resource.MY_APP_RESOURCE, 'www/lib/js/angular-file-upload.min.js')}" type="text/javascript"></script>
        <script src="{!URLFOR($Resource.MY_APP_RESOURCE, 'www/lib/js/aws-sdk.min.js')}" type="text/javascript"></script>
        <script src="{!URLFOR($Resource.MY_APP_RESOURCE, 'www/lib/js/image-uploader.js')}" type="text/javascript"></script>
```

### Add a directive

In the *www/js/controllers/controllers.module.js* file add a directive to this file, like this. This updates our `vm.file` variable when a file is selected, for use in the upload.

```
  // existing line
  angular.module('starter.controllers', ['ionic'])

      // our new directive
      .directive('file', function() {
        return {
          restrict: 'AE',
          scope: {
            file: '='
          },
          link: function(scope, el, attrs){
            el.bind('change', function(event){
              console.log("event", event);
              var files = event.target.files;
              var file = files[0];
              if(file.size>0){console.log("scope.file", file);
               console.log("event", 'Yup');
                scope.file = file;
              } else {
                scope.file = {};
              }
              scope.$apply();
            });
          }
        };
      })
```

### Add our markup

To your template you can add the following. This is based on you using `controllerAs: 'vm'` syntax and having your , but you can modify to suit your setup.

```
      <input class="bottom-marg-15" type="file" name="file" file="vm.file">
      <button class="button button-small button-full button-positive" ng-disabled="file.size&amp;&amp;false || uploadProgress&gt;0" ng-click="upload()" ng-cloak="">Upload</button>
      <a ng-href="{{uploadUri}}" ng-bind="uploadUri"></a>
```

### Add the upload handler to our controller

Again, based on us using `controllerAs` syntax, and our controller already defining `var vm = this` in our controller.

```
    var imageUploader = new ImageUploader();
    vm.file = {};

    $scope.upload = function() {
      console.log('File upload', vm.file);
      imageUploader.push(vm.file).then(function(data){
        console.log('File uploaded Successfully', vm.file, data);
        // data.url is the returned URL for our uploaded file.
      }).catch(function(e){
        console.error(e);
      });
    };
```

### Set your AWS Account Details

In the *www/lib/js/image-uploader.js* file add your `accessKeyId` and `region` and `secretAccessKey` details that match your AWS account.