module.exports = {
  // We are using Caddy as a reverse proxy from https -> http. Enabling trustProxy will allow us 
  // to see the actual client IP address.
  trustProxy: true,
}
