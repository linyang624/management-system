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
import { FiImage } from "react-icons/fi";


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
  };

  //preiew button
  const handlePreviewImage = () => {
    setPreviewImage(formData.imageLink.trim());
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
    <div style={ pageContainerStyle} >
    <div style={formWrapperStyle}>
      <h2 style={ pageTitleStyle }>
        {isEditMode ? "Edit Product" : "Add Product"}
      </h2>

      <form onSubmit={handleSubmit} style={formCardStyle}>

        {pageError && (
          <p style={{ color: "red", marginBottom: "16px" }}>{pageError}</p>
        )}

        <div style={{ marginBottom: "16px" }}>
          <label style={labelStyle}>Product name</label>
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
          <label style={labelStyle}>
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
            <label style={labelStyle}>
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
            <label style={labelStyle}>
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
            <label style={labelStyle}>
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
            <label style={labelStyle}>
              Add Image Link
            </label>
            <div style={imageLinkRowStyle}>
                <input
                    type="text"
                    name="imageLink"
                    value={formData.imageLink}
                    onChange={handleChange}
                    placeholder="http://"
                    style={imageLinkInputStyle}
                />
                <button
                    type="button"
                    onClick={handlePreviewImage}
                    style={previewButtonStyle}
                >
                    Preview
                </button>
            </div>
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

       {/* <div
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
        </div> */}

        <div style={previewOuterStyle}>
            {previewImage ? (
                <img
                    src={previewImage}
                    alt="Preview"
                    style={previewImageStyle}
                 />
            ) : (
            <div style={previewPlaceholderStyle}>
                <FiImage style={previewIconStyle} />
                <span style={previewTextStyle}>image preview!</span>
            </div>
            )}
        </div>

        {/* <div
          style={{
            display: "flex",
            gap: "12px",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        > */}
        <div style={buttonRowStyle}>
          <button
            type="submit"
            disabled={submitting}
            style={submitButtonStyle}
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
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px",
  border: "1px solid #ccc",
  borderRadius: "4px",
  boxSizing: "border-box",
  fontFamily: "Arial, sans-serif",
};

const twoColumnWrapperStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: "16px",
  marginBottom: "16px",
};

const pageContainerStyle = {
  maxWidth: "1320px",
  margin: "0 auto",
  padding: "48px 32px 28px",
  fontFamily: "Arial, sans-serif",
  boxSizing: "border-box",
};

const pageTitleStyle = {
  fontSize: "28px",
  margin: "0 0 32px 0",
  fontWeight: "700",
  color: "#111827",
  fontFamily: "Arial, sans-serif",
};

const formCardStyle = {
  width: "100%",
  maxWidth: "620px",
  backgroundColor: "#fff",
  padding: "32px 48px",
  borderRadius: "0",
  boxShadow: "none",
  boxSizing: "border-box",
};

const labelStyle = {
  display: "block",
  marginBottom: "8px",
  color: "#6b7280",
  fontSize: "14px",
  fontWeight: "500",
  fontFamily: "Arial, sans-serif",
};

const formWrapperStyle = {
  width: "100%",
  maxWidth: "620px",
  margin: "0 auto",
};

const previewOuterStyle = {
  width: "70%",
  height: "180px",
  margin: "20px auto 24px",
  border: "1px dashed #cfcfcf",
  backgroundColor: "#fff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
  boxSizing: "border-box",
};

const previewPlaceholderStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "10px",
  color: "#6b7280",
  fontFamily: "Arial, sans-serif",
};

const previewIconStyle = {
  width: "34px",
  height: "34px",
  color: "#d1d5db",
};

const previewTextStyle = {
  fontSize: "14px",
  fontWeight: "500",
  color: "#6b7280",
};

const previewImageStyle = {
  width: "100%",
  height: "100%",
  objectFit: "contain",
};

const buttonRowStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "12px",
  flexWrap: "wrap",
};

const submitButtonStyle = {
  width: "120px",
  height: "38px",
  backgroundColor: "#4f46e5",
  color: "#fff",
  border: "none",
  borderRadius: "3px",
  cursor: "pointer",
  fontSize: "13px",
  fontWeight: "500",
  fontFamily: "Arial, sans-serif",
};

const imageLinkRowStyle = {
  display: "flex",
  alignItems: "center",
  width: "100%",
  border: "1px solid #ccc",
  borderRadius: "4px",
  boxSizing: "border-box",
  overflow: "hidden",
  backgroundColor: "#fff",
};

const imageLinkInputStyle = {
  flex: 1,
  height: "40px",
  padding: "10px",
  border: "none",
  outline: "none",
  fontSize: "14px",
  fontFamily: "Arial, sans-serif",
  boxSizing: "border-box",
};

const previewButtonStyle = {
  width: "68px",
  height: "32px",
  marginRight: "8px",
  border: "none",
  borderRadius: "4px",
  backgroundColor: "#4f46e5",
  color: "#fff",
  cursor: "pointer",
  fontSize: "12px",
  fontWeight: "500",
  fontFamily: "Arial, sans-serif",
};