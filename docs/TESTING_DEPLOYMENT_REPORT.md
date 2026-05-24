# CampusMate Testing and Deployment Report

## Testing scope

The product was tested around the main student workflow:

1. Launch the app and enter guest mode.
2. View the home dashboard.
3. Search and filter tasks.
4. Create and edit a task.
5. Add a campus location reminder.
6. Schedule a reminder.
7. Start and save a study session.
8. Review analytics and play the audio summary.
9. Adjust settings such as dark mode and text size.

## Unit tests

The lightweight automated tests focus on data logic that affects the product experience.

```bash
npm run test
```

Current automated coverage includes:

- analytics calculation
- completed and pending task counts
- total study minutes
- completion rate

## Type checking

```bash
npm run typecheck
```

TypeScript is used to protect the task, subject, session, user and navigation models from mismatched fields.

## Manual device testing checklist

| Area | Expected result |
| --- | --- |
| Welcome flow | User can continue as guest or use the sign-in form |
| Home dashboard | Today’s tasks and device context appear correctly |
| Task list | Search, priority filter and status updates work |
| Add/edit task | Form validation prevents empty task titles |
| Location reminder | Map view loads and radius selection is saved |
| Notifications | Permission prompt appears and reminders can be scheduled |
| Study timer | Start, pause, reset and save work as expected |
| Analytics | Study time, completion count and subject balance update |
| Accessibility | Larger text and high-contrast options improve readability |
| Dark mode | Screens remain readable and consistent |

## Deployment notes

The project is built with Expo. A local development run can be started with:

```bash
npm install
npx expo install --fix
npx expo start
```

For a production-style Android build, use an Expo development build or EAS Build:

```bash
npx expo install --fix
eas build --platform android
```

Push notifications and background tasks have limitations inside Expo Go. A development build is recommended when validating those features on a real device.

## Known limitations

- Live Firebase credentials are intentionally not committed.
- Background reminder behaviour must be confirmed on physical devices.
- Location accuracy can vary depending on device permissions and environment.
- Push notifications require a development build for full validation.
