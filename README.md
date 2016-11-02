# ALIEM Cards

This repository contains the original markdown source for all the ALIEM Cards as well as the simple API providing the cards to a ReactJS frontend website.

## Card Format

Cards are formatted in [Github-Flavored Markdown](https://guides.github.com/features/mastering-markdown/). They include [YAML](http://www.yaml.org) front matter, similar to [Jekyll](https://jekyllrb.com/docs/frontmatter/).

### Front Matter

The front matter is a simple [YAML](http://www.yaml.org) block beginning and ending with three tick marks: `---`.

Within the tick marks are three key-value pairs:

- **title**: the title of the card
- **collection**: a list of categories to which each card belongs. Cards can belong to more than one category. Each category is on its own indented line, beginning with a hyphen.
- **tags**: a comma-separated list of tags. Currently this is primarily used to tag each card with its associated drugs.

**Sample YAML Front Matter**

```
---

title: Acetaminophen toxicity
collection:
  - toxicology
  - pharmacology
tags: acetaminophen, NAQ

---
```

### Adding Cards to Database

The cards are processed using [Gulp](http://gulpjs.com). There is a ```gulpfile.js``` in the main directory contains the code to run this task. It is run from the command line via ```gulp build_db```.

The gulp task runs through each markdown file, processes the frontmatter and then uploads new cards, and updates changed cards in a [Mongo database](https://www.mongodb.com). The database is hosted on [MLab](https://mlab.com)'s free tier. Communication from the script to the database is via the [Mongoose](http://mongoosejs.com) ORM.

Configuration and authentication information is stored in a ```config.js``` file that is not uploaded to the GitHub repository for security reasons. These details need to be added to OpenShift as custom environmental variables - more below.


## ALiEM Cards Website

The ```www``` folder contains files for the website.

### Frontend

The ```client``` folder contains the necessary pieces for a [ReactJS](https://facebook.github.io/react/)-based frontend. This is a simple [ReactJS](https://facebook.github.io/react/) website that makes ajax calls to the API - documented below.

The ```assets``` folder contains static assets, e.g. images, css files, etc. CSS from the site is based on the simple and barebones [Skeleton Framework](https://skeleton-framework.github.io). Various components have been broken out, and [Stylus](http://stylus-lang.com) is used as a CSS pre-processor.

### Backend

The ```server.js``` file contains the primary backend file for the website. It is built using [ExpressJS](https://expressjs.com) to handle routing. Routes specific to the API live in the ```routes/api.js``` file.

The backend is configured to serve the ```index.html``` to all routes not matching any of the patterns listed ahead of it in the main ```server.js``` file. This is necessary for clean URIs using [React Router](https://github.com/reactjs/react-router-tutorial).

It is also configured with OpenShift environmental variables as defaults for launching the server so it works when deployed or on a development machine.

### OpenShift

The website is hosted on the [OpenShift](https://www.openshift.com) free tier. This hosting platform allows deployment via git. Management is done via their command-line tool.

```
rhc ssh aliemcards
```

This command will provide shell access to the serve.

As mentioned above, [custom environmental variables](https://developers.openshift.com/managing-your-applications/environment-variables.html#custom-variables) must b
e configured for the database authentication to work properly. The only custom variable in the app is ```MLAB_CONNECT_STRING```.

OpenShift has been added to the git repository as another remote, in this case titled ```openshift```. After updates are made to the main respository, changes can be pushed via:

```
git push openshift HEAD
```

## API Documentation

Within the ```www``` folder is a Node Express server that handles API requests for cards and serves the ReactJS-based SPA to all other URL requests.

### APE Endpoints

The API Endpoints return objects with ```status``` and ```data``` properties.

Status  | Meaning
--------|------------
success | Data property contains return objects as detailed below
fail    | Back-end failure, e.g. unable to find specific card slug. Data contains error message.

**api return object**

```
{
  "status": "success",
  "data": [
    {
      "slug": "emergency-drug-card-adult",
      "title": "Emergency Drug Card - Adult"
    },
    {
      "slug": "emergency-drug-card-peds",
      "title": "Emergency Drug Card (Pediatric)"
    }
  ]
}
```

### API Endpoints

Method  | URL               | Action                                    | Return
--------|-------------------|-------------------------------------------|-------
GET     | /cards            | Retrieve all cards.                       | Array of card_summary objects
GET     | /cards/:slug      | Retrieve card with specific slug.         | Card object
GET     | /categories       | Retrieve all categories                   | Array of category objects
GET     | /categories/:slug | Retrieve all cards in specific category.  | Object with `title`, `slug` and array of card_summary objects
GET     | /search/:term     | Retrieve cards based on search term.      | Array of card objects
GET     | /tags             | Retrieve all tags                         | Array of tag objects
GET     | /tags/:slug       | Retrieve all cards with specific tag      | Object with `title`, `slug` and array of card_summary objects

**card object**:
```
{
    "title": "Urinary Tract Infection",
    "slug": "UTI",
    "tags": null,
    "collection": [
      "genitourinary",
      "infectious disease"
    ],
    "content": "Mardown content of the UTI card"
}
```

**card_summary object**:
```
{
    slug: 'card-slug',
    title: 'Card Title'
}
```

**Object with arrays of card_summary objects**
```
{
"status": "success",
"data": {
  "title": "midazolam",
  "slug": "midazolam",
  "cards": [
    {
      "_id": "5813da8dac961c3b6f5683d3",
      "title": "Benzodiazepines Metabolism by the Liver",
      "slug": "benzo-metabolism"
    },
    {
      "_id": "5813da8dac961c3b6f5683ce",
      "title": "Chemical Sedation - Haldol vs Ativan vs Versed",
      "slug": "ativan-vs-haldol"
    },
  }
}
```
