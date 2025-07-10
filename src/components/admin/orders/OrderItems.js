import Image from "next/image"
import { formatCurrency } from "@/utils/productDiscount"

export default function OrderItems({ items }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Order Items</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Quantity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Total
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {items.map((item) => (
              <tr key={item._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 dark:border-gray-700">
                      {item.image ? (
                        <Image
                          src={process.env.NEXT_PUBLIC_IMAGE_URL+item.image || "/placeholder.svg"}
                          alt={item.name}
                          width={64}
                          height={64}
                          className="h-full w-full object-cover object-center"
                        />
                      ) : (
                        <div className="h-full w-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                          <span className="text-xs text-gray-500 dark:text-gray-400">No image</span>
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{item.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">SKU: {item.sku}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-white">{formatCurrency(item.discountedPrice)}</div>
                  {item.basePrice !== item.discountedPrice && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 line-through">
                      {formatCurrency(item.basePrice)}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-white">{item.quantity}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {formatCurrency(item.totalPrice)}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex flex-col items-end">
          <div className="w-full max-w-md space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-300">Subtotal:</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {formatCurrency(items.reduce((sum, item) => sum + item.totalPrice, 0))}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
