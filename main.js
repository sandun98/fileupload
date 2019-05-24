class Uploader {
  constructor(config) {
    this.dropZoneMessage = "";
    this.gap = "5px";
    this.status;
    this.config = config;
    this.thumbnailWidth = 200;
    this.uploadForm = document.querySelector("#" + config.id);
    this.canvas = document.createElement("canvas");

    if (!this.validate()) return;

    this.uploadForm.addEventListener(
      "submit",
      e => {
        e.preventDefault();
        if (this.status == "success") {
          if (
            !confirm(
              "Files have been already uploaded successfully .\nDo you want to upload again? "
            )
          )
            return;
        }
        var files = this.fileUploadInput.files;
        if (files.length === 0) {
          alert("Please select at least one file");
          e.preventDefault();
          return;
        }

        this.uploadMultipleFiles(files);
        e.preventDefault();
      },
      true
    );

    this.createComponnets();
  }

  validate() {
    if (this.uploadForm == null) {
      alert("No upload form element found");
      return false;
    }
    if (this.uploadForm.action == null) {
      alert("No upload url found");
      return false;
    }
    return true;
  }
  createComponnets() {
    this.createFileUploadInput();
    this.createUploadButton();
    this.createProgressBar();
    this.createDropZone();
  }

  createFileUploadInput() {
    this.fileUploadInput = document.querySelector("#fileUploadInput");
    if (this.fileUploadInput == null) {
      this.fileUploadInput = document.createElement("input");
      this.fileUploadInput.type = "file";
      this.fileUploadInput.multiple = "multiple";
      this.fileUploadInput.name = "files";
      this.fileUploadInput.id = "fileUploadInput";
      this.fileUploadInput.style.marginRight = this.gap;
      this.uploadForm.appendChild(this.fileUploadInput);
    }

    this.fileUploadInput.addEventListener(
      "change",
      e => {
        this.filesSelected(e);
      },
      true
    );
  }

  filesSelected(e) {
    this.progressBar.style.display = "none";
    this.reset();
    for (var i = 0; i < e.target.files.length; i++) {
      this.creatThumbNail(e.target.files[i]);
    }
    this.readFile(e.target.files, 0);
  }
  creatThumbNail(file) {
    var div = document.createElement("div");
    var span = document.createElement("div");
    span.innerHTML = file.name;
    var img = document.createElement("img");
    img.id = file.name;
    div.style =
      "border :1px solid grey;margin:5px;float:left;padding:5px;cursor:pointer;width:" +
      (this.thumbnailWidth + 10) +
      "px;height:" +
      (this.thumbnailWidth + 10) +
      "px";
    div.appendChild(span);
    div.appendChild(img);
    img.style = "margin:0 auto"; //URL.createObjectURL(file);

    img.src = "../images/giphy.gif"; //URL.createObjectURL(file);
    img.width = this.thumbnailWidth;
    img.alt = file.name;
    this.dropZone.appendChild(div);
    return div;
  }

  readFile(files, i) {
    if (i > 0) {
      if (files[i - 1]) {
        URL.revokeObjectURL(files[i]);
      }
    }
    if (files.length < i + 1) return;
    var reader = new FileReader();
    reader.onload = e => {
      var img = document.getElementById(files[i].name);
      img.onload = function() {
        var ctx = canvas.getContext("2d");
        ctx.imageSmoothingEnabled = false;
        var canvasCopy = document.createElement("canvas");
        var copyContext = canvasCopy.getContext("2d");
        var ratio = 1;

        if (img.width > this.thumbnailWidth)
          ratio = this.thumbnailWidth / img.width;
        else if (img.height > this.thumbnailWidth)
          ratio = this.thumbnailWidth / img.height;

        canvasCopy.width = img.width;
        canvasCopy.height = img.height;
        copyContext.drawImage(img, 0, 0);

        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;
        ctx.drawImage(
          canvasCopy,
          0,
          0,
          canvasCopy.width,
          canvasCopy.height,
          0,
          0,
          canvas.width,
          canvas.height
        );
      };

      img.src = URL.createObjectURL(files[i]);
      this.readFile(files, i + 1);
    };
    reader.readAsBinaryString(files[i]);
  }

  reset() {
    while (this.dropZone.hasChildNodes()) {
      this.dropZone.removeChild(dropZone.firstChild);
    }
    this.status = null;
  }

  createProgressBar() {
    this.progressBar = document.querySelector("#progressBar");
    if (this.progressBar == null) {
      this.progressBar = document.createElement("progress");

      this.progressBar.id = "progressBar";
      this.progressBar.max = 100;
      this.progressBar.value = 0;
      this.progressBar.style.display = "none";
      this.progressBar.style.marginRight = this.gap;

      this.uploadForm.appendChild(this.progressBar);
    }
  }

  createUploadButton() {
    if (this.uploadButton == null) {
      this.uploadButton = document.createElement("button");
      this.uploadButton.innerHTML = "Upload";
      this.uploadButton.type = "submit";
      this.uploadButton.style.marginRight = this.gap;

      this.uploadForm.appendChild(this.uploadButton);
    }
  }
  createDropZone() {
    this.dropZone = document.querySelector("#dropZone");
    if (this.dropZone == null) {
      this.dropZone = document.createElement("div");
      this.dropZone.style.border = "1px dashed #D8D8D8";
      this.dropZone.style.width = "100%";
      this.dropZone.style.minHeight = "100px";
      this.dropZone.style.overflow = "auto";
      this.dropZone.style.cursor = "pointer";
      this.dropZone.style.height = "100%";
      this.dropZone.id = "dropZone";
      this.dropZone.style.background = "#F8F8F8";

      this.dropZone.addEventListener("mouseover", e => {
        this.dropZone.style.border = "1px dashed #D8D8D8";
        this.dropZone.style.background = "#F9F9F9";
      });
      this.dropZone.addEventListener("mouseout", e => {
        this.dropZone.style.border = "1px dashed #D8D8D8";
        this.dropZone.style.background = "#F7F7F7";
      });

      this.uploadForm.parentNode.appendChild(document.createElement("hr"));
      this.uploadForm.parentNode.appendChild(this.dropZone);
    }
  }

  serialUpload(files) {
    this.progressBar.style.display = "inline";

    var formData = new FormData();
    formData.append("data", files[index]);
    for (var index = 0; index < files.length; index++) {
      formData.append("files", files[index]);
    }

    var xhr = new XMLHttpRequest();
    xhr.open("POST", this.uploadForm.action);

    xhr.upload.onprogress = evt => {
      if (evt.lengthComputable)
        this.progressBar.value = (evt.loaded / evt.total) * 100;
    };
    xhr.onload = () => {
      var response = JSON.parse(xhr.responseText);
      if (xhr.status == 200) {
        this.status = "success";
        alert("All Files Uploaded Successfully");
      } else {
        this.status = "fail";

        alert((response && response.message) || "Some Error Occurred");
      }
    };
    xhr.send(formData);
  }

  uploadMultipleFiles(files) {
    this.serialUpload(files);
  }
}
