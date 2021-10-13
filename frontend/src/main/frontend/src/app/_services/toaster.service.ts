import { Injectable, NgZone } from "@angular/core";
import { NbIconConfig, NbToastrService } from "@nebular/theme";


@Injectable({ providedIn: 'root' })
export class ToasterService {

    constructor(private nbTs: NbToastrService, private zone: NgZone) {}

    showSuccess(msg: string): void {
        this.zone.run(() => {
            this.nbTs.show(msg, 'ZOEY', { preventDuplicates: true, status: 'success', icon: { icon: 'bell', pack: 'eva', status: 'success' }, duration: 5000 });
        });
    }

    showError(msg: string, code?: number): void {
        this.zone.run(() => {
            this.nbTs.show(msg, code ? 'Status Code: ' + code : 'Error', { status: 'warning', icon: {icon: 'alert-triangle', pack: 'eva', status: 'warning'}, duration: 5000 });
        });
    }
}