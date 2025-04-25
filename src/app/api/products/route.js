import { NextResponse } from 'next/server';
import Product, { OfflineProduct } from '@/models/productModel';
import Category from '@/models/category';
import { connectToDB } from '@/db';
import { uploadToS3 } from '@/utils/awsS3Bucket';
import fs from 'fs';
import { uploadToCloudinary } from '@/utils/cloudinary';
function calculatedDiscount(price, discountedPrice) {
  const discount = ((price - discountedPrice) / price) * 100;
  return Math.ceil(discount);
}
import { v4 as uuidv4 } from 'uuid';
// Get all products
export async function GET() {
  await connectToDB();
  try {
    const products = await Product.find();
    return NextResponse.json({ products }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// Add a new product
export async function POST(request) {
  await connectToDB()
  try {
    const formData = await request.formData()

    const imageFiles = formData.getAll("images")
    const name = formData.get("name")
    const description = formData.get("description")
    const price = formData.get("price")
    const discountPrice = formData.get("discountPrice")
    const category = formData.get("category")
    const subCategory = formData.get("subCategory")
    const collection = formData.getAll("collections")
    const metal = formData.get("metal")
    const stock = formData.get("stock")
    const mode = formData.get("mode")
    const sku = formData.get("sku")
    const video = formData.get("video")
    const specificationsJSON = formData.get("specifications")
    const specifications = specificationsJSON ? JSON.parse(specificationsJSON) : []
    console.log(specifications)

    const slug = name
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "")

    if (!imageFiles.length || !name || !price || !category || !subCategory) {
      return NextResponse.json({ message: "Please fill required fields" }, { status: 400 })
    }

    const isExist = await Category.findOne({ name: subCategory })
    if (!isExist) {
      return NextResponse.json({ message: "Invalid Category" }, { status: 403 })
    }
    if (price <= 0 || discountPrice < 0) {
      return NextResponse.json({ message: "Invalid price or discounted price values" }, { status: 403 })
    }

    // Upload images to Cloudinary
    const uploadPromises = imageFiles.map((file) => uploadToCloudinary(file,"products/images",`${sku}-${uuidv4()}`))
    const uploadedImages = await Promise.all(uploadPromises)

    // Upload video if provided
    let videoData = null
    if (video && video.type) {
      videoData = await uploadToCloudinary(video,"products/videos",`${sku}-${uuidv4()}`)
    }

    // Calculate discount percentage
    const discountPercent = calculatedDiscount(price, discountPrice)

    // Create product data object
    const productData = {
      sku,
      images: uploadedImages,
      name,
      description,
      price,
      discountPrice,
      discountPercent,
      category: { name: subCategory, type: category },
      collectionName: collection,
      metal,
      stock,
      slug,
      specifications,
    }

    // Add video if uploaded
    if (videoData) {
      productData.video = videoData
    }

    // Save product based on mode
    if (mode && mode === "offline") {
      const product = new OfflineProduct(productData)
      const newProduct = await product.save()
      return NextResponse.json(newProduct, { status: 201 })
    } else {
      const product = new Product(productData)
      const newProduct = await product.save()
      return NextResponse.json(newProduct, { status: 201 })
    }
  } catch (error) {
    console.error("Error uploading product:", error)
    return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 })
  }
}


