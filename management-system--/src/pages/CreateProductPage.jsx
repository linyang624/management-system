import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import products from "../mock/products";

// CreateProductPage is used by admin to add a new product.
// It also supports edit mode when route contains product id.
// It contains a simple controlled form with:
// - product name
// - description
// - category
// - price
// - stock quantity
// - image upload / image preview

export default function CreateProductPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const isEditMode = Boolean(id);

  // Find current product in edit mode
  const existingProduct = isEditMode
    ? products.find((item) => item.id === Number(id))
    : null;

  // Store all form input values in one state object
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "Category1",
    price: "",
    stock: "",
    imageLink: "",
    imageFile: null,
  });

  // Store preview image URL for display
  const [previewImage, setPreviewImage] = useState("");

  /*
    When in edit mode, preload form inputs with existing product data.
  */
  useEffect(() => {
    if (isEditMode && existingProduct) {
      setFormData({
        name: existingProduct.name || "",
        description: existingProduct.description || "",
        category: existingProduct.category || "Category1",
        price: existingProduct.price ?? "",
        stock: existingProduct.stock ?? "",
        imageLink: existingProduct.image || "",
        imageFile: null,
      });

      setPreviewImage(existingProduct.image || "");
    }
  }, [isEditMode, existingProduct]);

  /*
    Handle text, textarea, and select input changes.
    The input's name attribute is used as the key in formData.
  */
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // If admin types an image link manually, use it as preview
    if (name === "imageLink") {
      setPreviewImage(value);
    }
  };

  /*
    Handle image file selection from local computer.
    URL.createObjectURL(file) creates a temporary preview URL
    so the selected image can be shown immediately.
  */
  const handleImageUpload = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setFormData((prev) => ({
      ...prev,
      imageFile: file,
      imageLink: "",
    }));

    setPreviewImage(URL.createObjectURL(file));
  };

  /*
    Handle form submission.

    Create mode:
    - creates a new product object

    Edit mode:
    - creates an updated product object

    Right now we just print data to console.
    Later this can be connected to:
    - Redux
    - backend API
    - database
  */
  const handleSubmit = (e) => {
    e.preventDefault();

    const productData = {
      id: isEditMode ? existingProduct.id : Date.now(),
      name: formData.name,
      description: formData.description,
      category: formData.category,
      price: Number(formData.price),
      stock: Number(formData.stock),
      image: previewImage,
    };

    if (isEditMode) {
      console.log("Updated product:", productData);
      alert("Product updated (mock only).");
    } else {
      console.log("New product:", productData);
      alert("Product created (mock only).");
    }

    navigate("/admin/products");
  };

  /*
    Handle product deletion in edit mode.
    Right now we just print product id to console.
    Later this can be connected to:
    - Redux
    - backend API
    - database
  */
  const handleDelete = () => {
    if (!existingProduct) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) return;

    console.log("Deleted product id:", existingProduct.id);
    alert("Product deleted (mock only).");
    navigate("/admin/products");
  };

  if (isEditMode && !existingProduct) {
    return (
      <div style={{ padding: "20px" }}>
        <h2>Product not found.</h2>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ textAlign: "center", marginBottom: "24px" }}>
        {isEditMode ? "Edit Product" : "Create Product"}
      </h2>

      <form
        onSubmit={handleSubmit}
        style={{
          maxWidth: "500px",
          margin: "0 auto",
          backgroundColor: "#fff",
          padding: "24px",
          borderRadius: "8px",
          boxShadow: "0 0 8px rgba(0, 0, 0, 0.08)",
        }}
      >
        {/* Product name */}
        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", marginBottom: "6px" }}>
            Product name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter product name"
            style={inputStyle}
            required
          />
        </div>

        {/* Product description */}
        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", marginBottom: "6px" }}>
            Product Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter product description"
            rows="5"
            style={{ ...inputStyle, resize: "vertical" }}
            required
          />
        </div>

        {/* Category + Price */}
        <div style={twoColumnWrapperStyle}>
          <div style={{ flex: 1 }}>
            <label style={{ display: "block", marginBottom: "6px" }}>
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="Category1">Category1</option>
              <option value="Category2">Category2</option>
              <option value="Category3">Category3</option>
            </select>
          </div>

          <div style={{ flex: 1 }}>
            <label style={{ display: "block", marginBottom: "6px" }}>
              Price
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Enter price"
              style={inputStyle}
              min="0"
              required
            />
          </div>
        </div>

        {/* Stock + Image link */}
        <div style={twoColumnWrapperStyle}>
          <div style={{ flex: 1 }}>
            <label style={{ display: "block", marginBottom: "6px" }}>
              In Stock Quantity
            </label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              placeholder="Enter quantity"
              style={inputStyle}
              min="0"
              required
            />
          </div>

          <div style={{ flex: 1 }}>
            <label style={{ display: "block", marginBottom: "6px" }}>
              Add Image Link
            </label>
            <input
              type="text"
              name="imageLink"
              value={formData.imageLink}
              onChange={handleChange}
              placeholder="http://"
              style={inputStyle}
            />
          </div>
        </div>

        {/* Upload image button */}
        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", marginBottom: "6px" }}>
            Upload Product Image
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ marginBottom: "12px" }}
          />
        </div>

        {/* Image preview */}
        <div
          style={{
            marginBottom: "20px",
            border: "1px dashed #ccc",
            borderRadius: "8px",
            minHeight: "180px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            backgroundColor: "#fafafa",
          }}
        >
          {previewImage ? (
            <img
              src={previewImage}
              alt="Preview"
              style={{
                width: "100%",
                maxHeight: "220px",
                objectFit: "contain",
              }}
            />
          ) : (
            <span style={{ color: "#888" }}>image preview!</span>
          )}
        </div>

        {/* Submit / Delete buttons */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <button
            type="submit"
            style={{
              padding: "10px 18px",
              backgroundColor: "#5a54f9",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            {isEditMode ? "Update Product" : "Create Product"}
          </button>

          {isEditMode && (
            <button
              type="button"
              onClick={handleDelete}
              style={{
                padding: "10px 18px",
                backgroundColor: "#e5484d",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Delete Product
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

// Shared input style for cleaner code reuse
const inputStyle = {
  width: "100%",
  padding: "10px",
  border: "1px solid #ccc",
  borderRadius: "4px",
  boxSizing: "border-box",
};

// Shared layout style for rows that contain two inputs
const twoColumnWrapperStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: "16px",
  marginBottom: "16px",
};