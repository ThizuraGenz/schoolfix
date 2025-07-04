import React, { useState, useRef } from "react";
import "./ReportForm.css";
import "bootstrap/dist/css/bootstrap.min.css";

const MAX_IMAGES = 1;

interface Report {
  id: string;
  image: string;
  type: string;
  location: string;
  description: string;
  status: string;
  priority: "Important" | "Normal" | "Low";
}

const ReportForm = () => {
  const [formStatus, setFormStatus] = useState<string>("");
  const [images, setImages] = useState<File[]>([]);
  const [problemType, setProblemType] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [priority, setPriority] = useState<
    "Important" | "Normal" | "Low" | undefined
  >(undefined);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files);

      const filteredNewFiles = newFiles.filter(
        (newFile) =>
          !images.some(
            (existingFile) =>
              existingFile.name === newFile.name &&
              existingFile.size === newFile.size
          )
      );

      setImages((prevImages) => {
        const combined = [...prevImages, ...filteredNewFiles];
        if (combined.length > MAX_IMAGES) {
          alert(`You can upload up to ${MAX_IMAGES} images only.`);
          return combined.slice(0, MAX_IMAGES);
        }
        return combined;
      });
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setImages((prevImages) => {
      const updatedImages = prevImages.filter(
        (_, index) => index !== indexToRemove
      );
      if (updatedImages.length === 0 && fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return updatedImages;
    });
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (images.length === 0) {
      setFormStatus("⚠️ Please upload at least one image.");
      return;
    }
    if (!problemType || !location) {
      setFormStatus("⚠️ Please fill in all required fields.");
      return;
    }

    try {
      const base64Images = await Promise.all(
        images.map((img) => convertFileToBase64(img))
      );

      const newReport: Report = {
        id: Date.now().toString(),
        image: base64Images[0],
        type: problemType,
        location,
        description,
        status: "Reviewing",
        priority: priority || "Normal",
      };

      const existingReports = localStorage.getItem("reports");
      const reports = existingReports ? JSON.parse(existingReports) : [];
      reports.push(newReport);
      localStorage.setItem("reports", JSON.stringify(reports));

      setFormStatus("✅ Report submitted!");
      setImages([]);
      setProblemType("");
      setLocation("");
      setDescription("");
      setPriority(undefined);
      if (fileInputRef.current) fileInputRef.current.value = "";

      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
    } catch {
      setFormStatus("❌ Error uploading images. Please try again.");
    }
  };

  return (
    <div className="report-container py-4 shadow-lg">
        <div className="report-ca">
          <h2 className="largest text text-center mb-4">
            Report a Cleanliness or Fix Issue
          </h2>

          <form onSubmit={handleSubmit}>
            {/* Image Upload */}
            <div className="mb-3">
              <label className="form-label">
                📸 Upload Images (max {MAX_IMAGES})
              </label>
              <div className="d-flex align-items-center gap-2">
                <button
                  type="button"
                  className="choose-btn"
                  onClick={handleFileClick}
                >
                  Choose Images
                </button>
                <span className="file-status-text">
                  {images.length === 0
                    ? "No files chosen"
                    : `${images.length} file(s) selected`}
                </span>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                multiple
                accept="image/*"
                className="d-none"
                onChange={handleImageChange}
              />

              <div className="mt-3 d-flex flex-wrap gap-3">
                {images.map((img, index) => (
                  <div
                    key={index}
                    className="image-preview text-center position-relative"
                  >
                    <img
                      src={URL.createObjectURL(img)}
                      alt={`Preview ${index}`}
                      className="img-thumbnail"
                      style={{
                        width: "80px",
                        height: "80px",
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                    />
                    <p
                      className="my-small-muted-text"
                      style={{ maxWidth: "80px" }}
                    >
                      {img.name}
                    </p>
                    <button
                      type="button"
                      className="tiny-delete-btn"
                      onClick={() => handleRemoveImage(index)}
                    >
                      ❌
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Problem Type */}
            <div className="mb-3">
              <label className="form-label">📝 Problem Type</label>
              <select
                required
                className="form-select custom-select-glass"
                style={{
                  backgroundColor: "#FFFFFF15",
                  color: "#ffff",
                  borderColor: "#FFFFFF30",
                }}
                value={problemType}
                onChange={(e) => setProblemType(e.target.value)}
              >
                <option value="">-- Select --</option>
                <option value="Dirty">Dirty</option>
                <option value="Broken">Broken</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Location */}
            <div className="mb-3">
              <label className="form-label">📍 Location</label>
              <input
                type="text"
                placeholder="e.g. Washroom"
                required
                className="form-control custom-placeholder"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                style={{
                  backgroundColor: "#FFFFFF15",
                  color: "#ffff",
                  borderColor: "#FFFFFF30",
                  fontSize: "15px",
                }}
              />
            </div>

            {/* Description */}
            <div className="mb-3">
              <label className="form-label">🗣️ Description</label>
              <textarea
                rows={3}
                className="form-control custom-placeholder"
                placeholder="Give us a clear explanation..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{
                  backgroundColor: "#FFFFFF15",
                  color: "#ffff",
                  borderColor: "#FFFFFF30",
                  fontSize: "15px",
                }}
              ></textarea>
            </div>

            {/* Priority */}
            <div className="mb-3 flex flex-col">
              <label className="form-label">❗ Priority: </label>
              <div className="d-flex gap-2 mt-2">
                {["Important", "Normal", "Low"].map((level) => (
                  <button
                    key={level}
                    type="button"
                    className={`priority-btn ${
                      priority === level ? "active" : ""
                    }`}
                    onClick={() =>
                      setPriority(level as "Important" | "Normal" | "Low")
                    }
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <button type="submit" className="my-custom-btn w-100">
              Submit Report
            </button>

            {formStatus && (
              <div
                className={`alert text-center mt-3 ${
                  formStatus.startsWith("✅")
                    ? "alert-success"
                    : "alert-warning"
                }`}
                role="alert"
              >
                {formStatus}
              </div>
            )}
          </form>
        </div>
    </div>
  );
};

export default ReportForm;
