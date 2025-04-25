import { NextResponse } from 'next/server';
import Category from '@/models/category';
import { uploadToCloudinary } from '@/utils/cloudinary'; // Assuming this is your utility for Cloudinary
import { connectToDB } from '@/db';
import slugify from 'slugify';
import { v4 as uuidv4 } from 'uuid';


export async function POST(request) {
  await connectToDB()
  try {
    const formData = await request.formData();
    const name = formData.get('name').toLowerCase();
    const banners = formData.getAll('bannerImages')||null;
    const imageFile = formData.get('image') ||null;
    const parentCategory = formData.get('parentCategory').toLowerCase();

    // console.log( banners , imageFile)
    const isExist = await Category.findOne({ name });
    if (isExist && isExist.parentCategory === parentCategory) {
      return NextResponse.json({ message: 'Category Already Exists' }, { status: 403 });
    }
  
      const uploadPromises = banners.map(async (file) => {
              return  uploadToCloudinary(file,"category/banner/",`${name}-${uuidv4()}`);
        });

        const bannerImages = await Promise.all(uploadPromises);
        const image =await uploadToCloudinary(imageFile,"category/card/",`${name}-${uuidv4()}`);
    const newCategory = new Category({
      name,
      slug:slugify(name),
      bannerImages,
      image,
      parentCategory,
    });

    // Save the category to the database
    await newCategory.save();

    return NextResponse.json({ message: 'Category Added Successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error adding category:', error);
    return NextResponse.json({ message: 'Server error',error }, { status: 500 });
  }
}

export async function GET() {
  await connectToDB()
  try {
    const products = await Category.find();
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}
