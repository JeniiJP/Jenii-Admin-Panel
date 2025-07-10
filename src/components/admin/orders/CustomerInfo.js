import { User, Mail, Phone } from "lucide-react"
import Link from "next/link"

export default function CustomerInfo({ customer }) {
  if (!customer) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Customer</h2>
        </div>
        <div className="p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Guest checkout</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Customer</h2>

        <Link
          href={`/admin/customers/${customer._id}`}
          className="text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
        >
          View Profile
        </Link>
      </div>

      <div className="p-4">
        <div className="flex items-center mb-4">
          <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mr-4">
            {customer.image ? (
              <img
                src={customer.image || "/placeholder.svg"}
                alt={customer.name}
                className="h-12 w-12 rounded-full object-cover"
              />
            ) : (
              <User className="h-6 w-6 text-gray-500 dark:text-gray-400" />
            )}
          </div>

          <div>
            <h3 className="text-md font-medium text-gray-900 dark:text-white">{customer.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Customer since {new Date(customer.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-start">
            <Mail className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
            <div>
              <p className="text-sm text-gray-900 dark:text-white">{customer.email}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
            </div>
          </div>

          {customer.phone && (
            <div className="flex items-start">
              <Phone className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
              <div>
                <p className="text-sm text-gray-900 dark:text-white">{customer.phone}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Phone</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
