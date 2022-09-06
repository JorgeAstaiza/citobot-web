import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'app-instrucciones-tamizaje',
    templateUrl: './instrucciones-tamizaje.component.html',
    styleUrls: ['./instrucciones-tamizaje.component.scss']
})
export class InstruccionesTamizajeComponent implements OnInit {

    constructor(public dialogRef: MatDialogRef<InstruccionesTamizajeComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) { }

    ngOnInit(): void {
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

}
