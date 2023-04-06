import "dotenv/config";
import sharding from "./sharding";

sharding.spawn({ timeout: 60_000 });
