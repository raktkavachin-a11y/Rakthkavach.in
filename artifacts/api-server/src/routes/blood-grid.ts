import { Router, type IRouter } from "express";
import { and, count, desc, eq, ilike, type SQL } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import { db } from "@workspace/db";
import {
  auditLogsTable,
  bloodRequestsTable,
  bloodUnitsTable,
  donorsTable,
  donationHistoryTable,
  emergenciesTable,
  facilitiesTable,
} from "@workspace/db";
import {
  CreateBloodRequestBody,
  CreateBloodUnitBody,
  CreateDonorBody,
  CreateEmergencyBody,
  CreateBloodRequestResponse,
  CreateBloodUnitResponse,
  CreateDonorResponse,
  CreateEmergencyResponse,
  GetAiGuardianResponse,
  GetAuditLogsQueryParams,
  GetAuditLogsResponse,
  GetBloodUnitTimelineQueryParams,
  GetBloodUnitTimelineResponse,
  GetDashboardSummaryQueryParams,
  GetDashboardSummaryResponse,
  GetDonorHistoryParams,
  GetDonorHistoryResponse,
  GetDonorParams,
  GetDonorResponse,
  GetEmergencyTrendsQueryParams,
  GetEmergencyTrendsResponse,
  GetIntegrationStatusResponse,
  ListBloodRequestsQueryParams,
  ListBloodRequestsResponse,
  ListBloodUnitsQueryParams,
  ListBloodUnitsResponse,
  ListDonorsQueryParams,
  ListDonorsResponse,
  ListEmergenciesQueryParams,
  ListEmergenciesResponse,
  ListFacilitiesQueryParams,
  ListFacilitiesResponse,
  UpdateBloodRequestStatusBody,
  UpdateBloodRequestStatusParams,
  UpdateBloodRequestStatusResponse,
  UpdateBloodUnitBody,
  UpdateBloodUnitParams,
  UpdateBloodUnitResponse,
  UpdateDonorBody,
  UpdateDonorParams,
  UpdateDonorResponse,
  UpdateEmergencyStatusBody,
  UpdateEmergencyStatusParams,
  UpdateEmergencyStatusResponse,
  VerifyQrPassParams,
  VerifyQrPassResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();
const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as const;

function queryInput(query: unknown): Record<string, unknown> {
  if (!query || typeof query !== "object") return {};
  return query as Record<string, unknown>;
}

function pathInput(params: Record<string, unknown>): Record<string, unknown> {
  return params;
}

async function writeAudit(
  action: string,
  resourceType: string,
  resourceId: string,
  actorType = "authority",
): Promise<void> {
  await db.insert(auditLogsTable).values({
    action,
    actorType,
    resourceType,
    resourceId,
    metadata: {},
  });
}

router.get("/dashboard/summary", async (req, res): Promise<void> => {
  const parsed = GetDashboardSummaryQueryParams.safeParse(queryInput(req.query));
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [availableUnits, openRequests, activeEmergencies, donorCount, facilityCount, recentActivity] =
    await Promise.all([
      db.select({ value: count() }).from(bloodUnitsTable).where(eq(bloodUnitsTable.status, "available")),
      db.select({ value: count() }).from(bloodRequestsTable).where(eq(bloodRequestsTable.status, "open")),
      db.select({ value: count() }).from(emergenciesTable).where(eq(emergenciesTable.status, "active")),
      db.select({ value: count() }).from(donorsTable),
      db.select({ value: count() }).from(facilitiesTable),
      db.select().from(auditLogsTable).orderBy(desc(auditLogsTable.occurredAt)).limit(8),
    ]);
  const bloodGroupCounts = await Promise.all(
    bloodGroups.map(async (bloodGroup) => {
      const [units, requests] = await Promise.all([
        db.select({ value: count() }).from(bloodUnitsTable).where(
          and(eq(bloodUnitsTable.bloodGroup, bloodGroup), eq(bloodUnitsTable.status, "available")),
        ),
        db.select({ value: count() }).from(bloodRequestsTable).where(
          and(eq(bloodRequestsTable.bloodGroup, bloodGroup), eq(bloodRequestsTable.status, "open")),
        ),
      ]);
      return {
        bloodGroup,
        availableUnits: Number(units[0]?.value ?? 0),
        openRequests: Number(requests[0]?.value ?? 0),
      };
    }),
  );

  const data = {
    role: parsed.data.role ?? "authority",
    metrics: {
      availableUnits: Number(availableUnits[0]?.value ?? 0),
      openRequests: Number(openRequests[0]?.value ?? 0),
      activeEmergencies: Number(activeEmergencies[0]?.value ?? 0),
      registeredDonors: Number(donorCount[0]?.value ?? 0),
      networkFacilities: Number(facilityCount[0]?.value ?? 0),
    },
    bloodGroupCounts,
    recentActivity,
  };
  res.json(GetDashboardSummaryResponse.parse(data));
});

router.get("/donors", async (req, res): Promise<void> => {
  const parsed = ListDonorsQueryParams.safeParse(queryInput(req.query));
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const filters: SQL[] = [];
  if (parsed.data.bloodGroup) filters.push(eq(donorsTable.bloodGroup, parsed.data.bloodGroup));
  if (parsed.data.city) filters.push(ilike(donorsTable.city, parsed.data.city));
  if (parsed.data.eligible === true) filters.push(eq(donorsTable.eligibilityStatus, "eligible"));
  if (parsed.data.search) filters.push(ilike(donorsTable.fullName, `%${parsed.data.search}%`));
  const rows = await db.select().from(donorsTable).where(filters.length ? and(...filters) : undefined).orderBy(desc(donorsTable.createdAt)).limit(parsed.data.limit ?? 50);
  res.json(ListDonorsResponse.parse({ items: rows, total: rows.length }));
});

router.post("/donors", async (req, res): Promise<void> => {
  const parsed = CreateDonorBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [donor] = await db.insert(donorsTable).values({
    donorCode: `RKT-${randomUUID().slice(0, 8).toUpperCase()}`,
    fullName: parsed.data.fullName,
    bloodGroup: parsed.data.bloodGroup,
    city: parsed.data.city,
    phoneLast4: parsed.data.phoneLast4,
    eligibilityStatus: "unknown",
    bloodCredits: 0,
    verified: false,
  }).returning();
  await writeAudit("donor_registered", "donor", donor.id, "donor");
  res.status(201).json(CreateDonorResponse.parse(donor));
});

router.get("/donors/:donorId", async (req, res): Promise<void> => {
  const parsed = GetDonorParams.safeParse(pathInput(req.params));
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [donor] = await db.select().from(donorsTable).where(eq(donorsTable.id, parsed.data.donorId));
  if (!donor) {
    res.status(404).json({ error: "Donor not found" });
    return;
  }
  res.json(GetDonorResponse.parse(donor));
});

router.patch("/donors/:donorId", async (req, res): Promise<void> => {
  const params = UpdateDonorParams.safeParse(pathInput(req.params));
  const body = UpdateDonorBody.safeParse(req.body);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }
  const [donor] = await db.update(donorsTable).set(body.data).where(eq(donorsTable.id, params.data.donorId)).returning();
  if (!donor) {
    res.status(404).json({ error: "Donor not found" });
    return;
  }
  await writeAudit("donor_updated", "donor", donor.id, "donor");
  res.json(UpdateDonorResponse.parse(donor));
});

