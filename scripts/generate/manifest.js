#!/usr/bin/env node
import fs from "node:fs";

import { manifest } from "../../source/manifest.js";

fs.writeFileSync("./dist/manifest.json", JSON.stringify(manifest, null, 2));
