const objectId = {
  type: "string",
  pattern: "^[a-fA-F0-9]{24}$",
  example: "507f1f77bcf86cd799439011",
};

const idParameter = [{ $ref: "#/components/parameters/id" }];

/**
 * Creates an OpenAPI response object with a description.
 *
 * @param description The human-readable response description.
 * @returns An OpenAPI response object.
 */
const errorResponse = (description: string) => ({ description });

/**
 * Creates an OpenAPI object schema for request input.
 *
 * @param required The names of required properties.
 * @param properties The OpenAPI property definitions.
 * @returns An OpenAPI object schema.
 */
const inputSchema = (required: string[], properties: object) => ({
  type: "object",
  required,
  properties,
});

/**
 * Creates an OpenAPI JSON request body referencing a component schema.
 *
 * @param schema The name of the component schema.
 * @returns A required JSON request body definition.
 */
const requestBody = (schema: string) => ({
  required: true,
  content: {
    "application/json": { schema: { $ref: `#/components/schemas/${schema}` } },
  },
});

/** Defines the OpenAPI document rendered by Swagger UI. */
export const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "eCommerce API",
    version: "1.0.0",
    description: "API for users, categories, products and orders.",
  },
  servers: [{ url: "http://localhost:3001" }],
  tags: [
    { name: "Status", description: "Service availability endpoints." },
    { name: "Users", description: "User management endpoints." },
    { name: "Categories", description: "Product category endpoints." },
    { name: "Products", description: "Product management endpoints." },
    { name: "Orders", description: "Order management endpoints." },
  ],
  components: {
    parameters: {
      id: {
        name: "id",
        in: "path",
        required: true,
        schema: objectId,
      },
    },
    schemas: {
      UserInput: inputSchema(["name", "email", "password"], {
        name: { type: "string", example: "Test" },
        email: { type: "string", format: "email", example: "test@example.com" },
        password: { type: "string", format: "password", example: "secret123" },
      }),
      CategoryInput: inputSchema(["name"], {
        name: { type: "string", example: "Electronics" },
      }),
      ProductInput: inputSchema(
        ["name", "description", "price", "categoryId"],
        {
          name: { type: "string", example: "Keyboard" },
          description: { type: "string", example: "Mechanical keyboard" },
          price: { type: "number", minimum: 0, example: 99.99 },
          categoryId: objectId,
        },
      ),
      OrderInput: inputSchema(["userId", "products"], {
        userId: objectId,
        products: {
          type: "array",
          minItems: 1,
          items: inputSchema(["productId", "quantity"], {
            productId: {
              ...objectId,
              example: "507f1f77bcf86cd799439012",
            },
            quantity: { type: "integer", minimum: 1, example: 2 },
          }),
        },
      }),
    },
  },
  paths: {
    "/health": {
      get: {
        tags: ["Status"],
        summary: "Get service health",
        responses: { 200: { description: "Service is available" } },
      },
    },
    "/users": {
      get: {
        tags: ["Users"],
        summary: "List users",
        responses: { 200: { description: "User list" } },
      },
      post: {
        tags: ["Users"],
        summary: "Create user",
        requestBody: requestBody("UserInput"),
        responses: {
          201: { description: "User created" },
          400: errorResponse("Invalid user data"),
          409: errorResponse("Email already exists"),
        },
      },
    },
    "/users/{id}": {
      get: {
        tags: ["Users"],
        summary: "Get user",
        parameters: idParameter,
        responses: {
          200: { description: "User found" },
          404: errorResponse("User not found"),
        },
      },
      put: {
        tags: ["Users"],
        summary: "Update user",
        parameters: idParameter,
        requestBody: requestBody("UserInput"),
        responses: {
          200: { description: "User updated" },
          400: errorResponse("Invalid user data"),
          404: errorResponse("User not found"),
          409: errorResponse("Email already exists"),
        },
      },
      delete: {
        tags: ["Users"],
        summary: "Delete user",
        parameters: idParameter,
        responses: {
          204: { description: "User deleted" },
          404: errorResponse("User not found"),
        },
      },
    },
    "/categories": {
      get: {
        tags: ["Categories"],
        summary: "List categories",
        responses: { 200: { description: "Category list" } },
      },
      post: {
        tags: ["Categories"],
        summary: "Create category",
        requestBody: requestBody("CategoryInput"),
        responses: {
          201: { description: "Category created" },
          400: errorResponse("Invalid category data"),
        },
      },
    },
    "/categories/{id}": {
      get: {
        tags: ["Categories"],
        summary: "Get category",
        parameters: idParameter,
        responses: {
          200: { description: "Category found" },
          404: errorResponse("Category not found"),
        },
      },
      put: {
        tags: ["Categories"],
        summary: "Update category",
        parameters: idParameter,
        requestBody: requestBody("CategoryInput"),
        responses: {
          200: { description: "Category updated" },
          400: errorResponse("Invalid category data"),
          404: errorResponse("Category not found"),
        },
      },
      delete: {
        tags: ["Categories"],
        summary: "Delete category",
        parameters: idParameter,
        responses: {
          204: { description: "Category deleted" },
          404: errorResponse("Category not found"),
        },
      },
    },
    "/products": {
      get: {
        tags: ["Products"],
        summary: "List products",
        parameters: [
          {
            name: "categoryId",
            in: "query",
            schema: objectId,
            description: "Filter by category",
          },
        ],
        responses: {
          200: { description: "Product list" },
          400: errorResponse("Invalid category ID"),
        },
      },
      post: {
        tags: ["Products"],
        summary: "Create product",
        requestBody: requestBody("ProductInput"),
        responses: {
          201: { description: "Product created" },
          400: errorResponse("Invalid product data or category does not exist"),
        },
      },
    },
    "/products/{id}": {
      get: {
        tags: ["Products"],
        summary: "Get product",
        parameters: idParameter,
        responses: {
          200: { description: "Product found" },
          404: errorResponse("Product not found"),
        },
      },
      put: {
        tags: ["Products"],
        summary: "Update product",
        parameters: idParameter,
        requestBody: requestBody("ProductInput"),
        responses: {
          200: { description: "Product updated" },
          400: errorResponse("Invalid product data or category does not exist"),
          404: errorResponse("Product not found"),
        },
      },
      delete: {
        tags: ["Products"],
        summary: "Delete product",
        parameters: idParameter,
        responses: {
          204: { description: "Product deleted" },
          404: errorResponse("Product not found"),
        },
      },
    },
    "/orders": {
      get: {
        tags: ["Orders"],
        summary: "List orders",
        responses: { 200: { description: "Order list" } },
      },
      post: {
        tags: ["Orders"],
        summary: "Create order",
        description: "The server calculates total from current product prices.",
        requestBody: requestBody("OrderInput"),
        responses: {
          201: { description: "Order created" },
          400: errorResponse("Invalid order data, user, or product"),
        },
      },
    },
    "/orders/{id}": {
      get: {
        tags: ["Orders"],
        summary: "Get order",
        parameters: idParameter,
        responses: {
          200: { description: "Order found" },
          404: errorResponse("Order not found"),
        },
      },
      put: {
        tags: ["Orders"],
        summary: "Update order",
        description:
          "The server recalculates total from current product prices.",
        parameters: idParameter,
        requestBody: requestBody("OrderInput"),
        responses: {
          200: { description: "Order updated" },
          400: errorResponse("Invalid order data, user, or product"),
          404: errorResponse("Order not found"),
        },
      },
      delete: {
        tags: ["Orders"],
        summary: "Delete order",
        parameters: idParameter,
        responses: {
          204: { description: "Order deleted" },
          404: errorResponse("Order not found"),
        },
      },
    },
  },
};
