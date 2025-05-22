const token = localStorage.getItem('token');

async function sendFriendRequest() {
  const username = document.getElementById('friendUsername').value;
  const res = await fetch('http://localhost:5000/api/friends/request', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ toUsername: username })
  });

  const data = await res.json();
  document.getElementById('sendStatus').innerText = data.message || "Error sending request";
  document.getElementById('friendUsername').value = '';
  loadIncomingRequests();
}

// Load incoming friend requests
async function loadIncomingRequests() {
  const res = await fetch('http://localhost:5000/api/friends/requests', {
    headers: { Authorization: `Bearer ${token}` }
  });
  const requests = await res.json();
  const list = document.getElementById('incomingRequests');
  list.innerHTML = '';

  requests.forEach(r => {
    const li = document.createElement('li');
    li.innerHTML = `${r.from.username}
      <button onclick="respondRequest('${r._id}', 'accepted')">Accept</button>
      <button onclick="respondRequest('${r._id}', 'rejected')">Reject</button>`;
    list.appendChild(li);
  });
}

// Accept/Reject a friend request
async function respondRequest(requestId, action) {
  const res = await fetch('http://localhost:5000/api/friends/respond', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ requestId, action })
  });
  const data = await res.json();
  alert(data.message);
  loadIncomingRequests();
  loadFriends();
}

// Load friends list and render with Remove button
async function loadFriends() {
  const res = await fetch('http://localhost:5000/api/friends/list', {
    headers: { Authorization: `Bearer ${token}` }
  });
  const friends = await res.json();
  const list = document.getElementById('friendList');
  list.innerHTML = '';

  friends.forEach(friend => {
    const li = document.createElement('li');

    // Friend profile link
    const friendLink = document.createElement('a');
    friendLink.href = `friend-cart.html?id=${friend._id}`;
    friendLink.textContent = friend.username;
    li.appendChild(friendLink);

    // Remove button
    const removeBtn = document.createElement('button');
    removeBtn.textContent = 'Remove';
    removeBtn.style.marginLeft = '10px';
    removeBtn.onclick = () => removeFriend(friend._id, friend.username);
    li.appendChild(removeBtn);

    list.appendChild(li);
  });
}

// Remove friend function: calls backend API, then reloads friend list
async function removeFriend(friendId, friendUsername) {
  const confirmed = confirm(`Are you sure you want to remove ${friendUsername} from your friends?`);
  if (!confirmed) return;

  const res = await fetch('http://localhost:5000/api/friends/remove', {
    method: 'POST', // or 'DELETE' if your backend supports it
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ friendId })
  });

  const data = await res.json();

  if (res.ok) {
    document.getElementById('sendStatus').textContent = `Removed ${friendUsername} from friends.`;
    loadFriends();
  } else {
    alert(data.message || 'Failed to remove friend.');
  }
}

// Initial load on page open
loadIncomingRequests();
loadFriends();
