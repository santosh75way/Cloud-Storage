import prisma from "../common/lib/prisma";
import { SharingService } from "./sharing.service";

export const sharingService = new SharingService(prisma);