//-----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.  All rights reserved.
// Licensed under the MIT License. See License file under the project root for license information.
//-----------------------------------------------------------------------------
import { app, Menu } from "electron";
import * as uuidv5 from "uuid/v5";

import { env, Platform } from "./utilities/env";
import resolve, { local } from "./utilities/resolve";
import { ModuleManager } from "./module-manager/module-manager";

// Initialize main module manager.
global["sfxModuleManager"] = new ModuleManager(app.getVersion());

app.setName("Service Fabric Explorer");

(async () => {
    let startingUp: boolean = true;

    // Load built-in modules.
    await sfxModuleManager.loadModuleDirAsync(local("modules"));
    const log = await sfxModuleManager.getComponentAsync("logging");

    app.on("ready", async () => {
        log.writeInfo("'ready': Application starting up ...");

        if (env.platform === Platform.MacOs) {
            const settings = await sfxModuleManager.getComponentAsync("settings");

            log.writeInfo("'ready': Initialize application menu for macOS.");
            Menu.setApplicationMenu(
                Menu.buildFromTemplate(
                    settings.get("defaultMenu/" + env.platform)));
        }

        log.writeInfo("'ready': Starting up connect-cluster prompt.");

        await sfxModuleManager.getComponentAsync("main-window");

        // const prompt_connectCluster = await sfxModuleManager.getComponentAsync("prompt.connect-cluster");
        // const clusterUrl = await prompt_connectCluster.openAsync();

        // if (clusterUrl) {
        //     global["TargetClusterUrl"] = clusterUrl;
        //     const mainWindow = await sfxModuleManager.getComponentAsync("browser-window", null, true, clusterUrl);

        //     mainWindow.setMenuBarVisibility(false);

        //     log.writeEvent("connect-cluster", { "clusterId": uuidv5(clusterUrl, uuidv5.URL) });
        //     mainWindow.loadURL(resolve("sfx/index.html"));
        // } else {
        //     log.writeInfo("'ready': No cluster url provided.");
        //     log.writeInfo("'ready': app.quit().");

        //     app.quit();
        //     return;
        // }

        //setTimeout(async () => (await sfxModuleManager.getComponentAsync("update")).update(), 1000); // Check upgrade after 1 sec.
        startingUp = false;
        log.writeInfo("'ready': application startup finished.");
    });

    app.on("window-all-closed", () => {
        if (startingUp) {
            log.writeInfo("'window-all-closed': skip during application startup.");
            return;
        }

        log.writeInfo("'window-all-closed': app.quit().");
        app.quit();
    });
})();
