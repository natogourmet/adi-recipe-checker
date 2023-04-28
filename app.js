async function validateRecipe({ recipeId }) {
  const request = await fetch(
    `https://prod.fluidconfigure.com/v1/api/recipe/${recipeId}?apiKey=ADIDAS-ZFzVhet0y8DeOoIYqDCG1p3&runValidation=true`
  );
  const recipeData = await request.json();
  if (recipeData.status && recipeData.status == '424') {
    console.log(recipeId, 'false');
    return false;
  }
  console.log(recipeId, 'true');
  return true;
}

function getRecipeIds() {
  const fs = require('fs');
  return new Promise((resolve, reject) => {
    fs.readFile('src/data/recipeIds.txt', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        reject(err);
      }
      const recipeIds = data.split('\n');
      resolve(recipeIds);
    });
  });
}

async function getValidRecipes(recipeIds) {
  const validRecipes = [];
  for (const recipeId of recipeIds) {
    const isValid = await validateRecipe({ recipeId });
    validRecipes.push({
      id: recipeId,
      valid: isValid,
    });
  }
  return validRecipes;
}

function objectToCSV(validRecipesData) {
  return validRecipesData
    .map((recipe) => {
      return `${recipe.id},${recipe.valid}`;
    })
    .join('\n');
}

function createCSVFile(validRecipesData) {
  return new Promise((resolve, reject) => {
    const fs = require('fs');
    fs.writeFile('src/data/verifiedRecipes.csv', validRecipesData, (err) => {
      if (err) {
        console.error(err);
        reject(err);
      }
      resolve();
    });
  });
}

async function init() {
  const recipeIds = await getRecipeIds();
  const validRecipes = await getValidRecipes(recipeIds);
  const validRecipesData = objectToCSV(validRecipes);
  await createCSVFile(validRecipesData);
}

init();

// const data = validateRecipe({
//   recipe:
//     'https://cdn-prod.fluidconfigure.com/api/recipe/11953780?apiKey=ADIDAS-ZFzVhet0y8DeOoIYqDCG1p3',
// });
