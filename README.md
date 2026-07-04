# Tech Fest Website

Production-ready MERN website scaffold for the Tech Fest project.

## Structure

- `client/`: React + Vite frontend
- `server/`: Node.js + Express backend
- `docs/`: Documentation and planning assets

## Notes

This repository contains the initial folder/file structure based on the Tech Fest website guidelines.

## Development Setup

To establish your local environment and get the React frontend running, you must install the dependencies with the `--legacy-peer-deps` flag. This resolves strict peer dependency versions across `@react-three` packages.

```bash
cd client
npm install --legacy-peer-deps
npm run dev
```
