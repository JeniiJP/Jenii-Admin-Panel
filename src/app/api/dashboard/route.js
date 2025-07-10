import { connectToDB } from "@/db"
import Order from "@/models/orderModel.js"
import Product from "@/models/productModel.js"
import { NextResponse } from "next/server"
import User from "@/models/userModel.js"
import OrderItem from "@/models/orderItemModel"
export async function GET() {
  await connectToDB()

  try {
    // Total products count
    const totalProducts = await Product.countDocuments()

    // Total orders count
    const totalOrders = await Order.countDocuments()

    // Total revenue calculation
    const totalRevenueResult = await Order.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$totalAmount" },
        },
      },
    ])
    const totalRevenue = totalRevenueResult[0]?.total || 0

    // Payment modes distribution
    const paymentModes = await Order.aggregate([
      {
        $group: {
          _id: "$payment.mode",
          count: { $sum: 1 },
        },
      },
    ])

    // Recent orders with user details
    const recentOrders = await Order.find({})
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("userId", "name email")
      .populate("items")
      .lean()

    // Orders by month for the current year
    const currentYear = new Date().getFullYear()
    const ordersByMonth = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(`${currentYear}-01-01`),
            $lt: new Date(`${currentYear + 1}-01-01`),
          },
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 },
          revenue: { $sum: "$totalAmount" },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ])

    // Order status distribution
    const orderStatusDistribution = await Order.aggregate([
      {
        $group: {
          _id: "$orderStatus",
          count: { $sum: 1 },
        },
      },
    ])

    // Top selling products
    const topProducts = await Order.aggregate([
      { $unwind: "$items" },
      {
        $lookup: {
          from: "orderitems",
          localField: "items",
          foreignField: "_id",
          as: "orderItem",
        },
      },
      { $unwind: "$orderItem" },
      {
        $group: {
          _id: "$orderItem.productId",
          totalQuantity: { $sum: "$orderItem.quantity" },
          totalRevenue: { $sum: "$orderItem.price" },
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
      {
        $project: {
          name: "$product.name",
          totalQuantity: 1,
          totalRevenue: 1,
          image: { $arrayElemAt: ["$product.images", 0] },
        },
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: 5 },
    ])

    // Monthly growth calculation
    const lastMonth = new Date()
    lastMonth.setMonth(lastMonth.getMonth() - 1)

    const currentMonthOrders = await Order.countDocuments({
      createdAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) },
    })

    const lastMonthOrders = await Order.countDocuments({
      createdAt: {
        $gte: new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1),
        $lt: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      },
    })

    const orderGrowth =
      lastMonthOrders > 0 ? (((currentMonthOrders - lastMonthOrders) / lastMonthOrders) * 100).toFixed(1) : 0

    // Revenue growth
    const currentMonthRevenue = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$totalAmount" },
        },
      },
    ])

    const lastMonthRevenue = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1),
            $lt: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$totalAmount" },
        },
      },
    ])

    const currentRevenue = currentMonthRevenue[0]?.total || 0
    const lastRevenue = lastMonthRevenue[0]?.total || 0
    const revenueGrowth = lastRevenue > 0 ? (((currentRevenue - lastRevenue) / lastRevenue) * 100).toFixed(1) : 0

    return NextResponse.json({
      totalProducts,
      totalOrders,
      totalRevenue,
      paymentModes,
      recentOrders,
      ordersByMonth,
      orderStatusDistribution,
      topProducts,
      orderGrowth: Number.parseFloat(orderGrowth),
      revenueGrowth: Number.parseFloat(revenueGrowth),
      currentMonthOrders,
      currentMonthRevenue: currentRevenue,
    })
  } catch (error) {
    console.error("Dashboard API Error:", error)
    return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 })
  }
}
