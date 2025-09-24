import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

// Container
const users = [];

//usual practices
app
    .use(cors())
    .use(express.json())
    .use(express.urlencoded({ extended: true }))
    .use(express.static('public'))
    
    // Signup
    .post('/signup', (req, res) => {
        const { firstName, lastName, email, password, repassword } = req.body;
        
        // Basic validation
        if (!firstName || !lastName || !email || !password || !repassword) {
            return res.status(400).json({ success: false, message: 'Do not leave a blank on the form!' });
        }
        
        if (password !== repassword) {
            return res.status(400).json({ success: false, message: 'Make sure your password match' });
        }
        
        // Check if user already exists
        const existingUser = users.find(user => user.email === email);
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }
        
        // Store user 
        const newUser = {
            id: users.length + 1,
            firstName,
            lastName,
            email,
            password, 
            createdAt: new Date()
        };
        
        users.push(newUser);
        console.log('New user registered:', newUser);
        res.json({ success: true, message: 'User registered successfully' });
    })
    
    // Login
    .post('/login', (req, res) => {
        const { email, password } = req.body;
        
        // Validation
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and password are required' });
        }
        
        // Find user
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            res.json({ 
                success: true, 
                message: 'Login successful',
                user: {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email
                }
            });
        } else {
            res.status(401).json({ success: false, message: 'Invalid email or password' });
        }
    })
    
    .listen(PORT, () => {
        console.log(`Server has started at http://localhost:3000`);
    });