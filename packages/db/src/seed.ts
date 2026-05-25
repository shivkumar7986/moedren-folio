import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as dotenv from "dotenv";
import { projects, posts, settings } from "./schema";

// Load environment variables
dotenv.config();

const connectionString = process.env.DATABASE_URL || "postgresql://postgres:password@localhost:5432/portfolio";

console.log("🌱 Connecting to database for seeding...");
const client = postgres(connectionString, { max: 1 });
const db = drizzle(client);

async function main() {
  try {
    console.log("🧹 Cleaning existing data...");
    await db.delete(projects);
    await db.delete(posts);
    await db.delete(settings);

    console.log("📦 Seeding projects...");
    await db.insert(projects).values([
      {
        slug: "new-standard",
        title: "The New Standard",
        client: "Metropolis Inc.",
        year: 2026,
        tags: ["Branding", "Creative Direction", "Web3"],
        summary: "A complete digital transformation and brand revitalization for Metropolis Inc.",
        description: `### The Challenge

Metropolis came to us with a legacy digital footprint that failed to capture their forward-thinking vision. They needed more than a coat of paint; they needed an digital overhaul that asserted their market dominance.

### The Strategy

Inspired by editorial layouts, we designed a typography-first identity. We replaced their traditional stock photos with dark cinematic image loops and strict brutalist layout grids.

### The Technology

The platform leverages Next.js 15 ISR for instantaneous load times and Framer Motion for high-fidelity interactive storytelling.`,
        coverImage: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8",
        coverVideo: "",
        images: [
          { url: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8", caption: "Metropolis Homepage Layout", order: 1 },
          { url: "https://images.unsplash.com/photo-1522542550221-31fd19575a2d", caption: "Identity Guidelines & Typography Specs", order: 2 }
        ],
        featured: true,
        published: true,
        order: 1,
        seoTitle: "Metropolis Inc. Brand Transformation | Case Study",
        seoDesc: "Discover how we redesigned Metropolis's brand from the ground up, establishing a digital standard using Next.js 15."
      },
      {
        slug: "cinematic-landscapes",
        title: "Cinematic Landscapes",
        client: "Vanguard Films",
        year: 2025,
        tags: ["Video Production", "Sound Design", "WebGL"],
        summary: "An immersive interactive web catalog showcasing award-winning short films.",
        description: `### The Vision

To translate cinematic experiences into an interactive digital playground. Vanguard Films wanted their audience to feel the texture, sound, and mood of their movies before pressing play.

### Execution

We built an audio-reactive WebGL tunnel using Three.js, embedded seamlessly within a Next.js App Router frame. Visitors navigate through physical coordinates corresponding to the filming locations of each short film.

### Design Tone

Ultra-dark interface, high contrast typography, and interactive audio elements using Web Audio API to deliver true sensory engagement.`,
        coverImage: "https://images.unsplash.com/photo-1536440136628-849c177e76a1",
        coverVideo: "",
        images: [
          { url: "https://images.unsplash.com/photo-1536440136628-849c177e76a1", caption: "WebGL Interactive Sphere", order: 1 }
        ],
        featured: true,
        published: true,
        order: 2,
        seoTitle: "Vanguard Films Interactive Portfolio | WebGL Case Study",
        seoDesc: "Explore our sensory web experience featuring audio-reactive WebGL navigation built for Vanguard Films."
      },
      {
        slug: "aesthetic-brutalism",
        title: "Aesthetic Brutalism",
        client: "Arch Studio",
        year: 2025,
        tags: ["UI Design", "Tailwind v4", "Next"],
        summary: "An architectural portfolio celebrating minimalist brutalism and clean structural layouts.",
        description: `### Concrete & Code

An architectural studio portfolio that celebrates physical materials—concrete, glass, raw metal—by translating their structural principles directly into Web Layouts.

### Architecture

We utilized Tailwind CSS v4's strict configuration to enforce a mathematical, grid-based typography scale. There are zero non-standard colors or padding values.

### Result

An incredibly clean, bold, fast portfolio that allows high-resolution architectural photography to speak for itself.`,
        coverImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
        coverVideo: "",
        images: [
          { url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c", caption: "Brutalist Grid Detail", order: 1 }
        ],
        featured: false,
        published: true,
        order: 3,
        seoTitle: "Arch Studio Portfolio Redesign | Brutalist UI",
        seoDesc: "Minimalist concrete grids meet code. A study in architectural web layouts built with Tailwind CSS v4."
      }
    ]);

    console.log("📝 Seeding blog posts...");
    await db.insert(posts).values([
      {
        slug: "tailwind-v4-production",
        title: "The Rise of Tailwind CSS v4 in Production",
        excerpt: "An in-depth look at the performance, design improvements, and compiler upgrades in Tailwind CSS v4.",
        content: `Tailwind CSS v4 is a massive step forward for the modern web. In this article, we look at the new compiler architecture, dynamic HSL colors, and custom theme layouts.

### 1. The Lightning CSS Compiler

Tailwind v4 features a brand new Rust-powered compiler that builds up to 10x faster than v3. It integrates Lightning CSS directly, automating nesting, autoprefixing, and custom rule bundling without separate configs.

### 2. Custom Properties by Default

Tailwind v4 moves away from full JS configurations, adopting CSS variables (\`--color-*\`) inside standard stylesheet setups. This makes it insanely easy to swap themes at runtime without re-compiling.

\`\`\`css
@theme {
  --color-accent: #e8e020;
}
\`\`\`

### 3. Native Fluid Typography

Enforcing modular visual scales has never been easier. We discuss how to leverage custom spacing multipliers to build truly fluid editorial designs.`,
        coverImage: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8",
        tags: ["CSS", "Frontend", "Tailwind"],
        published: true,
        publishedAt: new Date(),
        seoTitle: "Tailwind CSS v4 In Production: Best Practices & Tips",
        seoDesc: "A masterclass in modern styling: why you should adopt Tailwind CSS v4 and how it transforms build times."
      },
      {
        slug: "agent-native-codebases",
        title: "Why Agent-Native Codebases are the Future",
        excerpt: "How skills.sh and clear conventions help AI and human developers collaborate seamlessly on complex software.",
        content: `Codebases are no longer read only by human developers. In 2026, AI coding agents are our primary pair-programmers. By structuring code for LLM digestibility, we enable unprecedented velocity.

### The AI-Developer Shift

Traditionally, codebases are documented for humans using complex onboarding guides and wiki pages. In the agent-first world, we use skills—like \`skills.sh\` definitions—to instruct models instantly on project conventions.

### Benefits of Clean Contracts

By maintaining strict tRPC procedure definitions, strict Drizzle models, and avoiding ad-hoc styling files, we ensure that both human programmers and AI models have a clear, predictable contract to build on.`,
        coverImage: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5",
        tags: ["AI", "Developer Experience", "Skills.sh"],
        published: true,
        publishedAt: new Date(),
        seoTitle: "The Agent-Native Future of Software Development",
        seoDesc: "How setting clear boundaries, using skills.sh, and maintaining rigorous ORM schemas creates perfect conditions for AI pair programming."
      }
    ]);

    console.log("⚙️ Seeding settings...");
    await db.insert(settings).values([
      {
        key: "siteName",
        value: { value: "Moedren Portfolio" }
      },
      {
        key: "adminEmail",
        value: { value: "admin@example.com" }
      }
    ]);

    console.log("✅ Database seeded successfully!");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
