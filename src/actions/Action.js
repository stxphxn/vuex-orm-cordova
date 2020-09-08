import deepmerge from 'deepmerge';
import localforage from 'localforage';
import cordovaSQLiteDriver from 'localforage-cordovasqlitedriver';
import Context from '../common/context';

export default class Action {
  /**
   * Transform Model to include ModelConfig
   * @param {object} model
   */
  static transformModel(model) {
    model.localforage = deepmerge({ storeName: model.entity }, model.localforage || {});

    model.$localStore = localforage.createInstance(deepmerge(
      Context.getInstance().options.localforage,
      model.localforage,
    ));

    model.$localStore.defineDriver(cordovaSQLiteDriver).then(() => {
      model.$localStore.setDriver([
        cordovaSQLiteDriver._driver,
        localforage.INDEXEDDB,
        localforage.WEBSQL,
        localforage.LOCALSTORAGE,
      ]);
      console.log(`setDriver:${localforage.driver()}`);
    });

    return model;
  }

  static getRecordKey(record) {
    return typeof record.$id === 'string' ? record.$id : String(record.$id);
  }
}
