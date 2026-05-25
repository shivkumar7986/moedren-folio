import Link from "next/link";
import Image from "next/image";
import { db, projects, type Project } from "@portfolio/db";
import { eq, asc } from "drizzle-orm";
import Navbar from "../../components/layout/Navbar";

// Activates Incremental Static Regeneration (re-compiles hourly)
export const revalidate = 3600;

export default async function Work() {
  // Query all published projects directly from Postgres at compile/ISR time
  let activeProjects: Project[] = [];
  try {
    activeProjects = await db
      .select()
      .from(projects)
      .where(eq(projects.published, true))
      .orderBy(asc(projects.order));
  } catch (error) {
    console.error("❌ Failed to fetch projects on server component render:", error);
  }

  const projectCount = activeProjects.length;

  return (
    <>
      <Navbar />

      <main className="flex-1 min-h-screen bg-bg text-fg px-6 pt-32 pb-24">
        <div className="max-w-7xl mx-auto w-full">
          {/* Editorial Section Header */}
          <div className="flex flex-col md:flex-row md:items-baseline justify-between border-b border-border-custom pb-8 mb-12">
            <h1 className="font-serif text-5xl md:text-7xl font-bold tracking-tight select-none">
              Selected Work
            </h1>
            <span className="font-mono text-xs tracking-widest text-accent uppercase mt-2 md:mt-0">
              [ Total Projects — 0{projectCount} ]
            </span>
          </div>

          {/* Masonry/Editorial Projects Grid */}
          {projectCount === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center border border-dashed border-border-custom rounded-lg bg-border-custom/5">
              <span className="font-serif text-lg text-muted-foreground mb-4">
                No published works available yet.
              </span>
              <p className="text-xs text-muted-foreground max-w-sm leading-relaxed">
                Connect your database and run `pnpm db:seed` to load realistic sample records.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
              {activeProjects.map((project, idx) => {
                // Alternates row spans for an asymmetrical, highly aesthetic editorial grid
                const isEven = idx % 2 === 0;

                return (
                  <div
                    key={project.id}
                    className={`flex flex-col group ${
                      isEven ? "md:translate-y-8" : "md:-translate-y-4"
                    }`}
                  >
                    {/* Project Navigation Wrapper */}
                    <Link href={`/work/${project.slug}`} className="relative block overflow-hidden rounded-md bg-border-custom/40 border border-border-custom/50 aspect-[4/3] md:aspect-[3/2] cursor-pointer">
                      {/* Image element with premium transition styles */}
                      {project.coverImage ? (
                        <Image
                          src={project.coverImage}
                          alt={project.title}
                          fill
                          sizes="(max-w-768px) 100vw, 50vw"
                          priority={idx < 2}
                          className="object-cover transition-all duration-700 ease-out filter grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-100 group-hover:scale-[1.03]"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-border-custom/10 text-muted-foreground font-mono text-xs">
                          NO_MEDIA_FOUND
                        </div>
                      )}

                      {/* Dark overlay that fades on hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-bg/60 via-transparent to-transparent opacity-80 group-hover:opacity-30 transition-opacity duration-500" />
                    </Link>

                    {/* Metadata & Typography Labels */}
                    <div className="mt-6 flex items-start justify-between">
                      <div className="flex flex-col gap-1">
                        <Link href={`/work/${project.slug}`}>
                          <h2 className="font-serif text-2xl font-bold hover:text-accent transition-colors duration-300">
                            {project.title}
                          </h2>
                        </Link>
                        {/* Tags display */}
                        <div className="flex flex-wrap gap-2 mt-1">
                          {project.tags.map((tag: string) => (
                            <span
                              key={tag}
                              className="font-mono text-[9px] tracking-wider text-muted-foreground uppercase border border-border-custom/80 px-2 py-0.5 rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Client & Date Tag */}
                      <div className="flex flex-col items-end text-right font-mono text-xs">
                        <span className="text-fg font-medium">
                          {project.client || "Self-Initiated"}
                        </span>
                        <span className="text-muted-foreground text-[10px] mt-1">
                          © {project.year}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
