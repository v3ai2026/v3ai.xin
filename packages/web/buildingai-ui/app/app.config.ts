import { defu } from "defu";

import { appConfigPresets } from "./app.config.presets";

export default defineAppConfig(defu({}, appConfigPresets));
