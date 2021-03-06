// import fetch
// const fetch = require('node-fetch');

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

// /logout
async function getFetch(URL) {
  try {
    // GET fetch
    const response = await fetch(URL);
    return response.json();
  } catch (err) {
    console.error(err);
  }
}

// module.exports = { fetchRegister, fetchLogin, fetchLogout };
export { postFetch, getFetch };