# RecipeShare - Collaborative Recipe Book

A beautiful, modern recipe sharing platform where users can discover, create, and share their favorite recipes with a community of food enthusiasts.

## 🚀 Features

### Core Features
- **Recipe Management**: Create, edit, delete, and browse recipes with rich details
- **User Authentication**: Secure JWT-based authentication system
- **Image Upload**: Upload and display recipe photos
- **Advanced Search**: Filter by categories, search by keywords, and sort by various criteria
- **Rating System**: 5-star rating system with average rating calculation
- **Comments**: Interactive commenting system for recipe discussions
- **Favorites**: Personal favorite recipes collection
- **Responsive Design**: Mobile-first design that works on all devices

### Design Elements
- Modern, clean interface with Tailwind CSS
- Smooth animations powered by Framer Motion
- Apple-level design aesthetics with attention to detail
- Comprehensive color system with primary, secondary, and accent colors
- 8px spacing system for consistent layouts
- Custom hover states and micro-interactions

## 🛠 Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Axios** - HTTP client
- **React Hot Toast** - Beautiful toast notifications
- **Lucide React** - Beautiful icons

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **JWT** - Authentication tokens
- **Bcrypt** - Password hashing
- **Multer** - File upload handling
- **Joi** - Input validation
- **CORS** - Cross-origin resource sharing

## 📁 Project Structure

```
/
├── server/                 # Backend API
│   ├── src/
│   │   ├── models/        # Data models (User, Recipe, Comment, Favorite)
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Authentication and error handling
│   │   └── server.js      # Express server setup
│   ├── uploads/           # Uploaded images storage
│   └── package.json
├── client/                # Frontend React app
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Route components
│   │   ├── context/       # React context (Auth)
│   │   ├── services/      # API services
│   │   └── styles/        # Global styles
│   └── package.json
└── package.json           # Root package.json with scripts
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Install dependencies for both client and server:**
   ```bash
   npm run install:all
   ```

2. **Set up environment variables:**
   
   Create `.env` in the `server/` directory:
   ```env
   PORT=5000
   JWT_SECRET=your_jwt_secret_key_here_make_it_long_and_secure
   CLIENT_URL=http://localhost:5173
   NODE_ENV=development
   ```
   
   Create `.env` in the `client/` directory:
   ```env
   VITE_API_BASE_URL=http://localhost:5000
   ```

3. **Start the development servers:**
   ```bash
   npm run dev
   ```
   
   This starts both the backend server (port 5000) and frontend dev server (port 5173) concurrently.

4. **Open your browser:**
   Navigate to `http://localhost:5173` to see the application.

## 📚 API Documentation

### Authentication Endpoints

#### POST /api/auth/register
Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### POST /api/auth/login
Login with existing credentials.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

#### GET /api/auth/me
Get current user information (requires authentication).

### Recipe Endpoints

#### GET /api/recipes
Get all recipes with optional filtering.

**Query Parameters:**
- `q` - Search term
- `category` - Filter by category (comma-separated)
- `sort` - Sort by 'latest' or 'rating'

#### GET /api/recipes/:id
Get a single recipe with full details.

#### POST /api/recipes
Create a new recipe (requires authentication).

**Request Body (multipart/form-data):**
- `title` - Recipe title
- `description` - Recipe description
- `ingredients` - JSON array of ingredients
- `instructions` - JSON array of instructions
- `categories` - JSON array of categories
- `photo` - Image file (optional)

#### PUT /api/recipes/:id
Update an existing recipe (requires authentication and ownership).

#### DELETE /api/recipes/:id
Delete a recipe (requires authentication and ownership).

#### POST /api/recipes/:id/ratings
Rate a recipe (requires authentication).

**Request Body:**
```json
{
  "value": 5
}
```

#### POST /api/recipes/:id/favorite
Toggle favorite status for a recipe (requires authentication).

### Comments Endpoints

#### GET /api/comments/recipe/:recipeId
Get all comments for a recipe.

#### POST /api/comments/recipe/:recipeId
Add a comment to a recipe (requires authentication).

**Request Body:**
```json
{
  "text": "This recipe is amazing!"
}
```

### Favorites Endpoints

#### GET /api/favorites/me
Get user's favorite recipes (requires authentication).

## 🎨 Design System

### Colors
- **Primary**: Emerald (10B981) - Main brand color
- **Secondary**: Blue (3B82F6) - Secondary actions
- **Accent**: Orange (F97316) - Highlights
- **Success**: Green tones
- **Warning**: Yellow tones
- **Error**: Red tones
- **Neutral**: Gray scale

### Typography
- **Font Family**: Inter (system fallback)
- **Weights**: 300, 400, 500, 600, 700
- **Line Heights**: 150% for body, 120% for headings

### Spacing
- **Base Unit**: 8px
- **Scale**: 4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px

## 🔒 Security Features

- JWT token-based authentication
- Password hashing with bcrypt
- Input validation on all endpoints
- File upload restrictions (type and size)
- CORS configuration
- Owner-only access for recipe modifications

## 🎯 User Experience Features

- **Responsive Design**: Works on mobile, tablet, and desktop
- **Loading States**: Skeleton loaders and spinners
- **Error Handling**: User-friendly error messages
- **Toast Notifications**: Success and error feedback
- **Smooth Animations**: Page transitions and micro-interactions
- **Accessibility**: Proper ARIA labels and keyboard navigation
- **Progressive Disclosure**: Tabbed content and expandable sections

## 🚀 Performance Optimizations

- Image lazy loading and optimization
- Component code splitting
- Efficient state management
- Debounced search functionality
- Optimized bundle size with Vite
- CDN-ready static assets

## 📱 Mobile Experience

- Touch-friendly interface
- Optimized layouts for small screens
- Mobile-first CSS approach
- Fast loading on mobile networks
- Swipe gestures and touch interactions

## 🧪 Sample Data

The application includes sample recipes on startup:
- Classic Chocolate Chip Cookies
- Healthy Buddha Bowl
- Homemade Pizza Margherita

Each sample recipe includes images, ingredients, instructions, and sample ratings.

## 🔄 Development Workflow

### Available Scripts

- `npm run dev` - Start both client and server in development mode
- `npm run client:dev` - Start only the client development server
- `npm run server:dev` - Start only the server development server
- `npm run build` - Build the client for production
- `npm run install:all` - Install dependencies for both client and server

### Development Features

- Hot module replacement (HMR) for fast development
- API proxy configuration for seamless development
- ESLint configuration for code quality
- Environment-specific configurations

## 🌟 Future Enhancements

- Recipe collections and meal planning
- Social features (follow users, recipe sharing)
- Advanced search filters (cooking time, difficulty)
- Recipe scaling and unit conversion
- Print-friendly recipe views
- Recipe import/export functionality
- Nutritional information display
- Video recipe tutorials
- Shopping list generation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Images courtesy of [Pexels](https://www.pexels.com)
- Icons from [Lucide React](https://lucide.dev)
- Design inspiration from modern cooking platforms
- Built with modern web technologies and best practices

---

**RecipeShare** - Bringing food enthusiasts together, one recipe at a time! 🍳✨