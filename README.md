# CampusMate

CampusMate is a polished React Native + Expo study companion for university students. It helps students plan tasks, manage deadlines, set campus reminders, track focused study time and understand weekly progress.

## Product overview

CampusMate is built around a simple student workflow:

1. See urgent tasks on the Home dashboard.
2. Search, filter, create and update study tasks.
3. Attach a campus location reminder when a task depends on a place.
4. Use a study timer to save focused study sessions.
5. Review weekly study progress through analytics and an audio summary.
6. Adjust appearance, text size and accessibility preferences.



## Install and run

```bash
npm install
npx expo install --fix
npx expo start
```

Then press:

- `i` for iOS simulator
- `a` for Android emulator
- scan the QR code with Expo Go on a real phone

## Scripts

```bash
npm run start
npm run typecheck
npm run test
```

## Firebase setup

To enable Firebase-backed authentication and cloud data, copy `.env.example` to `.env` and fill in your Firebase web app config:

```bash
cp .env.example .env
```

Supported Firebase areas:

- Email/password authentication
- Firestore-ready task and study session repositories
- Android device testing through Firebase Test Lab

No credentials or secrets are committed.

## Project structure

```text
App.tsx
src/
  components/        reusable UI components
  context/           app-wide state: auth, tasks, settings, sessions
  data/              seed data and campus places
  hooks/             timer, settings and device context logic
  navigation/        typed React Navigation setup
  screens/           product screens
  services/          Firebase, notification, location and background services
  storage/           AsyncStorage fallback repositories
  theme/             design system tokens
  types/             TypeScript models
  utils/             validation, dates, analytics and ID helpers
  __tests__/         lightweight logic tests
docs/
  PRODUCT_OVERVIEW.md
  COMMIT_MANIFEST.md
  SPRINT_BOARD.md
  USER_MANUAL.md
  TESTING_DEPLOYMENT_REPORT.md
  PITCH_SCRIPT.md
```

## Feature checklist

| Product area | Implemented in |
| --- | --- |
| Welcome and guest flow | `WelcomeScreen.tsx`, `authService.ts` |
| Home dashboard | `HomeScreen.tsx` |
| Task list, search and filters | `TasksScreen.tsx`, `TaskCard.tsx` |
| Add/edit task form | `AddTaskScreen.tsx` |
| Task detail actions | `TaskDetailScreen.tsx` |
| Location reminder with map/GPS | `LocationReminderScreen.tsx`, `locationService.ts` |
| Notification scheduling | `notificationService.ts` |
| Study timer | `StudyScreen.tsx`, `useStudyTimer.ts` |
| Analytics and audio summary | `AnalyticsScreen.tsx`, `analytics.ts` |
| Settings and accessibility | `SettingsScreen.tsx`, `AppContext.tsx` |
| Help and privacy | `HelpPrivacyScreen.tsx` |
| Local persistence | `AsyncStorage` repositories |
| Firebase-ready service layer | `src/services/firebase.ts` |
| Product documentation | `docs/*` |



## Added assessment-compliance notes

This version adds SQLite-backed local persistence, AdMob service/configuration, stronger background location reminder behaviour, and Jest integration/E2E-style workflow tests without changing the screen layout or visual UI.

Useful commands:

```bash
npm install
npx expo install --fix
npm run typecheck
npm run test
eas build -p android --profile preview
```

Before a production build, copy `.env.example` to `.env` and fill in Firebase and optional AdMob production values. If AdMob values are left blank, the app uses official Google sample IDs suitable for testing only.

See `docs/FEATURE_COVERAGE.md` for a requirement-by-requirement implementation map.
