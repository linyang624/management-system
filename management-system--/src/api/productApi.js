const BASE_URL = "http://localhost:5001/api/products";

async function handleResponse(response) {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}

// Get product list
export async function getProductsApi(sort = "latest") {
  const response = await fetch(`${BASE_URL}?sort=${sort}`);
  const data = await handleResponse(response);

  return data.map((product) => ({
    id: product._id,
    name: product.name,
    description: product.description,
    category: product.category,
    price: product.price,
    stock: product.stock,
    image: product.image,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  }));
}

// Get single product
export async function getProductByIdApi(id) {
  const response = await fetch(`${BASE_URL}/${id}`);
  const product = await handleResponse(response);

  return {
    id: product._id,
    name: product.name,
    description: product.description,
    category: product.category,
    price: product.price,
    stock: product.stock,
    image: product.image,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };
}

// Create product
export async function createProductApi(productData, token) {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(productData),
  });

  return handleResponse(response);
}

// Update product
export async function updateProductApi(id, productData, token) {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(productData),
  });

  return handleResponse(response);
}

// Delete product
export async function deleteProductApi(id, token) {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return handleResponse(response);
}