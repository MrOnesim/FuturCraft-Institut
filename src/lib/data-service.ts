import { db } from "@/db";
import {
  formations,
  promotions,
  students,
  paymentSchedules,
  payments,
  receipts,
  notifications,
  studentProjects,
  companyOffers,
  events,
  blogArticles,
  contactMessages,
  newsletterSubscribers,
} from "@/db/schema";
import { ensureDatabaseSeeded } from "@/db/ensure-seed";
import { eq, desc, sql } from "drizzle-orm";
import { slugify } from "@/lib/site";

export async function getFormations() {
  await ensureDatabaseSeeded();
  return await db.select().from(formations).orderBy(desc(formations.isPopular));
}

export async function getFormationBySlug(slug: string) {
  await ensureDatabaseSeeded();
  const rows = await db.select().from(formations).where(eq(formations.slug, slug));
  return rows[0] || null;
}

export async function getPromotions(formationId?: number) {
  await ensureDatabaseSeeded();
  if (formationId) {
    return await db.select().from(promotions).where(eq(promotions.formationId, formationId));
  }
  return await db.select().from(promotions);
}

export async function getAllStudents() {
  await ensureDatabaseSeeded();
  return await db.select().from(students).orderBy(desc(students.createdAt));
}

export async function getStudentById(id: number) {
  await ensureDatabaseSeeded();
  const studentRows = await db.select().from(students).where(eq(students.id, id));
  if (!studentRows.length) return null;
  const student = studentRows[0];

  const formationRows = await db.select().from(formations).where(eq(formations.id, student.formationId));
  const promotionRows = student.promotionId
    ? await db.select().from(promotions).where(eq(promotions.id, student.promotionId))
    : [];
  const schedules = await db
    .select()
    .from(paymentSchedules)
    .where(eq(paymentSchedules.studentId, student.id));
  const studentPayments = await db
    .select()
    .from(payments)
    .where(eq(payments.studentId, student.id))
    .orderBy(desc(payments.createdAt));
  const studentReceipts = await db
    .select()
    .from(receipts)
    .where(eq(receipts.studentId, student.id))
    .orderBy(desc(receipts.createdAt));
  const studentNotifs = await db
    .select()
    .from(notifications)
    .where(eq(notifications.studentId, student.id))
    .orderBy(desc(notifications.createdAt));

  return {
    student,
    formation: formationRows[0] || null,
    promotion: promotionRows[0] || null,
    schedules,
    payments: studentPayments,
    receipts: studentReceipts,
    notifications: studentNotifs,
  };
}

export async function getStudentByNumber(studentNumber: string) {
  await ensureDatabaseSeeded();
  const rows = await db.select().from(students).where(eq(students.studentNumber, studentNumber));
  if (!rows.length) return null;
  return await getStudentById(rows[0].id);
}

export async function createStudentWithPlan(data: {
  firstName: string;
  lastName: string;
  gender: string;
  email: string;
  phone: string;
  whatsapp?: string;
  city?: string;
  formationId: number;
  promotionId?: number;
  previousDiploma?: string;
  studyLevel?: string;
  previousSchool?: string;
  guardianName?: string;
  guardianPhone?: string;
  guardianRelation?: string;
  residenceCountry?: string;
}) {
  await ensureDatabaseSeeded();

  const [formation] = await db.select().from(formations).where(eq(formations.id, data.formationId));
  if (!formation) throw new Error("Formation introuvable");

  const countStudents = await db.select().from(students);
  const nextNum = String(countStudents.length + 101).padStart(4, "0");
  const studentNumber = `FC-2025-${nextNum}`;

  const total = formation.price;

  const [newStudent] = await db
    .insert(students)
    .values({
      studentNumber,
      firstName: data.firstName,
      lastName: data.lastName,
      gender: data.gender || "M",
      email: data.email,
      phone: data.phone,
      whatsapp: data.whatsapp || data.phone,
      city: data.city || "Cotonou",
      formationId: data.formationId,
      promotionId: data.promotionId || null,
      previousDiploma: data.previousDiploma || "BAC",
      studyLevel: data.studyLevel || "BAC",
      previousSchool: data.previousSchool || "",
      guardianName: data.guardianName || "",
      guardianPhone: data.guardianPhone || "",
      guardianRelation: data.guardianRelation || "",
      residenceCountry: data.residenceCountry || "Bénin",
      status: "preinscrit",
      totalAmount: total,
      paidAmount: 0,
      remainingAmount: total,
    })
    .returning();

  // Create default payment schedule: Inscription fee + 4 installments
  const regFee = formation.registrationFee || 25000;
  const remainingTuition = total - regFee;
  const installmentsCount = formation.installmentsCount || 4;
  const installmentAmount = Math.round(remainingTuition / installmentsCount);

  // Inscription
  await db.insert(paymentSchedules).values({
    studentId: newStudent.id,
    title: "Frais d'inscription & validation de dossier",
    amount: regFee,
    dueDate: "À régler sous 7 jours",
    status: "en_attente",
  });

  // Installments
  for (let i = 1; i <= installmentsCount; i++) {
    const isLast = i === installmentsCount;
    const amount = isLast
      ? remainingTuition - installmentAmount * (installmentsCount - 1)
      : installmentAmount;
    await db.insert(paymentSchedules).values({
      studentId: newStudent.id,
      title: `Mensualité ${i} — Formation ${formation.title.slice(0, 20)}...`,
      amount,
      dueDate: `Mois ${i} de formation`,
      status: "en_attente",
    });
  }

  // Welcome notification
  await db.insert(notifications).values({
    studentId: newStudent.id,
    title: "Bienvenue à FuturCraft Institut !",
    message: `Votre préinscription sous le numéro ${studentNumber} a été enregistrée avec succès. Vous pouvez finaliser vos frais d'inscription depuis votre espace.`,
    type: "admission",
  });

  return newStudent;
}

