# CampusMate

CampusMate is a mobile study companion for university students who need one place to manage deadlines, study sessions, reminders and weekly progress.

## Product overview

CampusMate helps students:

- track assignments and study tasks
- organise tasks by subject, priority and deadline
- create location-aware campus reminders
- run focused study sessions
- review progress through simple analytics
- adjust accessibility, text size and appearance preferences

The product is designed for busy students who need a calm, clear and mobile-first workflow rather than a complex project management tool.

## Current build

This version focuses on task creation and editing, while preserving the existing dashboard, task list and typed navigation structure.

## Install and run

```bash
npm install
npx expo install --fix
npx expo start
```

## Tech stack

- React Native
- Expo
- TypeScript
- React Navigation
- AsyncStorage
- Firebase-ready service layer

## Project structure

```text
App.tsx
src/
  components/        reusable UI components
  context/           app-wide state
  data/              seed data and campus places
  hooks/             reusable app logic
  navigation/        typed navigation setup
  screens/           product screens
  services/          Firebase, notification and location services
  storage/           local repositories
  theme/             design system tokens
  types/             TypeScript models
  utils/             validation, dates, analytics and IDs
```
