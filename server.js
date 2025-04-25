const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// Set EJS as templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Connect to MongoDB with better error handling
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB successfully');
    // Test database connection
    mongoose.connection.db.admin().ping().then(() => {
        console.log('MongoDB ping successful - database is responsive');
    }).catch(err => {
        console.error('MongoDB ping failed:', err);
    });
}).catch(err => {
    console.error('Error connecting to MongoDB:', err);
    console.error('Connection string (without password):', 
        process.env.MONGO_URI.replace(/:[^:@]+@/, ':****@'));
});

// Add this right after your MongoDB connection
mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
});

// Contributor Schema
const contributorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    bio: { type: String, required: true },
    website: { type: String },
    email: { type: String, required: true },
    status: { 
        type: String, 
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    createdAt: { type: Date, default: Date.now }
});

const Contributor = mongoose.model('Contributor', contributorSchema);

// API Routes
// 1. Create new contributor profile
app.post('/api/contributors', async (req, res) => {
    try {
        const contributor = new Contributor(req.body);
        await contributor.save();
        res.status(201).json({ message: 'Contributor profile submitted successfully!', id: contributor._id });
    } catch (error) {
        res.status(400).json({ message: 'Error submitting profile', error: error.message });
    }
});

// 2. Get all contributors (for admin dashboard)
app.get('/api/contributors', async (req, res) => {
    try {
        const status = req.query.status; // Optional filter by status
        let query = {};
        
        if (status) {
            query.status = status;
        }
        
        const contributors = await Contributor.find(query).sort({ createdAt: -1 });
        res.json(contributors);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching contributors', error: error.message });
    }
});

// 3. Get public approved contributors
app.get('/api/contributors/approved', async (req, res) => {
    try {
        const contributors = await Contributor.find({ status: 'approved' })
            .select('-email -status') // Exclude private fields
            .sort({ createdAt: -1 });
        res.json(contributors);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching approved contributors', error: error.message });
    }
});

// 4. Get single contributor by ID
app.get('/api/contributors/:id', async (req, res) => {
    try {
        const contributor = await Contributor.findById(req.params.id);
        if (!contributor) {
            return res.status(404).json({ message: 'Contributor not found' });
        }
        res.json(contributor);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching contributor', error: error.message });
    }
});

// 5. Update contributor status (for admin)
app.put('/api/contributors/:id', async (req, res) => {
    try {
        // Verify admin using middleware (implementation depends on your auth system)
        // For simplicity, I'm not including auth middleware here
        
        const contributor = await Contributor.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true, runValidators: true }
        );
        
        if (!contributor) {
            return res.status(404).json({ message: 'Contributor not found' });
        }
        
        res.json({ message: 'Contributor updated successfully', contributor });
    } catch (error) {
        res.status(400).json({ message: 'Error updating contributor', error: error.message });
    }
});

// 6. Delete contributor
app.delete('/api/contributors/:id', async (req, res) => {
    try {
        // Verify admin using middleware (implementation depends on your auth system)
        
        const contributor = await Contributor.findByIdAndDelete(req.params.id);
        
        if (!contributor) {
            return res.status(404).json({ message: 'Contributor not found' });
        }
        
        res.json({ message: 'Contributor deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting contributor', error: error.message });
    }
});

// Updated routes to use EJS templates
app.get('/', (req, res) => {
    // Redirect root URL directly to contributors page
    res.redirect('/contributors');
});

// Serve the public contributors page
app.get('/contributors', (req, res) => {
    res.render('contributors');
});

// Serve the contributor form page
app.get('/contribute', (req, res) => {
    res.render('contribute');
});

// Serve the admin dashboard
app.get('/admin', (req, res) => {
    // In a real application, you'd add authentication middleware here
    res.render('admin-dashboard');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});