const modal = document.getElementById("modal");
const cartContainer = document.getElementById("cartContainer");
const manualInput = document.getElementById("manualInput");
const token = localStorage.getItem("token");
function openModal() {
  document.getElementById("productURL").value = "";
  document.getElementById("productName").value = "";
  document.getElementById("productImage").value = "";
  manualInput.classList.add("hidden");
  modal.classList.remove("hidden");
}

function closeModal() {
  modal.classList.add("hidden");
}

async function fetchProduct() {
  const url = document.getElementById("productURL").value.trim();
  if (!url) return alert("Enter a product URL");

  try {
    const response = await fetch("http://localhost:5000/api/cart/add", {
      method: "POST",
      headers: { "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
       },
      body: JSON.stringify({ url })
    });

    const data = await response.json();
    console.log("Fetched data:", data);

    if (data && typeof data.image === 'string' && typeof data.name === 'string') {
      addItemToCart(data.image, data.name, data.url);
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


function addManualItem() {
  const name = document.getElementById("productName").value.trim();
  const imageInput = document.getElementById("productImage");

  if (!name || !imageInput.files[0]) {
    return alert("Please fill in both fields");
  }

  const reader = new FileReader();
 reader.onload = function (e) {
  addItemToCart(e.target.result, name); // no URL, so just '#'
  closeModal();
};
  reader.readAsDataURL(imageInput.files[0]);
}

function addItemToCart(imageSrc, name, productUrl = "#") {
  const card = document.createElement("div");
  card.className = "card";

  // Remove Button
  const removeBtn = document.createElement("button");
  removeBtn.className = "remove-btn";
  removeBtn.innerHTML = "❌";
  removeBtn.onclick = () => card.remove();

  // Link that wraps image and name
  const link = document.createElement("a");
  link.href = productUrl;
  link.target = "_blank"; // Opens in new tab
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

