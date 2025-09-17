const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

let cachedUsers = [];

async function fetchUsersFromAPI(count = 1) {
  try {
    const response = await axios.get(`https://randomuser.me/api/?results=${count}`);
    return response.data.results;
  } catch (error) {
    console.error('Error fetching from Random User API:', error);
    throw new Error('Failed to fetch users from external API');
  }
}

fetchUsersFromAPI(20)
  .then(users => {
    cachedUsers = users;
    console.log('Initial user data loaded');
  })
  .catch(error => {
    console.error('Failed to initialize user data:', error);
  });


app.get('/api/', async (req, res) => {
  try {
    const results = parseInt(req.query.results) || 1;
    const page = parseInt(req.query.page) || 1;
    const gender = req.query.gender;
    
    if (results > cachedUsers.length) {
      const newUsers = await fetchUsersFromAPI(results);
      cachedUsers = newUsers;
    }
    
    let filteredUsers = cachedUsers;
    if (gender && (gender === 'male' || gender === 'female')) {
      filteredUsers = cachedUsers.filter(user => user.gender === gender);
    }
    
    const startIndex = (page - 1) * results;
    const endIndex = startIndex + results;
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
    
    res.json({
      results: paginatedUsers,
      info: {
        seed: 'your-custom-seed',
        results: paginatedUsers.length,
        page: page,
        version: '1.4'
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/', async (req, res) => {
});

app.post('/api/refresh', async (req, res) => {
  try {
    const count = req.body.count || 100;
    cachedUsers = await fetchUsersFromAPI(count);
    res.json({ message: `User data refreshed with ${cachedUsers.length} users` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api/`);
});