router.get("/donors/:donorId/history", async (req, res): Promise<void> => {
  const parsed = GetDonorHistoryParams.safeParse(pathInput(req.params));
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const rows = await db.select().from(donationHistoryTable).where(eq(donationHistoryTable.donorId, parsed.data.donorId)).orderBy(desc(donationHistoryTable.donatedAt));
  res.json(GetDonorHistoryResponse.parse({ items: rows, total: rows.length }));
});

router.get("/inventory", async (req, res): Promise<void> => {
  const parsed = ListBloodUnitsQueryParams.safeParse(queryInput(req.query));
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const filters: SQL[] = [];
  if (parsed.data.bloodGroup) filters.push(eq(bloodUnitsTable.bloodGroup, parsed.data.bloodGroup));
  if (parsed.data.status) filters.push(eq(bloodUnitsTable.status, parsed.data.status));
  if (parsed.data.facilityId) filters.push(eq(bloodUnitsTable.facilityId, parsed.data.facilityId));
  const rows = await db.select({ unit: bloodUnitsTable, facilityName: facilitiesTable.name }).from(bloodUnitsTable).leftJoin(facilitiesTable, eq(bloodUnitsTable.facilityId, facilitiesTable.id)).where(filters.length ? and(...filters) : undefined).orderBy(desc(bloodUnitsTable.createdAt)).limit(parsed.data.limit ?? 100);
  res.json(ListBloodUnitsResponse.parse({ items: rows.map(({ unit, facilityName }) => ({ ...unit, facilityName })), total: rows.length }));
});

