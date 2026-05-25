import type { OpenAPIV3 } from "openapi-types";

const spec: OpenAPIV3.Document = {
  openapi: "3.0.3",
  info: {
    title: "Zafora Backend API",
    version: "1.0.0",
    description:
      "REST API for Zafora Holding — infrastructure advisory platform.\n\n**Auth:** JWT cookies (`access_token` 15 min + `refresh_token` 7 days). Call `POST /api/auth/login` first; cookies are set automatically. Use `POST /api/auth/refresh` to rotate tokens. Protected routes are marked 🔒.",
    contact: { email: "Office@zaforaholding.com" },
  },
  servers: [
    { url: "http://localhost:4000", description: "Local development" },
    { url: "https://your-railway-url.railway.app", description: "Production (Railway)" },
  ],
  tags: [
    { name: "Health", description: "Server health check" },
    { name: "Auth", description: "Authentication — login / logout / session" },
    { name: "Leads", description: "CRM — contact form submissions" },
    { name: "Projects", description: "Pipeline — infrastructure projects" },
    { name: "Project Interests", description: "Expressions of interest in a project" },
    { name: "Documents", description: "Document library" },
    { name: "Services", description: "Service offerings catalog" },
    { name: "Content", description: "CMS — stats, methodology steps, site settings" },
    { name: "Testimonials", description: "Client testimonials" },
    { name: "Stats", description: "Admin dashboard aggregate statistics" },
    { name: "Notifications", description: "Email notification configuration" },
    { name: "Storage", description: "File upload — AWS S3 presigned PUT URLs. Client uploads directly to S3; no file bytes through Express." },
    { name: "Audit", description: "Audit log trail" },
  ],

  // ── Reusable schemas ──────────────────────────────────────────────
  components: {
    schemas: {
      Error: {
        type: "object",
        properties: {
          error: { type: "string", example: "Not found" },
        },
        required: ["error"],
      },

      // Auth
      LoginBody: {
        type: "object",
        required: ["password"],
        description: "Password-only login. Admin email is resolved server-side from ADMIN_EMAIL env var.",
        properties: {
          password: { type: "string", minLength: 1, example: "mypassword" },
        },
      },
      LoginResponse: {
        type: "object",
        properties: {
          ok: { type: "boolean" },
          user: {
            type: "object",
            properties: {
              id: { type: "integer" },
              email: { type: "string" },
              role: { type: "string" },
            },
          },
        },
      },
      VerifyResponse: {
        type: "object",
        properties: {
          authenticated: { type: "boolean" },
          user: {
            type: "object",
            nullable: true,
            properties: {
              id: { type: "integer" },
              email: { type: "string" },
              role: { type: "string" },
            },
          },
        },
      },
      ChangePasswordBody: {
        type: "object",
        required: ["currentPassword", "newPassword"],
        properties: {
          currentPassword: { type: "string" },
          newPassword: { type: "string", minLength: 8 },
        },
      },

      // Lead
      Lead: {
        type: "object",
        properties: {
          id: { type: "integer" },
          fullName: { type: "string" },
          organization: { type: "string" },
          email: { type: "string" },
          phone: { type: "string", nullable: true },
          country: { type: "string" },
          requestType: { type: "string" },
          projectSector: { type: "string", nullable: true },
          message: { type: "string" },
          budgetFundingNeed: { type: "string", nullable: true },
          projectTimeline: { type: "string", nullable: true },
          roleType: { type: "string", nullable: true },
          status: { type: "string", enum: ["new", "reviewed", "contacted", "qualified", "proposal_sent", "in_progress", "closed", "rejected"], default: "new" },
          notes: { type: "string", nullable: true },
          followUpDate: { type: "string", nullable: true },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      CreateLeadBody: {
        type: "object",
        required: ["fullName", "organization", "email", "country", "requestType", "message"],
        properties: {
          fullName: { type: "string", example: "John Doe" },
          organization: { type: "string", example: "Ministry of Finance" },
          email: { type: "string", format: "email", example: "john@gov.ng" },
          phone: { type: "string", example: "+234 800 000 0000", nullable: true },
          country: { type: "string", example: "Nigeria" },
          requestType: { type: "string", example: "Government Advisory" },
          projectSector: { type: "string", example: "Energy", nullable: true },
          message: { type: "string", example: "We need advisory on a solar farm." },
          budgetFundingNeed: { type: "string", example: "$50M", nullable: true },
          projectTimeline: { type: "string", example: "12–18 months", nullable: true },
          roleType: { type: "string", example: "Government", nullable: true },
        },
      },
      UpdateLeadBody: {
        type: "object",
        properties: {
          status: { type: "string", enum: ["new", "reviewed", "contacted", "qualified", "proposal_sent", "in_progress", "closed", "rejected"] },
          notes: { type: "string", nullable: true },
          followUpDate: { type: "string", nullable: true },
        },
      },

      // Project
      Project: {
        type: "object",
        properties: {
          id: { type: "integer" },
          name: { type: "string" },
          sector: { type: "string" },
          country: { type: "string" },
          region: { type: "string", nullable: true },
          fundingStatus: { type: "string", enum: ["seeking_funding", "partially_funded", "funded", "closed"] },
          estimatedValue: { type: "string" },
          zaforaRole: { type: "string" },
          partnerNeed: { type: "string", nullable: true },
          description: { type: "string", nullable: true },
          imageUrl: { type: "string", nullable: true },
          interestCount: { type: "integer" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      CreateProjectBody: {
        type: "object",
        required: ["name", "sector", "country", "fundingStatus", "estimatedValue", "zaforaRole"],
        properties: {
          name: { type: "string", example: "Lagos Solar Farm" },
          sector: { type: "string", example: "Energy" },
          country: { type: "string", example: "Nigeria" },
          region: { type: "string", example: "West Africa", nullable: true },
          fundingStatus: { type: "string", enum: ["seeking_funding", "partially_funded", "funded", "closed"], example: "seeking_funding" },
          estimatedValue: { type: "string", example: "$120M" },
          zaforaRole: { type: "string", example: "Lead Advisor" },
          partnerNeed: { type: "string", example: "EPC contractor", nullable: true },
          description: { type: "string", example: "Utility-scale solar project.", nullable: true },
          imageUrl: { type: "string", nullable: true },
        },
      },

      // Project Interest
      ProjectInterest: {
        type: "object",
        properties: {
          id: { type: "integer" },
          projectId: { type: "integer" },
          fullName: { type: "string" },
          organization: { type: "string" },
          email: { type: "string" },
          phone: { type: "string", nullable: true },
          roleType: { type: "string" },
          message: { type: "string", nullable: true },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      ExpressInterestBody: {
        type: "object",
        required: ["fullName", "organization", "email", "roleType"],
        properties: {
          fullName: { type: "string", example: "Jane Smith" },
          organization: { type: "string", example: "Global Infrastructure Fund" },
          email: { type: "string", format: "email", example: "jane@gif.com" },
          phone: { type: "string", nullable: true },
          roleType: { type: "string", example: "Investor" },
          message: { type: "string", nullable: true },
        },
      },

      // Document
      Document: {
        type: "object",
        properties: {
          id: { type: "integer" },
          title: { type: "string" },
          documentType: { type: "string" },
          visibility: { type: "string", enum: ["public", "private"] },
          fileUrl: { type: "string", nullable: true },
          description: { type: "string", nullable: true },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      CreateDocumentBody: {
        type: "object",
        required: ["title", "documentType"],
        properties: {
          title: { type: "string", example: "Capability Statement 2025" },
          documentType: { type: "string", example: "capability_pack" },
          visibility: { type: "string", enum: ["public", "private"], default: "public" },
          fileUrl: { type: "string", nullable: true },
          description: { type: "string", nullable: true },
        },
      },

      // Service
      Service: {
        type: "object",
        properties: {
          id: { type: "integer" },
          name: { type: "string" },
          icon: { type: "string" },
          description: { type: "string" },
          bullets: { type: "array", items: { type: "string" } },
          imageUrl: { type: "string", nullable: true },
          category: { type: "string", nullable: true },
          displayOrder: { type: "integer" },
          visible: { type: "boolean" },
        },
      },
      CreateServiceBody: {
        type: "object",
        required: ["name", "description"],
        properties: {
          name: { type: "string", example: "Government Advisory" },
          icon: { type: "string", example: "Briefcase" },
          description: { type: "string", example: "End-to-end advisory for sovereign clients." },
          bullets: { type: "array", items: { type: "string" }, example: ["Feasibility studies", "Regulatory compliance"] },
          imageUrl: { type: "string", nullable: true },
          category: { type: "string", nullable: true },
          displayOrder: { type: "integer", default: 0 },
          visible: { type: "boolean", default: true },
        },
      },

      // Testimonial
      Testimonial: {
        type: "object",
        properties: {
          id: { type: "integer" },
          name: { type: "string" },
          company: { type: "string" },
          role: { type: "string", nullable: true },
          quote: { type: "string" },
          photoUrl: { type: "string", nullable: true },
          displayOrder: { type: "integer" },
          visible: { type: "boolean" },
        },
      },
      CreateTestimonialBody: {
        type: "object",
        required: ["name", "company", "quote"],
        properties: {
          name: { type: "string", example: "Minister of Infrastructure" },
          company: { type: "string", example: "West African Federal Government" },
          role: { type: "string", nullable: true, example: "Cabinet Minister" },
          quote: { type: "string", example: "Zafora brought clarity to a complex project." },
          photoUrl: { type: "string", nullable: true },
          displayOrder: { type: "integer", default: 0 },
          visible: { type: "boolean", default: true },
        },
      },

      // Content Stats
      ContentStat: {
        type: "object",
        properties: {
          id: { type: "integer" },
          label: { type: "string" },
          value: { type: "string" },
          suffix: { type: "string", nullable: true },
          description: { type: "string", nullable: true },
          iconName: { type: "string", nullable: true },
          displayOrder: { type: "integer" },
          visible: { type: "boolean" },
        },
      },
      CreateContentStatBody: {
        type: "object",
        required: ["label", "value"],
        properties: {
          label: { type: "string", example: "Project Value Advised" },
          value: { type: "string", example: "$2.4B" },
          suffix: { type: "string", example: "+", nullable: true },
          description: { type: "string", nullable: true },
          iconName: { type: "string", example: "DollarSign", nullable: true },
          displayOrder: { type: "integer", default: 0 },
          visible: { type: "boolean", default: true },
        },
      },

      // Methodology Step
      MethodologyStep: {
        type: "object",
        properties: {
          id: { type: "integer" },
          stepNumber: { type: "integer" },
          title: { type: "string" },
          description: { type: "string" },
          iconName: { type: "string", nullable: true },
          displayOrder: { type: "integer" },
          visible: { type: "boolean" },
        },
      },
      CreateMethodologyStepBody: {
        type: "object",
        required: ["stepNumber", "title", "description"],
        properties: {
          stepNumber: { type: "integer", example: 1 },
          title: { type: "string", example: "Origination & Screening" },
          description: { type: "string" },
          iconName: { type: "string", nullable: true, example: "Target" },
          displayOrder: { type: "integer", default: 0 },
          visible: { type: "boolean", default: true },
        },
      },

      // FAQ
      Faq: {
        type: "object",
        properties: {
          id: { type: "integer" },
          question: { type: "string" },
          answer: { type: "string" },
          category: { type: "string", example: "general" },
          page: { type: "string", example: "general", description: "Which page this FAQ appears on (general/home/about/services/projects/government/submit)" },
          displayOrder: { type: "integer" },
          visible: { type: "boolean" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      CreateFaqBody: {
        type: "object",
        required: ["question", "answer"],
        properties: {
          question: { type: "string", example: "What services does Zafora offer?" },
          answer: { type: "string", example: "Full-spectrum infrastructure advisory..." },
          category: { type: "string", default: "general", example: "services" },
          page: { type: "string", default: "general", example: "general" },
          displayOrder: { type: "integer", default: 0 },
          visible: { type: "boolean", default: true },
        },
      },
      UpdateFaqBody: {
        type: "object",
        properties: {
          question: { type: "string" },
          answer: { type: "string" },
          category: { type: "string" },
          page: { type: "string" },
          displayOrder: { type: "integer" },
          visible: { type: "boolean" },
        },
      },

      // Site Setting
      SiteSetting: {
        type: "object",
        properties: {
          id: { type: "integer" },
          key: { type: "string" },
          value: { type: "string", description: "JSON-serialised object" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },

      // Audit
      AuditLog: {
        type: "object",
        properties: {
          id: { type: "integer" },
          action: { type: "string", enum: ["create", "update", "delete", "login", "logout", "change_password"] },
          category: { type: "string", example: "CRM" },
          description: { type: "string" },
          detail: { type: "object", nullable: true },
          performedAt: { type: "string", format: "date-time" },
        },
      },

      // Dashboard stats
      DashboardStats: {
        type: "object",
        properties: {
          totalLeads: { type: "integer" },
          totalProjects: { type: "integer" },
          totalInterests: { type: "integer" },
          totalDocuments: { type: "integer" },
          newLeadsThisMonth: { type: "integer" },
          activeProjects: { type: "integer" },
          leadsByStatus: {
            type: "array",
            items: {
              type: "object",
              properties: {
                status: { type: "string" },
                count: { type: "integer" },
              },
            },
          },
          recentLeads: { type: "array", items: { $ref: "#/components/schemas/Lead" } },
        },
      },
    },

    // JWT cookie-based security
    securitySchemes: {
      cookieAuth: {
        type: "apiKey",
        in: "cookie",
        name: "access_token",
        description: "Short-lived JWT access token (15 min) — set automatically by POST /api/auth/login. Send credentials with every request.",
      },
    },
  },

  // ── Paths ─────────────────────────────────────────────────────────
  paths: {
    // ── Health ──────────────────────────────────────────────────────
    "/api/healthz": {
      get: {
        tags: ["Health"],
        summary: "Health check",
        operationId: "healthCheck",
        responses: {
          "200": { description: "Server is running", content: { "application/json": { schema: { type: "object", properties: { status: { type: "string", example: "ok" } } } } } },
        },
      },
    },

    // ── Auth ────────────────────────────────────────────────────────
    "/api/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Login",
        description: "Validates email + password (bcrypt). Sets `access_token` (15 min) and `refresh_token` (7 days) httpOnly cookies.",
        operationId: "login",
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/LoginBody" } } } },
        responses: {
          "200": { description: "Authenticated — cookies set", content: { "application/json": { schema: { $ref: "#/components/schemas/LoginResponse" } } } },
          "400": { description: "Invalid request body", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          "401": { description: "Invalid credentials", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
        },
      },
    },
    "/api/auth/verify": {
      get: {
        tags: ["Auth"],
        summary: "Verify access token 🔒",
        description: "Validates the `access_token` cookie. Returns current user if valid.",
        operationId: "verifySession",
        security: [{ cookieAuth: [] }],
        responses: {
          "200": { description: "Token state", content: { "application/json": { schema: { $ref: "#/components/schemas/VerifyResponse" } } } },
        },
      },
    },
    "/api/auth/refresh": {
      post: {
        tags: ["Auth"],
        summary: "Refresh tokens",
        description: "Rotates the `refresh_token` cookie and issues a new `access_token`. Old refresh token is invalidated.",
        operationId: "refreshTokens",
        responses: {
          "200": { description: "New tokens issued", content: { "application/json": { schema: { type: "object", properties: { ok: { type: "boolean" } } } } } },
          "401": { description: "Missing, invalid, or revoked refresh token", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
        },
      },
    },
    "/api/auth/logout": {
      post: {
        tags: ["Auth"],
        summary: "Logout",
        description: "Invalidates the refresh token in DB and clears both auth cookies.",
        operationId: "logout",
        security: [{ cookieAuth: [] }],
        responses: {
          "200": { description: "Logged out — cookies cleared", content: { "application/json": { schema: { type: "object", properties: { ok: { type: "boolean" } } } } } },
        },
      },
    },
    "/api/auth/change-password": {
      post: {
        tags: ["Auth"],
        summary: "Change password 🔒",
        description: "Requires an active session. Verifies current password, then updates bcrypt hash.",
        operationId: "changePassword",
        security: [{ cookieAuth: [] }],
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/ChangePasswordBody" } } } },
        responses: {
          "200": { description: "Password changed", content: { "application/json": { schema: { type: "object", properties: { ok: { type: "boolean" } } } } } },
          "400": { description: "Validation error", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          "401": { description: "Not authenticated", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
        },
      },
    },
    "/api/auth/setup-status": {
      get: {
        tags: ["Auth"],
        summary: "Check if initial setup is required",
        description: "Returns `{ required: true }` if no admin user exists yet.",
        operationId: "setupStatus",
        responses: {
          "200": { description: "Setup status", content: { "application/json": { schema: { type: "object", properties: { required: { type: "boolean" } } } } } },
        },
      },
    },
    "/api/auth/setup": {
      post: {
        tags: ["Auth"],
        summary: "First-time admin setup",
        description: "Creates the initial admin account. Requires `ADMIN_SETUP_EMAIL` env var to match.",
        operationId: "setupAdmin",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["adminEmail", "newPassword", "confirmPassword"],
                properties: {
                  adminEmail: { type: "string", format: "email" },
                  newPassword: { type: "string", minLength: 8 },
                  confirmPassword: { type: "string", minLength: 8 },
                },
              },
            },
          },
        },
        responses: {
          "200": { description: "Admin account created", content: { "application/json": { schema: { type: "object", properties: { ok: { type: "boolean" } } } } } },
          "400": { description: "Validation error or passwords mismatch" },
          "403": { description: "Setup already complete or email mismatch" },
          "503": { description: "ADMIN_SETUP_EMAIL not configured" },
        },
      },
    },
    "/api/auth/reset-password": {
      post: {
        tags: ["Auth"],
        summary: "Emergency password reset",
        description: "Resets admin password without knowing the current one. Requires `ADMIN_SETUP_EMAIL` match.",
        operationId: "resetPassword",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["adminEmail", "newPassword", "confirmPassword"],
                properties: {
                  adminEmail: { type: "string", format: "email" },
                  newPassword: { type: "string", minLength: 8 },
                  confirmPassword: { type: "string", minLength: 8 },
                },
              },
            },
          },
        },
        responses: {
          "200": { description: "Password reset successfully", content: { "application/json": { schema: { type: "object", properties: { ok: { type: "boolean" } } } } } },
          "400": { description: "Validation error or passwords mismatch" },
          "403": { description: "Email does not match ADMIN_SETUP_EMAIL" },
          "404": { description: "No admin account found — use /setup first" },
        },
      },
    },

    // ── Leads ───────────────────────────────────────────────────────
    "/api/leads": {
      get: {
        tags: ["Leads"],
        summary: "List leads 🔒",
        operationId: "listLeads",
        security: [{ cookieAuth: [] }],
        parameters: [
          { name: "status", in: "query", schema: { type: "string", enum: ["new", "contacted", "in_progress", "qualified", "disqualified", "closed"] } },
          { name: "requestType", in: "query", schema: { type: "string" } },
          { name: "page", in: "query", schema: { type: "integer", default: 1 } },
          { name: "limit", in: "query", schema: { type: "integer", default: 20 } },
        ],
        responses: {
          "200": {
            description: "Paginated lead list",
            content: { "application/json": { schema: { type: "object", properties: { leads: { type: "array", items: { $ref: "#/components/schemas/Lead" } }, total: { type: "integer" } } } } },
          },
          "400": { description: "Invalid query params", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          "401": { description: "Authentication required", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
        },
      },
      post: {
        tags: ["Leads"],
        summary: "Submit a lead (public)",
        description: "Public endpoint — no auth required. Sends admin notification email.",
        operationId: "createLead",
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/CreateLeadBody" } } } },
        responses: {
          "201": { description: "Lead created", content: { "application/json": { schema: { $ref: "#/components/schemas/Lead" } } } },
          "400": { description: "Validation error", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
        },
      },
    },
    "/api/leads/{id}": {
      get: {
        tags: ["Leads"],
        summary: "Get lead by ID 🔒",
        operationId: "getLead",
        security: [{ cookieAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": { description: "Lead", content: { "application/json": { schema: { $ref: "#/components/schemas/Lead" } } } },
          "400": { description: "Invalid id", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          "401": { description: "Authentication required", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          "404": { description: "Not found", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
        },
      },
      patch: {
        tags: ["Leads"],
        summary: "Update lead status / notes 🔒",
        operationId: "updateLead",
        security: [{ cookieAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/UpdateLeadBody" } } } },
        responses: {
          "200": { description: "Updated lead", content: { "application/json": { schema: { $ref: "#/components/schemas/Lead" } } } },
          "404": { description: "Not found", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
        },
      },
    },

    // ── Projects ────────────────────────────────────────────────────
    "/api/projects": {
      get: {
        tags: ["Projects"],
        summary: "List projects (public)",
        operationId: "listProjects",
        parameters: [
          { name: "sector", in: "query", schema: { type: "string" } },
          { name: "status", in: "query", schema: { type: "string", enum: ["seeking_funding", "partially_funded", "funded", "closed"] } },
          { name: "country", in: "query", schema: { type: "string" } },
          { name: "search", in: "query", schema: { type: "string" } },
        ],
        responses: {
          "200": { description: "Project list", content: { "application/json": { schema: { type: "object", properties: { projects: { type: "array", items: { $ref: "#/components/schemas/Project" } }, total: { type: "integer" } } } } } },
        },
      },
      post: {
        tags: ["Projects"],
        summary: "Create project 🔒",
        operationId: "createProject",
        security: [{ cookieAuth: [] }],
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/CreateProjectBody" } } } },
        responses: {
          "201": { description: "Created project", content: { "application/json": { schema: { $ref: "#/components/schemas/Project" } } } },
          "400": { description: "Validation error", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
        },
      },
    },
    "/api/projects/{id}": {
      get: {
        tags: ["Projects"],
        summary: "Get project by ID (public)",
        operationId: "getProject",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": { description: "Project", content: { "application/json": { schema: { $ref: "#/components/schemas/Project" } } } },
          "404": { description: "Not found", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
        },
      },
      patch: {
        tags: ["Projects"],
        summary: "Update project 🔒",
        operationId: "updateProject",
        security: [{ cookieAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/CreateProjectBody" } } } },
        responses: {
          "200": { description: "Updated project", content: { "application/json": { schema: { $ref: "#/components/schemas/Project" } } } },
          "404": { description: "Not found", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
        },
      },
      delete: {
        tags: ["Projects"],
        summary: "Delete project 🔒",
        operationId: "deleteProject",
        security: [{ cookieAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "204": { description: "Deleted" },
          "404": { description: "Not found", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
        },
      },
    },

    // ── Project Interests ────────────────────────────────────────────
    "/api/projects/{id}/interests": {
      get: {
        tags: ["Project Interests"],
        summary: "List interests for a project 🔒",
        operationId: "listProjectInterests",
        security: [{ cookieAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": { description: "Interests list", content: { "application/json": { schema: { type: "object", properties: { interests: { type: "array", items: { $ref: "#/components/schemas/ProjectInterest" } }, total: { type: "integer" } } } } } },
        },
      },
      post: {
        tags: ["Project Interests"],
        summary: "Express interest in a project (public)",
        description: "Public endpoint — no auth. Increments project interest count and sends email.",
        operationId: "expressInterest",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/ExpressInterestBody" } } } },
        responses: {
          "201": { description: "Interest recorded", content: { "application/json": { schema: { $ref: "#/components/schemas/ProjectInterest" } } } },
          "400": { description: "Validation error", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
        },
      },
    },

    // ── Documents ────────────────────────────────────────────────────
    "/api/documents": {
      get: {
        tags: ["Documents"],
        summary: "List documents 🔒",
        operationId: "listDocuments",
        security: [{ cookieAuth: [] }],
        parameters: [
          { name: "visibility", in: "query", schema: { type: "string", enum: ["public", "private"] } },
          { name: "page", in: "query", schema: { type: "integer", default: 1 } },
          { name: "limit", in: "query", schema: { type: "integer", default: 20 } },
        ],
        responses: {
          "200": { description: "Document list", content: { "application/json": { schema: { type: "object", properties: { documents: { type: "array", items: { $ref: "#/components/schemas/Document" } }, total: { type: "integer" } } } } } },
          "401": { description: "Authentication required", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
        },
      },
      post: {
        tags: ["Documents"],
        summary: "Create document 🔒",
        operationId: "createDocument",
        security: [{ cookieAuth: [] }],
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/CreateDocumentBody" } } } },
        responses: {
          "201": { description: "Created document", content: { "application/json": { schema: { $ref: "#/components/schemas/Document" } } } },
        },
      },
    },
    "/api/documents/{id}": {
      patch: {
        tags: ["Documents"],
        summary: "Update document 🔒",
        operationId: "updateDocument",
        security: [{ cookieAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/CreateDocumentBody" } } } },
        responses: {
          "200": { description: "Updated document", content: { "application/json": { schema: { $ref: "#/components/schemas/Document" } } } },
          "404": { description: "Not found", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
        },
      },
      delete: {
        tags: ["Documents"],
        summary: "Delete document 🔒",
        operationId: "deleteDocument",
        security: [{ cookieAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "204": { description: "Deleted" },
        },
      },
    },

    // ── Services ────────────────────────────────────────────────────
    "/api/services": {
      get: {
        tags: ["Services"],
        summary: "List services (public)",
        operationId: "listServices",
        responses: {
          "200": { description: "Services list", content: { "application/json": { schema: { type: "object", properties: { services: { type: "array", items: { $ref: "#/components/schemas/Service" } } } } } } },
        },
      },
      post: {
        tags: ["Services"],
        summary: "Create service 🔒",
        operationId: "createService",
        security: [{ cookieAuth: [] }],
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/CreateServiceBody" } } } },
        responses: {
          "201": { description: "Created service", content: { "application/json": { schema: { $ref: "#/components/schemas/Service" } } } },
        },
      },
    },
    "/api/services/{id}": {
      patch: {
        tags: ["Services"],
        summary: "Update service 🔒",
        operationId: "updateService",
        security: [{ cookieAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/CreateServiceBody" } } } },
        responses: {
          "200": { description: "Updated service", content: { "application/json": { schema: { $ref: "#/components/schemas/Service" } } } },
          "404": { description: "Not found", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
        },
      },
      delete: {
        tags: ["Services"],
        summary: "Delete service 🔒",
        operationId: "deleteService",
        security: [{ cookieAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { "204": { description: "Deleted" } },
      },
    },

    // ── Testimonials ─────────────────────────────────────────────────
    "/api/testimonials": {
      get: {
        tags: ["Testimonials"],
        summary: "List testimonials (public)",
        operationId: "listTestimonials",
        responses: {
          "200": { description: "Testimonials", content: { "application/json": { schema: { type: "object", properties: { testimonials: { type: "array", items: { $ref: "#/components/schemas/Testimonial" } } } } } } },
        },
      },
      post: {
        tags: ["Testimonials"],
        summary: "Create testimonial 🔒",
        operationId: "createTestimonial",
        security: [{ cookieAuth: [] }],
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/CreateTestimonialBody" } } } },
        responses: {
          "201": { description: "Created testimonial", content: { "application/json": { schema: { $ref: "#/components/schemas/Testimonial" } } } },
        },
      },
    },
    "/api/testimonials/{id}": {
      patch: {
        tags: ["Testimonials"],
        summary: "Update testimonial 🔒",
        operationId: "updateTestimonial",
        security: [{ cookieAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/CreateTestimonialBody" } } } },
        responses: {
          "200": { description: "Updated testimonial", content: { "application/json": { schema: { $ref: "#/components/schemas/Testimonial" } } } },
          "404": { description: "Not found", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
        },
      },
      delete: {
        tags: ["Testimonials"],
        summary: "Delete testimonial 🔒",
        operationId: "deleteTestimonial",
        security: [{ cookieAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { "204": { description: "Deleted" } },
      },
    },

    // ── Content Stats ────────────────────────────────────────────────
    "/api/content/stats": {
      get: {
        tags: ["Content"],
        summary: "Get homepage stats (public)",
        operationId: "getContentStats",
        responses: {
          "200": { description: "Stats", content: { "application/json": { schema: { type: "object", properties: { stats: { type: "array", items: { $ref: "#/components/schemas/ContentStat" } } } } } } },
        },
      },
      post: {
        tags: ["Content"],
        summary: "Create content stat 🔒",
        operationId: "createContentStat",
        security: [{ cookieAuth: [] }],
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/CreateContentStatBody" } } } },
        responses: {
          "201": { description: "Created stat", content: { "application/json": { schema: { $ref: "#/components/schemas/ContentStat" } } } },
        },
      },
    },
    "/api/content/stats/{id}": {
      patch: {
        tags: ["Content"],
        summary: "Update content stat 🔒",
        operationId: "updateContentStat",
        security: [{ cookieAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/CreateContentStatBody" } } } },
        responses: {
          "200": { description: "Updated stat", content: { "application/json": { schema: { $ref: "#/components/schemas/ContentStat" } } } },
          "404": { description: "Not found", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
        },
      },
      delete: {
        tags: ["Content"],
        summary: "Delete content stat 🔒",
        operationId: "deleteContentStat",
        security: [{ cookieAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { "204": { description: "Deleted" } },
      },
    },

    // ── Methodology Steps ────────────────────────────────────────────
    "/api/content/methodology": {
      get: {
        tags: ["Content"],
        summary: "Get methodology steps (public)",
        operationId: "getMethodologySteps",
        responses: {
          "200": { description: "Steps", content: { "application/json": { schema: { type: "object", properties: { steps: { type: "array", items: { $ref: "#/components/schemas/MethodologyStep" } } } } } } },
        },
      },
      post: {
        tags: ["Content"],
        summary: "Create methodology step 🔒",
        operationId: "createMethodologyStep",
        security: [{ cookieAuth: [] }],
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/CreateMethodologyStepBody" } } } },
        responses: {
          "201": { description: "Created step", content: { "application/json": { schema: { $ref: "#/components/schemas/MethodologyStep" } } } },
        },
      },
    },
    "/api/content/methodology/{id}": {
      patch: {
        tags: ["Content"],
        summary: "Update methodology step 🔒",
        operationId: "updateMethodologyStep",
        security: [{ cookieAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/CreateMethodologyStepBody" } } } },
        responses: {
          "200": { description: "Updated step", content: { "application/json": { schema: { $ref: "#/components/schemas/MethodologyStep" } } } },
          "404": { description: "Not found", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
        },
      },
      delete: {
        tags: ["Content"],
        summary: "Delete methodology step 🔒",
        operationId: "deleteMethodologyStep",
        security: [{ cookieAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { "204": { description: "Deleted" } },
      },
    },

    // ── Site Settings ────────────────────────────────────────────────
    "/api/content/settings/{key}": {
      get: {
        tags: ["Content"],
        summary: "Get site setting by key (public)",
        description: "Available keys: `notifications`, `navigation`, `branding`, `hero`, `services_page`, `government_page`, `submit_page`, `footer`, `about`, `seo_home`, `seo_about`, `seo_services`, `seo_projects`",
        operationId: "getSiteSetting",
        parameters: [{ name: "key", in: "path", required: true, schema: { type: "string" }, example: "branding" }],
        responses: {
          "200": { description: "Site setting", content: { "application/json": { schema: { $ref: "#/components/schemas/SiteSetting" } } } },
        },
      },
      patch: {
        tags: ["Content"],
        summary: "Update site setting 🔒",
        operationId: "updateSiteSetting",
        security: [{ cookieAuth: [] }],
        parameters: [{ name: "key", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["value"],
                properties: {
                  value: { type: "string", description: "JSON-serialised string of the setting object", example: "{\"adminEmail\":\"admin@zaforaholding.com\"}" },
                },
              },
            },
          },
        },
        responses: {
          "200": { description: "Updated setting", content: { "application/json": { schema: { $ref: "#/components/schemas/SiteSetting" } } } },
        },
      },
    },

    // ── Stats ────────────────────────────────────────────────────────
    "/api/stats": {
      get: {
        tags: ["Stats"],
        summary: "Dashboard overview stats 🔒",
        operationId: "getDashboardStats",
        security: [{ cookieAuth: [] }],
        responses: {
          "200": { description: "Aggregate stats", content: { "application/json": { schema: { $ref: "#/components/schemas/DashboardStats" } } } },
        },
      },
    },
    "/api/stats/projects": {
      get: {
        tags: ["Stats"],
        summary: "Project breakdown stats 🔒",
        operationId: "getProjectStats",
        security: [{ cookieAuth: [] }],
        responses: {
          "200": {
            description: "Project stats by sector and status",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    bySector: { type: "array", items: { type: "object", properties: { sector: { type: "string" }, count: { type: "integer" } } } },
                    byStatus: { type: "array", items: { type: "object", properties: { status: { type: "string" }, count: { type: "integer" } } } },
                  },
                },
              },
            },
          },
        },
      },
    },

    // ── FAQs ─────────────────────────────────────────────────────────
    "/api/content/faqs": {
      get: {
        tags: ["Content"],
        summary: "List FAQs (public)",
        operationId: "listFaqs",
        responses: {
          "200": { description: "FAQ list", content: { "application/json": { schema: { type: "object", properties: { faqs: { type: "array", items: { $ref: "#/components/schemas/Faq" } } } } } } },
        },
      },
      post: {
        tags: ["Content"],
        summary: "Create FAQ 🔒",
        operationId: "createFaq",
        security: [{ cookieAuth: [] }],
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/CreateFaqBody" } } } },
        responses: {
          "201": { description: "FAQ created", content: { "application/json": { schema: { $ref: "#/components/schemas/Faq" } } } },
          "400": { description: "Validation error" },
          "401": { description: "Authentication required" },
        },
      },
    },
    "/api/content/faqs/{id}": {
      patch: {
        tags: ["Content"],
        summary: "Update FAQ 🔒",
        operationId: "updateFaq",
        security: [{ cookieAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/UpdateFaqBody" } } } },
        responses: {
          "200": { description: "Updated FAQ", content: { "application/json": { schema: { $ref: "#/components/schemas/Faq" } } } },
          "404": { description: "Not found" },
        },
      },
      delete: {
        tags: ["Content"],
        summary: "Delete FAQ 🔒",
        operationId: "deleteFaq",
        security: [{ cookieAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "204": { description: "Deleted" },
          "404": { description: "Not found" },
        },
      },
    },

    // ── Audit ────────────────────────────────────────────────────────
    "/api/audit": {
      get: {
        tags: ["Audit"],
        summary: "List audit logs 🔒",
        operationId: "listAuditLogs",
        security: [{ cookieAuth: [] }],
        parameters: [{ name: "limit", in: "query", schema: { type: "integer", default: 50, maximum: 200 } }],
        responses: {
          "200": { description: "Audit logs", content: { "application/json": { schema: { type: "object", properties: { logs: { type: "array", items: { $ref: "#/components/schemas/AuditLog" } } } } } } },
        },
      },
      delete: {
        tags: ["Audit"],
        summary: "Clear all audit logs 🔒",
        operationId: "clearAuditLogs",
        security: [{ cookieAuth: [] }],
        responses: { "204": { description: "Cleared" } },
      },
    },

    // ── Notifications ────────────────────────────────────────────────
    "/api/notifications/status": {
      get: {
        tags: ["Notifications"],
        summary: "Check email configuration 🔒",
        operationId: "emailStatus",
        security: [{ cookieAuth: [] }],
        responses: {
          "200": { description: "Email status", content: { "application/json": { schema: { type: "object", properties: { configured: { type: "boolean" } } } } } },
          "401": { description: "Authentication required", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
        },
      },
    },
    "/api/notifications/test": {
      post: {
        tags: ["Notifications"],
        summary: "Send test email 🔒",
        operationId: "sendTestEmail",
        security: [{ cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email"],
                properties: { email: { type: "string", format: "email", example: "you@example.com" } },
              },
            },
          },
        },
        responses: {
          "200": { description: "Email sent", content: { "application/json": { schema: { type: "object", properties: { ok: { type: "boolean" } } } } } },
          "400": { description: "Missing email", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          "401": { description: "Authentication required", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          "500": { description: "Email send failed", content: { "application/json": { schema: { type: "object", properties: { ok: { type: "boolean" }, error: { type: "string" } } } } } },
        },
      },
    },

    // ── Storage (AWS S3 presigned upload) ────────────────────────────
    "/api/storage/presign": {
      post: {
        tags: ["Storage"],
        summary: "Request S3 presigned upload URL 🔒",
        description: "Returns a presigned PUT URL for direct-to-S3 upload. The client uploads the file directly to `uploadUrl`; the resulting object is accessible at `publicUrl`. No file bytes pass through Express.",
        operationId: "presignUpload",
        security: [{ cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["fileName", "contentType", "size"],
                properties: {
                  fileName: { type: "string", example: "logo.png" },
                  contentType: {
                    type: "string",
                    enum: ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml", "application/pdf"],
                    example: "image/png",
                  },
                  size: {
                    type: "integer",
                    description: "File size in bytes (max 10 MB)",
                    example: 204800,
                    maximum: 10485760,
                  },
                  folder: {
                    type: "string",
                    description: "S3 key prefix folder (lowercase alphanumeric with dashes)",
                    default: "uploads",
                    example: "projects",
                  },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Presigned upload details",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    uploadUrl: { type: "string", description: "Presigned S3 PUT URL (valid 60 min)" },
                    publicUrl: { type: "string", description: "Final public URL of the uploaded object" },
                    key: { type: "string", description: "S3 object key" },
                  },
                },
              },
            },
          },
          "400": { description: "Validation error", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          "401": { description: "Authentication required", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          "500": { description: "Failed to generate presigned URL", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
        },
      },
    },
  },
};

export default spec;
