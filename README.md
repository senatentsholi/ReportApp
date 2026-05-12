# LUCT Faculty Reporting App

Mobile faculty reporting app for Limkokwing University with a clear three-part structure:

- `frontend/` for the Expo React Native app
- `backend/` for the Express API and Firebase Admin logic
- `database/` for Firestore rules and indexes

## Project Structure

```text
project-root/
|-- frontend/
|   |-- App.js
|   `-- src/
|       |-- components/
|       |-- firebase/
|       |-- hooks/
|       |-- navigation/
|       |-- providers/
|       |-- screens/
|       |-- services/
|       |-- theme/
|       `-- utils/
|-- backend/
|   |-- controllers/
|   |-- firebase/
|   |-- middleware/
|   |-- routes/
|   |-- services/
|   |-- utils/
|   `-- server.js
|-- database/
|   |-- firestore.indexes.json
|   `-- firestore.rules
|-- assets/
|-- functions/
|-- App.js
`-- package.json
```

## Frontend

- Firebase Authentication for login and registration
- Role-based screens for `student`, `lecturer`, `prl`, and `pl`
- Attendance, reports, ratings, monitoring, lecturer management, and course/class assignment
- Shared providers for auth and app data
- Firebase client config in `frontend/src/firebase/`

## Backend

- Express server in `backend/server.js`
- Route/controller separation
- Firebase Admin support in `backend/firebase/`
- Validation and middleware for API requests

## Database

- Firestore rules in [database/firestore.rules](/C:/Users/pc/LUCTReportApp/database/firestore.rules)
- Firestore indexes in [database/firestore.indexes.json](/C:/Users/pc/LUCTReportApp/database/firestore.indexes.json)

## Start The App

```bash
cmd /c npm.cmd install
cmd /c npm.cmd start
```

## Start The Backend

```bash
cd backend
cmd /c npm.cmd install
cmd /c npm.cmd start
```

## Notes

- The root `App.js` only boots the Expo app from `frontend/`.
- The frontend is now self-contained inside `frontend/src/`, so you no longer need to explain mixed root-level `screens`, `components`, `hooks`, `navigation`, `services`, `utils`, and `firebase` wrappers.
- Firestore access is role-aware, and the current app still uses the Firebase client SDK directly for live mobile data.