router.post("/inventory", async (req, res): Promise<void> => {
  const parsed = CreateBloodUnitBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [unit] = await db.insert(bloodUnitsTable).values({
    ...parsed.data,
    collectedAt: new Date(parsed.data.collectedAt),
    expiresAt: new Date(parsed.data.expiresAt),
    verified: false,
  }).returning();
  await writeAudit("blood_unit_added", "blood_unit", unit.id, "blood-bank");
  res.status(201).json(CreateBloodUnitResponse.parse({ ...unit, facilityName: null }));
});

router.patch("/inventory/:unitId", async (req, res): Promise<void> => {
  const params = UpdateBloodUnitParams.safeParse(pathInput(req.params));
  const body = UpdateBloodUnitBody.safeParse(req.body);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }
  const [unit] = await db.update(bloodUnitsTable).set(body.data).where(eq(bloodUnitsTable.id, params.data.unitId)).returning();
  if (!unit) {
    res.status(404).json({ error: "Blood unit not found" });
    return;
  }
  await writeAudit("blood_unit_updated", "blood_unit", unit.id, "blood-bank");
  res.json(UpdateBloodUnitResponse.parse({ ...unit, facilityName: null }));
});

router.get("/inventory/timeline", async (req, res): Promise<void> => {
  const parsed = GetBloodUnitTimelineQueryParams.safeParse(queryInput(req.query));
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const filters: SQL[] = [];
  if (parsed.data.facilityId) filters.push(eq(bloodUnitsTable.facilityId, parsed.data.facilityId));
  const rows = await db.select({ id: bloodUnitsTable.id, unitCode: bloodUnitsTable.unitCode, status: bloodUnitsTable.status, createdAt: bloodUnitsTable.createdAt, facilityName: facilitiesTable.name }).from(bloodUnitsTable).leftJoin(facilitiesTable, eq(bloodUnitsTable.facilityId, facilitiesTable.id)).where(filters.length ? and(...filters) : undefined).orderBy(desc(bloodUnitsTable.createdAt)).limit(parsed.data.limit ?? 50);
  res.json(GetBloodUnitTimelineResponse.parse({ items: rows.map((row) => ({ id: row.id, eventType: row.status, unitCode: row.unitCode, facilityName: row.facilityName, occurredAt: row.createdAt, detail: null })) }));
});

router.get("/blood-requests", async (req, res): Promise<void> => {
  const parsed = ListBloodRequestsQueryParams.safeParse(queryInput(req.query));
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const filters: SQL[] = [];
  if (parsed.data.bloodGroup) filters.push(eq(bloodRequestsTable.bloodGroup, parsed.data.bloodGroup));
  if (parsed.data.status) filters.push(eq(bloodRequestsTable.status, parsed.data.status));
  if (parsed.data.facilityId) filters.push(eq(bloodRequestsTable.facilityId, parsed.data.facilityId));
  const rows = await db.select({ request: bloodRequestsTable, facilityName: facilitiesTable.name }).from(bloodRequestsTable).leftJoin(facilitiesTable, eq(bloodRequestsTable.facilityId, facilitiesTable.id)).where(filters.length ? and(...filters) : undefined).orderBy(desc(bloodRequestsTable.createdAt));
  res.json(ListBloodRequestsResponse.parse({ items: rows.map(({ request, facilityName }) => ({ ...request, facilityName })), total: rows.length }));
});

