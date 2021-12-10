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
import { TimezoneService } from '@app/timezone.service';
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
@Component({selector: 'app-settings-plugin-configure-ldap', templateUrl: './ldap.component.html'})


// Component Export Definition
export class SettingsPluginConfigureLDAPComponent implements OnInit {

  // Libraries
  pluginLib = pluginLib;
  rightLib = rightLib;
  dataLib = dataLib;

  // jQuery
  jquery = $;

  // Plugin (Non-Configurable)
  plugin = {"id": 5, "name": "LDAP"};
  pluginOptions = {};

  // Results (Non-Configurable)
  resultInfo = {'ldapGroup': null, 'ldapUserChange': null};

  // Table Columns (Non-Configurable)
  columns = {'ldapGroup': {}, 'ldapUserChange': {}};

  // Access Level (Non-Configurable)
  accessLevel = {'selected': null, 'options': []};
  disabledLevel = [];

  // Sorting (Non-Configurable)
  sortingArray = {'ldapGroup': {'attr': null, 'order': true}, 'ldapUserChange': {'attr': null, 'order': true}};

  // Filtering (Non-Configurable)
  filterArray = {
      "ldapGroup": [
          {
              "property": [
                  null
              ],
              "comparator": null,
              "ref": null,
              "object": [
                  "LDAPGroup"
              ],
              "lastProperty": null,
              "fixed": false
          }
      ],
      "ldapUserChange": [
          {
              "property": [
                  null
              ],
              "comparator": null,
              "ref": null,
              "object": [
                  "LDAPUserChange"
              ],
              "lastProperty": null,
              "fixed": false
          }
      ]
  };
  filterState = {'applied': true, 'lastFilter': null};
  filterPanel = {'ldapGroup': false, 'ldapUserChange': false};

  // Pages (Non-Configurable)
  pageInfo = {'ldapGroup': {'page': 1, 'perPage': 50, 'maxPage': 1, 'total': null, 'exist': null}, 'ldapUserChange': {'page': 1, 'perPage': 20, 'maxPage': 1, 'total': null, 'exist': null}};

  // Display Options (Non-Configurable)
  displayOptions = {};

  // Passed Parameters
  passedParameters = [];

  // CRUD Options (Non-Configurable)
  crudOptions = {};

  // Custom Modal Libraries (Non-Configurable)
  modalLibs = {};

  // Context Reference
  context = this;


  // Component Definition
  constructor(public router: Router, public route: ActivatedRoute, public data: DataService, public http: HttpClient, public cookieService: CookieService, public appConfig: AppConfig, public pluginConfig: PluginConfig, private hashConfig: HashConfig, public snackBar: SnackBarService, public timezone: TimezoneService, public translate: TranslateService, public translation: TranslationService) {

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
    $('#update-required').on("reload", () => { this.update(); });

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

  // LDAP Group Rights?
  hasLdapGroupRights() {

    // Sufficient Rights?
    if (!rightLib.sufficientRights(this.data.userData.right, 'LDAPGroup', 'Get', 'own')) { return false; }

    // Return OK
    return true;

  }

  // LDAP User Change Rights?
  hasLdapUserChangeRights() {

    // Sufficient Rights?
    if (!rightLib.sufficientRights(this.data.userData.right, 'LDAPUserChange', 'Get', 'own')) { return false; }

    // Return OK
    return true;

  }

  // Update Results
  async update() {

    // Get All Plugin Options
    this.pluginOptions = await dataLib.getPrivatePluginValues(this.appConfig.config, this.plugin, this.snackBar, this.cookieService, this.http);

    // LDAP Groups
    if (this.hasLdapGroupRights()) {

      // Get LDAP Group Info
      dataLib.getPageInfo(this.appConfig.config, this.data.userData, 'ldapGroup', 'LDAPGroup', this.columns, this.pageInfo, this.resultInfo, this.accessLevel, this.sortingArray, this.filterArray, this.filterState, this.displayOptions, null, this.translate, this.timezone, this.snackBar, this.cookieService, this.http);

    }

    // LDAP User Change
    if (this.hasLdapUserChangeRights()) {

      // Get Recent Changes Info
      dataLib.getPageInfo(this.appConfig.config, this.data.userData, 'ldapUserChange', 'LDAPUserChange', this.columns, this.pageInfo, this.resultInfo, this.accessLevel, this.sortingArray, this.filterArray, this.filterState, this.displayOptions, null, this.translate, this.timezone, this.snackBar, this.cookieService, this.http);

    }

  }

}
