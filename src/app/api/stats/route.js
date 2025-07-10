import { connectToDB } from "@/db"
import Order from "@/models/orderModel.js"
import User from "@/models/userModel.js"
import { NextResponse } from "next/server"

export async function GET() {
  await connectToDB()

  try {
    // Sales data by month for the current year
    const currentYear = new Date().getFullYear()
    const salesData = await Order.aggregate([
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
          totalRevenue: { $sum: "$totalAmount" },
          orderCount: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ])

    // Best-selling products
    const productSalesData = await Order.aggregate([
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
          totalSales: { $sum: "$orderItem.quantity" },
          totalRevenue: { $sum: { $multiply: ["$orderItem.quantity", "$orderItem.price"] } },
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
          sales: "$totalSales",
          revenue: "$totalRevenue",
          image: { $arrayElemAt: ["$product.images", 0] },
        },
      },
      { $sort: { sales: -1 } },
      { $limit: 10 },
    ])

    // Customer demographics by state
    const customerDemographics = await Order.aggregate([
      {
        $group: {
          _id: "$shippingAddress.state",
          count: { $sum: 1 },
          revenue: { $sum: "$totalAmount" },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ])

    // User registration stats by month
    const userRegistrationStats = await User.aggregate([
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
          userCount: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ])

    // Order status analytics
    const orderStatusAnalytics = await Order.aggregate([
      {
        $group: {
          _id: "$orderStatus",
          count: { $sum: 1 },
          totalValue: { $sum: "$totalAmount" },
        },
      },
    ])

    // Payment method analytics
    const paymentMethodAnalytics = await Order.aggregate([
      {
        $group: {
          _id: "$payment.mode",
          count: { $sum: 1 },
          totalValue: { $sum: "$totalAmount" },
          avgOrderValue: { $avg: "$totalAmount" },
        },
      },
    ])

    // Category performance
    const categoryPerformance = await Order.aggregate([
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
        $lookup: {
          from: "products",
          localField: "orderItem.productId",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
      {
        $group: {
          _id: "$product.category.name",
          totalSales: { $sum: "$orderItem.quantity" },
          totalRevenue: { $sum: { $multiply: ["$orderItem.quantity", "$orderItem.price"] } },
          orderCount: { $sum: 1 },
        },
      },
      { $sort: { totalRevenue: -1 } },
    ])

    // Daily sales trend for last 30 days
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const dailySalesTrend = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" },
          },
          dailyRevenue: { $sum: "$totalAmount" },
          dailyOrders: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 },
      },
    ])

    return NextResponse.json({
      salesData,
      productSalesData,
      customerDemographics,
      userRegistrationStats,
      orderStatusAnalytics,
      paymentMethodAnalytics,
      categoryPerformance,
      dailySalesTrend,
    })
  } catch (error) {
    console.error("Stats API Error:", error)
    return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 })
  }
}
