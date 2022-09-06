import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';

import { Subject } from 'rxjs';



@Component({
  selector: 'app-webcam-snapshot',
  templateUrl: './webcam-snapshot.component.html',
  styleUrls: ['./webcam-snapshot.component.scss'],
})
export class WebcamSnapshotComponent implements OnInit {
  WIDTH = 640;
  HEIGHT = 480;
  private nextWebcam: Subject<boolean | string> = new Subject<
    boolean | string
  >();
  @ViewChild('video')
  public video!: ElementRef;

  @ViewChild('canvas')
  public canvas!: ElementRef;
  constructor() {}

  ngOnInit(): void {}
  captures: string[] = [];
  error: any;
  isCaptured!: boolean;
  @Output() imagen = new EventEmitter<string>();
  async ngAfterViewInit() {
    await this.setupDevices();
  }

  async setupDevices() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        if (stream) {
          this.video.nativeElement.srcObject = stream;
          this.video.nativeElement.play();
          this.error = null;
        } else {
          this.error = 'You have no output video device';
        }
      } catch (e) {
        this.error = e;
      }
    }
  }

  capture() {
    this.drawImageToCanvas(this.video.nativeElement);
    this.captures.push(this.canvas.nativeElement.toDataURL('image/png'));
    console.log(this.capture);
    this.isCaptured = true;
  }

  removeCurrent() {
    this.isCaptured = false;
  }

  setPhoto(idx: number) {
    console.log(idx);

    this.isCaptured = true;
    var image = new Image();
    image.src = this.captures[idx];
    console.log(image.src);
    this.imagen.emit(image.src);
    this.drawImageToCanvas(image);
  }

  changeWebCame(directionOrDeviceId: boolean | string) {
    this.nextWebcam.next(directionOrDeviceId);
  }

  drawImageToCanvas(image: any) {
    this.canvas.nativeElement
      .getContext('2d')
      .drawImage(image, 0, 0, this.WIDTH, this.HEIGHT);
  }
}
