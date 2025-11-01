# GiftMaster Discord Bot

## Overview

GiftMaster is a Discord bot that rewards users for engaging with commands in Discord servers. The system consists of two main components: a Discord bot that handles slash commands and a web dashboard for administrative management. Users can generate "gifts" (accounts/rewards) from a stock system with cooldown controls, while administrators can manage services and add accounts through both Discord commands and a web interface.

The application uses a file-based storage system where rewards are stored in text files organized by service type (free/premium), with each line representing an individual account credential.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes (October 31, 2025)

**24/7 Deployment Configuration**
- Configured bot for continuous operation on Replit using Reserved VM deployment
- Updated web dashboard to bind to 0.0.0.0:5000 (required for Replit webview)
- Created unified start.js script to manage both Discord bot and web server processes
- Removed server.js import from index.js to prevent port binding conflicts
- Added npm start script for easy deployment
- Configured Reserved VM deployment for 24/7 uptime

## Running the Bot

The bot now uses a unified start script that launches both components:

```bash
npm start
```

This command runs `start.js`, which spawns two child processes:
- **Discord Bot** (index.js) - Handles Discord slash commands and events
- **Web Dashboard** (server.js) - Admin interface accessible at port 5000

## Deployment for 24/7 Operation

The bot is configured for **Reserved VM deployment** on Replit:

1. Navigate to the Deployments tool in Replit
2. Select "Reserved VM" deployment type
3. Click "Set up your published app"
4. The deployment will automatically use the configured settings:
   - Run command: `npm start`
   - Port: 5000
   - Both bot and dashboard will stay online 24/7

## Environment Variables

The following secrets must be configured (already set up):
- `token` - Discord bot token
- `username` - Dashboard admin username
- `password` - Dashboard admin password

These are accessed via Replit's secrets management and override values in config.json.

## System Architecture

### Frontend Architecture

**Web Dashboard Design Pattern**
- Static file serving through Express with HTML/CSS/JavaScript
- Cookie-based session management for administrative access
- Parallax effects and interactive UI elements for engaging user experience
- Responsive design with custom styling (no frontend framework)
- Dashboard accessible on port 5000 at the published URL

**Decision Rationale**: A simple static frontend was chosen to minimize complexity and dependencies. The parallax effects and custom CSS provide visual appeal without requiring heavy JavaScript frameworks, making the application lightweight and easy to deploy.

### Backend Architecture

**Dual-Process Architecture**
- Two separate Node.js processes run concurrently:
  - Discord bot process (`index.js`) - Handles Discord interactions
  - Web server process (`server.js`) - Serves administrative dashboard
- `start.js` orchestrates both processes using child process spawning
- Independent process lifecycle management with shared configuration
- Both processes managed by a single workflow for deployment

**Decision Rationale**: Separating the bot and web server into distinct processes allows for independent scaling and failure isolation. If one component fails, it doesn't necessarily crash the other. This architecture also simplifies debugging and maintenance. The start.js wrapper ensures both components launch together and shut down gracefully.

**Port Configuration**
- Web dashboard binds to 0.0.0.0:5000 for external accessibility
- Port 5000 is required for Replit's webview/deployment system
- Environment variable PORT can override if needed

**Decision Rationale**: Replit requires frontend servers to bind to port 5000 with host 0.0.0.0 for proper proxy routing. This ensures the dashboard is accessible both in development (webview) and production (Reserved VM deployment).

**Command System Architecture**
- Slash command-based interaction model using Discord.js v13
- Command files dynamically loaded from `/commands` directory
- Each command is a self-contained module with registration data and execution logic
- Commands deployed either globally or guild-specific based on configuration

**Decision Rationale**: Slash commands provide a native Discord experience with built-in validation and autocomplete. The modular command structure makes it easy to add, remove, or modify commands without touching core bot logic.

**File-Based Storage System**
- Rewards stored in plain text files organized by type (`/free` and `/premium` directories)
- Each service has its own `.txt` file
- Line-by-line reading/writing for account distribution
- No database dependency

**Decision Rationale**: File-based storage eliminates database setup complexity and is sufficient for the application's scale. Text files are human-readable and easy to back up or migrate. This approach prioritizes simplicity over scalability for small-to-medium Discord communities.

**Authentication System**
- Cookie-based authentication for dashboard access
- Credentials stored as Replit secrets with config.json fallback
- 7-day cookie expiration
- Simple username/password validation

**Decision Rationale**: Basic authentication is appropriate for a single-admin dashboard. Cookie-based sessions avoid the complexity of OAuth or token systems while providing reasonable security for private administrative functions.

**Permission System**
- Discord role-based permissions for bot commands
- Admin commands require `MANAGE_CHANNELS` permission
- Channel-specific command execution (configured generation channels)
- Cooldown system using in-memory Set for rate limiting

**Decision Rationale**: Leveraging Discord's native permission system ensures consistency with user expectations. Channel restrictions prevent spam and organize bot usage. In-memory cooldowns are simple but reset on restart (acceptable tradeoff for this use case).

### Configuration Management

**Centralized Configuration**
- Single `config.json` file for all settings
- Environment variable override support via dotenv and Replit secrets
- Configuration includes: bot tokens, channels, cooldowns, colors, messages
- No dynamic configuration updates (requires restart)

**Decision Rationale**: Centralized configuration makes deployment easier and provides a clear source of truth. Environment variable support enables secure credential management in production environments like Replit.

### Process Management

**Startup and Lifecycle**
- Single entry point (`start.js`) spawns child processes
- Signal handling for graceful shutdown (SIGINT, SIGTERM)
- Process output inheritance for unified logging
- Exit code propagation from child processes

**Decision Rationale**: This pattern ensures both components start together and shut down cleanly. Inheriting stdio simplifies debugging by consolidating logs in one stream.

## External Dependencies

### Core Dependencies

**Discord.js v13.16.0**
- Purpose: Discord API interaction and bot functionality
- Provides: Command handling, event system, embed creation
- Version constraint: Uses v13 (not latest v14) for stability

**Express.js v4.18.2**
- Purpose: Web server for administrative dashboard
- Provides: HTTP routing, static file serving, middleware support

**@discordjs/builders & @discordjs/rest**
- Purpose: Slash command registration and Discord REST API interactions
- Used for: Command deployment and API communication

### Supporting Dependencies

**express-session v1.17.3**
- Purpose: Session management middleware
- Note: Imported but cookie-parser is used for simpler auth implementation

**cookie-parser v1.4.6**
- Purpose: Parse cookie headers for authentication state

**body-parser v1.20.2**
- Purpose: Parse incoming request bodies (form data for login)

**dotenv v16.3.1**
- Purpose: Load environment variables from .env files
- Enables secure configuration in production

**cat-loggr v1.2.2**
- Purpose: Enhanced logging functionality
- Used in command files for formatted console output

**node-fetch v3.2.6**
- Purpose: HTTP client for potential external API calls
- Currently included but not actively used in core functionality

### Discord API Integration

- Uses Discord API v9 (discord-api-types v0.37.56)
- Slash command registration through Discord REST API
- Guild-specific or global command deployment options
- Webhook-style interaction responses

### File System Operations

- Native Node.js `fs` module for synchronous operations
- `fs/promises` for asynchronous file operations in newer commands
- Directory scanning for service discovery
- Line-by-line file reading for account distribution

### Runtime Environment

- Node.js v16.11.0+ required (specified in package dependencies)
- Designed for Replit deployment (includes Replit badge)
- Port 5000 for web dashboard (Replit requirement)
- Support for process environment variables and Replit secrets
