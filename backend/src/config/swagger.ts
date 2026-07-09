import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Uburiza Learn API",
      version: "1.0.0",
      description: "REST API documentation for the Uburiza Learn online learning platform",
      contact: {
        name: "Uburiza Solutions",
        email: "derrickiradukunda@uburizasolutions.com",
        url: "https://www.uburizasolutions.com",
      },
    },
    servers: [
      { url: "http://localhost:5000", description: "Development server" },
      { url: "https://your-backend.railway.app", description: "Production server" },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            name: { type: "string" },
            email: { type: "string", format: "email" },
            role: { type: "string", enum: ["LEARNER", "ADMIN"] },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        Course: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            title: { type: "string" },
            description: { type: "string" },
            category: { type: "string" },
            level: { type: "string", enum: ["BEGINNER", "INTERMEDIATE", "ADVANCED"] },
            thumbnailUrl: { type: "string", nullable: true },
            isFree: { type: "boolean" },
            price: { type: "number", nullable: true },
            published: { type: "boolean" },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        Lesson: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            moduleId: { type: "string", format: "uuid" },
            title: { type: "string" },
            type: { type: "string", enum: ["VIDEO", "TEXT", "QUIZ"] },
            contentUrl: { type: "string", nullable: true },
            orderIndex: { type: "integer" },
            durationMins: { type: "integer", nullable: true },
          },
        },
        Enrollment: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            userId: { type: "string", format: "uuid" },
            courseId: { type: "string", format: "uuid" },
            enrolledAt: { type: "string", format: "date-time" },
            completedAt: { type: "string", format: "date-time", nullable: true },
          },
        },
        Progress: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            userId: { type: "string", format: "uuid" },
            lessonId: { type: "string", format: "uuid" },
            completed: { type: "boolean" },
            completedAt: { type: "string", format: "date-time", nullable: true },
          },
        },
        Certificate: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            userId: { type: "string", format: "uuid" },
            courseId: { type: "string", format: "uuid" },
            issuedAt: { type: "string", format: "date-time" },
            certificateUid: { type: "string", format: "uuid" },
          },
        },
        Resource: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            title: { type: "string" },
            category: { type: "string" },
            fileUrl: { type: "string" },
            fileType: { type: "string" },
            uploadedAt: { type: "string", format: "date-time" },
          },
        },
        Error: {
          type: "object",
          properties: {
            message: { type: "string" },
          },
        },
      },
    },
    tags: [
      { name: "Auth", description: "Authentication endpoints" },
      { name: "Courses", description: "Course management" },
      { name: "Enrollment", description: "Course enrollment and learner courses" },
      { name: "Progress", description: "Lesson progress tracking" },
      { name: "Certificates", description: "Certificate generation and verification" },
      { name: "Resources", description: "Resource library" },
      { name: "Admin", description: "Admin-only endpoints" },
    ],
    paths: {
      "/api/auth/register": {
        post: {
          tags: ["Auth"],
          summary: "Register a new learner account",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["name", "email", "password"],
                  properties: {
                    name: { type: "string", minLength: 2, example: "Jane Doe" },
                    email: { type: "string", format: "email", example: "jane@example.com" },
                    password: { type: "string", minLength: 8, example: "securePass123" },
                  },
                },
              },
            },
          },
          responses: {
            201: {
              description: "User registered successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      token: { type: "string" },
                      user: { $ref: "#/components/schemas/User" },
                    },
                  },
                },
              },
            },
            409: { description: "Email already in use", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          },
        },
      },
      "/api/auth/login": {
        post: {
          tags: ["Auth"],
          summary: "Login and receive a JWT token",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["email", "password"],
                  properties: {
                    email: { type: "string", format: "email", example: "jane@example.com" },
                    password: { type: "string", example: "securePass123" },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "Login successful",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      token: { type: "string" },
                      user: { $ref: "#/components/schemas/User" },
                    },
                  },
                },
              },
            },
            401: { description: "Invalid credentials", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          },
        },
      },
      "/api/auth/logout": {
        post: {
          tags: ["Auth"],
          summary: "Logout current session",
          responses: { 200: { description: "Logged out successfully" } },
        },
      },
      "/api/auth/reset-password": {
        post: {
          tags: ["Auth"],
          summary: "Trigger a password reset email",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["email"],
                  properties: { email: { type: "string", format: "email" } },
                },
              },
            },
          },
          responses: { 200: { description: "Reset email sent if account exists" } },
        },
      },
      "/api/courses": {
        get: {
          tags: ["Courses"],
          summary: "List all published courses",
          parameters: [
            { name: "category", in: "query", schema: { type: "string" }, description: "Filter by category" },
            { name: "level", in: "query", schema: { type: "string", enum: ["BEGINNER", "INTERMEDIATE", "ADVANCED"] }, description: "Filter by level" },
          ],
          responses: {
            200: {
              description: "List of courses",
              content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/Course" } } } },
            },
          },
        },
        post: {
          tags: ["Courses"],
          summary: "Create a new course (admin only)",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["title", "description", "category"],
                  properties: {
                    title: { type: "string" },
                    description: { type: "string" },
                    category: { type: "string" },
                    level: { type: "string", enum: ["BEGINNER", "INTERMEDIATE", "ADVANCED"] },
                    isFree: { type: "boolean" },
                    price: { type: "number" },
                    thumbnailUrl: { type: "string" },
                    published: { type: "boolean" },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: "Course created", content: { "application/json": { schema: { $ref: "#/components/schemas/Course" } } } },
            403: { description: "Admin access required" },
          },
        },
      },
      "/api/courses/{id}": {
        get: {
          tags: ["Courses"],
          summary: "Get a single course with modules and lessons",
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
          responses: {
            200: { description: "Course details", content: { "application/json": { schema: { $ref: "#/components/schemas/Course" } } } },
            404: { description: "Course not found" },
          },
        },
        put: {
          tags: ["Courses"],
          summary: "Update a course (admin only)",
          security: [{ bearerAuth: [] }],
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
          requestBody: {
            required: true,
            content: { "application/json": { schema: { $ref: "#/components/schemas/Course" } } },
          },
          responses: {
            200: { description: "Course updated" },
            403: { description: "Admin access required" },
          },
        },
        delete: {
          tags: ["Courses"],
          summary: "Soft delete a course (admin only)",
          security: [{ bearerAuth: [] }],
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
          responses: {
            200: { description: "Course unpublished" },
            403: { description: "Admin access required" },
          },
        },
      },
      "/api/enroll": {
        post: {
          tags: ["Enrollment"],
          summary: "Enroll authenticated user in a course",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["courseId"],
                  properties: {
                    courseId: { type: "string", format: "uuid" },
                    accessCode: { type: "string", description: "Required for paid courses" },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: "Enrolled successfully", content: { "application/json": { schema: { $ref: "#/components/schemas/Enrollment" } } } },
            400: { description: "Invalid access code or course not found" },
          },
        },
      },
      "/api/my-courses": {
        get: {
          tags: ["Enrollment"],
          summary: "Get all courses for the logged-in learner with progress",
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: "List of enrolled courses with progress" },
          },
        },
      },
      "/api/progress": {
        post: {
          tags: ["Progress"],
          summary: "Mark a lesson as complete",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["lessonId"],
                  properties: { lessonId: { type: "string", format: "uuid" } },
                },
              },
            },
          },
          responses: {
            200: { description: "Progress updated", content: { "application/json": { schema: { $ref: "#/components/schemas/Progress" } } } },
          },
        },
      },
      "/api/progress/{courseId}": {
        get: {
          tags: ["Progress"],
          summary: "Get lesson completion status for a course",
          security: [{ bearerAuth: [] }],
          parameters: [{ name: "courseId", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
          responses: {
            200: {
              description: "Progress summary",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      total: { type: "integer" },
                      completed: { type: "integer" },
                      percentage: { type: "integer" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/api/certificates/{userId}": {
        get: {
          tags: ["Certificates"],
          summary: "List all certificates earned by a learner",
          security: [{ bearerAuth: [] }],
          parameters: [{ name: "userId", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
          responses: {
            200: { description: "List of certificates", content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/Certificate" } } } } },
          },
        },
      },
      "/api/certificate/{uid}": {
        get: {
          tags: ["Certificates"],
          summary: "Verify and display a certificate by unique ID",
          parameters: [{ name: "uid", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
          responses: {
            200: { description: "Certificate details", content: { "application/json": { schema: { $ref: "#/components/schemas/Certificate" } } } },
            404: { description: "Certificate not found" },
          },
        },
      },
      "/api/certificate/generate": {
        post: {
          tags: ["Certificates"],
          summary: "Generate a certificate on course completion",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["courseId"],
                  properties: { courseId: { type: "string", format: "uuid" } },
                },
              },
            },
          },
          responses: {
            201: { description: "Certificate generated", content: { "application/json": { schema: { $ref: "#/components/schemas/Certificate" } } } },
            400: { description: "Course not fully completed" },
          },
        },
      },
      "/api/resources": {
        get: {
          tags: ["Resources"],
          summary: "List all resources",
          parameters: [
            { name: "category", in: "query", schema: { type: "string" } },
            { name: "fileType", in: "query", schema: { type: "string" } },
          ],
          responses: {
            200: { description: "List of resources", content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/Resource" } } } } },
          },
        },
        post: {
          tags: ["Resources"],
          summary: "Upload a new resource (admin only)",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["title", "category", "fileUrl", "fileType"],
                  properties: {
                    title: { type: "string" },
                    category: { type: "string" },
                    fileUrl: { type: "string" },
                    fileType: { type: "string" },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: "Resource created", content: { "application/json": { schema: { $ref: "#/components/schemas/Resource" } } } },
            403: { description: "Admin access required" },
          },
        },
      },
      "/api/resources/{id}": {
        delete: {
          tags: ["Resources"],
          summary: "Delete a resource (admin only)",
          security: [{ bearerAuth: [] }],
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
          responses: {
            200: { description: "Resource deleted" },
            403: { description: "Admin access required" },
          },
        },
      },
      "/api/admin/learners": {
        get: {
          tags: ["Admin"],
          summary: "List all registered learners",
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: "List of learners", content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/User" } } } } },
          },
        },
      },
      "/api/admin/analytics": {
        get: {
          tags: ["Admin"],
          summary: "Get enrollment counts and completion rates",
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: "Analytics data",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      totalLearners: { type: "integer" },
                      totalEnrollments: { type: "integer" },
                      completionRate: { type: "string", example: "72%" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/api/admin/access-codes": {
        post: {
          tags: ["Admin"],
          summary: "Generate batch access codes for a course",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["courseId"],
                  properties: {
                    courseId: { type: "string", format: "uuid" },
                    count: { type: "integer", default: 10 },
                    maxUses: { type: "integer", default: 1 },
                    expiresAt: { type: "string", format: "date-time", nullable: true },
                  },
                },
              },
            },
          },
          responses: {
            201: {
              description: "Access codes generated",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      created: { type: "integer" },
                      codes: { type: "array", items: { type: "string" } },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/api/admin/export/learners": {
        get: {
          tags: ["Admin"],
          summary: "Export learner data as CSV",
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: "CSV file download", content: { "text/csv": { schema: { type: "string" } } } },
          },
        },
      },
    },
  },
  apis: [],
};

export const swaggerSpec = swaggerJsdoc(options);
