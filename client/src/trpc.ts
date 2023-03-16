import { createTRPCReact } from "@trpc/react-query";
import type { RouterType } from "../../server/router";

export const trpc = createTRPCReact<RouterType>();
