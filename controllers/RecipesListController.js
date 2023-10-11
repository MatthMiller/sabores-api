import RecipesList from '../models/RecipesList.js';
import Recipe from '../models/Recipe.js';
import RecipesInList from '../models/associative/RecipesInList.js';

class RecipesListController {
  static async create(req, res) {
    try {
      const { title } = req.body;

      if (!title) {
        res.status(400).json({ message: "A chave 'title' é necessária" });
        return;
      }

      if (title.length < 3 || title.length > 100) {
        res.status(400).json({
          message: "'title' precisa ter mais que 3 e menos que 100 caracteres",
        });
        return;
      }

      await RecipesList.create({ title });
      res.status(200).json({ message: `Lista '${title}' criada com sucesso` });
    } catch (error) {
      res.status(500).json({ message: 'Erro inesperado' });
      console.log(error);
      return;
    }
  }

  static async addToList(req, res) {
    try {
      const { recipeId, listId } = req.body;

      if (!recipeId || !listId) {
        res.status(400).json({
          message: "A chave 'recipeId' e 'listId' são necessárias",
        });
        return;
      }

      const list = await RecipesList.findByPk(listId);
      const recipe = await Recipe.findByPk(recipeId);

      if (!list) {
        res.status(400).json({
          message: 'Lista de receitas não encontrada',
        });
        return;
      }

      if (!recipe) {
        res.status(400).json({
          message: 'Receita não encontrada',
        });
        return;
      }

      const existingRecord = await RecipesInList.findOne({
        where: {
          recipeId,
          recipesListId: listId,
        },
      });

      if (existingRecord) {
        res.status(400).json({
          message: `Essa receita já está na lista de id ${listId}`,
        });
        return;
      }

      await RecipesInList.create({
        recipeId,
        recipesListId: listId,
      });

      res
        .status(200)
        .json({ message: 'Receita adicionada a lista com sucesso' });
    } catch (error) {
      res.status(500).json({ message: 'Erro inesperado' });
      console.log(error);
      return;
    }
  }

  static async removeFromList(req, res) {
    try {
      const { recipeId, listId } = req.body;

      if (!recipeId || !listId) {
        res.status(400).json({
          message: "A chave 'recipeId' e 'listId' são necessárias",
        });
        return;
      }

      const list = await RecipesList.findByPk(listId);
      const recipe = await Recipe.findByPk(recipeId);

      if (!list) {
        res.status(400).json({
          message: 'Lista de receitas não encontrada',
        });
        return;
      }

      if (!recipe) {
        res.status(400).json({
          message: 'Receita não encontrada',
        });
        return;
      }

      const existingRecord = await RecipesInList.findOne({
        where: {
          recipeId,
          recipesListId: listId,
        },
      });

      if (!existingRecord) {
        res.status(400).json({
          message: `Essa receita não pertence a lista de id ${listId}`,
        });
        return;
      }

      await existingRecord.destroy();

      res
        .status(200)
        .json({ message: 'Receita removida da lista com sucesso' });
    } catch (error) {
      res.status(500).json({ message: 'Erro inesperado' });
      console.log(error);
      return;
    }
  }

  static async setSeasonalList(req, res) {
    try {
      const { listId } = req.params;

      if (!listId) {
        res.status(400).json({
          message: "O parâmetro 'listId' é necessário",
        });
        return;
      }

      const list = await RecipesList.findByPk(listId);

      if (!list) {
        res.status(400).json({ message: 'Essa lista não existe' });
        return;
      }

      const oldList = await RecipesList.findOne({
        where: {
          isSeasonal: true,
        },
      });

      if (oldList) {
        oldList.isSeasonal = false;
        await oldList.save();
      }

      list.isSeasonal = true;
      await list.save();
      res.status(200).json({ message: 'Lista sazonal redefinida com sucesso' });
    } catch (error) {
      res.status(500).json({ message: 'Erro inesperado' });
      console.log(error);
      return;
    }
  }

  static async getSeasonalList(req, res) {
    try {
      const list = await RecipesList.findOne({
        where: { isSeasonal: true },
        raw: true,
      });

      if (!list) {
        res.status(404).json({ message: 'Não há uma lista sazonal' });
        return;
      }

      const recipes = await RecipesInList.findAll({
        where: { recipesListId: list.id },
        raw: true,
      });

      const formattedRecipes = await Promise.all(
        recipes.map(async (recipe) => {
          const recipeDetails = await Recipe.findByPk(recipe.recipeId, {
            raw: true,
          });

          return {
            id: recipeDetails.id,
            title: recipeDetails.title,
            author: recipeDetails['User.name'],
            videoLink: recipeDetails.videoLink,
            estimatedTimeMinutes: recipeDetails.estimatedTimeMinutes,
            ingredients: recipeDetails.ingredients,
            imagePath: `http://${req.headers.host}/images/${recipeDetails.imageName}`,
            createdAt: recipeDetails.createdAt,
            updatedAt: recipeDetails.updatedAt,
          };
        })
      );

      res.status(200).json({
        title: list.title,
        updatedAt: list.updatedAt,
        createdAt: list.createdAt,
        recipes: formattedRecipes,
      });
    } catch (error) {
      res.status(500).json({ message: 'Erro inesperado' });
      console.log(error);
      return;
    }
  }
}

export default RecipesListController;
