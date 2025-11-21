# Tesla Website Replication
<!-- Updated project scope section -->

A full-stack web application replicating the Tesla website with all required features.

## Features

- ✅ **Home Page** - Banner with call-to-action buttons
- ✅ **Cars/Product Page** - Display of 4 Tesla models (Model S, Model 3, Model X, Model Y)
- ✅ **Customize Page** - Dynamic car customization with real-time price updates and preview
- ✅ **Login/Signup** - Secure authentication with hashed passwords using bcrypt
- ✅ **Session Management** - Express sessions for user authentication
- ✅ **Responsive Design** - Mobile-friendly layout

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: SQLite3
- **Authentication**: bcrypt for password hashing, express-session for session management
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)

## Installation

1. Make sure you have Node.js installed (v14 or higher)

2. Install dependencies:
```bash
npm install
```

## Running the Application

1. Start the server:
```bash
npm start
```

Or for development with auto-reload:
```bash
npm run dev
```

2. Open your browser and navigate to:
```
http://localhost:3000
```

## Project Structure

```
tesla-website/
├── server.js              # Express server and API routes
├── package.json           # Dependencies and scripts
├── tesla.db              # SQLite database (created automatically)
├── public/               # Frontend files
│   ├── index.html        # Home page
│   ├── cars.html         # Product page
│   ├── customize.html    # Customization page
│   ├── login.html        # Login page
│   ├── signup.html       # Signup page
│   ├── styles.css        # Global styles
│   └── js/               # JavaScript files
│       ├── common.js     # Shared functionality
│       ├── cars.js       # Cars page logic
│       ├── customize.js  # Customization logic
│       ├── login.js      # Login logic
│       └── signup.js     # Signup logic
└── README.md             # This file
```

## Customization Features

The customize page allows users to select:
- **Battery**: Standard Range, Long Range, or Performance
- **Color**: 5 different color options
- **Wheels**: 4 different wheel styles
- **Interior**: 3 interior color options

All selections update the total price in real-time and show a visual preview.

## Security Features

- Passwords are hashed using bcrypt (10 salt rounds)
- Session-based authentication
- Protected routes (customize page requires login)
- Input validation on both client and server side

## Notes

- The database file (`tesla.db`) will be created automatically on first run
- Default car models are inserted automatically
- Session secret should be changed in production
- For production, enable HTTPS and set `secure: true` in session configuration

<!-- minor update for commit -->

