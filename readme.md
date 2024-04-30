# Catalogues Web Application

This project is a web application designed to showcase a catalogue of items. It is built using React for the frontend and Node.js for the backend API.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

What things you need to install the software and how to install them:

- Node.js
- npm

### Environment
Configure these on the API side in ``.env`` file

``PORT``: Port in which the server will run on.

``MONGO_URI``: MongoDB URI

### Installing

A step by step series of examples that tell you how to get a development environment running:

1. Clone the repository to your local machine
2. Navigate to the `Assignment/api` directory and install the dependencies:

```sh
cd Assignment/api
npm install
```

3. Start the backend server:
```sh
npm start
```
4. In a new terminal, navigate to the Assignment/web directory and install the frontend dependencies:
```sh
cd Assignment/web
npm install
```
5. Start the frontend development server:
```sh
npm start
```

6. Open http://localhost:3000 to view the application in the browser.


### API Routes

| Method | Route                          | Description                           |
|--------|--------------------------------|---------------------------------------|
| GET    | ``/``                            | Base route, returns API status.       |
| GET    | `/catalogue`                   | Retrieves all catalogues.             |
| GET    | `/catalogue/search`            | Searches catalogues with given query. |
| GET    | `/catalogue/filter`            | Filters catalogues based on criteria. |
| GET    | `/catalogue/available-filters` | Gets available filters for catalogues.|
| POST   | `/catalogue`                   | Creates a new catalogue entry.        |
| GET    | `/catalogue/:id`               | Retrieves a specific catalogue by ID. |
| PUT    | `/catalogue/:uuid`             | Updates a specific catalogue by UUID. |
| DELETE | `/catalogue/:id`               | Deletes a specific catalogue by ID.   |
| POST   | `/catalogue/bulk/export`       | Exports selected catalogues.          |

### Frontend Pages

| Path                | Component                     | Description                           |
|---------------------|-------------------------------|---------------------------------------|
| `*`                 | `ErrorPage` within `NavLayout`| Fallback error page for unmatched routes. |
| ``/``               | `HomePage` within `NavLayout` | The homepage of the web application.  |
| `/catalogue/:id`    | `CatalogueItemPage` in `view` mode within `NavLayout` | Page to view a specific catalogue item. |
| `/catalogue/:id/edit` | `CatalogueItemPage` in `edit` mode within `NavLayout` | Page to edit a specific catalogue item. |
| `/catalogue/create` | `CatalogueItemPage` in `create` mode within `NavLayout` | Page to create a new catalogue item. |

These tables summarize the API endpoints available in the backend and the routes configured in the frontend of the application