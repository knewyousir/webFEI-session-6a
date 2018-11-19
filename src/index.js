// Angular Work

import angular from 'angular';
import ngRoute from 'angular-route';

const app = angular.module('foodApp', ['ngRoute']);

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

app.component('recipeList', {
    templateUrl: '/templates/recipes.html',
    controller: function RecipeListController($scope, $http) {
        $http.get('api/recipes').then( res => {
            $scope.recipes = res.data;
        })

        $scope.deleteRecipe = (index, recipeId) => {
            $http.delete(`/api/recipes/${recipeId}`)
            .then(() => $scope.recipes.splice(index, 1))
        }
        
        $scope.addRecipe = function(data) {
            $http.post('api/recipes/', data)
            .then(res => {
                $scope.recipes.push(res.data)
                $scope.recipe = {}
            })
        }
    }
});

app.component('recipeDetail', {
    templateUrl: '/templates/recipe.html',
  
    controller: function RecipeDetailController($http, $routeParams, $scope) {
        $http.get('api/recipes/' + $routeParams.recipeId)
        .then(res => {
            $scope.recipe = res.data;
        })
    }
  });