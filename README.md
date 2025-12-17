## Dynamic Nested Question Form Builder (React + Node.js/Express)

This project is a full-stack web app that lets users build a **dynamic, recursively nested question form** with auto-numbering, delete, drag-and-drop reordering of parent questions, local storage persistence, and a read-only hierarchical submission view.

### Project Structure

```text
root
├── client          # React app (frontend)
│   ├── src
│   │   ├── components
│   │   │   ├── Question.jsx
│   │   │   ├── NestedQuestion.jsx
│   │   │   └── FormBuilder.jsx
│   │   ├── utils
│   │   │   └── autoNumbering.js
│   │   ├── App.jsx
│   │   └── index.js
│   └── package.json
│
├── server          # Node/Express API (backend)
│   ├── controllers
│   │   └── formController.js
│   ├── routes
│   │   └── formRoutes.js
│   ├── server.js
│   └── package.json
│
└── README.md
```

---

## Setup Instructions

### Prerequisites

- Node.js (LTS) and npm installed on your machine.

### Backend (Node.js + Express)

From the project root:

```bash
cd server
npm install      # installs express, cors, nodemon
npm run dev      # or: npm start
```

The API will run on `http://localhost:5000`.

#### API Endpoints

- **GET `/api/form`**  
  Returns the current in-memory form structure (array of question objects).

- **POST `/api/form`**  
  Accepts an array of question objects and stores it in memory:

  ```json
  [
    {
      "id": "string",
      "text": "string",
      "type": "short | boolean",
      "answer": true,
      "children": []
    }
  ]
  ```

No database or authentication is used; everything is kept in server memory.

### Frontend (React)

From the project root:

```bash
cd client
npm install      # installs React, react-scripts, react-beautiful-dnd
npm start
```

The React dev server will run on `http://localhost:3000` and proxy API requests to `http://localhost:5000` via the `"proxy"` field in `client/package.json`.

---

## Core Logic Overview

### Data Structure

Each question is represented as a **tree node**:

```js
{
  id: string,
  text: string,
  type: 'short' | 'boolean',
  answer: true | false | null,
  children: Question[]
}
```

`children` can contain any number of nested questions, so the tree can grow to **unlimited depth**.

### Recursive Nesting

- `NestedQuestion.jsx` is a **recursive React component**.
- It renders a single `Question` plus its children:
  - For each child in `question.children`, `NestedQuestion` calls itself again, passing down the correct `onUpdate` and `onDelete` handlers.
  - This pattern supports **infinite nesting** since each instance is responsible only for its own subtree.
- Child questions can only be added when a **True/False** question has answer `True`, enforcing the requirement from the prompt.

### Auto-Numbering Logic

The helper `assignNumbers` in `client/src/utils/autoNumbering.js` walks the tree and assigns hierarchical numbers:

- Top-level questions: `Q1`, `Q2`, `Q3`, ...
- Child questions: `Q1.1`, `Q1.2`, ...
- Deeper levels: `Q1.1.1`, `Q1.1.2`, etc.

Conceptually:

1. Traverse the `questions` array with an index.
2. Build a number prefix:
   - If there is no parent prefix, use `Q${index + 1}`.
   - If there is a prefix, append `.${index + 1}`.
3. Recurse into `children` with the new prefix.

This is recomputed **every render** from the current state, so numbering automatically updates when questions are:

- Added
- Deleted
- Reordered at the parent level

### Drag-and-Drop Handling (react-beautiful-dnd)

- The parent-level questions list is wrapped with:
  - `DragDropContext` (for the whole list)
  - A single `Droppable` container (`droppableId="parent-questions"`)
  - Each top-level question is a `Draggable` item.
- In `onDragEnd`:
  - If there is no destination, we exit.
  - Otherwise, we re-order the **top-level `questions` array** using `splice`.
  - Only the parent order changes; each question’s `children` array is left untouched, so child hierarchies remain intact.
- After reordering, the auto-numbering logic runs again and updates numbers such as `Q1`, `Q2`, etc.

### Local Storage Logic

- Key: `nested-form-builder`.
- On mount:
  1. Try to **load from `localStorage`**.
  2. If not available or invalid, **fallback to fetching from the backend** (`GET /api/form`).
- On any state change to `questions`:
  - The entire questions array is saved to `localStorage`.
  - The same JSON is sent to the backend via `POST /api/form` to keep the in-memory copy up to date.
- There is a **“Clear Form”** button that:
  - Resets React state (`questions` and `submitted`).
  - Removes the local storage key.

### Form Submission View

- Clicking **“Submit Form”**:
  - Runs `assignNumbers` on the current `questions` tree.
  - Saves this numbered tree into `submitted` state.
- `SubmissionList` recursively renders this tree as a **read-only hierarchical view**, showing:
  - The number (`Q1`, `Q1.1`, etc.)
  - The question text
  - The type tag (`[short]` or `[boolean]`) when applicable.

---

## How to Run Everything Together

1. **Start the backend API**

   ```bash
   cd server
   npm install
   npm run dev   # or npm start
   ```

2. **Start the React frontend**

   ```bash
   cd ../client
   npm install
   npm start
   ```

3. Open `http://localhost:3000` in your browser.

You can now:

- Add parent questions and nested child questions (recursively).
- Delete any question (and its subtree).
- Drag parent questions to reorder them.
- Refresh the page and see your form restored from local storage.
- Submit and view the read-only hierarchical view with correct numbering.


