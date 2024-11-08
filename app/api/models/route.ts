import { NextResponse, type NextRequest } from 'next/server'
import { checkToken, handleError } from '../utils'
import { ErrorType } from '@/constant/errors'
import { isNull } from 'lodash-es'

const geminiApiKey = process.env.GEMINI_API_KEY as string
const geminiApiBaseUrl = process.env.GEMINI_API_BASE_URL as string
const mode = process.env.NEXT_PUBLIC_BUILD_MODE

export const preferredRegion = ['sfo1']

export async function GET(req: NextRequest) {
  if (mode === 'export') return new NextResponse('Not available under static deployment')

  const searchParams = req.nextUrl.searchParams
  const token = searchParams.get('token')

  if (isNull(token) || !checkToken(token)) {
    return NextResponse.json({ code: 40301, message: ErrorType.InValidToken }, { status: 403 })
  }
  if (!geminiApiKey) {
    return NextResponse.json({ code: 50001, message: ErrorType.NoGeminiKey }, { status: 500 })
  }

  try {
    const apiBaseUrl = geminiApiBaseUrl || 'https://generativelanguage.googleapis.com'
    const response = await fetch(`${apiBaseUrl}/v1beta/models?key=${geminiApiKey}`)
    return new NextResponse(response.body)
  } catch (error) {
    if (error instanceof Error) {
      return handleError(error.message)
    }
  }
}
