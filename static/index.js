const dropArea = document.getElementById("drop-area");
const fileInput = document.getElementById("fileElem");
const fileName = document.getElementById("file-name");
const uploadBtn = document.getElementById("uploadBtn");
const status = document.getElementById("status");
let selectedFile = null;

dropArea.addEventListener("click", () => fileInput.click());

fileInput.addEventListener("change", handleFiles);
dropArea.addEventListener("dragover", e => {
  e.preventDefault();
  dropArea.classList.add("border-blue-500");
});

dropArea.addEventListener("dragleave", () => dropArea.classList.remove("border-blue-500"));

dropArea.addEventListener("drop", e => {
  e.preventDefault();
  dropArea.classList.remove("border-blue-500");
  fileInput.files = e.dataTransfer.files;
  handleFiles();
});

function handleFiles() {
  const file = fileInput.files[0];
  if (file && file.type === "application/pdf" && file.size <= 10 * 1024 * 1024) {
    selectedFile = file;
    fileName.textContent = `Selected: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`;
    uploadBtn.disabled = false;
    status.textContent = "";
  } else {
    fileName.textContent = "";
    uploadBtn.disabled = true;
    status.textContent = "Please select a valid PDF file under 10MB.";
    status.classList.add("text-red-500");
  }
}

uploadBtn.addEventListener("click", async () => {
  if (!selectedFile) return;

  const formData = new FormData();
  formData.append("file", selectedFile);

  status.textContent = "Uploading...";
  status.classList.remove("text-red-500");
  status.classList.remove("text-green-500");

  try {
    const res = await fetch("/upload", {
      method: "POST",
      body: formData
    });

    const result = await res.json();
    if (res.ok) {
      status.textContent = "Upload successful!";
      status.classList.add("text-green-500");
    } else {
      status.textContent = result.detail || "Upload failed.";
      status.classList.add("text-red-500");
    }
  } catch (err) {
    status.textContent = "Server error.";
    status.classList.add("text-red-500");
  }
});
