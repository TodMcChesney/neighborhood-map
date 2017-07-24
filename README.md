# Neighborhood Map App

This is my version of Project #5 for the Front-End Web Developer
Nanodegree. I used the Google Maps API to generate the map and the
Wikipedia API to get data for each location.

![screenshot](/screenshot.png)

The live version can be viewed here:

[https://todmcchesney.github.io/neighborhood-map/](https://todmcchesney.github.io/neighborhood-map/)

## Getting Started

First clone or download the repo to your local computer. Then to get the
project up and running for development and testing you will need to
setup gulp.

### Requires
- Node.js
- gulp-cli (installed globally)

### Install
From the command line in the root project folder run:

```$ npm install```

This will install gulp locally with all the necessary modules.

### Running Dev Environment

```$ gulp```

This task spins up a localhost server, and watches all files for changes
. BrowserSync automatically opens the index.html page and refreshes
the site after any changes are saved.

### Building Production Code

```$ gulp build```

This task cleans the dist folder first by deleting any old contents.
Then the js, css, and html files are minified and all files are copied
over to the clean dist folder. Links the js and css are updated to the
.min versions in the html.

## License
MIT
