import { publicApi } from '@/lib/api/public'
import type { ApiResponse } from '@/types/api'
import type { PaymentMethod } from '@/types/master'

export const paymentMethodService = {
  listByUser: (userId: number) =>
    publicApi.get<ApiResponse<PaymentMethod[]>>(`/users/${userId}/payment-methods`),

  get: (id: number) =>
    publicApi.get<ApiResponse<PaymentMethod>>(`/payment-methods/${id}`),

  delete: (id: number) =>
    publicApi.delete<ApiResponse<null>>(`/payment-methods/${id}`),

  setDefault: (id: number, userId: number) =>
    publicApi.post<ApiResponse<null>>(`/payment-methods/${id}/set-default`, { user_id: userId }),
}
