var elem = document.querySelector('#app');

function fetchRecipes(url, callback) {
  fetch(url)
  .then( res => res.json() )
  .then( data => callback(data) )
  .catch( (err) => { console.error(err)})
}

function getEm() {

  fetchRecipes('http://localhost:3000/api/recipes', (recipes) => {
    console.log(recipes)
    const markup = `
      <ul class="recipes">
        ${recipes.map(
      recipe => `
        <li>
          <h2>${recipe.title}</h2>
          <p>${recipe.description}</p>
          <img src="img/${recipe.image}" />

          <h3>Ingredients</h3>
          <ul class="ingredient">${
            recipe.ingredients.map(
              (ingredient) => `<li>${ingredient}</li>`
            ).join('')
            }
          </ul>

          <h3>Steps</h3>
          <ul class="ingredient">
          ${ recipe.preparation.map(
            (prep) => `<li>${(prep.step)}</li>`
          ).join('')
          }
          </ul>

        </li>
        `
        ).join('')}
      </ul>
    `
    elem.innerHTML = markup;
  })
}

getEm();