import { CommonModule } from '@angular/common';
import { Component, forwardRef, Input, ViewChild } from '@angular/core';
import { ControlValueAccessor, FormArray, FormBuilder, FormControl, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { PrimeNGConfig } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { FileRemoveEvent, FileUpload, FileUploadModule } from 'primeng/fileupload';
import { CommonHelper } from 'src/Helper/CommonHelper';

@Component({
  selector: 'app-file-uploader',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FileUploadModule,
    ButtonModule
  ],
  templateUrl: './file-uploader.component.html',
  styleUrl: './file-uploader.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FileUploaderComponent),
      multi: true
    }
  ]
})
export class FileUploaderComponent implements ControlValueAccessor {
  @ViewChild('fileUpload') fileUpload: FileUpload;
  @Input() accept: string;
  @Input() maxFileSize: number;
  @Input() multiple: boolean = false;
  @Input() disabled: boolean = false;
  files = [];
  totalSize: number = 0;
  totalSizePercent: number = 0;
  private onTouchedCallback: () => void = () => { };
  private onChangeCallback: (_: any) => void = () => { };
  images: FormArray = this.fb.array([]);
  constructor(
    private config: PrimeNGConfig,
    private fb: FormBuilder
  ) { }

  get imagesFAC() {
    return this.images.controls;
  }

  async writeValue(value: any) {
    // console.log('writeValue', value);
    // console.log(this.imagesFAC);
    if (value) {
      const formValue = Array.isArray(value) ? value : [value];
      formValue.forEach(async (item) => {
        const file = await this.urlToFile(item, item.split('/').pop());
        this.fileUpload.files.push(file);
        this.images.push(new FormControl(item))
      })
    }
    // console.log(this.imagesFAC);
  }

  registerOnChange(fn: any): void {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouchedCallback = fn;
  }

  valueChanged(newValue: any) {
    this.onChangeCallback(newValue);
  }

  choose(event, callback) {
    this.onTouchedCallback();
    callback();
  }

  fileRemove(event: FileRemoveEvent) {
    // this.onChangeCallback('');
    // this.categoryForm.get('image').setValue('');
    // console.log(this.categoryForm.value);
  }

  onSelectedFiles(event) {
    this.onTouchedCallback();
    const currentFile = event.currentFiles;
    // this.files = Array.from(event.files);
    this.files = this.multiple ? currentFile.slice(this.images.length) : currentFile;
    this.multiple || this.images.removeAt(0);
    this.files.forEach((file) => {
      this.totalSize += parseInt(this.formatSize(file.size));
      const alreadyExist = currentFile.includes(file);
      const reader = new FileReader();
      // console.log(file)
      reader.readAsDataURL(file);
      reader.onload = () => {
        // console.log('File Upload', reader.result);
        this.images.push(new FormControl(reader.result as string));
        console.log(this.images.value);
        console.log(this.multiple ? this.images?.value : this.images.length ? this.images?.value[0] : '');
        this.onChangeCallback(this.multiple ? this.images?.value : this.images.length ? this.images?.value[0] : '')
      };
      reader.onerror = (error) => {
      };
    });
    this.totalSizePercent = this.totalSize / 10;
  }

  onRemoveTemplateFile(event, file, removeFileCallback, index) {
    removeFileCallback(event, index);
    this.images.removeAt(index);
    // this.images.splice(index, 1);
    console.log(this.images.value)
    this.onChangeCallback(this.multiple ? this.images.value : this.images.length ? this.images.value[0] : '');
  }

  formatSize(bytes) {
    const k = 1024;
    const dm = 3;
    const sizes = this.config.translation.fileSizeTypes;
    if (bytes === 0) {
      return `0 ${sizes[0]}`;
    }
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const formattedSize = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));
    return `${formattedSize} ${sizes[i]}`;
  }


  base64ToFile(base64, filename) {
    var arr = base64.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[arr.length - 1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }

  async urlToFile(url: string, filename: string) {
    const response = await fetch(url);
    const blob = await response.blob();
    const file = new File([blob], filename, { type: blob.type });
    const objectUrl = URL.createObjectURL(file);
    console.log('objectUrl', objectUrl);
    // file.objectURL
    return file;
  }
}
