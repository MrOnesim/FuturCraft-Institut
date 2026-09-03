import { eq, like } from "drizzle-orm";
import { db } from "./index";
import { blogArticles, events, formations, studentProjects, students, users } from "./schema";
import {
  AVATAR_PLACEHOLDER,
  articleImages,
  eventImages,
  formationImage,
  projectImages,
  studentAvatar,
} from "./media";

const REMOTE_PREFIX = "https://images.pexels.com/%";

/**
 * Remplace, sur une base déjà peuplée, les visuels qui pointent encore vers
 * la banque d'images externe par les visuels auto-hébergés de `media.ts`.
 *
 * Idempotent et prudent : seules les lignes dont l'URL commence par le
 * préfixe distant sont modifiées ; une image déjà locale ou personnalisée
 * en base n'est jamais écrasée. Retourne le nombre de lignes mises à jour.
 */
export async function syncSeedMedia(): Promise<number> {
  let updated = 0;

  const remoteFormations = await db
    .select({ id: formations.id, slug: formations.slug })
    .from(formations)
    .where(like(formations.imageUrl, REMOTE_PREFIX));
  for (const f of remoteFormations) {
    await db.update(formations).set({ imageUrl: formationImage(f.slug) }).where(eq(formations.id, f.id));
    updated++;
  }

  const remoteProjects = await db
    .select({ id: studentProjects.id, slug: studentProjects.slug })
    .from(studentProjects)
    .where(like(studentProjects.coverImage, REMOTE_PREFIX));
  for (const p of remoteProjects) {
    const cover = projectImages[p.slug];
    if (!cover) continue;
    await db.update(studentProjects).set({ coverImage: cover }).where(eq(studentProjects.id, p.id));
    updated++;
  }

  const remoteEvents = await db
    .select({ id: events.id, title: events.title })
    .from(events)
    .where(like(events.imageUrl, REMOTE_PREFIX));
  for (const e of remoteEvents) {
    const image = eventImages[e.title];
    if (!image) continue;
    await db.update(events).set({ imageUrl: image }).where(eq(events.id, e.id));
    updated++;
  }

  const remoteArticles = await db
    .select({ id: blogArticles.id, slug: blogArticles.slug })
    .from(blogArticles)
    .where(like(blogArticles.coverImage, REMOTE_PREFIX));
  for (const a of remoteArticles) {
    const cover = articleImages[a.slug];
    if (!cover) continue;
    await db.update(blogArticles).set({ coverImage: cover }).where(eq(blogArticles.id, a.id));
    updated++;
  }

  const remoteStudents = await db
    .select({ id: students.id, studentNumber: students.studentNumber })
    .from(students)
    .where(like(students.avatarUrl, REMOTE_PREFIX));
  for (const s of remoteStudents) {
    await db.update(students).set({ avatarUrl: studentAvatar(s.studentNumber) }).where(eq(students.id, s.id));
    updated++;
  }

  const remoteUsers = await db
    .select({ id: users.id })
    .from(users)
    .where(like(users.avatarUrl, REMOTE_PREFIX));
  for (const u of remoteUsers) {
    await db.update(users).set({ avatarUrl: AVATAR_PLACEHOLDER }).where(eq(users.id, u.id));
    updated++;
  }

  return updated;
}
