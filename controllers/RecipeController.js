class RecipeController {
  /**
   * Como fazer puxar o base64 da imagem no JavaScript do client:
   * https://refine.dev/blog/how-to-base64-upload/#example
   * usando o objeto FileReader.
   */

  static async create(req, res) {
    try {
      res
        .status(200)
        .json({ message: 'Vamos criar uma receita 🤖!', uuid: req.uuid });
    } catch (error) {
      res.status(500).json({ message: error });
      console.log(error);
    }
  }
}

export default RecipeController;
