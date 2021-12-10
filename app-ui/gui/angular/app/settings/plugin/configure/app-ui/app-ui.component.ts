/*
    Author:     Thomas D'haenens
    License:    GPL-3.0
    Link:       https://github.com/BENEATLY/neat-community-plugins/
    Contact:    https://neatly.be/
*/


// Imports: Default
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

// Imports: Custom Services
import { DataService } from '@app/data.service';
import { TranslationService } from '@app/translation.service';
import { SnackBarService } from '@app/snackbar.service';

// Imports: Config Loaders
import { AppConfig } from '@app/app.config';
import { HashConfig } from '@app/hash.config';
import { PluginConfig } from '@app/plugin.config';

// Imports: Translation
import { TranslateService } from '@ngx-translate/core';

// Imports: Libraries
import * as pluginLib from '@library/plugin';
import * as rightLib from '@library/right';
import * as dataLib from '@library/data';


// Declarations: JQuery
declare var $: any;


// Component Definition
@Component({selector: 'app-settings-plugin-configure-app-ui', templateUrl: './app-ui.component.html'})


// Component Export Definition
export class SettingsPluginConfigureAppUIComponent implements OnInit {

  // Libraries
  pluginLib = pluginLib;
  rightLib = rightLib;
  dataLib = dataLib;

  // jQuery
  jquery = $;

  // Plugin (Non-Configurable)
  plugin = {"id": 16, "name": "Application Look & Feel"};
  pluginOptions = {};

  // Context Reference
  context = this;


  // Component Definition
  constructor(public router: Router, public route: ActivatedRoute, public data: DataService, public http: HttpClient, public cookieService: CookieService, public appConfig: AppConfig, public pluginConfig: PluginConfig, private hashConfig: HashConfig, public snackBar: SnackBarService, public translate: TranslateService, public translation: TranslationService) {

    // Translate
    let lang = this.translation.translation.translationFile;
    this.translate.setTranslation(lang, this.translation.translationContent);
    this.translate.setDefaultLang(lang);

    // Select Correct Navbar Item (Default)
    this.data.flagNewPath(this.route.snapshot.url);

    // Route Allowed?
    this.routeAllowed();

  }


  // Page Initialisation
  async ngOnInit() {

    // Update Results
    this.update();

    // Update Hook
    $('#update-required').on("update", () => { this.update(); });

    // Reload Hook
    $('#update-required').on("reload", () => { this.reloadConfig(); });

  }


  // Route Allowed?
  routeAllowed() {

    // Plugin Active?
    if (!pluginLib.isActivePlugin(this.pluginConfig.plugin, this.plugin.id)) { this.router.navigate([`dashboard`]); }

    // Sufficient Plugin Action Rights?
    if (!rightLib.sufficientPluginActionRights(this.data.userData.pluginActionRight, this.plugin.id, 'use', 'all')) { this.router.navigate([`dashboard`]); }

    // Return OK
    return true;

  }

  // Update Results
  async update() {

    // Get All Plugin Options
    this.pluginOptions = await dataLib.getPrivatePluginValues(this.appConfig.config, this.plugin, this.snackBar, this.cookieService, this.http);

  }

  // Reload Config
  async reloadConfig() {

    // Load New Config
    await this.appConfig.load(this.hashConfig);

    // Reload
    location.reload(true);

  }

}
