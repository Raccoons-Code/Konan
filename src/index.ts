import "dotenv/config";
import "source-map-support/register";
import sharding from "./sharding";

sharding.spawn();
