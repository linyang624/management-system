import { useState } from "react";

// CreateProductPage is used by admin to add a new product.
// It contains a simple controlled form with:
// - product name
// - description
// - category
// - price
// - stock quantity
// - image upload / image preview

export default function CreateProductPage() {
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
    Right now we just print the new product data to console.
    Later this can be connected to:
    - Redux
    - backend API
    - database
  */
  const handleSubmit = (e) => {
    e.preventDefault();

    const newProduct = {
      id: Date.now(),
      name: formData.name,
      description: formData.description,
      category: formData.category,
      price: Number(formData.price),
      stock: Number(formData.stock),
      image: previewImage,
    };

    console.log("New product:", newProduct);

    // Reset form after submit
    setFormData({
      name: "",
      description: "",
      category: "Category1",
      price: "",
      stock: "",
      imageLink: "",
      imageFile: null,
    });

    setPreviewImage("");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ textAlign: "center", marginBottom: "24px" }}>
        Create Product
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

        {/* Submit button */}
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
          Add Product
        </button>
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