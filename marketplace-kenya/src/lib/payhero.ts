const PAYHERO_API_KEY = process.env.PAYHERO_API_KEY
const PAYHERO_CHANNEL_ID = process.env.PAYHERO_CHANNEL_ID
const PAYHERO_CALLBACK_URL = process.env.PAYHERO_CALLBACK_URL

export interface PayHeroSTKPushRequest {
  phone: string
  amount: number
  account_reference: string
  transaction_desc: string
}

export interface PayHeroSTKPushResponse {
  success: boolean
  message?: string
  checkoutRequestID?: string
  responseCode?: string
  responseDescription?: string
}

export async function initiateSTKPush(
  request: PayHeroSTKPushRequest
): Promise<PayHeroSTKPushResponse> {
  try {
    const response = await fetch('https://api.payhero.co.ke/api/v1/stkpush', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${PAYHERO_API_KEY}`,
      },
      body: JSON.stringify({
        channel_id: PAYHERO_CHANNEL_ID,
        phone: request.phone,
        amount: request.amount,
        account_reference: request.account_reference,
        transaction_desc: request.transaction_desc,
        callback_url: PAYHERO_CALLBACK_URL,
      }),
    })

    const data = await response.json()

    if (data.success) {
      return {
        success: true,
        checkoutRequestID: data.checkoutRequestID,
      }
    } else {
      return {
        success: false,
        message: data.message || 'STK Push failed',
        responseCode: data.responseCode,
        responseDescription: data.responseDescription,
      }
    }
  } catch (error) {
    return {
      success: false,
      message: 'Failed to initiate STK Push',
    }
  }
}

export async function verifyTransaction(checkoutRequestID: string): Promise<boolean> {
  try {
    const response = await fetch(`https://api.payhero.co.ke/api/v1/transaction/${checkoutRequestID}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${PAYHERO_API_KEY}`,
      },
    })

    const data = await response.json()
    return data.success && data.status === 'completed'
  } catch (error) {
    return false
  }
}

export function validateCallback(callbackData: any): boolean {
  // Validate callback data structure
  return (
    callbackData &&
    callbackData.checkoutRequestID &&
    callbackData.resultCode !== undefined &&
    callbackData.resultDesc !== undefined
  )
}