router.post("/blood-requests", async (req, res): Promise<void> => {
  const parsed = CreateBloodRequestBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [request] = await db.insert(bloodRequestsTable).values({
    requestCode: `REQ-${randomUUID().slice(0, 8).toUpperCase()}`,
    ...parsed.data,
    neededBy: parsed.data.neededBy ? new Date(parsed.data.neededBy) : null,
    status: "open",
  }).returning();
  await writeAudit("blood_request_created", "blood_request", request.id, "hospital");
  res.status(201).json(CreateBloodRequestResponse.parse({ ...request, facilityName: null }));
});

router.patch("/blood-requests/:requestId/status", async (req, res): Promise<void> => {
  const params = UpdateBloodRequestStatusParams.safeParse(pathInput(req.params));
  const body = UpdateBloodRequestStatusBody.safeParse(req.body);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }
  const [request] = await db.update(bloodRequestsTable).set({ status: body.data.status, updatedAt: new Date() }).where(eq(bloodRequestsTable.id, params.data.requestId)).returning();
  if (!request) {
    res.status(404).json({ error: "Blood request not found" });
    return;
  }
  await writeAudit("blood_request_status_updated", "blood_request", request.id, "hospital");
  res.json(UpdateBloodRequestStatusResponse.parse({ ...request, facilityName: null }));
});

router.get("/emergencies", async (req, res): Promise<void> => {
  const parsed = ListEmergenciesQueryParams.safeParse(queryInput(req.query));
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const rows = await db.select().from(emergenciesTable).where(parsed.data.status ? eq(emergenciesTable.status, parsed.data.status) : undefined).orderBy(desc(emergenciesTable.createdAt));
  res.json(ListEmergenciesResponse.parse({ items: rows, total: rows.length }));
});

router.post("/emergencies", async (req, res): Promise<void> => {
  const parsed = CreateEmergencyBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [emergency] = await db.insert(emergenciesTable).values({
    caseCode: `SOS-${randomUUID().slice(0, 8).toUpperCase()}`,
    ...parsed.data,
    status: "active",
  }).returning();
  await writeAudit("sos_created", "emergency", emergency.id, "hospital");
  res.status(201).json(CreateEmergencyResponse.parse(emergency));
});

router.patch("/emergencies/:emergencyId/status", async (req, res): Promise<void> => {
  const params = UpdateEmergencyStatusParams.safeParse(pathInput(req.params));
  const body = UpdateEmergencyStatusBody.safeParse(req.body);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }
  const [emergency] = await db.update(emergenciesTable).set({ status: body.data.status, responseEtaMinutes: body.data.responseEtaMinutes, updatedAt: new Date() }).where(eq(emergenciesTable.id, params.data.emergencyId)).returning();
  if (!emergency) {
    res.status(404).json({ error: "Emergency not found" });
    return;
  }
  await writeAudit("sos_status_updated", "emergency", emergency.id, "authority");
  res.json(UpdateEmergencyStatusResponse.parse(emergency));
});

router.get("/emergencies/trends", async (req, res): Promise<void> => {
  const parsed = GetEmergencyTrendsQueryParams.safeParse(queryInput(req.query));
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  res.json(GetEmergencyTrendsResponse.parse({ period: parsed.data.period ?? "7d", points: [] }));
});

router.get("/facilities", async (req, res): Promise<void> => {
  const parsed = ListFacilitiesQueryParams.safeParse(queryInput(req.query));
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const filters: SQL[] = [];
  if (parsed.data.type) filters.push(eq(facilitiesTable.type, parsed.data.type));
  if (parsed.data.city) filters.push(ilike(facilitiesTable.city, parsed.data.city));
  const facilities = await db.select().from(facilitiesTable).where(filters.length ? and(...filters) : undefined).orderBy(facilitiesTable.name);
  const units = await db.select({ facilityId: bloodUnitsTable.facilityId }).from(bloodUnitsTable).where(eq(bloodUnitsTable.status, "available"));
  const counts = units.reduce<Record<string, number>>((acc, unit) => {
    acc[unit.facilityId] = (acc[unit.facilityId] ?? 0) + 1;
    return acc;
  }, {});
  res.json(ListFacilitiesResponse.parse({ items: facilities.map((facility) => ({ ...facility, liveUnits: counts[facility.id] ?? 0, lastSyncedAt: null })), total: facilities.length }));
});

