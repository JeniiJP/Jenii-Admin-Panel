import { CreditCard, DollarSign, Tag, Truck } from "lucide-react"
import { formatCurrency } from "@/utils/productDiscount"

export default function PaymentInfo({ payment, paymentDetails, subtotal, shippingCost, discount, totalAmount }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Payment Information</h2>
      </div>

      <div className="p-4">
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2 flex items-center">
            <CreditCard className="h-4 w-4 mr-1" />
            Payment Method
          </h3>

          <div className="text-sm text-gray-600 dark:text-gray-300 ml-5">
            <p className="font-medium">{payment.mode}</p>

            {paymentDetails && (
              <>
                {paymentDetails.method && (
                  <p>
                    <span className="text-gray-500 dark:text-gray-400">Method: </span>
                    {paymentDetails.method}
                  </p>
                )}

                {paymentDetails.via && (
                  <p>
                    <span className="text-gray-500 dark:text-gray-400">Via: </span>
                    {paymentDetails.via}
                  </p>
                )}

                {paymentDetails.rzr_payment_id && (
                  <p>
                    <span className="text-gray-500 dark:text-gray-400">Transaction ID: </span>
                    {paymentDetails.rzr_payment_id}
                  </p>
                )}
              </>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2 flex items-center">
            <DollarSign className="h-4 w-4 mr-1" />
            Order Summary
          </h3>

          <div className="text-sm text-gray-600 dark:text-gray-300 ml-5 space-y-1">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>

            <div className="flex justify-between">
              <span className="flex items-center">
                <Truck className="h-3 w-3 mr-1" />
                Shipping:
              </span>
              <span>{formatCurrency(shippingCost)}</span>
            </div>

            {discount > 0 && (
              <div className="flex justify-between">
                <span className="flex items-center">
                  <Tag className="h-3 w-3 mr-1" />
                  Discount:
                </span>
                <span className="text-green-600 dark:text-green-400">-{formatCurrency(discount)}</span>
              </div>
            )}

            <div className="border-t border-gray-200 dark:border-gray-700 pt-1 mt-1">
              <div className="flex justify-between font-medium text-gray-900 dark:text-white">
                <span>Total:</span>
                <span>{formatCurrency(totalAmount)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
