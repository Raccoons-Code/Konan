import bytes from './bytes';
import capitalize from './capitalize';
import { addButtonRoles, addSelectRoles, ComponentLink, createButtonRoles, createSelectRoles, filterRolesId, removeButtonRoles, removeSelectRoles, setDefaultRole } from './commands';
import composition from './composition';
import Constants from './Constants';
import filterObjectByKeys from './filterObjectByKeys';
import findDuplicatesInArray from './findDuplicatesInArray';
import getLocalizations from './getLocalizations';
import hasDuplicatesInArray from './hasDuplicatesInArray';
import isClass from './isClass';
import isDuplicate from './isDuplicate';
import isJSON from './isJSON';
import isSameDate from './isSameDate';
import keyGen from './keyGen';
import mathRandom from './mathRandom';
import parseJSON from './parseJSON';
import pattern from './pattern';
import randomizeArray from './randomizeArray';
import removeDuplicatesInArray from './removeDuplicatesInArray';
import removeFromArray from './removeFromArray';
import splitArrayInGroups from './splitArrayInGroups';
import splitLimits from './splitLimits';
import waitAsync from './waitAsync';
import waitSync from './waitSync';

export default abstract class Util {
  static bytes = bytes;
  static capitalize = capitalize;
  static composition = composition;
  static Constants = Constants;
  static filterObjectByKeys = filterObjectByKeys;
  static findDuplicatesInArray = findDuplicatesInArray;
  static getLocalizations = getLocalizations;
  static hasDuplicatesInArray = hasDuplicatesInArray;
  static isClass = isClass;
  static isDuplicate = isDuplicate;
  static isJSON = isJSON;
  static isSameDate = isSameDate;
  static keyGen = keyGen;
  static mathRandom = mathRandom;
  static parseJSON = parseJSON;
  static pattern = pattern;
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
  static createButtonRoles = createButtonRoles;
  static createSelectRoles = createSelectRoles;
  static filterRolesId = filterRolesId;
  static removeButtonRoles = removeButtonRoles;
  static removeSelectRoles = removeSelectRoles;
  static setDefaultRole = setDefaultRole;
}

export { Util };

