# Show Hacker

![Sample Project Screenshot](https://raw.githubusercontent.com/melvitax/showhacker.com/master/_Screenshot.jpg "Sample Project Screenshot")

## About

Show Hacker is an aggregator of discounted Broadway tickets that includes lottery and rush ticket info in one single location. It is an open source project where any one can contibute code or content.


## How To Contribute Content

Show Hacker is backed by a content management system where a contributor can update information about any show. If you would like to become a contributor, send me an email requesting an account.

## Howe To Contribute Code

You can clone this project and make a pull request to fix any bugs. If you would like to add a new feature, reach out to me first to ensure the feature is something we want to pursue.

### Technology

Show Hacker is backed by **Jekyll** static site generator and is hosted in **Github Pages**. It also uses **NodeJS** and **Webpack** to manage dependencies.

### First time install
Make sure you have installed [Jekyll](https://jekyllrb.com)

#### Cloning the project

```
$ git clone https://github.com/melvitax/showhacker.com
```

#### Installing Node Modules

```
$ npm install
```

#### Installing Jekyll Gem

```
$ gem install jekyll
```

#### Installing Bundler 
2.0.1 is the version supported by Netlify CMS

```
$ gem install bundler -v 2.0.1
```

#### Installing Gems

```
$ bundle install
```

### Adding external Javascript scripts

External scripts like JQuery, Video.js etc are placed in the /vendor directory. If you need to add a new script that is available via npm, add the script via npm then use webpack to move them from the npm directory to the /venddor directory. It's a longer process initially but makes it easier to keep updated down the line.

For example the steps to add JQuery are:

> package.json - under devDependencies
 
`"jquery": "^3.4.1"`

> terminal: run the npm installer, this installs the files in the node_modules directory 

`npm install`

> webpack.config.js - add to config under plugins

`{ from: './node_modules/jquery/dist/jquery.min.js', to: './vendor/jquery' }`

> terminal: run webpack to move the files to /vendor

`$ npm run webpack`

#### Running locally
```
$ npm run dev
```