export async function recordPayment(data: {
  studentId: number;
  scheduleId?: number;
  amount: number;
  paymentMethod: string;
  recordedBy?: string;
  notes?: string;
}) {
  await ensureDatabaseSeeded();

  const [student] = await db.select().from(students).where(eq(students.id, data.studentId));
  if (!student) throw new Error("Étudiant introuvable");

  const countPayments = await db.select().from(payments);
  const recIndex = String(countPayments.length + 1430).padStart(5, "0");
  const receiptNumber = `REC-2025-${recIndex}`;
  const verificationCode = `FC-SEC-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${Date.now().toString().slice(-4)}`;
  const trxRef = `TRX-${data.paymentMethod.slice(0, 3).toUpperCase()}-${Date.now().toString().slice(-6)}`;
  const nowStr = new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date());

  const [paymentRecord] = await db
    .insert(payments)
    .values({
      receiptNumber,
      studentId: data.studentId,
      scheduleId: data.scheduleId || null,
      amount: data.amount,
      paymentMethod: data.paymentMethod,
      transactionRef: trxRef,
      status: "valide",
      notes: data.notes || `Paiement pour ${student.firstName} ${student.lastName}`,
      recordedBy: data.recordedBy || "Portail en ligne (MTN/Moov)",
      paidAt: nowStr,
    })
    .returning();

  // If schedule is linked, update it
  if (data.scheduleId) {
    await db
      .update(paymentSchedules)
      .set({
        status: "paye",
        paidAt: nowStr,
        transactionRef: trxRef,
      })
      .where(eq(paymentSchedules.id, data.scheduleId));
  }

  // Create receipt
  const [receiptRecord] = await db
    .insert(receipts)
    .values({
      receiptNumber,
      paymentId: paymentRecord.id,
      studentId: student.id,
      verificationCode,
      qrData: `https://futurcraft.bj/recu/${receiptNumber}?code=${verificationCode}&matricule=${student.studentNumber}`,
      issuedAt: nowStr,
    })
    .returning();

  // Update student amounts and status if needed
  const newPaid = student.paidAmount + data.amount;
  const newRemaining = Math.max(0, student.totalAmount - newPaid);
  const newStatus = student.status === "preinscrit" ? "actif" : student.status;

  await db
    .update(students)
    .set({
      paidAmount: newPaid,
      remainingAmount: newRemaining,
      status: newStatus,
    })
    .where(eq(students.id, student.id));

  // Add notification
  await db.insert(notifications).values({
    studentId: student.id,
    title: "Nouveau reçu de paiement généré",
    message: `Votre versement de ${data.amount.toLocaleString("fr-FR")} FCFA a été validé. Reçu N° ${receiptNumber} disponible.`,
    type: "payment",
  });

  return {
    payment: paymentRecord,
    receipt: receiptRecord,
  };
}

export async function getReceiptDetails(receiptNumber: string) {
  await ensureDatabaseSeeded();
  const receiptRows = await db.select().from(receipts).where(eq(receipts.receiptNumber, receiptNumber));
  if (!receiptRows.length) return null;
  const receipt = receiptRows[0];

  const [payment] = await db.select().from(payments).where(eq(payments.id, receipt.paymentId));
  const [student] = await db.select().from(students).where(eq(students.id, receipt.studentId));
  const [formation] = student
    ? await db.select().from(formations).where(eq(formations.id, student.formationId))
    : [null];

  return {
    receipt,
    payment,
    student,
    formation,
  };
}

