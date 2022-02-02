/*
    Author:     Thomas D'haenens
    License:    GPL-3.0
    Link:       https://github.com/BENEATLY/neat-community-plugins/
    Contact:    https://neatly.be/
*/


// Imports: Libraries
import * as objLib from '@library/object';
import * as formatLib from '@library/format';
import * as definitionsLib from '@library/definitions';
import * as sortLib from '@library/sort';
import * as stringLib from '@library/string';
import * as translateLib from '@library/translate';


// Definitions
let plugin = {'id': 8, 'name': 'CRUD'};


// Get Allowed API Objects
export function getAllowedAPIObjects(config, right) {

  // No Definitions
  if (!objLib.lookUpKey(config['definitions'], 'Object')) { return []; }

  // Return Allowed API Objects
  return formatLib.formatUniqueBy(right.filter(x => x.apiAction.name == 'Get').filter(x => objLib.lookUpKey(config['definitions']['Object'], x.apiObject.name) && objLib.lookUpKey(config['definitions']['Object'][x.apiObject.name]['properties'], 'all')).filter(x => !['User', 'Team', 'Function', 'ApiAction', 'ApiObject', 'Right', 'PluginActionRight', 'PluginOptionRight', 'Plugin', 'Translation', 'Activity'].includes(x.apiObject.name)), ['apiObject']).filter(x => x.right == 'all').map(x => x.apiObject);

}

// Select API Object
export async function selectAPIObject(config, right, crudSelector, sortingArray, filterArray, pageInfo, accessLevel, disabledLevel) {
  crudSelector.apiObject = apiObject;
  sortingArray.model = {'attr': null, 'order': true};
  filterArray.model = [{'property': [null], 'comparator': null, 'ref': null, 'object': [crudSelector.apiObject], 'lastProperty': null}];
  pageInfo.model.page = 1;
  objLib.updateExistingDict(accessLevel, definitionsLib.createViewList(config, right, 'Get', crudSelector.apiObject, disabledLevel));
}

// Apply Select Presentation
export function applySelectPresentation(translate, items) {

  // Add Presentation Value
  let modItems = items.map(item => ({ ...item, _presentationValue: stringLib.toTitleCase(translate.instant(translateLib.constructSP(item.name, 1))) }));

  // Sort According to Presentation Value & Return
  return sortLib.sortBy(modItems, '_presentationValue', true);

}
