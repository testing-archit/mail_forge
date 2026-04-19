# MailForge Frontend

Professional React-based frontend for the MailForge Secure Email Management System.

## Features

- 🎨 **Modern UI Design** - Professional gradient-based interface
- 🔐 **Secure Authentication** - JWT token-based login/registration
- 📧 **Email Management** - Inbox, compose, and email viewing
- 👤 **User Dashboard** - Profile management and settings
- 🔒 **Security Settings** - Two-factor auth, session management
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- ⚡ **Fast & Smooth** - React-based single-page application

## Tech Stack

- **React 18.2.0** - UI library
- **React Router 6.14.0** - Client-side routing
- **Axios 1.4.0** - HTTP client
- **Lucide React 0.263.1** - Icon library
- **CSS3** - Styling with animations and gradients

## Installation

### Prerequisites

- Node.js 14+ 
- npm or yarn

### Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file (optional):
```env
REACT_APP_API_URL=http://localhost:9090
```

3. Start development server:
```bash
npm start
```

The app will open at `http://localhost:3000`

## Project Structure

```
frontend/
├── public/
│   └── index.html          # Main HTML file
├── src/
│   ├── pages/
│   │   ├── LandingPage.js  # Homepage with features
│   │   ├── AuthPage.js     # Login/Register form
│   │   ├── Dashboard.js    # User dashboard
│   │   └── EmailClient.js  # Email management interface
│   ├── App.js              # Main app component
│   ├── App.css             # Global styles
│   ├── index.js            # React entry point
│   └── index.css           # Global CSS (if exists)
├── package.json            # Dependencies
└── README.md               # This file
```

## Pages

### Landing Page
- Hero section with value proposition
- Features showcase
- Security highlights
- Tech stack information
- Call-to-action buttons

### Auth Page
- User registration form
- User login form
- Password visibility toggle
- Form validation
- Social auth buttons (UI ready)

### Dashboard
- User profile management
- Password change
- Security settings (2FA, session timeout)
- Notification preferences
- Storage usage
- Account information

### Email Client
- Inbox with email list
- Email search
- Compose new email
- Email detail view
- Encryption toggle
- Attachment support
- Sidebar navigation

## API Integration

The frontend communicates with the API Gateway on `http://localhost:9090`:

### Key Endpoints

- `POST /app/v1/user/register` - User registration
- `POST /app/v1/user/login` - User login
- `GET /app/v1/users/profile` - Get user profile
- `GET /app/v1/mail/emails` - Get inbox
- `POST /app/v1/mail/send` - Send email

All requests to protected endpoints include JWT token in Authorization header.

## Authentication Flow

1. User registers or logs in on AuthPage
2. Backend returns JWT token
3. Token stored in localStorage
4. Token included in all subsequent API requests
5. Dashboard/Email routes only accessible with valid token
6. Logout clears token and user data

## Styling

### Color Scheme

- **Primary Gradient**: #667eea → #764ba2 (Purple/Blue)
- **Dark**: #1a202c
- **Light**: #f7fafc
- **Error**: #fc5c65
- **Success**: #2dd4c0

### Responsive Breakpoints

- Desktop: 1024px+
- Tablet: 768px - 1023px
- Mobile: Below 768px

## Building for Production

```bash
npm run build
```

Creates optimized production build in `build/` directory.

## Development Tips

- Use React DevTools for debugging
- Check browser console for API errors
- Verify API Gateway is running on port 9090
- Keep token refresh logic in mind for long sessions

## Environment Variables

Create `.env` file in frontend root:

```env
REACT_APP_API_URL=http://localhost:9090
REACT_APP_API_TIMEOUT=5000
```

## Common Issues

### "Cannot connect to API"
- Check API Gateway is running (port 9090)
- Verify backend services are registered with Eureka
- Check network tab in browser DevTools

### "Unauthorized (401)"
- Token may be expired
- Try logging out and logging back in
- Check token in localStorage

### "CORS Error"
- API Gateway must have CORS configured
- Frontend and backend must match in browser requirements

## Performance

- Code splitting with React Router
- Lazy loading of components
- CSS animations use GPU acceleration
- Optimized bundle size ~150KB

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Contributing

- Follow existing code style
- Create components for reusability
- Use CSS modules or scoped CSS for styling
- Keep components focused and single-responsibility

## License

MailForge - Secure Email Management System

## Support

For issues and questions:
1. Check documentation
2. Review API logs
3. Check browser console
4. Verify all services are running
# MailForge_Frontend
# mail_forge-
# mail_forge-
