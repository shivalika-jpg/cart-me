const modal = document.getElementById("modal");
const manualInput = document.getElementById("manualInput");
const token = localStorage.getItem("token");

// Helper function to get current category number
function getCategoryNumber() {
  const path = window.location.pathname;
  const match = path.match(/category(\d+)/);
  return match ? match[1] : 1;
}

// Configure API base URL based on environment
const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const API_BASE_URL = isLocal ? 'http://localhost:5000' : 'https://cart-me.onrender.com';

console.log('Using API base URL:', API_BASE_URL);
console.log('Current hostname:', window.location.hostname);

// Open Modal
function openModal() {
  document.getElementById("productURL").value = "";
  document.getElementById("productName").value = "";
  document.getElementById("productImage").value = "";
  manualInput.classList.add("hidden");
  modal.classList.remove("hidden");
}

// Close Modal
function closeModal() {
  modal.classList.add("hidden");
}

// Fetch product metadata and add to cart
async function fetchProduct() {
  const url = document.getElementById("productURL").value.trim();
  if (!url) return alert("Enter a product URL");

  try {
    const response = await fetch(`${API_BASE_URL}/api/cart/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ url, category: getCategoryNumber() }),
    });

    const data = await response.json();
    console.log("Fetched data:", data);

    if (response.ok && data && typeof data.image === "string" && typeof data.name === "string") {
      addItemToCart(data.image, data.name, data.url, data._id, data.category);
      closeModal();
    } else {
      console.warn("Response missing image or name, showing manual input");
      manualInput.classList.remove("hidden");
    }
  } catch (error) {
    console.error("Error fetching product:", error);
    manualInput.classList.remove("hidden");
  }
}

// Manual product entry
async function addManualItem() {
  const name = document.getElementById("productName").value.trim();
  const imageInput = document.getElementById("productImage");

  if (!name || !imageInput.files[0]) {
    return alert("Please fill in both fields");
  }

  try {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('image', imageInput.files[0]);
    formData.append('category', getCategoryNumber());

    const response = await fetch(`${API_BASE_URL}/api/cart/add`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    const data = await response.json();
    
    if (response.ok) {
      addItemToCart(data.image, data.name, data.url, data._id, getCategoryNumber());
      closeModal();
    } else {
      throw new Error(data.message || 'Failed to add item');
    }
  } catch (error) {
    console.error('Error adding manual item:', error);
    alert('Failed to add item: ' + error.message);
  }
}

// Add product to DOM
function addItemToCart(imageSrc, name, productUrl = "#", itemId = null, category) {
  // Get the correct cart container for this category
  const cartContainer = document.getElementById(`cartContainer${category}`);
  if (!cartContainer) {
    console.error(`Cart container not found for category ${category}`);
    return;
  }
  const card = document.createElement("div");
  card.dataset.category = category;
  card.className = "card";

  // Remove button
  const removeBtn = document.createElement("button");
  removeBtn.className = "remove-btn";
  removeBtn.innerHTML = "❌";

  removeBtn.onclick = async () => {
    if (itemId) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/cart/${itemId}`, {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
        });

        const data = await response.json();
        console.log("Delete response:", data);

        if (response.ok) {
          card.remove(); 
        } else {
          alert("Failed to delete item: " + (data.message || "Unknown error"));
        }
      } catch (error) {
        console.error("Error removing item:", error);
        alert("Error removing item. See console for details.");
      }
    } else {
      // Manual (non-backend) item
      card.remove();
    }
  };



  const link = document.createElement("a");
  link.href = productUrl;
  link.target = "_blank";
  link.rel = "noopener noreferrer";

  const img = document.createElement("img");
  img.src = imageSrc;

  const label = document.createElement("span");
  label.textContent = name;

  link.appendChild(img);
  link.appendChild(label);
  card.appendChild(link);
  card.appendChild(removeBtn);

  cartContainer.appendChild(card);
}

// Load saved cart on page load
async function loadCartItems() {
  if (!token) return;
  
  try {
    const response = await fetch(`${API_BASE_URL}/api/cart?category=${getCategoryNumber()}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    const items = await response.json();
    if (!Array.isArray(items)) {
      console.error("Invalid response format from server");
      return;
    }

    items.forEach((item) => {
      addItemToCart(item.image, item.name, item.url, item._id, item.category);
    });
  } catch (error) {
    console.error("Error loading cart items:", error);
  }

  try {
    const response = await fetch("https://cart-me.onrender.com/api/cart", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    const items = await response.json();

    if (Array.isArray(items)) {
      items.forEach((item) => {
        addItemToCart(item.image, item.name, item.url, item._id);
      });
    }
  } catch (error) {
    console.error("Error loading cart items:", error);
  }
}

window.addEventListener("DOMContentLoaded", () => {
  // Initialize cart container and load items
  const category = getCategoryNumber();
  const cartContainer = document.getElementById(`cartContainer${category}`);
  if (!cartContainer) {
    console.error("Cart container not found for category", category);
    return;
  }
  
  // Initialize modal and other elements
  const modal = document.getElementById("modal");
  const manualInput = document.getElementById("manualInput");
  const token = localStorage.getItem("token");
  
  if (!modal || !manualInput) {
    console.error("Missing required DOM elements");
    return;
  }
  
  loadCartItems();
});
