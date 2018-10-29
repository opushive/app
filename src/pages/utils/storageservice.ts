import { Storage } from '@ionic/storage';

export class StorageService {
    static ACCOUNT_TYPE;
    static IS_BENEFICIARY;
    private ns: Storage;
    private data = {};
    private ready = false;

    constructor(storage: Storage) {
        let app = this;
        app.ns = storage;
        app.ns.ready().then(() => {
            //this.ns.clear();
            //this.ns.set("store", this.data);
            app.ns.get("store").then(
                (storeData) => {
                    app.setReady(true);
                    app.setData(storeData);
                    StorageService.ACCOUNT_TYPE = app.getItem('accountType');
                }
            )
        });
    }

    private setData(data) {
        this.data = (data === null ? {} : data);
    }

    setReady(ready) {
        this.ready = ready;
    }

    isReady() {
        return this.ready;
    }

    setItem(key, itemData) {
        if (this.data['isGuest'] === true || this.data['isGuest'] === 'true') {
            let key2 = 'guest' + key;
            key = key2;
        }                
        this.data[key] = itemData;
        this.ns.set("store", this.data);
    }

    getItem(key) {
        if (this.data['isGuest'] === true || this.data['isGuest'] === 'true') {
            let key2 = 'guest' + key;
            key = key2;
        }
        return this.data[key];
    }

    clear() {
        this.ns.clear();
        this.data = { dummy: 1 };
        this.ns.set("store", this.data).then(() => {
            console.log("Xendbit: Was cleared.");
        });
    }
}