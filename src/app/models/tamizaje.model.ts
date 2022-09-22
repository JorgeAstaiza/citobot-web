export interface Tamizaje {

    tam_id?: number | undefined;
    tam_pac_per_identificacion?: string;
    tam_usu_per_identificacion?: string;
    tam_fecha: Date | string;
    tam_contraste: string;
    tam_vph: string;
    tam_vph_no_info?: number;
    per_tip_id?: string;
    tam_niv_id: number;

    per_identificacion?: number;
    niv_mensaje?: string;
    per_primer_nombre?: string;

}
