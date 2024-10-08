"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const ProductForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    tagline: "",
    description: "",
    isOpenSource: false,
    githubLink: "",
    twitter: "",
    topic: "",
    comment: "",
    status: "startup",
    pitchVideoUrl: "",
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [ogImageFile, setOgImageFile] = useState<File | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      if (name === "logo") setLogoFile(files[0]);
      if (name === "ogImage") setOgImageFile(files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Convert files to base64
      const logoBase64 = logoFile ? await convertToBase64(logoFile) : "";
      const ogImageBase64 = ogImageFile ? await convertToBase64(ogImageFile) : "";

      const finalFormData = {
        ...formData,
        logoFile: logoBase64,
        ogImageFile: ogImageBase64,
        userId: localStorage.getItem('userId'),  // Assuming userId is stored in localStorage
      };

      const res = await fetch("/api/products/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(finalFormData),
      });

      if (res.ok) {
        router.push("/dashboard");
      } else {
        console.error("Error creating product");
      }
    } catch (error) {
      console.error("Error during form submission", error);
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto space-y-6 p-8 rounded shadow"
    >
      <h2 className="text-2xl font-bold mb-4">Create New Product</h2>

      {/* Product Name */}
      <div>
        <label className="block mb-1 text-sm font-medium">Product Name</label>
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
      </div>

      {/* Tagline */}
      <div>
        <label className="block mb-1 text-sm font-medium">Tagline</label>
        <input
          type="text"
          name="tagline"
          placeholder="Tagline"
          value={formData.tagline}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block mb-1 text-sm font-medium">Description</label>
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
      </div>

      {/* Open Source */}
      <div className="flex items-center">
        <input
          type="checkbox"
          name="isOpenSource"
          checked={formData.isOpenSource}
          onChange={handleChange}
          className="mr-2"
        />
        <label htmlFor="isOpenSource" className="text-sm">
          Is Open Source
        </label>
      </div>

      {/* GitHub Link (shown if Open Source is checked) */}
      {formData.isOpenSource && (
        <div>
          <label className="block mb-1 text-sm font-medium">GitHub Link</label>
          <input
            type="url"
            name="githubLink"
            placeholder="GitHub Link"
            value={formData.githubLink}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
      )}

      {/* Twitter Handle */}
      <div>
        <label className="block mb-1 text-sm font-medium">Twitter Handle</label>
        <input
          type="url"
          name="twitter"
          placeholder="Twitter Handle"
          value={formData.twitter}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
      </div>

      {/* Topic */}
      <div>
        <label className="block mb-1 text-sm font-medium">Topic</label>
        <input
          type="text"
          name="topic"
          placeholder="Topic"
          value={formData.topic}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
      </div>

      {/* Comment (optional) */}
      <div>
        <label className="block mb-1 text-sm font-medium">
          Comment (optional)
        </label>
        <textarea
          name="comment"
          placeholder="Comment"
          value={formData.comment}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </div>

      {/* Product Status */}
      <div>
        <label className="block mb-1 text-sm font-medium">Product Status</label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        >
          <option value="startup">Startup</option>
          <option value="preexisting">Pre-existing</option>
        </select>
      </div>

      <input type="file" name="logo" onChange={handleFileChange} />
      <input type="file" name="ogImage" onChange={handleFileChange} />

      {/* Loom Video URL */}
      <div>
        <label className="block mb-1 text-sm font-medium">
          Loom Pitch Video URL
        </label>
        <input
          type="url"
          name="pitchVideoUrl"
          placeholder="Loom Pitch Video URL"
          value={formData.pitchVideoUrl}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </div>

      {/* Submit Button */}
      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full p-3 bg-white hover:bg-slate-200 text-black rounded"
        >
          {isSubmitting ? "Submitting..." : "Create Product"}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
