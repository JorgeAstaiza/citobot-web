export function transformEnum(obj: any) {
  const firtFix = obj[0]['SUBSTRING(COLUMN_TYPE,5)'].split('(')[1];
  const secondFix = firtFix.split(')')[0];
  let objFinal = secondFix.split(',');
  for (let i = 0; i < objFinal.length; i++) {
    objFinal[i] = objFinal[i].replace("'", '');
  }
  for (let i = 0; i < objFinal.length; i++) {
    objFinal[i] = objFinal[i].replace("'", '');
  }
  return objFinal;
}
