import { eq, asc } from "drizzle-orm";
import { db, servicesTable } from "@/db/index.js";
import { logAction } from "@/modules/audit/index.js";
import type { CreateServiceBodyType, UpdateServiceBodyType } from "./services.validator.js";

export async function listServices() {
  return db.select().from(servicesTable).orderBy(asc(servicesTable.displayOrder));
}

export async function getServiceById(id: number) {
  const [service] = await db.select().from(servicesTable).where(eq(servicesTable.id, id)).limit(1);
  return service ?? null;
}

export async function createService(data: CreateServiceBodyType) {
  const [service] = await db.insert(servicesTable).values({
    name: data.name,
    icon: data.icon,
    description: data.description,
    bullets: data.bullets,
    imageUrl: data.imageUrl ?? null,
    category: data.category ?? null,
    displayOrder: data.displayOrder,
    visible: data.visible,
  }).returning();

  logAction("create", "Services", `Service created: "${data.name}"`, { serviceId: service!.id }).catch(() => {});
  return service!;
}

export async function updateService(id: number, data: UpdateServiceBodyType) {
  const updates: Record<string, unknown> = {};
  if (data.name !== undefined) updates["name"] = data.name;
  if (data.icon !== undefined) updates["icon"] = data.icon;
  if (data.description !== undefined) updates["description"] = data.description;
  if (data.bullets !== undefined) updates["bullets"] = data.bullets;
  if (data.imageUrl !== undefined) updates["imageUrl"] = data.imageUrl;
  if (data.category !== undefined) updates["category"] = data.category;
  if (data.displayOrder !== undefined) updates["displayOrder"] = data.displayOrder;
  if (data.visible !== undefined) updates["visible"] = data.visible;

  const [service] = await db.update(servicesTable).set(updates).where(eq(servicesTable.id, id)).returning();
  if (!service) return null;

  logAction("update", "Services", `Service updated: "${service.name}"`, { serviceId: id }).catch(() => {});
  return service;
}

export async function deleteService(id: number) {
  const [service] = await db.select({ name: servicesTable.name }).from(servicesTable).where(eq(servicesTable.id, id));
  await db.delete(servicesTable).where(eq(servicesTable.id, id));
  logAction("delete", "Services", `Service deleted: "${service?.name ?? `#${id}`}"`, { serviceId: id }).catch(() => {});
}
