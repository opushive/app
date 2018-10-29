import { Constants } from './constants';
export class Console {

    static log(data) {
        let TAG = "Xendbit: ";
        if (Constants.LOGGING_ENABLED) {            
            try {
                console.log(TAG + JSON.stringify(data));
            } catch(e) {            
                console.log(data);
            }
        }
    }
}