router.get("/verification/qr/:token", async (req, res): Promise<void> => {
  const parsed = VerifyQrPassParams.safeParse(pathInput(req.params));
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [unit] = await db.select().from(bloodUnitsTable).where(eq(bloodUnitsTable.qrToken, parsed.data.token));
  if (unit) {
    res.json(VerifyQrPassResponse.parse({ valid: unit.verified, verificationType: "blood-unit", referenceId: unit.id, displayLabel: unit.unitCode, status: unit.status, verifiedAt: new Date(), reason: unit.verified ? null : "Unit is awaiting verification" }));
    return;
  }
  const [donor] = await db.select().from(donorsTable).where(eq(donorsTable.donorCode, parsed.data.token));
  if (donor) {
    res.json(VerifyQrPassResponse.parse({ valid: donor.verified, verificationType: "donor", referenceId: donor.id, displayLabel: donor.donorCode, status: donor.eligibilityStatus, verifiedAt: new Date(), reason: donor.verified ? null : "Donor identity is awaiting verification" }));
    return;
  }
  res.status(404).json({ error: "QR pass not found" });
});

router.get("/intelligence/guardian", async (_req, res): Promise<void> => {
  const [emergencies, requests] = await Promise.all([
    db.select({ value: count() }).from(emergenciesTable).where(eq(emergenciesTable.status, "active")),
    db.select({ value: count() }).from(bloodRequestsTable).where(eq(bloodRequestsTable.status, "open")),
  ]);
  const activeEmergencies = Number(emergencies[0]?.value ?? 0);
  const openRequests = Number(requests[0]?.value ?? 0);
  const signals = [];
  if (activeEmergencies > 0) {
    signals.push({ id: "active-emergencies", title: "Active SOS cases require attention", severity: "urgent", description: `${activeEmergencies} emergency case${activeEmergencies === 1 ? "" : "s"} currently active in the grid.`, source: "Emergency response feed", createdAt: new Date() });
  }
  if (openRequests > 0) {
    signals.push({ id: "open-requests", title: "Open blood requests are waiting", severity: "watch", description: `${openRequests} open request${openRequests === 1 ? "" : "s"} need a facility or donor match.`, source: "Blood request registry", createdAt: new Date() });
  }
  res.json(GetAiGuardianResponse.parse({ status: signals.some((signal) => signal.severity === "urgent") ? "attention" : signals.length ? "monitoring" : "clear", signals, generatedAt: new Date() }));
});

router.get("/audit-logs", async (req, res): Promise<void> => {
  const parsed = GetAuditLogsQueryParams.safeParse(queryInput(req.query));
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const rows = await db.select().from(auditLogsTable).orderBy(desc(auditLogsTable.occurredAt)).limit(parsed.data.limit ?? 50);
  res.json(GetAuditLogsResponse.parse({ items: rows, total: rows.length }));
});

router.get("/integrations/status", async (_req, res): Promise<void> => {
  const items = [
    { key: "abdm", name: "ABDM health identity", status: process.env.ABDM_BASE_URL ? "configured" : "planned", detail: process.env.ABDM_BASE_URL ? "Endpoint configured" : "Connector boundary is ready for onboarding", lastSyncedAt: null },
    { key: "eraktkosh", name: "e-RaktKosh exchange", status: process.env.ERAKTKOSH_BASE_URL ? "configured" : "planned", detail: process.env.ERAKTKOSH_BASE_URL ? "Endpoint configured" : "Connector boundary is ready for onboarding", lastSyncedAt: null },
    { key: "sms", name: "Emergency notifications", status: process.env.SMS_PROVIDER ? "configured" : "unavailable", detail: process.env.SMS_PROVIDER ? "Provider configured" : "Add a notification provider before enabling outbound alerts", lastSyncedAt: null },
  ];
  res.json(GetIntegrationStatusResponse.parse({ items }));
});

export default router;