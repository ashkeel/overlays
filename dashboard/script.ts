import { initNebulaStream } from "./nebula";
import { initTwitch } from "./twitch";

async function run() {
	initTwitch();
	initNebulaStream();
}

run();
