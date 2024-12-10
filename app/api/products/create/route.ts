/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import cloudinary from "@/lib/cloudinary";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json(); // Parse the JSON body
    const {
      name,
      tagline,
      description,
      isOpenSource,
      githubLink,
      twitter,
      topic,
      comment,
      status,
      pitchVideoUrl,
      logoFile,
      ogImageFile,
    } = body;

    // Validate required fields
    if (!name || !tagline || !description || !publicKey) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Upload logo if provided
    let logoUrl = "";
    if (logoFile) {
      const uploadedLogo = await cloudinary.uploader.upload(logoFile, {
        folder: "product-logos",
        public_id: uuidv4(),
        resource_type: "image",  // Ensure Cloudinary recognizes the file type correctly
      });
      logoUrl = uploadedLogo.secure_url;
    }

    // Upload OG image if provided
    let ogImageUrl = "";
    if (ogImageFile) {
      const uploadedOgImage = await cloudinary.uploader.upload(ogImageFile, {
        folder: "og-images",
        public_id: uuidv4(),
        resource_type: "image",  // Ensure Cloudinary recognizes the file type correctly
      });
      ogImageUrl = uploadedOgImage.secure_url;
    }

    // Create product in the database
    const product = await prisma.product.create({
      data: {
        name,
        tagline,
        description,
        isOpenSource,
        githubLink,
        twitter,
        topic,
        comment,
        status,
        pitchVideoUrl,
        logoUrl,
        ogImageUrl,
        userId,
      },
    });

    // Return successful response
    return NextResponse.json(
      { message: "Product created successfully", productId: product.id },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating product:", error);

    // Handle specific database constraint errors
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "A product with similar data already exists" },
        { status: 409 }
      );
    }

    // Return internal server error for any other issues
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
