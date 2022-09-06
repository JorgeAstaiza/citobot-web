// Ordenaré los tamizajes por la fecha
export function sortFunctionTamizajes(a: any, b: any) {
    if (a.tam_id < b.tam_id) {
        return 1;
    }
    if (a.tam_id > b.tam_id) {
        return -1;
    }
    return 0;
}

// Ordenaré los pacientes por el nombre
export function sortFunctionPacientes(a: any, b: any) {
    if (a.per_primer_nombre < b.per_primer_nombre) {
        return -1;
    }
    if (a.per_primer_nombre > b.per_primer_nombre) {
        return 1;
    }
    return 0;
}

// Ordenaré los usuarios por el nombre
export function sortFunctionUsuarios(a: any, b: any) {
    if (a.per_primer_nombre < b.per_primer_nombre) {
        return -1;
    }
    if (a.per_primer_nombre > b.per_primer_nombre) {
        return 1;
    }
    return 0;
}
