# V - Transitioning to the Front End

## Homework

Work on your API for the midterm.

## Homework Review

Clone the current session by `cd`ing to the desktop and entering:

```sh
git clone https://github.com/front-end-intermediate/session-5.git
```

`cd` into the newly cloned folder, install the npm components from last class and kick off the application:

```sh
npm i
npm start
```

Visit `localhost:3001` in the browser.

### Environment Variables

Edit the mongoUri variable in `.env` to use your own database on mLab.

```sh
NODE_ENV=development
DB=recipes-daniel
DB_USER=devereld
DB_PW=dd2345
PORT=3004
```

Use the DB variable:

```js
const mongoUri = `mongodb://${process.env.DB_USER}:${process.env.DB_PW}@ds157223.mlab.com:57223/${process.env.DB}`;
console.log(mongoUri)
```

Test by going to the recipes end point [localhost:3000/api/recipes](localhost:3000/api/recipes).

Return to the home page and click on the link. Note the error in the browser's console.

If you've changed ports you'll need to change the port number in `scripts.js`:

```js
fetchRecipes( 'http://localhost:3000/api/recipes', (recipes) => {
  ...
}
```

Visit the import endpoint to import recipes if needed.

### ES6 Module Syntax (Demo)

Create `src/test.js`.

Exporting data - using _default_ exports:

```js
const apiKey = 'abcdef';
export default apiKey;
```

Import it into `index.js` (note: paths are not necessary for node modules):

```js
import apiKey from './test';
console.log(apiKey);
```

(Remember, `console.log(apiKey);` is now on the front end and appears in the browser's console.)

The path './test' is relative to the root established in `webpack.config.js`.

Refresh the browser. Note the new variable in the browser's console.

Because we exported it as default, we can rename on import if need be.

In `index.js`:

```js
import foo from './test';
console.log(foo);
```

ES6 Modules can only have one default export but _can_ have multiple named exports.

A _named_ export in `test.js`:

`export const apiKey = 'abcdef';`

requires an import that selects it in `index.js`:

```js
import { apiKey } from './test';
console.log(apiKey);
```

Multiple named exports encourage code encapsulation and reuse across multiple projects.

Functions can be internal to a module or exported.

`test.js`:

```js
export const apiKey = 'abcdef';
export const url = 'https://mlab.com';

export function sayHi(name) {
  console.log(`Say hello ${name}`);
}
```

```js
import { apiKey as foo, url, sayHi } from './test';
sayHi('daniel');
console.log(foo, url);
```

See [the documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export) for options including `import as`, `export as` and exporting multiple items.

## Angular as a Templating Engine

Let's look at using Angular as our page templating language. Documentation for the features we will be using is located [here](https://docs.angularjs.org/guide).

Save the contents of `index.js` and `index.html` to `index-OLD.html` and `index-OLD.js`. 

Edit `index.html` page in the `app` directory:

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Recipes</title>
    <link rel="stylesheet" href="css/styles.css">
    <script src="/js/bundle.js"></script>
</head>

<body>
    <p>It works</p>
</body>

</html>
```

The npm installs for Angular:

```sh
npm i -S angular@1.6.2 angular-route@1.6.2
```

In the old days you would use `<script>` tags to access libraries etc., e.g.:

`<script src="https://code.angularjs.org/1.6.2/angular.js"></script>`

Since we are bundling we use ES6 imports and our installed packages in `node_modules`.

Delete all the content in `index.js` and import angular and angular routing into `index.js`:

```js
import angular from 'angular';
import ngRoute from 'angular-route';
```

(Note that your bundle just got very large.)

### Our first Component

Bootstrap the app in `index.html` and add a custom tag:

```html
<body ng-app="foodApp">
  <div>
    <recipe-list></recipe-list>
  </div>
</body>
```

Create the first component:

```js
import angular from 'angular';
import ngRoute from 'angular-route';

const app = angular.module('foodApp', ['ngRoute']);

app.component('recipeList', {
  template: `<div class="wrap"><h1>{{ name }} component</h1></div>`,
  controller: function RecipeListController($scope) {
    $scope.name = 'Recipe List'
  }
});
```

View the page in the browser.


- [MVC](https://en.wikipedia.org/wiki/Model–view–controller) - Model, View, Controller
- `{{ }}` - "moustaches" or "handlebars" in the template evaluate a value
- `$scope` - the "glue" between application controller and the view (the state)
- ng-model (and ng-repeat etc.) is an Angular [directive](https://docs.angularjs.org/api/ng/directive)
- AngularJS vs Angular
- Dependency injection for `ngRoute`

`ngRoute` is the router for front end views. Always include a single route in Express for your SPA page. Front end routes handle the view (templates) and the logic (controllers) for the views.

Add a template in a new folder: `app > templates > recipes.html`:

```html`
<div class="wrap">
  <h2>Recipes</h2>
  <ul class="recipes">
    <li ng-repeat="recipe in recipes">
    <img ng-src="img/{{ recipe.image }}">
    <h2><a href="recipes/{{ recipe._id }}">{{ recipe.title }}</a></h2>
    <p>{{ recipe.description }}</p>
    </li>
  </ul>
  </div>
```

Edit the template declaration in myapp.js `templateUrl: '/templates/recipes.html',`:

```js
app.component('recipeList', {
  templateUrl: '/templates/recipes.html',
  controller: function RecipeListController($scope) {
    $scope.name = 'Recipe List'
  }
});
```

<!-- ### Formatting

```js
{
  "liveSassCompile.settings.formats": [
      {
        "savePath": "static/css/",
        "format": "expanded"
      }
    ],
    "liveSassCompile.settings.excludeList": [ 
      "**/node_modules/**",
      ".vscode/**",
      "**/other/**"
    ],
}

``` -->

### Routing and Multiple Components

Create our first route using [Angular's ngRoute](https://docs.angularjs.org/api/ngRoute):

```js
app.config(function config($locationProvider, $routeProvider) {
  $routeProvider.when('/', {
    template: `
      <div class="wrap">
        <h1>Home</h1>
      </div>
      `
  });
  $locationProvider.html5Mode(true);
});
```

Note the `$`'s. These are [services](https://docs.angularjs.org/api/ng/service) and are made available to a function by declaring them.

Add in the head of index.html:

`<base href="/">`

Currently the component is hard coded:

```html
  <div>
    <recipe-list></recipe-list>
  </div>
```

Use the `ng-view` directive to alow it to use whatever module we pass into it:

```html
<body ng-app="foodApp">
  <div ng-view></div>
</body>
```

And add the template to our routes:

```js
app.config(function config($locationProvider, $routeProvider) {
  $routeProvider
    .when('/', {
      template: `
      <div class="wrap">
        <h1>Home</h1>
      </div>
      `
    })
    .when('/recipes', {
      template: '<recipe-list></recipe-list>'
    });
  $locationProvider.html5Mode(true);
});
```

### $HTTP

We fetch the dataset from our server using Angular's built-in [$http](https://docs.angularjs.org/api/ng/service/$http) service.

- a core (built into Angular) service that facilitates communication with the remote HTTP servers
- need to make it available to the recipeList component's controller via [dependency injection](https://docs.angularjs.org/guide/di)
- AngularJS predates `fetch`

Use `get` method with `$http` to fetch the json from the data folder:

```js
app.component('recipeList', {
  templateUrl: '/templates/recipes.html',
  controller: function RecipeListController($scope, $http) {
    $http.get('api/recipes').then( res => {
      $scope.recipes = res.data;
      console.log($scope.recipes);
    });
  }
});
```

Test the route. 

Note the routes in Express - `app.js`. Since they run in order we will change our front end route to a universal selector and move it so that it appears after all our api routes:

```js
app.get('/api/recipes', recipes.findAll);
app.get('/api/recipes/:id', recipes.findById);
app.post('/api/recipes', recipes.add);
app.put('/api/recipes/:id', recipes.update);
app.delete('/api/recipes/:id', recipes.delete);
app.get('/api/import', recipes.import);
app.get('/api/killall', recipes.killall);
app.post('api/upload'), recipes.upload;

app.get('*', function(req, res) {
  res.sendFile(__dirname + '/app/index.html');
});
```

### Adding Routing to Display Individual Recipes

Note the `recipe._id` expression in the anchor tag:

`<h1><a href="recipes/{{ recipe._id }}">{{ recipe.title }}</a></h1>`

Clicking on the individual recipe shows a parameter in the browser's location bar. We do not have routes set up for these yet.

A module's `.config()` method gives us access to tools for configuration.

To make the providers, services and directives defined in `ngRoute` available to our application, we added ngRoute as a dependency to our foodApp module:

```js
angular.module('foodApp', ['ngRoute']);
```

Application routes in Angular are declared via `$routeProvider`. This service makes it easy to wire together controllers, view templates, and the current URL location in the browser.

Add a route in `index.js` for the new recipe links:

```js
app.config(function config($locationProvider, $routeProvider) {
  $routeProvider
    .when('/', {
      template: '<h1>Home</h1>'
    })
    .when('/recipes', {
      template: '<recipe-list></recipe-list>'
    })
    .when('/recipes/:recipeId', {
      template: '<recipe-detail></recipe-detail>'
    });
  $locationProvider.html5Mode(true);
});
```

All variables defined with the `:` prefix are extracted into a (injectable) `$routeParams` object.

We inject the routeParams service of `ngRoute` into our controller so that we can extract the recipeId and use it in our stub.

```js
app.component('recipeDetail', {
  template: '<div class="wrap">Detail view for {{recipeId}}</div>',

  controller: function RecipeDetailController($scope, $routeParams) {
    $scope.recipeId = $routeParams.recipeId;
  }
});
```

Clicking on the recipe links in the list view should take you to our stub template.

### Adding the Detail Template

Create `templates/recipe.html`:

```html
<div class="wrap">
  <ul class="recipes single">
    <li>
      <h2>{{ recipe.title }}</h2>
      <img src="img/{{recipe.image}}" />
      <p>{{ recipe.description }}</p>

      <h3>Ingredients</h3>
      <ul class="ingredients">
        <li ng-repeat="ingredient in recipe.ingredients">
          {{ ingredient }}
        </li>
      </ul>
    </li>
  </ul>
</div>
```

Edit the component to use `templateUrl: '/templates/recipe.html',`:

```js
app.config(function config($locationProvider, $routeProvider) {
  $routeProvider
    .when('/', {
      template: '<h1>Home</h1>'
    })
    .when('/recipes', {
      template: '<recipe-list></recipe-list>'
    })
    .when('/recipes/:recipeId', {
      templateUrl: '/templates/recipe.html',
    });
  $locationProvider.html5Mode(true);
});
```

Add:

- `$http` to the dependency list for our controller so we can access the api,
- `$routeParams` so we can access the id in the url, and
- `$scope` so we can make the results of the api call accessible to the view

and use a function to load the data:

```js
app.component('recipeDetail', {
  template: '<div class="wrap">Detail view for {{recipeId}}</div>',

  controller: function RecipeDetailController($http, $routeParams, $scope) {
    $http.get('api/recipes/' + $routeParams.recipeId).then(res => {
      ($scope.recipe = res.data);
      console.log($scope.recipe);
    });
  }
});
```

### Deleting a Recipe

Wire up the `recipes` template with `<span ng-click="deleteRecipe(recipe._id)">✖︎</span>`:

```html
<div class="wrap">
    <ul class="recipes">
        <li ng-repeat="recipe in recipes | filter:query | orderBy:orderProp">
        <img ng-src="img/{{ recipe.image }}">
        <h2><a href="recipes/{{ recipe._id }}">{{ recipe.title }}</a></h2>
        <p>{{ recipe.description }}</p>
        <span ng-click="deleteRecipe(recipe._id)">✖︎</span>
      </li>
    </ul>
</div>
```

Add a delete function to the recipe list controller in `index.js`:

```js
app.component('recipeList', {
  templateUrl: '/templates/recipes.html',
  
  controller: function RecipeListController($scope, $http) {
    $http.get('api/recipes').then( res => {
      $scope.recipes = res.data;
      console.log($scope.recipes);
    });

    $scope.deleteRecipe = recipeid => console.log(recipeid);
  }
});
```

And test.

Use the api:

```js
    $scope.deleteRecipe = recipeid => $http.delete('/api/recipes/' + recipeid);
```

Clicking on an `✖︎` will remove a recipe but you need to refresh to see the result. It has no effect on the view ($scope).

Pass the `index` of the selected recipe to the function:

```html
<span ng-click="deleteRecipe(index, recipe._id)">✖︎</span>
```

Add a promise and use the Array method [splice](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice) on the index to update the scope.

Catch the index in the function (`(index, recipeid)`) and call `then` on it to `splice` the array in scope:

```js
$scope.deleteRecipe = (index, recipeid) =>
    $http.delete(`/api/recipes/${recipeid}`)
    .then(() => $scope.recipes.splice(index, 1));
```

Changes to the db persist and are relected in the view.

<!-- ### Animation

Check the project preferences:

```js
{
  "liveSassCompile.settings.formats": [
      {
        "savePath": "static/css/",
        "format": "expanded"
      }
    ],
    "liveSassCompile.settings.excludeList": [
      "**/node_modules/**",
      ".vscode/**",
      "**/other/**"
    ],
}
```

`npm i --save angular-animate@1.6.2`

Inject `ng-animate` as a dependency in the module:

`const app = angular.module('recipeApp', ['ngAnimate']);`

Add the class `fade` to the `li`'s in the html.

Add this css to `_base.css`:

```css
ul li:nth-child(odd) {
    background: #bada55;
}

.fade.ng-enter {
    animation: 2s appear;
}
.fade.ng-leave {
    animation: 0.5s disappear;
}

@keyframes appear {
    from {
        opacity: 0;
        transform: translateX(-200px);
    }
    to {
        opacity: 1;
    }
}
@keyframes disappear {
    0% {
        opacity: 1;
    }
    50% {
        font-size: 0.75rem;
    }
    75% {
        color: green;
    }
    100% {
        opacity: 0;
        transform: translateX(-100%);
    }
}
``` -->

### Adding a Recipe

Add a form to the recipes template:

```html
<form ng-submit="addRecipe(recipe)">
    <input type="text" ng-model="recipe.title" required placeholder="Title" />
    <textarea type="text" ng-model="recipe.description" required placeholder="Description"></textarea>
    <input type="text" ng-model="recipe.image" required placeholder="Image" />
    <button type="submit">Add Recipe</button>
</form>
```

Add to the recipeList component in `index.js`:

```js
$scope.addRecipe = function(data) {
    $http.post('/api/recipes/', data).then(() => {
        $scope.recipes.push(data);
    });
};
```

e.g.:

```js
const app = angular.module('recipeApp', ['ngAnimate']);

app.component('recipeList', {
    templateUrl: '/js/recipe-list.template.html',
    controller: function RecipeAppController($http, $scope) {
        $http.get('/api/recipes').then(res => {
            $scope.recipes = res.data;
        });

        $scope.deleteRecipe = (index, recipeid) =>
            $http.delete('/api/recipes/' + recipeid).then(() => $scope.recipes.splice(index, 1));

        $scope.addRecipe = function(data) {
            $http.post('/api/recipes/', data).then(() => {
                $scope.recipes.push(data);
            });
        };
    }
});
```

Test by adding a recipe

Edit the push to use the data returned by the response:

```js
$scope.addRecipe = function(data) {
    $http.post('/api/recipes/', data).then(res => {
        console.log(res.data);
        $scope.recipes.push(res.data);
        $scope.recipe = {};
    });
};
```

The complete component:

```js
app.component('recipeList', {
  templateUrl: '/templates/recipes.html',
  controller: function RecipeListController($scope, $http) {
    $http.get('api/recipes').then( res => {
      $scope.recipes = res.data;
    });

    $scope.orderProp = 'date';

    $scope.deleteRecipe = (index, recipeid) => {
      console.log(index, recipeid)
      $http.delete(`/api/recipes/${recipeid}`)
      .then ($scope.recipes.splice(index, 1));
    }

    $scope.addRecipe = function(data) {
      $http.post('/api/recipes/', data).then(() => {
        $scope.recipes.push(data);
      });
    };

  }
});
```

<!-- 
```js
const app = angular.module('recipeApp', ['ngAnimate']);

app.component('recipeList', {
    templateUrl: '/js/recipe-list.template.html',
    controller: function RecipeAppController($http, $scope) {
        $http.get('/api/recipes').then(res => {
            $scope.recipes = res.data;
        });

        $scope.deleteRecipe = function(index, recipeid) {
            $http.delete('/api/recipes/' + recipeid).then(() => $scope.recipes.splice(index, 1));
        };
        $scope.addRecipe = function(data) {
            $http.post('/api/recipes/', data).then(res => {
                $scope.recipes.push(res.data);
                $scope.recipe = {};
            });
        };
    }
});
``` 
-->

### Updating a Recipe

`put` HTTP actions in a REST API correlate to an Update method.

The route for Update also uses an `:id` parameter.

In `recipe.controllers.js`:

```js
exports.update = function(req, res) {
    const id = req.params.id;
    const updates = req.body;

    Recipe.update({ _id: id }, updates, function(err) {
        if (err) return console.log(err);
        return res.sendStatus(202);
    });
};
```

Notice the updates variable storing the `req.body`. `req.body` is useful when you want to pass in larger chunks of data like a single JSON object. Here we will pass in a JSON object (following the schema) of only the model's properties you want to change.

The model's update() takes three parameters:

- JSON object of matching properties to look up the doc with to update
- JSON object of just the properties to update
- callback function that returns any errors

### Test with Curl

We will need to construct this line using ids from the recipes listing and test it in a new Terminal tab. Edit the URL to reflect both the port and id of the target recipe:

(Check the below for proper URL - it changes depending on the port in use as well as the id.)

```sh
curl -i -X PUT -H 'Content-Type: application/json' -d '{"title": "Big Mac"}' http://localhost:3002/api/recipes/5b32895059ea391966aa3825

```

This sends a JSON Content-Type PUT request to our update endpoint. That JSON object is the request body, and the long hash at the end of the URL is the id of the recipe we want to update.

Visit the same URL from the cURL request in the browser to see the changes.

PUT actions are cumbersome to test in the browser, so we'll use Postman to run through the process of editing a recipe above.

1: Set the action to put and the url to a single entry with an id.

2: Set the body to `raw` and the `text` header to application/json

3: put `{ "title": "Toast", "image": "toast.jpg", "description": "Tasty!" }`

4: Test to see changes

### Edit Recipe in the Detail Template

We will allow the user to edit a recipe in the detail view - showing and hiding the editor in the UI using Angular's [ng-show / hide](https://docs.angularjs.org/api/ng/directive/ngShow) function.

Edit `templates/recipe.html`:

```html
<div class="wrap" ng-hide="editorEnabled">
  <h1>{{ recipe.title }}</h1>
  <img ng-src="img/recipes/{{ recipe.image }}" style="width: 200px;"/>
  <p>{{ recipe.description }}</p>

  <h3>Ingredients</h3>
  <ul class="ingredients">
      <li ng-repeat="ingredient in recipe.ingredients">
          {{ ingredient }}
      </li>
  </ul>
  <button ng-click="toggleEditor(recipe)">Edit</button>
</div>

<div class="wrap" ng-show="editorEnabled">
    <form ng-submit="saveRecipe(recipe, recipe._id)" name="updateRecipe">
        <label>Title</label>
        <input ng-model="recipe.title">
        <label>Date</label>
        <input ng-model="recipe.date">
        <label>Description</label>
        <input ng-model="recipe.description">
        <label>Image</label>
        <input ng-model="recipe.image">
        <label>ID</label>
        <input ng-model="recipe._id">
        <button type="submit">Submit</button>
    </form>
    <button type="cancel" ng-click="toggleEditor()">Cancel</button>
</div>

<button type="submit" ng-click="back()">Back</button>
```

<!-- Add a link using the id `href="/recipes/{{ recipe._id }}"` to the existing `recipe-list.template`:

```html
<ul>
  <li ng-repeat="recipe in recipes" class="fade">
      <a href="/recipes/{{ recipe._id }}">{{ recipe.title }} / {{ recipe._id }}</a>
      <span ng-click="deleteRecipe($index, recipe._id)">✖︎</span>
  </li>
</ul>
```

2: Create a `recipeDetail` component in the module.

Use $http.get and $routeParams to grab the info from our api route:

```js
app.component('recipeDetail', {
    templateUrl: '/js/recipe-detail.template.html',
    controller: function RecipeDetailController($http, $routeParams) {
        $http.get('/api/recipes/' + $routeParams.recipeId).then(response => (this.recipe = response.data));
    }
});
``` -->

<!-- Test by clicking on one of the links - you should now be able to view the detail template.

Due to routes in `app.js` refreshing a detail page will not work.

We can try the following in `app.js`

```js
app.get('*', (req, res) => {
    res.sendFile(__dirname + '/static/index.html');
});
``` -->

### Back button

```js
$scope.back = () => window.history.back();
```

e.g.:

```js
app.component('recipeDetail', {
  templateUrl: '/templates/recipe.html',
  
  controller: function RecipeDetailController($http, $routeParams, $scope) {
    $http.get('api/recipes/' + $routeParams.recipeId).then(res => {
      ($scope.recipe = res.data);
    });

    $scope.back = () => window.history.back();
  }
});
```

### Edit Button

Toggling the editor interface:

```js
    $scope.editorEnabled = false;
    $scope.toggleEditor = () => ($scope.editorEnabled = !$scope.editorEnabled);
```

e.g.:

```js
app.component('recipeDetail', {
  templateUrl: '/templates/recipe.html',
  
  controller: function RecipeDetailController($http, $routeParams, $scope) {
    $http.get('api/recipes/' + $routeParams.recipeId).then(res => {
      ($scope.recipe = res.data);
    });

    $scope.back = () => window.history.back();

    $scope.editorEnabled = false;
    $scope.toggleEditor = () => ($scope.editorEnabled = !$scope.editorEnabled);
  }
});
```

<!-- Test this by changing the default value to true:

`this.editorEnabled = true;`

Add a button that only shows when the editor is on:

```html
<button type="cancel" ng-click="$ctrl.toggleEditor()">Cancel</button>
```

e.g.:

```html
<div ng-show="$ctrl.editorEnabled">
    <form ng-submit="$ctrl.saveRecipe($ctrl.recipe, $ctrl.recipe._id)" name="updateRecipe">
        <label>Title</label>
        <input ng-model="$ctrl.recipe.title">
        <label>Date</label>
        <input ng-model="$ctrl.recipe.date">
        <label>Description</label>
        <input ng-model="$ctrl.recipe.description">
        <label>Image</label>
        <input ng-model="$ctrl.recipe.image">
        <label>ID</label>
        <input ng-model="$ctrl.recipe._id">
        <input type="submit" value="Save">
    </form>
    <button type="cancel" ng-click="$ctrl.toggleEditor()">Cancel</button>
</div>
<button type="submit" ng-click="$ctrl.back()">Back</button>
``` -->

Update the recipe detail controller with a save recipe function:

```js
$scope.saveRecipe = (recipe, recipeid) => {
  $http.put('/api/recipes/' + recipeid, recipe).then(res => ($scope.editorEnabled = false));
};
```

e.g.:

```js
app.component('recipeDetail', {
  templateUrl: '/templates/recipe.html',
  
  controller: function RecipeDetailController($http, $routeParams, $scope) {
    $http.get('api/recipes/' + $routeParams.recipeId).then(res => {
      ($scope.recipe = res.data);
    });

    $scope.back = () => window.history.back();

    $scope.editorEnabled = false;
    $scope.toggleEditor = () => ($scope.editorEnabled = !$scope.editorEnabled);

    $scope.saveRecipe = (recipe, recipeid) => {
      $http.put('/api/recipes/' + recipeid, recipe).then(res => ($scope.editorEnabled = false));
    };
  }
});
```

And test.

## Notes

### Adding an Image

Implement an image switcher within our recipe details component.

Note this entry in recipe1309.json: `"mainImageUrl": "lasagna-1.png",`

Add to the template after the header:

`<img ng-src="img/home/{{ $ctrl.recipe.mainImageUrl }}" />`

We are creating an image switcher so we will create a new function in the recipe-detail component:

```js
controller: function RecipeDetailController($http, $routeParams) {
  $http.get('data/' + $routeParams.recipeId + '.json').then(response => {
    this.recipe = response.data;
  });
  this.setImage = imageUrl => (this.mainImageUrl = imageUrl);
}
```

Followed by a call to the function _in the promise function_ to initialize the first image:

```js
controller: function RecipeDetailController($http, $routeParams) {
  $http.get('data/' + $routeParams.recipeId + '.json').then(response => {
    this.recipe = response.data;
    this.setImage(this.recipe.images[3]);
  });
  this.setImage = imageUrl => (this.mainImageUrl = imageUrl);
}
```

Note: changing the index in the setImage call doesn't work yet.

And make the following change to the template, adding a class for styling and a source which uses the `mainImageUrl` variable we created in the controller:

`<img ng-src="img/home/{{$ctrl.mainImageUrl}}" class="recipe-detail-image" />`

(Note: we no longer need `"mainImageUrl": "images/home/lasagna-1.png",` in the json since we are now refering to the images array.)

### ng-click

Add a list of images to the template that we will click on to swap out the main image.

Note the `ng-click` directive and its call to the setImage function we created earlier (this goes below the img tag):

```html
<ul class="recipe-thumbs">
    <li ng-repeat="img in $ctrl.recipe.images">
        <img ng-src="img/home/{{img}}" ng-click="$ctrl.setImage(img)" />
    </li>
</ul>
```

You should now be able to click on one of the images in the list to swap out the main image.

Final refactored component:

```js
app.component('recipeDetail', {
  templateUrl: '/includes/recipe.html',

  controller: function RecipeDetailController($http, $routeParams) {
    $http.get('data/' + $routeParams.recipeId + '.json').then(response => {
      this.recipe = response.data;
      this.setImage(this.recipe.images[3]);
    });
    this.setImage = imageUrl => (this.mainImageUrl = imageUrl);
  }
});
```

`https://www.twilio.com/blog/2017/08/working-with-environment-variables-in-node-js.html`

`https://www.npmjs.com/package/dotenv`

`https://www.contentful.com/blog/2017/04/04/es6-modules-support-lands-in-browsers-is-it-time-to-rethink-bundling/`

https://www.zeolearn.com/magazine/connecting-reactjs-frontend-with-nodejs-backend

https://www.npmjs.com/package/express-fileupload


```js
const cors = require('cors'); // addition we make
const fileUpload = require('express-fileupload'); //addition we make
app.use(fileUpload());

app.post('/api/upload', recipes.upload);

exports.upload = function(req, res, next) {
  console.log(req.files)
  if (Object.keys(req.files).length == 0) {
    return res.status(400).send('No files were uploaded.');
  }
  let file = req.files.file;
  file.mv(`./app/img/${req.body.filename}.jpg`, err => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json({ file: `app/img/${req.body.filename}.jpg` });
    console.log(res.json);
  });
};
```

```html
  <div>
    <form action='/api/upload' method='post' encType="multipart/form-data" >
      <input type="file" name="file" />
      <input type="text" placeholder="File name (.jpg only)" name="filename" />
      <button type='submit'>Submit</button>
    </form>   
  </div>
```

`presets: ['@babel/preset-env']`