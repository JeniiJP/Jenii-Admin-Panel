import { MapPin, Truck, Calendar } from "lucide-react"
import { formatDate } from "@/utils/productDiscount"

export default function ShippingInfo({ shippingAddress, billingAddress, shippingDetails }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Shipping Information</h2>
      </div>

      <div className="p-4">
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2 flex items-center">
            <MapPin className="h-4 w-4 mr-1" />
            Shipping Address
          </h3>

          <div className="text-sm text-gray-600 dark:text-gray-300 ml-5">
            <p className="font-medium">
              {shippingAddress.name} {shippingAddress.lastname}
            </p>
            <p>{shippingAddress.address}</p>
            {shippingAddress.addressline2 && <p>{shippingAddress.addressline2}</p>}
            <p>
              {shippingAddress.city}, {shippingAddress.state} {shippingAddress.pincode}
            </p>
            <p>{shippingAddress.country}</p>
            <p className="mt-1">
              <span className="text-gray-500 dark:text-gray-400">Contact: </span>
              {shippingAddress.contact}
            </p>
          </div>
        </div>

        {billingAddress && (
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2 flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              Billing Address
            </h3>

            <div className="text-sm text-gray-600 dark:text-gray-300 ml-5">
              <p className="font-medium">
                {billingAddress.name} {billingAddress.lastname}
              </p>
              <p>{billingAddress.address}</p>
              {billingAddress.addressline2 && <p>{billingAddress.addressline2}</p>}
              <p>
                {billingAddress.city}, {billingAddress.state} {billingAddress.pincode}
              </p>
              <p>{billingAddress.country}</p>
              <p className="mt-1">
                <span className="text-gray-500 dark:text-gray-400">Contact: </span>
                {billingAddress.contact}
              </p>
            </div>
          </div>
        )}

        {shippingDetails && (
          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2 flex items-center">
              <Truck className="h-4 w-4 mr-1" />
              Shipping Details
            </h3>

            <div className="text-sm text-gray-600 dark:text-gray-300 ml-5 space-y-1">
              <p>
                <span className="text-gray-500 dark:text-gray-400">Delivery Option: </span>
                {shippingDetails.deliveryOption || "Standard"}
              </p>

              {shippingDetails.courier && (
                <p>
                  <span className="text-gray-500 dark:text-gray-400">Courier: </span>
                  {shippingDetails.courier.name}
                </p>
              )}

              {shippingDetails.awb && (
                <p>
                  <span className="text-gray-500 dark:text-gray-400">AWB: </span>
                  {shippingDetails.awb}
                </p>
              )}

              {shippingDetails.estimatedDelivery && (
                <p className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1 text-gray-500 dark:text-gray-400" />
                  <span className="text-gray-500 dark:text-gray-400">Estimated Delivery: </span>
                  {formatDate(shippingDetails.estimatedDelivery)}
                </p>
              )}

              {shippingDetails.trackingUrl && (
                <p className="mt-2">
                  <a
                    href={shippingDetails.trackingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 flex items-center"
                  >
                    <Truck className="h-4 w-4 mr-1" />
                    Track Shipment
                  </a>
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
