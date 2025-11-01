const { spawn } = require('child_process');

console.log('Starting Discord Bot and Dashboard...');

// Start the Discord bot
const bot = spawn('node', ['index.js'], {
  stdio: 'inherit'
});

// Start the web dashboard
const dashboard = spawn('node', ['server.js'], {
  stdio: 'inherit'
});

bot.on('error', (error) => {
  console.error(`Bot error: ${error.message}`);
});

dashboard.on('error', (error) => {
  console.error(`Dashboard error: ${error.message}`);
});

bot.on('close', (code) => {
  console.log(`Bot process exited with code ${code}`);
  process.exit(code);
});

dashboard.on('close', (code) => {
  console.log(`Dashboard process exited with code ${code}`);
  process.exit(code);
});

// Handle termination signals
process.on('SIGINT', () => {
  console.log('Shutting down...');
  bot.kill();
  dashboard.kill();
  process.exit();
});

process.on('SIGTERM', () => {
  console.log('Shutting down...');
  bot.kill();
  dashboard.kill();
  process.exit();
});
