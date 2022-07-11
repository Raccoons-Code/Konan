import BitField from './BitField';
import Bytes from './Byte';
import bytes from './bytes';
import capitalize from './capitalize';
import { addButtonRoles, addSelectRoles, ComponentLink, componentsHasRoles, createButtonRoles, createSelectRoles, filterRolesId, removeButtonRoles, removeSelectRoles, setDefaultRole } from './commands';
import composition from './composition';
import Constants from './Constants';
import djsLimits from './djsLimits';
import filterObjectByKeys from './filterObjectByKeys';
import findDuplicatesInArray from './findDuplicatesInArray';
import getApplicationOwners from './getApplicationOwners';
import getLocalizations from './getLocalizations';
import getRandomFromArray from './getRandomFromArray';
import hasDuplicatesInArray from './hasDuplicatesInArray';
import isClass from './isClass';
import isDuplicate from './isDuplicate';
import isJSON from './isJSON';
import isSameDate from './isSameDate';
import keyGen from './keyGen';
import mathRandom from './mathRandom';
import parseJSON from './parseJSON';
import randomizeArray from './randomizeArray';
import regexp from './regexp';
import removeDuplicatesInArray from './removeDuplicatesInArray';
import removeFromArray from './removeFromArray';
import splitArrayInGroups from './splitArrayInGroups';
import splitLimits from './splitLimits';
import waitAsync from './waitAsync';
import waitSync from './waitSync';

export default abstract class Util {
  static BitField = BitField;
  static Bytes = Bytes;
  static bytes = bytes;
  static capitalize = capitalize;
  static composition = composition;
  static Constants = Constants;
  static djsLimits = djsLimits;
  static filterObjectByKeys = filterObjectByKeys;
  static findDuplicatesInArray = findDuplicatesInArray;
  static getApplicationOwners = getApplicationOwners;
  static getLocalizations = getLocalizations;
  static getRandomFromArray = getRandomFromArray;
  static hasDuplicatesInArray = hasDuplicatesInArray;
  static isClass = isClass;
  static isDuplicate = isDuplicate;
  static isJSON = isJSON;
  static isSameDate = isSameDate;
  static keyGen = keyGen;
  static mathRandom = mathRandom;
  static parseJSON = parseJSON;
  static regexp = regexp;
  static randomizeArray = randomizeArray;
  static removeDuplicatesInArray = removeDuplicatesInArray;
  static removeFromArray = removeFromArray;
  static splitArrayInGroups = splitArrayInGroups;
  static splitLimits = splitLimits;
  static waitAsync = waitAsync;
  static waitSync = waitSync;

  // Commands utils
  static addButtonRoles = addButtonRoles;
  static addSelectRoles = addSelectRoles;
  static ComponentLink = ComponentLink;
  static componentsHasRoles = componentsHasRoles;
  static createButtonRoles = createButtonRoles;
  static createSelectRoles = createSelectRoles;
  static filterRolesId = filterRolesId;
  static removeButtonRoles = removeButtonRoles;
  static removeSelectRoles = removeSelectRoles;
  static setDefaultRole = setDefaultRole;
}

export { Util };

