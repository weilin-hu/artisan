// import fetch
// const fetch = require('node-fetch');

// /register /login endpoint
async function deleteAuthFetch(URL) {
  const fetchData = { 
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  };
  try {
    const response = await fetch(URL, fetchData);
    return response.json();
  } catch (err) {
    console.error(err);
  }
}

// /register /login endpoint
async function postFetch(URL, data) {
  const fetchData = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  };
  try {
    const response = await fetch(URL, fetchData);
    return response.json();
  } catch (err) {
    console.error(err);
  }
}
 
async function getFetch(URL) {
   try {
     // GET fetch
     const response = await fetch(URL);
     return response.json();
   } catch (err) {
     console.error(err);
   }
}

async function getAuthFetch(URL) {
  const fetchData = {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  };
  try {
    // GET fetch
    const response = await fetch(URL, fetchData);
    return response.json();
  } catch (err) {
    console.error(err);
  }
}

// /register /login endpoint
async function postAuthFetch(URL, data) {
  const fetchData = {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(data),
  };
  try {
    const response = await fetch(URL, fetchData);
    console.log(response);
    return response.json();
  } catch (err) {
    console.error(err);
  }
}

async function postImageFetch(URL, data) {
  try {
    const fetchData = {
      method: 'POST',
      headers: {
        // 'Content-Type': 'multipart/form-data',
      //   'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: data
    };
    const response = await fetch(URL, fetchData);
    return response.json();
  } catch (err) {
    console.error(err);
  }
}
 
 // module.exports = { fetchRegister, fetchLogin, fetchLogout };
 export { postFetch, postImageFetch, postAuthFetch, getFetch, getAuthFetch, deleteAuthFetch };