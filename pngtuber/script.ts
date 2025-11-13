import { OBS } from "../lib/connection-utils";
import { EventSubscription } from "obs-websocket-js";

interface InputLevelEntry {
  inputLevelsMul: number[];
  inputName: string;
  inputUuid: string;
}


    const main = document.querySelector("main");
async function run() {
  const obs = await OBS({ eventSubscriptions: EventSubscription.InputVolumeMeters });

  obs.on("InputVolumeMeters", (meters) => {
    // Generated type is stupid, we like good types in this house >:(
    const inputs = meters.inputs as unknown as InputLevelEntry[];

    const mic = inputs.find(i => i.inputUuid === "15a705f2-adb2-4249-9a72-e9032b31591d");
    if (!mic) {
      return;
    }

    main.innerHTML = "<pre>"+JSON.stringify(mic, null, 2)+"</pre>";
  });
}

run();
