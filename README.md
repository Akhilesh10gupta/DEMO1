## INFO
This is a Next.js application. It uses Material-UI for the UI, Zustand for state management, and NextAuth for authentication. The backend data is fetched from the public API at `https://dummyjson.com/`.

## Features

-   Admin login with authentication.
-   Protected dashboard, user, and product routes.
-   A list of users with pagination and search, displayed in a responsive table or card UI depending on screen size.
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

This application implements an in-memory client-side caching strategy within the Zustand stores to optimize performance and reduce API calls.

-   **Why caching is useful:** Caching is crucial for improving user experience by reducing load times and making the application feel snappier. It minimizes redundant network requests for data that has been recently fetched or is unlikely to change frequently, thereby reducing server load and bandwidth usage.
-   **Caching Strategy:** A time-based in-memory cache is used within the Zustand `userStore` and `productStore`. Fetched data (such as user lists, search results, product lists, product categories, and individual user/product details) is stored in the store's `cache` property along with a timestamp. When a new request for the same data is made, the store first checks if a valid (not expired) entry exists in the cache. If it does, the cached data is immediately returned, avoiding an API call. Data is considered expired after `CACHE_DURATION` (e.g., 5 minutes). This approach balances data freshness with performance benefits. The `authStore` continues to use Zustand's `persist` middleware to store the authentication token in `localStorage`, ensuring user login persistence across sessions.

## Performance Optimization

-   `React.memo`, `useCallback`, and `useMemo` can be used to optimize performance by reducing unnecessary re-renders. For instance, the product and user list items can be wrapped in `React.memo`.
-   API-side pagination is used to load data in smaller chunks, which is more efficient than loading large lists of data at once.
