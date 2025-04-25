// src/app/api/slides/add/route.js
import { connectToDB } from "@/db"
import Home from "@/models/homePageModel";
import { uploadToS3 } from "@/utils/awsS3Bucket";
import { uploadToCloudinary } from "@/utils/cloudinary";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from 'uuid';
export async function GET() {
    await connectToDB();
    try {
      const slides = await Home.find();
      return NextResponse.json(slides, { status: 200 });
    } catch (err) {
      return NextResponse.json({ message: err.message }, { status: 500 });
    }
  }
export async function POST(req) {
    await connectToDB();
    try {
        const formData = await req.formData();
        console.log(formData)
        const links = formData.get("links");
        const section = formData.get("section");
        const desktopbanner = formData.get("desktopbanner");
        const mobilebanner = formData.get("mobilebanner");
        if ( desktopbanner?.type.startsWith("/image") && mobilebanner?.type.startsWith("/image")) {
            return NextResponse.json({ message: "Invalid image type" }, { status: 400 });
        }
        console.log(mobilebanner,desktopbanner)
        if ( !links && !section) {
            return NextResponse.json({ message: "All fields are required" }, { status: 400 });
        }

        const uploadedDesktopImage = await uploadToCloudinary(desktopbanner,"slide/desktop/", `bnlg-${uuidv4()}`); // Upload to Cloudinary
        console.log(uploadedDesktopImage)
        const uploadedMoblieImage = await uploadToCloudinary(mobilebanner,"slide/mobile/", `bnsm-${uuidv4()}`); // Upload to Cloudinary
        const home = await Home.create({ desktopBannerImage: uploadedDesktopImage,mobileBannerImage: uploadedMoblieImage, links, section });

        if (!home) {
            return NextResponse.json({ message: "Slide not added" }, { status: 500 });
        }

        return NextResponse.json({ message: "Slide added successfully", home }, { status: 201 });
    } catch (err) {
        return NextResponse.json({ message: err.message,error:err }, { status: 500 });
    }
}

