import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getProductByIdApi,
  createProductApi,
  updateProductApi,
  deleteProductApi,
} from "../api/productApi";
import { useDispatch, useSelector } from "react-redux";
import { removeProductFromAllCarts } from "../features/cart/cartSlice";


export default function CreateProductPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const isEditMode = Boolean(id);

  const { token } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "Category1",
    price: "",
    stock: "",
    imageLink: "",
    imageFile: null,
  });

  const [previewImage, setPreviewImage] = useState("");
  const [loadingProduct, setLoadingProduct] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [pageError, setPageError] = useState("");
  const [existingProduct, setExistingProduct] = useState(null);

  useEffect(() => {
    const loadProduct = async () => {
      if (!isEditMode) return;

      try {
        setLoadingProduct(true);
        setPageError("");

        const product = await getProductByIdApi(id);

        setExistingProduct(product);
        setFormData({
          name: product.name || "",
          description: product.description || "",
          category: product.category || "Category1",
          price: product.price ?? "",
          stock: product.stock ?? "",
          imageLink: product.image || "",
          imageFile: null,
        });
        setPreviewImage(product.image || "");
      } catch (error) {
        setPageError(error.message || "Failed to load product");
      } finally {
        setLoadingProduct(false);
      }
    };

    loadProduct();
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "imageLink") {
      setPreviewImage(value);
    }
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      setPageError("");

      const productData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        category: formData.category,
        price: Number(formData.price),
        stock: Number(formData.stock),
        image: previewImage || formData.imageLink.trim(),
      };

      if (isEditMode) {
        await updateProductApi(id, productData, token);
        alert("Product updated successfully.");
      } else {
        await createProductApi(productData, token);
        alert("Product created successfully.");
      }

      navigate("/admin/products");
    } catch (error) {
      setPageError(error.message || "Failed to save product");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!isEditMode) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) return;

    try {
      setSubmitting(true);
      setPageError("");

      await deleteProductApi(id, token);

      // Remove this deleted product from all carts in Redux
      dispatch(removeProductFromAllCarts(id));

      alert("Product deleted successfully.");
      navigate("/admin/products");
    } catch (error) {
      setPageError(error.message || "Failed to delete product");
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingProduct) {
    return (
      <div style={{ padding: "20px" }}>
        <h2>Loading product...</h2>
      </div>
    );
  }

  if (isEditMode && pageError && !existingProduct) {
    return (
      <div style={{ padding: "20px" }}>
        <h2 style={{ color: "red" }}>{pageError}</h2>
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
        {pageError && (
          <p style={{ color: "red", marginBottom: "16px" }}>{pageError}</p>
        )}

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
              step="0.01"
              required
            />
          </div>
        </div>

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
{/* 
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
        </div> */}

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
            disabled={submitting}
            style={{
              padding: "10px 18px",
              backgroundColor: "#5a54f9",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            {submitting
              ? "Saving..."
              : isEditMode
              ? "Update Product"
              : "Create Product"}
          </button>

          {isEditMode && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={submitting}
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

const inputStyle = {
  width: "100%",
  padding: "10px",
  border: "1px solid #ccc",
  borderRadius: "4px",
  boxSizing: "border-box",
};

const twoColumnWrapperStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: "16px",
  marginBottom: "16px",
};