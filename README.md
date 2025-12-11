## INFO
This is a Next.js application. It uses Material-UI for the UI, Zustand for state management, and NextAuth for authentication. The backend data is fetched from the public API at `https://dummyjson.com/`.

## Features

-   Admin login with authentication.
-   Protected dashboard, user, and product routes.
-   A list of users with pagination and search.
-   A detailed view for a single user.
-   A list of products with pagination, search, and category filtering.
-   A detailed view for a single product with an image carousel.

## Setup and Installation

1.  **Clone the repository:**
    ```bash
    git clone <your-repo-url>
    cd assessment-app
    ```

2.  **Install dependencies:**
    Since the environment I am working in does not allow running `npm install`, I have provided the `package.json` file. Please run the following command to install the dependencies:
    ```bash
    npm install
    ```

3.  **Environment Variables:**
    Create a `.env.local` file in the root of the project and add a `NEXTAUTH_SECRET`. You can generate a secret with the following command:
    ```bash
    openssl rand -base64 32
    ```
    Your `.env.local` file should look like this:
    ```
    NEXTAUTH_SECRET=<your-secret>
    ```

4.  **Run the application:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:3000`.

## State Management with Zustand

Zustand was chosen for state management in this project for several reasons:

-   **Simplicity and Small Footprint:** Zustand has a very simple API and is much smaller than Redux, making it a great choice for small to medium-sized applications where a complex state management solution is not necessary.
-   **Built-in Async Actions:** Zustand allows for creating asynchronous actions directly within the store, which simplifies API calls and state updates. This is demonstrated in the `authStore`, `userStore`, and `productStore`.
-   **No Boilerplate:** Zustand requires minimal boilerplate code compared to Redux, which leads to faster development and cleaner code.
-   **Hooks-based API:** Zustand's API is based on React hooks, which makes it feel natural to use within a React/Next.js application.

## Client-Side Caching

This application implements a simple client-side caching strategy within the Zustand stores.

-   **Why caching is useful:** Caching is useful to avoid redundant API calls for data that has been recently fetched. This improves the user experience by making the application feel faster and reduces the load on the server.
-   **Caching Strategy:** The stores can be improved to check if the data is already present before making an API call. For example, the `fetchUsers` action could be modified to only fetch users if the `users` array in the store is empty. For this project, a simple in-memory cache is used where data is fetched on component mount, but a more advanced strategy could involve timestamps to invalidate the cache after a certain period. The `authStore` uses the `persist` middleware to cache the authentication token to `localStorage`, so the user remains logged in even after a page refresh.

## Performance Optimization

-   `React.memo`, `useCallback`, and `useMemo` can be used to optimize performance by reducing unnecessary re-renders. For instance, the product and user list items can be wrapped in `React.memo`.
-   API-side pagination is used to load data in smaller chunks, which is more efficient than loading large lists of data at once.
