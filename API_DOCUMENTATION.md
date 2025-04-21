# API Documentation

This document describes the API endpoints available in the application.

## Authentication

Most endpoints require authentication. Users must be logged in to access these endpoints. Authentication is handled via cookies managed by the `better-auth` library. Unauthorized requests will receive a `401 Unauthorized` response. Requests attempting to access or modify resources belonging to other users will receive a `403 Forbidden` response.

## Endpoints

### API Vendors

These endpoints manage the API vendors configured by the user. All vendor endpoints require authentication.

#### `GET /api/vendors`

-   **Description:** Retrieves a list of all API vendors associated with the authenticated user.
-   **Authentication:** Required.
-   **Success Response:**
    -   **Code:** `200 OK`
    -   **Content:** `[{ "id": "string", "name": "string", "url": "string", "apiKey": "string", "modelName": "string", "userId": "string", "createdAt": "datetime", "updatedAt": "datetime" }, ...]`
-   **Error Response:**
    -   **Code:** `500 Internal Server Error`
    -   **Content:** `{ "error": "Failed to fetch vendors" }`

#### `POST /api/vendors`

-   **Description:** Creates a new API vendor for the authenticated user.
-   **Authentication:** Required.
-   **Request Body:**
    ```json
    {
      "name": "string",
      "url": "string",
      "apiKey": "string",
      "modelName": "string"
    }
    ```
-   **Success Response:**
    -   **Code:** `201 Created`
    -   **Content:** `{ "id": "string", "name": "string", "url": "string", "apiKey": "string", "modelName": "string", "userId": "string", "createdAt": "datetime", "updatedAt": "datetime" }`
-   **Error Response:**
    -   **Code:** `500 Internal Server Error`
    -   **Content:** `{ "error": "Failed to create vendor" }`

#### `PUT /api/vendors/:id`

-   **Description:** Updates an existing API vendor specified by `id`. Only the owner of the vendor can update it.
-   **Authentication:** Required.
-   **URL Parameters:**
    -   `id` (string): The ID of the vendor to update.
-   **Request Body:**
    ```json
    {
      "name": "string",
      "url": "string",
      "apiKey": "string",
      "modelName": "string"
    }
    ```
-   **Success Response:**
    -   **Code:** `200 OK`
    -   **Content:** `{ "id": "string", "name": "string", "url": "string", "apiKey": "string", "modelName": "string", "userId": "string", "createdAt": "datetime", "updatedAt": "datetime" }`
-   **Error Responses:**
    -   **Code:** `404 Not Found` - `{ "error": "Vendor not found" }`
    -   **Code:** `403 Forbidden` - `{ "error": "Unauthorized to update this vendor" }`
    -   **Code:** `500 Internal Server Error` - `{ "error": "Failed to update vendor" }`

#### `DELETE /api/vendors/:id`

-   **Description:** Deletes an existing API vendor specified by `id` and all associated performance metrics. Only the owner of the vendor can delete it.
-   **Authentication:** Required.
-   **URL Parameters:**
    -   `id` (string): The ID of the vendor to delete.
-   **Success Response:**
    -   **Code:** `204 No Content`
-   **Error Responses:**
    -   **Code:** `404 Not Found` - `{ "error": "Vendor not found" }`
    -   **Code:** `403 Forbidden` - `{ "error": "Unauthorized to delete this vendor" }`
    -   **Code:** `500 Internal Server Error` - `{ "error": "Failed to delete vendor" }`

### Performance Metrics

These endpoints manage performance metrics recorded for API vendors. All metrics endpoints require authentication.

#### `GET /api/metrics`

-   **Description:** Retrieves a list of all performance metrics. *Note: This currently fetches metrics for all users, which might need adjustment based on requirements.*
-   **Authentication:** Required.
-   **Success Response:**
    -   **Code:** `200 OK`
    -   **Content:** `[{ "id": "string", "timeToFirstToken": "float", "tokensPerSecond": "float", "apiVendorId": "string", "createdAt": "datetime", "updatedAt": "datetime", "apiVendor": { ...vendor object... } }, ...]`
-   **Error Response:**
    -   **Code:** `500 Internal Server Error`
    -   **Content:** `{ "error": "Failed to fetch metrics" }`

#### `POST /api/metrics`

-   **Description:** Creates a new performance metric record for a specific API vendor.
-   **Authentication:** Required.
-   **Request Body:**
    ```json
    {
      "apiVendorId": "string",
      "timeToFirstToken": "float",
      "tokensPerSecond": "float"
    }
    ```
-   **Success Response:**
    -   **Code:** `201 Created`
    -   **Content:** `{ "id": "string", "timeToFirstToken": "float", "tokensPerSecond": "float", "apiVendorId": "string", "createdAt": "datetime", "updatedAt": "datetime", "apiVendor": { ...vendor object... } }`
-   **Error Responses:**
    -   **Code:** `400 Bad Request` - `{ "error": "apiVendorId is required" }`
    -   **Code:** `500 Internal Server Error` - `{ "error": "Failed to create metric" }`

#### `DELETE /api/metrics/:id`

-   **Description:** Deletes a specific performance metric by `id`. *Note: This currently allows deletion of any metric, regardless of ownership.*
-   **Authentication:** Required.
-   **URL Parameters:**
    -   `id` (string): The ID of the metric to delete.
-   **Success Response:**
    -   **Code:** `204 No Content`
-   **Error Response:**
    -   **Code:** `500 Internal Server Error` - `{ "error": "Failed to delete metric" }`

#### `DELETE /api/vendors/:id/metrics`

-   **Description:** Deletes all performance metrics associated with a specific vendor `id`. Only the owner of the vendor can delete its metrics.
-   **Authentication:** Required.
-   **URL Parameters:**
    -   `id` (string): The ID of the vendor whose metrics should be deleted.
-   **Success Response:**
    -   **Code:** `204 No Content`
-   **Error Responses:**
    -   **Code:** `404 Not Found` - `{ "error": "Vendor not found" }`
    -   **Code:** `403 Forbidden` - `{ "error": "Unauthorized to delete metrics for this vendor" }`
    -   **Code:** `500 Internal Server Error` - `{ "error": "Failed to delete vendor metrics" }`

#### `GET /api/metrics/export`

-   **Description:** Exports all performance metrics belonging to the authenticated user's vendors as a CSV file.
-   **Authentication:** Required.
-   **Success Response:**
    -   **Code:** `200 OK`
    -   **Headers:**
        -   `Content-Type: text/csv`
        -   `Content-Disposition: attachment; filename="metrics.csv"`
    -   **Body:** CSV formatted data with headers: `metricId,vendorId,vendorName,timeToFirstToken,tokensPerSecond,createdAt,updatedAt`.
-   **Error Response:**
    -   **Code:** `500 Internal Server Error` - `{ "error": "Failed to export metrics" }`

### Authentication Endpoint

#### `ALL /api/auth/*`

-   **Description:** Handles all authentication-related requests (login, logout, session management). These are managed by the `better-auth` library. Refer to the `better-auth` documentation for specific sub-routes and behaviors.
-   **Authentication:** Handled internally by the library. 