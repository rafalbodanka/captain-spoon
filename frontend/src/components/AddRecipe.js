import React, { useState } from "react";
import axios from "axios";
import TextField from "@mui/material/TextField";

const AddRecipe = ({ isOpen, onRequestClose }) => {
  const [formData, setFormData] = useState({
    detail_url: "",
    title: "",
    publisher: "",
    publisher_url: "",
    tags: [],
    description: "",
    cooking_time: "",
    servings: "",
    ingredients: [],
    image_url: "",
  });

  const [errorFormData, setErrorFormData] = useState({});

  // Form validation
  const validateForm = (formData) => {
    return new Promise((resolve, reject) => {
      let errors = {};

      function isValidUrl(string) {
        try {
          new URL(string);
          return true;
        } catch (err) {
          return false;
        }
      }

      // detail_url validation
      if (!formData.detail_url) {
        errors.detail_url = "Detail URL is required";
      } else if (!isValidUrl(formData.detail_url)) {
        errors.detail_url = "Invalid URL";
      }

      //title validation
      if (!formData.title) {
        errors.title = "Title is required";
      } else if (formData.title.length < 5) {
        errors.title = "Title has to be at least 5 characters long.";
      }

      //publisher validation
      if (!formData.publisher) {
        errors.publisher = "Publisher is required";
      }

      //publisher_url validation
      if (!formData.publisher_url) {
        errors.publisher_url = "Recipe url is required";
      } else if (!isValidUrl(formData.publisher_url)) {
        errors.title = "Invalid URL";
      }

      //tag validation, tag is not necessary but it has to be only one word
      if (formData.tags) {
        formData.tags.forEach((tag) => {
          const tagPattern = /^\w+$/;
          return tagPattern.test(tag);
        });
      }

      if (!formData.cooking_time) {
        errors.cooking_time = "Cooking time field is required";
      } else if (formData.cooking_time < 1) {
        errors.cooking_time = "There has to be at least 1 minute cooking time";
      }

      if (!formData.servings) {
        errors.servings = "Servings field is required";
      } else if (formData.servings < 1) {
        errors.servings = "There can't be less than 1 serving";
      }

      if (formData.ingredients.length < 1) {
        errors.ingredients = "There has to be at least 1 ingredient";
      }

      if (!formData.image_url) {
        errors.image_url = "Image URL is required";
      } else if (!isValidUrl(formData.image_url)) {
        errors.image_url = "Invalid URL";
      }

      setErrorFormData(errors);

      if (Object.keys(errors).length === 0) {
        resolve();
      } else {
        reject();
      }
    });
  };

  const [recipeUploadMessage, setRecipeUploadMessage] = useState("");
  const [isRecipeUploadMessageModalOpen, setIsRecipeUploadMessageModalOpen] =
    useState(false);

  const handleRecipeUploadMessageModaClose = () => {
    setIsRecipeUploadMessageModalOpen(false);
  };

  // Form submitting
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await validateForm(formData);
    } catch (err) {
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/recipes/add/",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      if (response.status === 201) {
        setFormData({
          detail_url: "",
          title: "",
          publisher: "",
          publisher_url: "",
          image_url: "",
          cooking_time: "",
          tags: [],
          description: "",
          servings: "",
          ingredients: [],
        });
        setRecipeUploadMessage("Recipe added succesfully!");
        setIsRecipeUploadMessageModalOpen(true);
      }
    } catch (error) {
      setRecipeUploadMessage("Something went wrong, try again!");
      setIsRecipeUploadMessageModalOpen(true);
    }
  };

  const handleInputChange = (event) => {
    event.preventDefault();

    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  // Tags
  const [tagValue, setTagValue] = useState("");

  const handleTagInputChange = (event) => {
    setTagValue(event.target.value);
  };

  const handleAddTag = (event) => {
    event.preventDefault();
    if (formData.tags.includes(tagValue)) {
      setTagValue("");
      return;
    }

    if (tagValue === "") {
      return;
    }
    setFormData({
      ...formData,
      tags: [...formData.tags, tagValue],
    });
    setTagValue("");
    document.querySelector("#tag").value = "";
  };

  const handleDeleteTag = (event) => {
    const tag = event.target.textContent.trim();
    const newTags = formData.tags.filter((t) => t !== tag);
    setFormData({ ...formData, tags: newTags });
  };

  // Ingredients
  const [ingredientValue, setIngredientValue] = useState({
    name: "",
    quantity: "",
    unit: "",
  });
  const [isIngredientSet, setIsIngredientSet] = useState(false);

  const handleIngredientInputChange = (event) => {
    const { name, value } = event.target;
    setIngredientValue({ ...ingredientValue, [name]: value });
    setIsIngredientSet(true);
  };

  const handleAddIngredient = (event) => {
    event.preventDefault();
    //check if ingredient with given name already exists
    //duplicated names are not allowed, because ingredient deletion bases on ingredient's name
    const ingredientExists = formData.ingredients.some(
      (ingredient) => ingredient.name === ingredientValue.name
    );
    if (ingredientExists) {
      return;
    }

    if (!isIngredientSet) return;
    // Set the quantity field as null if it's an empty string
    const quantity =
      ingredientValue.quantity === "" ? null : ingredientValue.quantity;
    setFormData({
      ...formData,
      ingredients: [...formData.ingredients, { ...ingredientValue, quantity }],
    });
    setIngredientValue({
      name: "",
      quantity: "",
      unit: "",
    });
    setIsIngredientSet(false);
    document.querySelector("#name").value = "";
    document.querySelector("#quantity").value = "";
    document.querySelector("#unit").value = "";
  };

  const handleDeleteIngredient = (event, name) => {
    const newIngredients = formData.ingredients.filter(
      (ing) => ing.name !== name
    );
    setFormData({ ...formData, ingredients: newIngredients });
  };

  return (
    <>
      {isOpen ? (
        <div className="add_recipe-modal-overlay">
          <div className="add_recipe-modal">
            <div className="close_btn_container">
              <div className="close_btn" onClick={onRequestClose}>
                +
              </div>
            </div>
            <div className="add-recipe-header">Add Recipe</div>
            <form onSubmit={handleSubmit}>
              <div className="form_input">
                <TextField
                  id="detail_url"
                  name="detail_url"
                  label="Recipe page"
                  value={formData.detail_url}
                  onChange={handleInputChange}
                  color="warning"
                  fullWidth
                ></TextField>
                {errorFormData.detail_url && (
                  <div className="add_recipe_field_error">
                    {errorFormData.detail_url}
                  </div>
                )}
              </div>
              <div className="form_input">
                <TextField
                  id="image_url"
                  name="image_url"
                  label="Image link"
                  value={formData.image_url}
                  onChange={handleInputChange}
                  color="warning"
                  fullWidth
                ></TextField>
                {errorFormData.image_url && (
                  <div className="add_recipe_field_error">
                    {errorFormData.image_url}
                  </div>
                )}
              </div>
              <div className="form_input">
                <TextField
                  id="title"
                  name="title"
                  label="Title"
                  value={formData.title}
                  onChange={handleInputChange}
                  color="warning"
                  fullWidth
                ></TextField>
                {errorFormData.title && (
                  <div className="add_recipe_field_error">
                    {errorFormData.title}
                  </div>
                )}
              </div>
              <div className="form_input">
                <TextField
                  id="publisher"
                  name="publisher"
                  label="Publisher name"
                  value={formData.publisher}
                  onChange={handleInputChange}
                  color="warning"
                  fullWidth
                ></TextField>
                {errorFormData.publisher && (
                  <div className="add_recipe_field_error">
                    {errorFormData.publisher}
                  </div>
                )}
              </div>
              <div className="form_input">
                <TextField
                  id="publisher_url"
                  name="publisher_url"
                  label="Publisher website"
                  value={formData.publisher_url}
                  onChange={handleInputChange}
                  color="warning"
                  fullWidth
                ></TextField>
                {errorFormData.publisher_url && (
                  <div className="add_recipe_field_error">
                    {errorFormData.publisher_url}
                  </div>
                )}
              </div>
              <div className="form_input">
                <TextField
                  type="text"
                  name="description"
                  maxLength={255}
                  rows={5}
                  id="description"
                  label="Description"
                  value={formData.description}
                  onChange={handleInputChange}
                  color="warning"
                  fullWidth
                ></TextField>
              </div>
              <div className="form_input">
                <TextField
                  type="number"
                  id="cooking_time"
                  name="cooking_time"
                  label="Cooking time"
                  value={formData.cooking_time}
                  onChange={handleInputChange}
                  color="warning"
                  fullWidth
                ></TextField>
                {errorFormData.cooking_time && (
                  <div className="add_recipe_field_error">
                    {errorFormData.cooking_time}
                  </div>
                )}
              </div>
              <div className="form_input">
                <TextField
                  type="number"
                  id="servings"
                  name="servings"
                  label="Servings"
                  value={formData.servings}
                  onChange={handleInputChange}
                  color="warning"
                  fullWidth
                ></TextField>
                {errorFormData.servings && (
                  <div className="add_recipe_field_error">
                    {errorFormData.servings}
                  </div>
                )}
              </div>
              <div className="add-recipe-header">Ingredients</div>
              <div className="form_input">
                <TextField
                  type="text"
                  id="name"
                  name="name"
                  label="Name"
                  onChange={handleIngredientInputChange}
                  color="warning"
                  fullWidth
                ></TextField>
                {errorFormData.ingredients && (
                  <div className="add_recipe_field_error">
                    {errorFormData.ingredients}
                  </div>
                )}
              </div>
              <div className="form_input">
                <TextField
                  type="number"
                  id="quantity"
                  name="quantity"
                  label="Quantity"
                  onChange={handleIngredientInputChange}
                  color="warning"
                  fullWidth
                ></TextField>
              </div>
              <div className="form_input">
                <TextField
                  type="text"
                  id="unit"
                  name="unit"
                  label="Unit"
                  onChange={handleIngredientInputChange}
                  color="warning"
                  fullWidth
                ></TextField>
              </div>
              <button
                className="add_recipe_form_btn"
                type="submit"
                onClick={handleAddIngredient}
              >
                Add ingredient
              </button>
              <div className="ingredients">
                {formData.ingredients.map((ingredient) => {
                  return (
                    <div key={ingredient.name} className="ingredient">
                      <div
                        onClick={(event) =>
                          handleDeleteIngredient(event, ingredient.name)
                        }
                      >
                        {ingredient.name}
                        <div>
                          {ingredient.quantity} {ingredient.unit}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="add-recipe-header">Tags</div>
              <div className="form_input">
                <TextField
                  id="tag"
                  label="Tags"
                  onChange={handleTagInputChange}
                  color="warning"
                  fullWidth
                ></TextField>
                <button
                  className="add_recipe_form_btn"
                  type="button"
                  onClick={handleAddTag}
                >
                  Add tag
                </button>
              </div>
              <div className="tags">
                {formData.tags.map((tag) => {
                  return (
                    <div key={tag} className="tag" onClick={handleDeleteTag}>
                      {" "}
                      {tag}
                    </div>
                  );
                })}
              </div>
              {errorFormData.tags && (
                <div className="add_recipe_field_error">
                  {errorFormData.tags}
                </div>
              )}
              <button className="submit_btn" type="submit">
                Add Recipe
              </button>
            </form>
          </div>
        </div>
      ) : (
        ""
      )}
      {isRecipeUploadMessageModalOpen ? (
        <div
          className="upload_result_modal-overlay"
          onClick={handleRecipeUploadMessageModaClose}
        >
          <div className="upload_result_modal">
            {recipeUploadMessage}
            <div
              className="close_upload_result_modal_btn"
              onClick={handleRecipeUploadMessageModaClose}
            >
              OK
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export default AddRecipe;
