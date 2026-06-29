import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, savedTripsTable } from "@workspace/db";
import { getStationById, ALL_STATIONS } from "../data/stations";

const router: IRouter = Router();

function planRoute(originId: string, destId: string) {
  const origin = getStationById(originId);
  const dest = getStationById(destId);

  if (!origin || !dest) return null;

  const steps = [];
  let totalDuration = 0;
  let totalStops = 0;

  if (origin.lineId === dest.lineId) {
    // Same line — direct
    const stops = Math.abs(dest.order - origin.order);
    const duration = stops * 2 + 3;
    steps.push({
      lineId: origin.lineId,
      lineName: origin.lineName,
      lineColor: origin.lineColor,
      lineNumber: origin.lineNumber,
      boardAt: origin.name,
      alightAt: dest.name,
      stops,
      duration,
    });
    totalStops = stops;
    totalDuration = duration;
  } else {
    // Different lines — find an interchange station
    const interchangeStation = ALL_STATIONS.find(
      (s) =>
        s.isInterchange &&
        s.lineId === origin.lineId &&
        s.interchangeLines.includes(dest.lineId)
    ) ?? ALL_STATIONS.find(
      (s) =>
        s.isInterchange &&
        s.lineId === dest.lineId &&
        s.interchangeLines.includes(origin.lineId)
    ) ?? ALL_STATIONS.find((s) => s.isInterchange && s.lineId === origin.lineId);

    if (interchangeStation) {
      const stopsToInterchange = Math.abs(interchangeStation.order - origin.order);
      const durationToInterchange = stopsToInterchange * 2 + 3;
      steps.push({
        lineId: origin.lineId,
        lineName: origin.lineName,
        lineColor: origin.lineColor,
        lineNumber: origin.lineNumber,
        boardAt: origin.name,
        alightAt: interchangeStation.name,
        stops: stopsToInterchange,
        duration: durationToInterchange,
      });

      const destLineStation = ALL_STATIONS.find(
        (s) => s.isInterchange && s.lineId === dest.lineId && s.name === interchangeStation.name
      ) ?? ALL_STATIONS.find((s) => s.lineId === dest.lineId && s.isInterchange);

      if (destLineStation) {
        const stopsFromInterchange = Math.abs(dest.order - destLineStation.order);
        const durationFromInterchange = stopsFromInterchange * 2 + 3;
        steps.push({
          lineId: dest.lineId,
          lineName: dest.lineName,
          lineColor: dest.lineColor,
          lineNumber: dest.lineNumber,
          boardAt: destLineStation.name,
          alightAt: dest.name,
          stops: stopsFromInterchange,
          duration: durationFromInterchange,
        });
        totalStops = stopsToInterchange + stopsFromInterchange;
        totalDuration = durationToInterchange + durationFromInterchange + 3;
      }
    } else {
      // Fallback: direct estimate
      const stops = 8;
      const duration = 22;
      steps.push({
        lineId: origin.lineId,
        lineName: origin.lineName,
        lineColor: origin.lineColor,
        lineNumber: origin.lineNumber,
        boardAt: origin.name,
        alightAt: dest.name,
        stops,
        duration,
      });
      totalStops = stops;
      totalDuration = duration;
    }
  }

  const crowdLevels: Array<"low" | "moderate" | "high"> = ["low", "moderate", "high"];
  const crowdLevel = crowdLevels[Math.floor(Math.random() * crowdLevels.length)];
  const baseFare = 4;
  const fare = Math.min(baseFare + totalStops * 0.5, 20);

  return {
    origin,
    destination: dest,
    totalDuration,
    totalStops,
    fare: Math.round(fare * 2) / 2,
    steps,
    crowdLevel,
    note: "Travel times are simulated estimates. Actual times may vary.",
  };
}

router.post("/trips/plan", async (req, res): Promise<void> => {
  const { originId, destinationId } = req.body ?? {};

  if (!originId || !destinationId) {
    res.status(400).json({ error: "originId and destinationId are required" });
    return;
  }

  if (originId === destinationId) {
    res.status(400).json({ error: "Origin and destination must be different stations" });
    return;
  }

  const plan = planRoute(originId, destinationId);
  if (!plan) {
    res.status(400).json({ error: "Could not find a route between the selected stations" });
    return;
  }

  res.json(plan);
});

router.get("/trips/saved", async (req, res): Promise<void> => {
  const userIdHeader = req.headers["x-user-id"];
  const userId = Array.isArray(userIdHeader) ? userIdHeader[0] : userIdHeader;

  if (!userId) {
    res.json([]);
    return;
  }

  const uid = parseInt(userId, 10);
  if (isNaN(uid)) {
    res.json([]);
    return;
  }

  const trips = await db
    .select()
    .from(savedTripsTable)
    .where(eq(savedTripsTable.userId, uid))
    .orderBy(savedTripsTable.savedAt);

  res.json(
    trips.map((t) => ({
      id: String(t.id),
      originId: t.originId,
      destinationId: t.destinationId,
      originName: t.originName,
      destinationName: t.destinationName,
      savedAt: t.savedAt.toISOString(),
      userId: String(t.userId),
    }))
  );
});

router.post("/trips/saved", async (req, res): Promise<void> => {
  const userIdHeader = req.headers["x-user-id"];
  const userId = Array.isArray(userIdHeader) ? userIdHeader[0] : userIdHeader;

  if (!userId) {
    res.status(401).json({ error: "Authentication required" });
    return;
  }

  const uid = parseInt(userId, 10);
  if (isNaN(uid)) {
    res.status(401).json({ error: "Invalid user" });
    return;
  }

  const { originId, destinationId, originName, destinationName } = req.body ?? {};

  if (!originId || !destinationId || !originName || !destinationName) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  const [trip] = await db
    .insert(savedTripsTable)
    .values({ userId: uid, originId, destinationId, originName, destinationName })
    .returning();

  res.status(201).json({
    id: String(trip.id),
    originId: trip.originId,
    destinationId: trip.destinationId,
    originName: trip.originName,
    destinationName: trip.destinationName,
    savedAt: trip.savedAt.toISOString(),
    userId: String(trip.userId),
  });
});

router.delete("/trips/saved/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);

  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid trip ID" });
    return;
  }

  await db.delete(savedTripsTable).where(eq(savedTripsTable.id, id));
  res.sendStatus(204);
});

router.get("/trips/network-summary", async (_req, res): Promise<void> => {
  const crowdLevels: Array<"low" | "moderate" | "high"> = ["low", "moderate", "high"];
  res.json({
    totalLines: 6,
    totalStations: 85,
    totalInterchanges: 4,
    activeTrains: Math.floor(Math.random() * 20) + 40,
    averageCrowdLevel: crowdLevels[Math.floor(Math.random() * crowdLevels.length)],
    operationalStatus: "All lines operational",
  });
});

export default router;
