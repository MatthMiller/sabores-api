import Recipe from '../models/Recipe.js';
import Category from '../models/Category.js';
import User from '../models/User.js';

class RecipeController {
  /**
   * Como fazer puxar o base64 da imagem no JavaScript do client:
   * https://refine.dev/blog/how-to-base64-upload/#example
   * usando o objeto FileReader.
   */

  static async create(req, res) {
    try {
      const {
        title,
        videoLink,
        ingredients,
        content,
        categoryId,
        estimatedTimeMinutes,
      } = req.body;

      if (
        [
          title,
          ingredients,
          content,
          categoryId,
          estimatedTimeMinutes,
        ].includes(undefined)
      ) {
        res.status(400).json({
          message:
            "The keys 'title', 'ingredients', 'categoryId', 'estimatedTimeMinutes' and 'content' are required",
        });
        return;
      }

      if (title.length < 3 || title.length > 100) {
        res.status(400).json({
          message: 'Title must have between 3 and 100 characters',
        });
        return;
      }

      if (
        typeof ingredients !== 'number' &&
        ingredients % 1 !== 0 &&
        typeof estimatedTimeMinutes !== 'number' &&
        ingredients % 1 !== 0
      ) {
        res.status(400).json({
          message: "'ingredients' and 'estimatedTimeMinutes' must be integers",
        });
        return;
      }

      const category = await Category.findOne({ where: { id: categoryId } });

      if (!category) {
        res
          .status(400)
          .json({ message: `Essa categoria não existe (id: ${categoryId})` });
        return;
      }

      await Recipe.create({
        title,
        imageName: req.uuid,
        ingredients,
        content,
        estimatedTimeMinutes,
        CategoryId: categoryId,
        videoLink: videoLink === undefined ? null : videoLink,
      });

      res.status(200).json({ message: 'Receita criada com sucesso!' });
    } catch (error) {
      res.status(500).json({ message: 'Erro inesperado' });
      console.log(error);
      return;
    }
  }

  static async customFeed(req, res) {
    try {
      res.json({
        message:
          'Custom Feed. Rota pra feed do usuário (mostra receitas dos seguidores primeiro)',
      });
    } catch (error) {
      res.status(500).json({ message: 'Erro inesperado' });
      console.log(error);
    }
  }

  static async feed(req, res) {
    try {
      const orderParam = req.params.order || 'recent';
      const actualPage = parseInt(req.query.page) || 1;
      const recipesPerPage = parseInt(req.query.recipesPerPage) || 10;

      let order = '';
      if (orderParam === 'recent') {
        order = 'DESC';
      } else if (orderParam === 'old') {
        order = 'ASC';
      } else {
        res.status(400).json({ message: 'Invalid order filter' });
        return;
      }

      const { count, rows } = await Recipe.findAndCountAll({
        raw: true,
        limit: recipesPerPage,
        offset: (actualPage - 1) * recipesPerPage,
        order: [['createdAt', order]],
        include: [
          {
            model: User,
            attributes: ['name'],
          },
        ],
        attributes: { exclude: ['UserId'] },
      });

      const recipes = rows.map((recipe) => ({
        id: recipe.id,
        title: recipe.title,
        author: recipe['User.name'],
        videoLink: recipe.videoLink,
        ingredients: recipe.ingredients,
        imagePath: `http://${req.headers.host}/images/${recipe.imageName}`,
        createdAt: recipe.createdAt,
        updatedAt: recipe.updatedAt,
      }));

      res.json({
        totalPages: Math.ceil(count / recipesPerPage),
        actualPage,
        recipes,
      });
    } catch (error) {
      res.status(500).json({ message: 'Erro inesperado' });
      console.log(error);
      return;
    }
  }
}

export default RecipeController;