export async function getAdminStats() {
  await ensureDatabaseSeeded();
  const allStudents = await db.select().from(students);
  const allPayments = await db.select().from(payments);
  const allFormations = await db.select().from(formations);

  const totalStudents = allStudents.length;
  const activeStudents = allStudents.filter((s) => s.status === "actif").length;
  const newInscriptions = allStudents.filter((s) => s.status === "preinscrit" || s.status === "en_attente").length;

  const totalExpectedAmount = allStudents.reduce((acc, s) => acc + s.totalAmount, 0);
  const totalCollectedAmount = allStudents.reduce((acc, s) => acc + s.paidAmount, 0);
  const totalRemainingAmount = allStudents.reduce((acc, s) => acc + s.remainingAmount, 0);

  const recoveryRate = totalExpectedAmount > 0 ? Math.round((totalCollectedAmount / totalExpectedAmount) * 100) : 0;

  return {
    totalStudents,
    activeStudents,
    newInscriptions,
    totalExpectedAmount,
    totalCollectedAmount,
    totalRemainingAmount,
    recoveryRate,
    formationsCount: allFormations.length,
    recentPayments: allPayments.slice(0, 10),
  };
}

export async function getProjects() {
  await ensureDatabaseSeeded();
  return await db.select().from(studentProjects).orderBy(desc(studentProjects.isFeatured));
}

export type EventRecord = typeof events.$inferSelect & { slug: string };

/** Les événements n'ont pas de colonne slug : il est dérivé du titre, de façon stable. */
function withEventSlug(ev: typeof events.$inferSelect): EventRecord {
  return { ...ev, slug: slugify(ev.title) };
}

export async function getEvents(): Promise<EventRecord[]> {
  await ensureDatabaseSeeded();
  const rows = await db.select().from(events);
  return rows.map(withEventSlug);
}

export async function getEventBySlug(slug: string): Promise<EventRecord | null> {
  const all = await getEvents();
  return all.find((ev) => ev.slug === slug) || null;
}

export async function getBlogArticles() {
  await ensureDatabaseSeeded();
  return await db.select().from(blogArticles).orderBy(desc(blogArticles.id));
}

export async function getBlogArticleBySlug(slug: string) {
  await ensureDatabaseSeeded();
  const rows = await db.select().from(blogArticles).where(eq(blogArticles.slug, slug));
  return rows[0] || null;
}

/* ------------------------------------------------------------------ */
/* Demandes entrantes (contact, événements) et newsletter               */
/* ------------------------------------------------------------------ */

export async function saveContactMessage(data: {
  name: string;
  email?: string | null;
  phone: string;
  subject: string;
  context?: string | null;
  message: string;
  source?: string | null;
}) {
  await ensureDatabaseSeeded();
  const [row] = await db
    .insert(contactMessages)
    .values({
      name: data.name,
      email: data.email || null,
      phone: data.phone,
      subject: data.subject,
      context: data.context || null,
      message: data.message,
      source: data.source || null,
    })
    .returning();
  return row;
}

export async function getContactMessages() {
  await ensureDatabaseSeeded();
  return await db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt));
}

export async function setContactMessageStatus(id: number, status: "nouveau" | "traite") {
  const [row] = await db.update(contactMessages).set({ status }).where(eq(contactMessages.id, id)).returning();
  return row || null;
}

/** Inscrit une adresse (idempotent) ; réactive un abonné désinscrit. */
export async function subscribeNewsletter(email: string, source?: string | null) {
  await ensureDatabaseSeeded();
  const normalized = email.trim().toLowerCase();
  const [row] = await db
    .insert(newsletterSubscribers)
    .values({ email: normalized, source: source || null })
    .onConflictDoUpdate({
      target: newsletterSubscribers.email,
      set: { unsubscribedAt: null, source: sql`coalesce(${newsletterSubscribers.source}, ${source || null})` },
    })
    .returning();
  return row;
}

export async function getNewsletterSubscribers() {
  await ensureDatabaseSeeded();
  return await db.select().from(newsletterSubscribers).orderBy(desc(newsletterSubscribers.createdAt));
}

export async function getCompanyOffers() {
  await ensureDatabaseSeeded();
  return await db.select().from(companyOffers).orderBy(desc(companyOffers.createdAt));
}
