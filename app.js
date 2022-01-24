const meal = document.getElementById('meal-input');
const search = document.getElementById('search-icon');
const randomsearch = document.getElementById('random-search');
const foodBox = document.getElementById('food-box');
const heading = document.querySelector('.heading');
const singleMeal = document.querySelector('.singleMeal');
const randomSearch = document.getElementById('random-search')

// event listeners

search.addEventListener('click',mealfind);
 randomSearch.addEventListener('click',randomMeal)   

// functions
// fetch meal by id
function getMealById(mealID){
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
    .then(res => res.json())
    .then(data=>{
        const meal = data.meals[0];
        addMealToDOM(meal)
    });
};

// random meal
function randomMeal(){
    // clear headings and meal
    foodBox.innerHTML = '';
    heading.innerHTML = '';
    fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
    .then(res=>res.json())
    .then(data=>{
        const randomMeal = data.meals[0];
        addMealToDOM(randomMeal)
    })
}



// addmeal to dom
function addMealToDOM(meal) {
    const ingredients = [];
  
    for (let i = 1; i <= 20; i++) {
      if (meal[`strIngredient${i}`]) {
        ingredients.push(
          `${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`
        );
      } else {
        break;
      }
    }
  
    singleMeal.innerHTML = `
      <div class="single-meal">
        <h1>${meal.strMeal}</h1>
        <img src="${meal.strMealThumb}" class="images" alt="${meal.strMeal}" />
        <div class="single-meal-info">
          ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ''}
          ${meal.strArea ? `<p>${meal.strArea}</p>` : ''}
        </div>
        <div class="main">
          <p>${meal.strInstructions}</p>
          <h2>Ingredients</h2>
          <ul>
            ${ingredients.map(ing => `<li>${ing}</li>`).join('')}
          </ul>
        </div>
      </div>
    `;
  }
// mealfind
function mealfind(e){
    e.preventDefault();
    let foodName = meal.value;
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${foodName}`)
  .then(response => response.json())
  .then(data => {
    heading.innerHTML=`search results for '${foodName}'`

    if(data.meals === null){
    heading.innerHTML=`There is no search results. Try again`
    }
    else if(meal.value === ''){
    heading.innerHTML=`Enter fileds`
    }
    else{
        foodBox.innerHTML = data.meals.map(meals=>
            `<div class="meal">
                <img src="${meals.strMealThumb}" alt="${meals.strMeal}"/>
                <div class="meal-info" data-mealID="${meals.idMeal}">
                <h4>${meals.strMeal}</h4>
              </div>
            </div>
            `
            )
            .join(''); 
        }  
        
    });
}
foodBox.addEventListener('click', e=>{
    const mealInfo = e.path.find(item =>{
        if(item.classList){
            return item.classList.contains('meal-info');
        }else{
            return false;
        }
    })
    if(mealInfo){
        const mealID = mealInfo.getAttribute('data-mealid');
        getMealById(mealID)
    }
})
