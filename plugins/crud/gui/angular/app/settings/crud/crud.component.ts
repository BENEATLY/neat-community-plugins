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
import { PluginConfig } from '@app/plugin.config';

// Imports: Translation
import { TranslateService } from '@ngx-translate/core';

// Imports: Libraries
import * as pluginLib from '@library/plugin';
import * as translateLib from '@library/translate';
import * as rightLib from '@library/right';
import * as dataLib from '@library/data';
import * as crudLib from '@plugin-library/8/crud';

// Imports: Tools
import * as cloneDeep from 'lodash/cloneDeep';


// Declarations: JQuery
declare var $: any;


// Component Definition
@Component({selector: 'app-settings-crud', templateUrl: './crud.component.html'})


// Component Export Definition
export class SettingsCrudComponent implements OnInit {

  // Libraries
  pluginLib = pluginLib;
  translateLib = translateLib;
  rightLib = rightLib;
  dataLib = dataLib;
  crudLib = crudLib;

  // jQuery
  jquery = $;

  // Object Definitions (Non-Configurable)
  objectName = null;
  objectDefinition = null;

  // Plugin (Non-Configurable)
  plugin = {'id': 8, 'name': 'CRUD'};

  // Results (Non-Configurable)
  resultInfo = {'model': null};

  // Table Columns (Non-Configurable)
  columns = {'model': {}};

  // Access Level (Non-Configurable)
  accessLevel = {'selected': null, 'options': []};
  disabledLevel = [];

  // Sorting (Non-Configurable)
  sortingArray = {'model': {'attr': null, 'order': true}};

  // Filtering (Non-Configurable)
  filterArray = {
    'model': [
      {
        'property': [null],
        'comparator': null,
        'ref': null,
        'object': null,
        'lastProperty': null
      }
    ]
  };
  filterState = {'applied': true, 'lastFilter': null};
  filterPanel = {'model': false};

  // Pages (Non-Configurable)
  pageInfo = {'model': {'page': 1, 'perPage': 50, 'maxPage': 1, 'total': null, 'exist': null}};

  // Display Options (Non-Configurable)
  displayOptions = {};

  // CRUD Options (Non-Configurable)
  crudOptions: any[] = [];
  filteredCrudOptions: any[] = [];

  // Custom Modal Libraries (Non-Configurable)
  modalLibs = {};

  // CRUD Plugin (Non-Configurable)
  crudSelector = {'apiObject': null};
  crudPlaceHolder: string = '';

  // Context Reference
  context = this;


  // Component Definition
  constructor(public router: Router, public route: ActivatedRoute, public data: DataService, public http: HttpClient, public cookieService: CookieService, public appConfig: AppConfig, public pluginConfig: PluginConfig, public snackBar: SnackBarService, public timezone: TimezoneService, public translate: TranslateService, public translation: TranslationService) {

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
  ngOnInit() {

    // Get CRUD Place Holder
    this.crudPlaceHolder = this.translate.instant('settings.crud.selectobject');

    // Get CRUD Options
    let crudOptions = crudLib.applySelectPresentation(this.translate, crudLib.getAllowedAPIObjects(this.appConfig.config, this.data.userData.right));
    this.crudOptions = crudOptions;
    this.filteredCrudOptions = cloneDeep(crudOptions);

    // Update Results
    this.update();

    // Update Hook
    $('#update-required').on("update", () => { this.update(); });

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

    // Get Page Info
    if (this.crudSelector.apiObject != null) { dataLib.getPageInfo(this.appConfig.config, this.data.userData, 'model', this.crudSelector.apiObject, this.columns, this.pageInfo, this.resultInfo, this.accessLevel, this.sortingArray, this.filterArray, this.filterState, this.displayOptions, null, this.translate, this.timezone, this.snackBar, this.cookieService, this.http); }

  }

  // Update Selected API Object
  updateSelectedApiObject() {

    // Reset CRUD Place Holder
    this.crudPlaceHolder = '';

    // Update Inputs
    crudLib.selectAPIObject(this.appConfig.config, this.data.userData.right, this.crudSelector, this.sortingArray, this.filterArray, this.pageInfo, this.accessLevel, this.disabledLevel);

    // Set Object Definitions
    this.objectDefinition = this.crudSelector.apiObject;
    this.objectName = this.crudSelector.apiObject;

    // Trigger  Update
    $('#update-required').trigger("update");

  }

}
